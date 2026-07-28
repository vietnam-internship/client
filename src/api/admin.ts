import { http } from '@/utils/http'
import type { RedeemResponse } from '@/types'

/** qrPayload("{branchId}:{reservationId}:{token}")를 리딤 API 호출에 필요한 조각으로 나눈다. */
export interface ParsedQrPayload {
  branchId: number
  reservationId: number
  qrToken: string
}

export function parseQrPayload(raw: string): ParsedQrPayload | null {
  const parts = raw.trim().split(':')
  if (parts.length < 3) return null

  const [branchIdText, reservationIdText, ...tokenParts] = parts
  const branchId = Number(branchIdText)
  const reservationId = Number(reservationIdText)
  const qrToken = tokenParts.join(':')
  if (!Number.isInteger(branchId) || !Number.isInteger(reservationId) || !qrToken) return null

  return { branchId, reservationId, qrToken }
}

// POST /branches/{id}/reservations/{reservationId}/redeem — 지점 창구에서 QR + 신원 확인으로 픽업 완료 처리 (ADMIN 전용)
export function redeemReservation(
  branchId: number,
  reservationId: number,
  qrToken: string,
  idVerified: boolean,
): Promise<RedeemResponse> {
  return http<RedeemResponse>(`/branches/${branchId}/reservations/${reservationId}/redeem`, {
    method: 'POST',
    body: JSON.stringify({ qrToken, idVerified }),
  })
}
