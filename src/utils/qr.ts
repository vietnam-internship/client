export interface ParsedQrPayload {
  branchId: number
  reservationId: number
  token: string
}

/**
 * Customer QR (`ReservationDetail.qrPayload`) encodes `"{branchId}:{reservationId}:{token}"`,
 * but the backend redeem/lookup endpoints only ever compare the bare token against
 * `reservations.qr_token`. Admin scanning must extract that bare token before calling them —
 * sending the full composite string as `qrToken` never matches and always fails.
 * Falls back to treating the raw input as the bare token (e.g. manual test entry).
 */
export function parseQrPayload(raw: string): ParsedQrPayload | null {
  const parts = raw.split(':')
  if (parts.length === 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1]) && parts[2]) {
    return { branchId: Number(parts[0]), reservationId: Number(parts[1]), token: parts[2] }
  }
  return null
}

export function extractQrToken(raw: string): string {
  return parseQrPayload(raw)?.token ?? raw
}
