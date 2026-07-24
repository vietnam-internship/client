import { http } from '@/utils/http'
import type {
  CurrencyDetail,
  CurrencyListResponse,
  RateHistoryEntry,
  TimingRecommendation,
} from '@/types'

// Branch/Reservation과 동일하게 { result, data }로 감싸져 온다 (실제 백엔드 ApiResponse 포맷).
interface ApiEnvelope<T> {
  result: string
  data: T
}

// GET /currencies — q가 있으면 코드/국가명 검색, 없으면 전체 + 최근 검색/인기 통화
export async function listCurrencies(q?: string): Promise<CurrencyListResponse> {
  const query = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''
  const { data } = await http<ApiEnvelope<CurrencyListResponse>>(`/currencies${query}`)
  return data
}

// GET /currencies/{code} — 기준 매입/매도 환율과 고변동성 배지
export async function getCurrency(code: string): Promise<CurrencyDetail> {
  const { data } = await http<ApiEnvelope<CurrencyDetail>>(
    `/currencies/${encodeURIComponent(code.toUpperCase())}`,
  )
  return data
}

// GET /currencies/{code}/history — 일별 환율 이력, 날짜 오름차순 (기본 30일)
export async function getCurrencyHistory(code: string, days?: number): Promise<RateHistoryEntry[]> {
  const query = days ? `?days=${days}` : ''
  const { data } = await http<ApiEnvelope<RateHistoryEntry[]>>(
    `/currencies/${encodeURIComponent(code.toUpperCase())}/history${query}`,
  )
  return data
}

// GET /currencies/{code}/recommendation — AI 환전 타이밍 추천. 백엔드가 아직 MVP 스텁이라
// signal은 항상 'NEUTRAL', predictedRate는 항상 null로 옴.
export async function getTimingRecommendation(code: string): Promise<TimingRecommendation> {
  const { data } = await http<ApiEnvelope<TimingRecommendation>>(
    `/currencies/${encodeURIComponent(code.toUpperCase())}/recommendation`,
  )
  return data
}
