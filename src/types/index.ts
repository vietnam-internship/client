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

/**
 * GET /branches 목록 항목 — 위 `Branch`(목업, 아직 API 미연동 페이지에서 사용 중)와는 별개로,
 * 실제 서버 응답 스키마(BranchSummary)를 그대로 옮긴 타입이다.
 */
export interface BranchSummary {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  /** latitude/longitude 파라미터 전달 시에만 값이 온다. */
  distanceKm: number | null
  isOpenNow: boolean
  /** currency 파라미터 전달 시에만 값이 온다 (기준 환율 × (1 − 우대율/100)). */
  finalRate: number | null
  /** currency 파라미터 전달 시에만 값이 온다. */
  preferentialRate: number | null
  reservationAvailable: boolean
}

/** BranchDetail.currencies 항목 — 지점이 취급하는 통화별 우대율/최종 환율/재고. */
export interface BranchCurrencyRate {
  currencyCode: string
  preferentialRate: number
  finalRate: number
  reservationOnlyStock: number
  updatedAt: string
}

/** GET /branches/{id} 응답 (BranchSummary 필드 + 상세 필드). */
export interface BranchDetail extends BranchSummary {
  phone: string
  businessHours: string
  pickupLocationDetail: string | null
  timeSlotCapacity: number
  /** 이 지점 좌표 기준 5km 반경 내에서 최저 매도 환율을 제공하는 통화가 하나라도 있으면 true. */
  isBestRateNearby: boolean
  active: boolean
  currencies: BranchCurrencyRate[]
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

/** Picked on PickupDetailsPage, carried via router state through review/payment/complete. */
export interface PickupSelection {
  branchId: number
  currencyCode: string
  amount: number
  pickupDate: string
  pickupTime: string
  dateTime: string
  fromAmount: string
  toAmount: string
}

/** Passed to PaymentPage via router state once ReviewReservationPage calls POST /reservations. */
export interface PaymentDraft extends PickupSelection {
  clientSecret: string
  reservationId: number
  reservationNumber: string
}

export type BackendReservationStatus = 'PENDING_PAYMENT' | 'RESERVED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

/** GET /reservations 목록 항목, GET /reservations/{id} 응답의 공통 필드. */
export interface ReservationSummary {
  id: number
  reservationNumber: string
  currencyCode: string
  amount: number
  branchId: number
  branchName: string | null
  pickupDate: string
  pickupTime: string
  status: BackendReservationStatus
  lockedRate: number | null
  paymentExpiresAt: string | null
  expiresAt: string | null
  createdAt: string
}

/** GET /reservations/{id} 응답 — paymentClientSecret은 예약 생성 응답에서만 값이 있다. */
export interface ReservationDetail extends ReservationSummary {
  amountFrom: number | null
  amountTo: number
  qrPayload: string | null
  pickedUpAt: string | null
  branch: BranchSummary | null
  paymentClientSecret: string | null
}

export interface ReservationPageResponse {
  content: ReservationSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface CreateReservationPayload {
  currencyCode: string
  branchId: number
  amount: number
  pickupDate: string
  pickupTime: string
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

export interface AdminPopularCurrency {
  currencyCode: string
  count: number
}

export type AdminReservationStatus = 'pending' | 'completed' | 'cancelled'

export interface AdminRecentReservation {
  customerName: string
  currencyPair: string
  amount: number
  status: AdminReservationStatus
}

export interface AdminDashboardResponse {
  totalUsers: number
  pendingReservationsCount: number
  popularCurrencies: AdminPopularCurrency[]
  recentReservations: AdminRecentReservation[]
}

export interface AdminReservationSummary {
  id: number
  reservationNumber: string
  customerName: string
  currencyPair: string
  amount: number
  status: AdminReservationStatus
}

export interface AdminReservationListResponse {
  reservations: AdminReservationSummary[]
  page: number
  totalPages: number
  totalElements: number
}

export interface AdminReservationDetail {
  id: number
  reservationNumber: string
  customerName: string
  currencyPair: string
  amount: number
  status: AdminReservationStatus
  branchName: string
  pickupDetail: string
}

export interface AdminRateRow {
  currencyCode: string
  buyRate: number | null
  sellRate: number | null
  feePercent: number
}

export interface AdminInventoryRow {
  currencyCode: string
  stock: number
  lowStock: boolean
}
