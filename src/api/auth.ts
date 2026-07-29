import { http, ADMIN_AUTH } from '@/utils/http'
import type { GoogleLoginResponse } from '@/types'

export function exchangeGoogleCode(code: string): Promise<GoogleLoginResponse> {
  return http<GoogleLoginResponse>(`/auth/google/callback?code=${encodeURIComponent(code)}`)
}

export function adminLogin(email: string, password: string): Promise<GoogleLoginResponse> {
  return http<GoogleLoginResponse>(
    '/auth/admin/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    ADMIN_AUTH,
  )
}

export function logoutRequest(): Promise<void> {
  return http<void>('/auth/logout', { method: 'POST' })
}
