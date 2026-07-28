import { http } from '@/utils/http'
import type { BranchSummary } from '@/types'

export interface ScoreBreakdown {
  distanceScore: number
  rateScore: number
  availabilityScore: number
  reservationScore: number
}

export interface BranchRecommendation extends BranchSummary {
  ranking: number
  totalScore: number
  breakdown: ScoreBreakdown | null
  isBestRateNearby: boolean
}

export interface BranchRecommendationQueryResponse {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  results: BranchRecommendation[]
  disclaimer: string | null
}

export interface CreateBranchRecommendationParams {
  latitude: number
  longitude: number
  radiusKm: number
  currency: string
  amount: number
}

export function createBranchRecommendation(
  params: CreateBranchRecommendationParams,
): Promise<{ sessionId: number }> {
  return http<{ sessionId: number }>('/branches/recommendations', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getBranchRecommendation(
  sessionId: number,
): Promise<BranchRecommendationQueryResponse> {
  return http<BranchRecommendationQueryResponse>(
    `/branches/recommendations?sessionId=${sessionId}`,
  )
}

export function recordRecommendationClick(itemId: number): Promise<void> {
  return http<void>(`/branches/recommendations/items/${itemId}/click`, { method: 'POST' })
}
