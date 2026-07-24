// 백엔드의 qrToken은 예약을 식별할 branchId/reservationId 정보를 담고 있지 않은 순수 랜덤
// 문자열이라, 직원용 스캐너가 /branches/{id}/reservations/{reservationId}/redeem 호출에 필요한
// 값을 모두 얻을 수 있도록 이 세 값을 JSON으로 묶어서 QR 이미지에 인코딩한다.
export interface ReservationQrPayload {
  branchId: number
  reservationId: number
  qrToken: string
}

export function encodeQrPayload(payload: ReservationQrPayload): string {
  return JSON.stringify(payload)
}

export function decodeQrPayload(raw: string): ReservationQrPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      typeof (parsed as Record<string, unknown>).branchId === 'number' &&
      typeof (parsed as Record<string, unknown>).reservationId === 'number' &&
      typeof (parsed as Record<string, unknown>).qrToken === 'string'
    ) {
      return parsed as unknown as ReservationQrPayload
    }
    return null
  } catch {
    return null
  }
}
