import { API_BASE_URL } from '@/constants/api'
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY, ADMIN_ACCESS_TOKEN_KEY, ADMIN_USER_KEY } from '@/constants/storage'

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

/** Which localStorage keys/redirect target a given `http()` call's session belongs to. */
export interface HttpAuthConfig {
  tokenKey: string
  userKey: string
  loginPath: string
}

/** Regular customer session (default — every existing caller keeps this behavior unchanged). */
export const USER_AUTH: HttpAuthConfig = { tokenKey: ACCESS_TOKEN_KEY, userKey: AUTH_USER_KEY, loginPath: '/login' }

/** Admin panel session — separate storage so a browser can hold both sessions independently. */
export const ADMIN_AUTH: HttpAuthConfig = { tokenKey: ADMIN_ACCESS_TOKEN_KEY, userKey: ADMIN_USER_KEY, loginPath: '/admin' }

// 만료/무효 토큰으로 401을 받으면 세션을 정리하고 로그인 화면으로 보낸다.
function handleSessionExpired(auth: HttpAuthConfig) {
  localStorage.removeItem(auth.tokenKey)
  localStorage.removeItem(auth.userKey)
  if (window.location.pathname !== auth.loginPath) {
    window.location.href = `${auth.loginPath}?error=session`
  }
}

/**
 * TravelX API 공용 fetch 래퍼.
 * - 토큰이 있으면 Authorization 헤더, FormData가 아니면 JSON Content-Type 자동 첨부
 * - 실패 응답은 HttpError로, 네트워크 에러는 일반 Error로 통일해서 던짐
 * - 백엔드 에러 바디 `{ code, message }`를 파싱해 HttpError.code에 실어줌
 * - 토큰을 실어 보낸 요청이 401로 실패하면 세션 만료로 간주하고 로그아웃 처리한다.
 * - 204/빈 응답, JSON이 아닌 응답도 에러 없이 처리
 * - 대부분의 성공 응답은 백엔드 공용 포맷 `{ result, data, code, message }`로 감싸져 오므로 `data`만 꺼내 돌려준다
 *   (실제 로컬 서버에 요청해 확인함 — 이전에는 래퍼째로 반환돼 호출부 타입과 어긋나 있었다).
 *   단, /auth/google/callback처럼 ApiResponse로 감싸지 않고 DTO를 그대로 반환하는 엔드포인트도 있어
 *   (AuthController 주석 참고) `result` 필드 존재 여부로 감싸진 응답인지 판별한다.
 * - 세 번째 인자로 어떤 세션(고객/관리자)의 토큰을 실을지 선택한다 — 생략하면 고객 세션(USER_AUTH).
 */
export async function http<T>(path: string, init: RequestInit = {}, auth: HttpAuthConfig = USER_AUTH): Promise<T> {
  const token = localStorage.getItem(auth.tokenKey)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',

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
        handleSessionExpired(auth)
      }

      throw new HttpError(res.status, message, text, code)
    }

    if (res.status === 204) {
      return undefined as T
    }

    // JSON 응답만 파싱, 나머지는 undefined 반환. { result, data } 형태로 감싸진 응답이면 data만 꺼낸다.
    const contentType = res.headers.get('Content-Type') ?? ''
    if (contentType.includes('application/json')) {
      const body = (await res.json()) as { result?: string; data?: T }
      return (typeof body.result === 'string' ? body.data : body) as T
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
