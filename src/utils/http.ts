import { API_BASE_URL } from '@/constants/api'
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY } from '@/constants/storage'

/**
 * Thrown for any non-2xx response so callers can branch on `status` or `code`.
 * `code`는 백엔드 공통 에러 형식 `{ code, message, timestamp }`의 에러 코드
 * (예: PHONE_NOT_VERIFIED, AUTH_INVALID_TOKEN). JSON이 아닌 응답이면 undefined.
 */
export class HttpError extends Error {
  status: number
  code?: string
  responseText?: string

  constructor(status: number, message: string, responseText?: string, code?: string) {
    super(`HTTP ${status}: ${message}`)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.responseText = responseText
  }
}

// 만료/무효 토큰으로 401을 받으면 세션을 정리하고 로그인 화면으로 보낸다.
function handleSessionExpired() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?error=session'
  }
}

/**
 * TravelX API 공용 fetch 래퍼.
 * - 토큰이 있으면 Authorization 헤더, FormData가 아니면 JSON Content-Type 자동 첨부
 * - 실패 응답은 HttpError로, 네트워크 에러는 일반 Error로 통일해서 던짐
 * - 백엔드 에러 바디 `{ code, message }`를 파싱해 HttpError.code에 실어줌
 * - 토큰을 실어 보낸 요청이 401로 실패하면 세션 만료로 간주하고 로그아웃 처리한다.
 * - 204/빈 응답, JSON이 아닌 응답도 에러 없이 처리
 */
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')

      let code: string | undefined
      let message = text || res.statusText
      try {
        const body: unknown = JSON.parse(text)
        if (body && typeof body === 'object') {
          const { code: c, message: m } = body as { code?: unknown; message?: unknown }
          if (typeof c === 'string') code = c
          if (typeof m === 'string') message = m
        }
      } catch {
        // JSON이 아닌 에러 본문 — raw text 그대로 사용
      }
      // 인증된 요청이 401이면 토큰 만료/무효로 간주, 세션 정리
      if (res.status === 401 && token) {
        handleSessionExpired()
      }

      throw new HttpError(res.status, message, text, code)
    }

    if (res.status === 204) {
      return undefined as T
    }

    // JSON 응답만 파싱, 나머지는 undefined 반환
    const contentType = res.headers.get('Content-Type') ?? ''
    if (contentType.includes('application/json')) {
      return (await res.json()) as T
    }
    return undefined as T
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      cause: error,
    })
  }
}
