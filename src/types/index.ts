import type { ComponentType, SVGProps } from 'react'

/** Icon components from `@/components/icons`. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string | null
  phoneVerified: boolean
  role: string
}

/** Response of GET /auth/google/callback — JWT issued after Google OAuth2 login. */
export interface GoogleLoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  isNewUser: boolean
  user: UserProfile
}

/** Response of POST /auth/verify-phone (KYC step 1). */
export interface PhoneVerificationResponse {
  verified: boolean
  expiresAt: string | null
}

// Item of GET /currencies — 기준 환율은 외부 공공 API에서 일 1회 배치 수집.
export interface CurrencySummary {
  id: number
  code: string
  country: string
  buyRate: number
  sellRate: number
  updatedAt: string
}

// Response of GET /currencies — recent/popular은 q 미입력 시에만 내려옴. 
export interface CurrencyListResponse {
  results: CurrencySummary[]
  recentSearches: CurrencySummary[] | null
  popularCurrencies: CurrencySummary[] | null
}

// Response of GET /currencies/{code}.
export interface CurrencyDetail extends CurrencySummary {
  highVolatility: boolean
}

// Item of GET /currencies/{code}/history — 날짜 오름차순. 
export interface RateHistoryEntry {
  date: string
  rate: number
}

/**
 * NOW = 지금 환전 / WAIT = 대기 / NEUTRAL = 중립.
 * COLLECTING_DATA = 이력 14일 미만 워밍업 상태(배지 미표시).
 */
export type TimingSignal = 'NOW' | 'WAIT' | 'NEUTRAL' | 'COLLECTING_DATA'

// Response of GET /currencies/{code}/recommendation (AI 환전 타이밍 추천)
export interface TimingRecommendation {
  currencyCode: string
  signal: TimingSignal
  currentRate: number
  predictedRate: number | null
  highVolatility: boolean
  fallbackUsed: boolean
  explanation: { feature: string; contribution: number }[]
  disclaimer: string
}

export interface Branch {
  id: string
  name: string
  distance: string
  address: string
  boothDetail: string
  openUntil: string
  feeNote: string
  listRate: string
  rates: { code: string; rate: string }[]
  hours: { label: string; time: string }[]
}

export interface PickupOffice {
  id: string
  name: string
  openUntil: string
  rate: string
  locationDetail: string
}

export type ReservationStatus = 'active' | 'completed' | 'cancelled'

/** Statuses shown in exchange history, i.e. reservations that are no longer active. */
export type HistoryStatus = Exclude<ReservationStatus, 'active'>

export interface Reservation {
  id: string
  reservationNumber: string
  location: string
  locationDetail: string
  dateTime: string
  fromAmount: string
  toAmount: string
  status: ReservationStatus
}

/** Reservation details passed between the reserve pages via router state. */
export interface ReservationDraft {
  dateTime: string
  fromAmount: string
  toAmount: string
}

export interface Notification {
  icon: 'trend' | 'clock' | 'pin'
  title: string
  description: string
}

export interface Rate {
  code: string
  name: string
  value: string
  change: string
}
