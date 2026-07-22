import { http } from '@/utils/http'
import type {
  ReservationCreateRequest,
  ReservationDetail,
  ReservationPage,
} from '@/types'

// Branch와 동일하게 { result, data }로 감싸져 온다 (실제 백엔드 ApiResponse 포맷).
interface ApiEnvelope<T> {
  result: string
  data: T
}

// POST /reservations
export async function createReservation(
  payload: ReservationCreateRequest,
): Promise<ReservationDetail> {
  const { data } = await http<ApiEnvelope<ReservationDetail>>('/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data
}

export interface ListMyReservationsParams {
  status?: string
  page?: number
  size?: number
}

// GET /reservations — status는 쉼표로 복수 지정 가능 (예: 'COMPLETED,CANCELLED')
export async function listMyReservations(
  params: ListMyReservationsParams = {},
): Promise<ReservationPage> {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  const qs = query.toString()

  const { data } = await http<ApiEnvelope<ReservationPage>>(
    `/reservations${qs ? `?${qs}` : ''}`,
  )
  return data
}

// GET /reservations/{id}
export async function getReservation(id: number): Promise<ReservationDetail> {
  const { data } = await http<ApiEnvelope<ReservationDetail>>(`/reservations/${id}`)
  return data
}

// DELETE /reservations/{id} — 204 No Content
export function cancelReservation(id: number): Promise<void> {
  return http<void>(`/reservations/${id}`, { method: 'DELETE' })
}
