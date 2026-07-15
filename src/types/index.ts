import type { ComponentType, SVGProps } from 'react'

/** Icon components from `@/components/common/icons`. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

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
