import { http } from '@/utils/http'

export interface CurrencySummary {
  id: number
  code: string
  country: string
  buyRate: number
  sellRate: number
  updatedAt: string
}

export interface CurrencyListResponse {
  results: CurrencySummary[]
  recentSearches: CurrencySummary[] | null
  popularCurrencies: CurrencySummary[] | null
}

export interface CurrencyDetailResponse extends CurrencySummary {
  highVolatility: boolean
}

export interface RateHistoryEntry {
  date: string
  rate: number
}

export interface TimingRecommendation {
  currencyCode: string
  signal: 'NOW' | 'WAIT' | 'NEUTRAL' | 'COLLECTING_DATA'
  currentRate: number
  predictedRate: number | null
  highVolatility: boolean
  fallbackUsed: boolean
  explanation: Array<{ feature: string; contribution: number }>
  disclaimer: string
}

export const getCurrencies = (query?: string): Promise<CurrencyListResponse> => {
  const qs = query ? `?q=${encodeURIComponent(query)}` : ''
  return http<CurrencyListResponse>(`/currencies${qs}`)
}

export const getCurrencyDetail = (code: string): Promise<CurrencyDetailResponse> => {
  return http<CurrencyDetailResponse>(`/currencies/${encodeURIComponent(code)}`)
}

export const getCurrencyHistory = (code: string, days = 7): Promise<RateHistoryEntry[]> => {
  return http<RateHistoryEntry[]>(`/currencies/${encodeURIComponent(code)}/history?days=${days}`)
}

export const getTimingRecommendation = (code: string): Promise<TimingRecommendation> => {
  return http<TimingRecommendation>(`/currencies/${encodeURIComponent(code)}/recommendation`)
}
