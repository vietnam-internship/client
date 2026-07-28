import { http, ADMIN_AUTH } from '@/utils/http'
import type {
  AdminDashboardResponse,
  AdminReservationListResponse,
  AdminReservationDetail,
  AdminRateRow,
  AdminInventoryRow,
  BranchDetail,
} from '@/types'

export function adminGetDashboard(branchId?: number): Promise<AdminDashboardResponse> {
  const qs = branchId !== undefined ? `?branchId=${branchId}` : ''
  return http<AdminDashboardResponse>(`/admin/dashboard${qs}`, {}, ADMIN_AUTH)
}

export interface AdminReservationListParams {
  status?: 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  q?: string
  page?: number
  size?: number
}

export function adminListReservations(
  branchId: number,
  params: AdminReservationListParams = {},
): Promise<AdminReservationListResponse> {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.q) query.set('q', params.q)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  const qs = query.toString()
  return http<AdminReservationListResponse>(
    `/admin/branches/${branchId}/reservations${qs ? `?${qs}` : ''}`,
    {},
    ADMIN_AUTH,
  )
}

export function adminLookupReservationByQr(branchId: number, qrToken: string): Promise<AdminReservationDetail> {
  return http<AdminReservationDetail>(
    `/admin/branches/${branchId}/reservations/lookup?qrToken=${encodeURIComponent(qrToken)}`,
    {},
    ADMIN_AUTH,
  )
}

// /branches/{id}/reservations/{id}/redeem — ReservationRedeemController의 기존 경로 (/admin 접두어 아님)
export function adminCompleteReservation(
  branchId: number,
  reservationId: number,
  qrToken: string,
): Promise<AdminReservationDetail> {
  return http<AdminReservationDetail>(
    `/branches/${branchId}/reservations/${reservationId}/redeem`,
    { method: 'POST', body: JSON.stringify({ qrToken, idVerified: true }) },
    ADMIN_AUTH,
  )
}

export function adminRejectReservation(branchId: number, reservationId: number): Promise<void> {
  return http<void>(
    `/admin/branches/${branchId}/reservations/${reservationId}/reject`,
    { method: 'POST' },
    ADMIN_AUTH,
  )
}

export function adminGetRates(branchId: number): Promise<AdminRateRow[]> {
  return http<AdminRateRow[]>(`/admin/branches/${branchId}/rates`, {}, ADMIN_AUTH)
}

export function adminUpdateRates(
  branchId: number,
  rates: { currencyCode: string; feePercent: number }[],
): Promise<AdminRateRow[]> {
  return http<AdminRateRow[]>(
    `/admin/branches/${branchId}/rates`,
    { method: 'PATCH', body: JSON.stringify({ rates }) },
    ADMIN_AUTH,
  )
}

export function adminGetInventory(branchId: number): Promise<AdminInventoryRow[]> {
  return http<AdminInventoryRow[]>(`/admin/branches/${branchId}/inventory`, {}, ADMIN_AUTH)
}

export function adminUpdateInventory(
  branchId: number,
  items: { currencyCode: string; stock: number }[],
): Promise<AdminInventoryRow[]> {
  return http<AdminInventoryRow[]>(
    `/admin/branches/${branchId}/inventory`,
    { method: 'PATCH', body: JSON.stringify({ items }) },
    ADMIN_AUTH,
  )
}

export interface AdminBranchSettingsUpdate {
  name?: string
  latitude?: number
  longitude?: number
  openTime?: string
  closeTime?: string
  timeSlotCapacity?: number
}

export function adminUpdateBranchSettings(
  branchId: number,
  update: AdminBranchSettingsUpdate,
): Promise<BranchDetail> {
  return http<BranchDetail>(
    `/admin/branches/${branchId}`,
    { method: 'PATCH', body: JSON.stringify(update) },
    ADMIN_AUTH,
  )
}
