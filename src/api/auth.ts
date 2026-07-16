import { http } from '@/utils/http'
import type { GoogleLoginResponse, PhoneVerificationResponse } from '@/types'

/** Exchange the authorization code from Google for a JWT. */
export function exchangeGoogleCode(code: string): Promise<GoogleLoginResponse> {
  return http<GoogleLoginResponse>(`/auth/google/callback?code=${encodeURIComponent(code)}`)
}

/** Revoke the current JWT. Fire-and-forget; local state is cleared regardless. */
export function logoutRequest(): Promise<void> {
  return http<void>('/auth/logout', { method: 'POST' })
}

async function verifyPhone(body: {
  phone: string
  mode: 'REQUEST' | 'CONFIRM'
  code?: string
}): Promise<PhoneVerificationResponse> {
  return http<PhoneVerificationResponse>('/auth/verify-phone', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function requestPhoneCode(phone: string) {
  return verifyPhone({ phone, mode: 'REQUEST' })
}

export function confirmPhoneCode(phone: string, code: string) {
  return verifyPhone({ phone, mode: 'CONFIRM', code })
}
