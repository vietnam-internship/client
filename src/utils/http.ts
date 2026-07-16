import { API_BASE_URL } from '@/constants/api'
import { ACCESS_TOKEN_KEY } from '@/constants/storage'

/** Thrown for any non-2xx response so callers can branch on `status`. */
export class HttpError extends Error {
  status: number
  responseText?: string

  constructor(status: number, message: string, responseText?: string) {
    super(`HTTP ${status}: ${message}`)
    this.name = 'HttpError'
    this.status = status
    this.responseText = responseText
  }
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Shared fetch wrapper for the TravelX API.
 * - Adds the bearer token (if present) and JSON content-type automatically.
 * - Normalizes failures into `HttpError` and network errors into a plain `Error`.
 * - Handles 204/empty bodies and non-JSON responses without throwing.
 */
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...authHeader(),
        ...(init.headers ?? {}),
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new HttpError(res.status, text || res.statusText, text)
    }

    if (res.status === 204) {
      return undefined as T
    }

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
