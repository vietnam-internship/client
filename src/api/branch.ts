import { http } from '@/utils/http'
import type { BranchDetail, BranchSummary, BranchTimeSlotsResponse } from '@/types'

export interface ListBranchesParams {
  currency?: string
  latitude?: number
  longitude?: number
  sort?: 'RATE' | 'DISTANCE'
}

// GET /branches — currency를 주면 지점별 finalRate를 포함한 환율 비교 목록으로 쓸 수 있다.
export function listBranches(params: ListBranchesParams = {}): Promise<BranchSummary[]> {
  const query = new URLSearchParams()
  if (params.currency) query.set('currency', params.currency)
  if (params.latitude !== undefined) query.set('latitude', String(params.latitude))
  if (params.longitude !== undefined) query.set('longitude', String(params.longitude))
  if (params.sort) query.set('sort', params.sort)
  const qs = query.toString()

  return http<BranchSummary[]>(`/branches${qs ? `?${qs}` : ''}`)
}

// GET /branches/{id} — 지점 상세 (통화별 환율, 영업시간, 주변 최저가 여부 등)
export function getBranch(id: number): Promise<BranchDetail> {
  return http<BranchDetail>(`/branches/${id}`)
}

// GET /branches/{id}/time-slots?date= — 지점의 특정 날짜 30분 단위 예약 가능 슬롯.
// date는 "YYYY-MM-DD" (로컬 날짜, toIsoDate 참고).
export function getBranchTimeSlots(id: number, date: string): Promise<BranchTimeSlotsResponse> {
  return http<BranchTimeSlotsResponse>(`/branches/${id}/time-slots?date=${date}`)
}
