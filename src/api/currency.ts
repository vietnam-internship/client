import { http } from '@/utils/http'
import type {
  CurrencyDetail,
  CurrencyListResponse,
  RateHistoryEntry,
  TimingRecommendation,
} from '@/types'

// GET /currencies — q가 있으면 코드/국가명 검색, 없으면 전체 + 최근 검색/인기 통화
export function listCurrencies(q?: string): Promise<CurrencyListResponse> {
  const query = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''
  return http<CurrencyListResponse>(`/currencies${query}`)
}

// GET /currencies/{code} — 기준 매입/매도 환율과 고변동성 배지
export function getCurrency(code: string): Promise<CurrencyDetail> {
  return http<CurrencyDetail>(`/currencies/${encodeURIComponent(code.toUpperCase())}`)
}

// GET /currencies/{code}/history — 일별 환율 이력, 날짜 오름차순 (기본 30일)
export function getCurrencyHistory(code: string, days?: number): Promise<RateHistoryEntry[]> {
  const query = days ? `?days=${days}` : ''
  return http<RateHistoryEntry[]>(
    `/currencies/${encodeURIComponent(code.toUpperCase())}/history${query}`,
  )
}

// GET /currencies/{code}/recommendation — AI 환전 타이밍 추천 (NOW/WAIT/NEUTRAL)
export function getTimingRecommendation(code: string): Promise<TimingRecommendation> {
  return http<TimingRecommendation>(
    `/currencies/${encodeURIComponent(code.toUpperCase())}/recommendation`,
  )
}
