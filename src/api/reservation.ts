import { http } from '@/utils/http'
import type { ReservationDetail, ReservationPage } from '@/types'

export interface CreateReservationRequest {
  currencyCode: string
  branchId: number
  amount: number
  /** YYYY-MM-DD */
  pickupDate: string
  /** 30분 슬롯 시작 시각, HH:00 또는 HH:30만 허용된다. */
  pickupTime: string
}

// POST /reservations — 결제 대기(PENDING_PAYMENT) 상태로 예약을 홀드하고 Stripe PaymentIntent를 만든다.
// paymentClientSecret으로 실제 카드 결제를 완료하는 UI는 이번 스코프에 포함하지 않는다.
export function createReservation(body: CreateReservationRequest): Promise<ReservationDetail> {
  return http<ReservationDetail>('/reservations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export interface ListReservationsParams {
  /** 쉼표로 복수 지정 가능 (예: "COMPLETED,CANCELLED"). */
  status?: string
  page?: number
  size?: number
}

// GET /reservations — 내 예약 목록 (최신순)
export function listMyReservations(params: ListReservationsParams = {}): Promise<ReservationPage> {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  const qs = query.toString()

  return http<ReservationPage>(`/reservations${qs ? `?${qs}` : ''}`)
}

// GET /reservations/{id} — 예약 상세 (QR 페이로드는 RESERVED 상태일 때만 포함)
export function getReservation(id: number): Promise<ReservationDetail> {
  return http<ReservationDetail>(`/reservations/${id}`)
}

// DELETE /reservations/{id} — 예약 취소 (204)
export function cancelReservation(id: number): Promise<void> {
  return http<void>(`/reservations/${id}`, { method: 'DELETE' })
}
