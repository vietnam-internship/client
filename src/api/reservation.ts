import { http } from '@/utils/http'
import type { CreateReservationPayload, ReservationDetail, ReservationPageResponse } from '@/types'

// POST /reservations — 예약 생성과 동시에 Stripe PaymentIntent를 만들어 paymentClientSecret을 함께 받는다.
export function createReservation(payload: CreateReservationPayload): Promise<ReservationDetail> {
  return http<ReservationDetail>('/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface ListMyReservationsParams {
  status?: string
  page?: number
  size?: number
}

// GET /reservations — 내 예약 목록.
export function listMyReservations(params: ListMyReservationsParams = {}): Promise<ReservationPageResponse> {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  const qs = query.toString()

  return http<ReservationPageResponse>(`/reservations${qs ? `?${qs}` : ''}`)
}

// GET /reservations/{id} — 예약 상세.
export function getReservation(id: number): Promise<ReservationDetail> {
  return http<ReservationDetail>(`/reservations/${id}`)
}

// DELETE /reservations/{id} — 예약 취소.
export function cancelReservation(id: number): Promise<void> {
  return http<void>(`/reservations/${id}`, { method: 'DELETE' })
}
