import { http } from '@/utils/http'
import type { BranchDetail, BranchSummary } from '@/types'

// Branch 도메인 응답은 다른 도메인과 달리 { result, data }로 감싸져 온다 (실제 백엔드 ApiResponse 포맷).
interface ApiEnvelope<T> {
  result: string
  data: T
}

export interface ListBranchesParams {
  currency?: string
  latitude?: number
  longitude?: number
  sort?: 'RATE' | 'DISTANCE'
}

// GET /branches — currency 전달 시 환율 비교용 finalRate 포함 (현재 백엔드 미연동으로 항상 null)
export async function listBranches(params: ListBranchesParams = {}): Promise<BranchSummary[]> {
  const query = new URLSearchParams()
  if (params.currency) query.set('currency', params.currency)
  if (params.latitude !== undefined) query.set('latitude', String(params.latitude))
  if (params.longitude !== undefined) query.set('longitude', String(params.longitude))
  if (params.sort) query.set('sort', params.sort)
  const qs = query.toString()

  const { data } = await http<ApiEnvelope<BranchSummary[]>>(`/branches${qs ? `?${qs}` : ''}`)
  return data
}

// GET /branches/{id} — 지점 상세
export async function getBranch(id: number): Promise<BranchDetail> {
  const { data } = await http<ApiEnvelope<BranchDetail>>(`/branches/${id}`)
  return data
}
