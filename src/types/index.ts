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

export interface Currency {
  code: string
  name: string
  pair: string
  rate: string
  change: string
  range: string
  aiNote: string
  trend: number[]
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
  /** Currency 도메인이 서버에 아직 없으면(현재 develop 기준) 항상 null이다. */
  finalRate: number | null
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

/**
 * 서버 ReservationStatus(#39 결제 시스템 병합 이후 5종). PENDING_PAYMENT는 결제 대기,
 * EXPIRED는 결제 TTL(5분) 초과로 자동 해제된 홀드 — 노쇼(autoExpired)와는 서버에서 구분한다.
 */
export type ServerReservationStatus = 'PENDING_PAYMENT' | 'RESERVED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

/** GET /reservations 목록 항목. */
export interface ReservationSummary {
  id: number
  reservationNumber: string
  currencyCode: string
  amount: number
  branchId: number
  branchName: string
  pickupDate: string
  pickupTime: string
  status: ServerReservationStatus
  lockedRate: number | null
  /** PENDING_PAYMENT일 때만 값이 온다 (결제 TTL 만료 시각). */
  paymentExpiresAt: string | null
  /** RESERVED일 때만 값이 온다 (픽업 홀드 만료 시각). */
  expiresAt: string | null
  createdAt: string
}

/** POST /reservations, GET /reservations/{id} 응답. */
export interface ReservationDetail extends ReservationSummary {
  /** amount × lockedRate(KRW) — lockedRate가 없으면 null. */
  amountFrom: number | null
  amountTo: number
  /** RESERVED 상태일 때만 값이 온다 — 픽업 시 제시할 일회용 QR. */
  qrPayload: string | null
  pickedUpAt: string | null
  branch: BranchSummary
  /**
   * Stripe PaymentIntent의 client secret — 예약 생성(POST) 응답에서만 채워진다.
   * 결제 UI(Stripe Elements)는 이번 스코프에 포함하지 않아 현재는 사용하지 않는다.
   */
  paymentClientSecret: string | null
}

/** POST /branches/{id}/reservations/{reservationId}/redeem 응답 (ADMIN 전용). */
export interface RedeemResponse {
  reservationId: number
  status: ServerReservationStatus
  pickedUpAt: string | null
  summary: ReservationDetail
}

export interface ReservationPage {
  content: ReservationSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Pickup 예약 초안 — PickupDetailsPage에서 골라 ReviewReservationPage로 넘긴다. */
export interface PickupReservationDraft {
  branchId: number
  branchName: string
  currencyCode: string
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
