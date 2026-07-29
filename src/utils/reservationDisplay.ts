import { formatNumber } from '@/utils/format'
import type { BackendReservationStatus, Reservation, ReservationStatus, ReservationSummary } from '@/types'

export function toUiStatus(status: BackendReservationStatus): ReservationStatus {
  if (status === 'COMPLETED') return 'completed'
  if (status === 'CANCELLED' || status === 'EXPIRED') return 'cancelled'
  return 'active' // PENDING_PAYMENT, RESERVED
}

export function formatPickupDateTime(pickupDate: string, pickupTime: string): string {
  const [year, month, day] = pickupDate.split('-').map(Number)
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const [hour, minute] = pickupTime.split(':').map(Number)
  const period = hour < 12 ? 'AM' : 'PM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${dateLabel} · ${hour12}:${String(minute).padStart(2, '0')} ${period}`
}

/** Maps a backend reservation (list or detail) onto the display shape ReservationListCard/HistoryCard expect. */
export function toDisplayReservation(r: ReservationSummary, locationDetail = ''): Reservation {
  const amountFrom = r.lockedRate != null ? r.amount * r.lockedRate : null

  return {
    id: String(r.id),
    reservationNumber: r.reservationNumber,
    location: r.branchName ?? 'Unknown branch',
    locationDetail,
    dateTime: formatPickupDateTime(r.pickupDate, r.pickupTime),
    fromAmount: amountFrom != null ? `${formatNumber(amountFrom)} KRW` : '—',
    toAmount: `${formatNumber(r.amount)} ${r.currencyCode}`,
    status: toUiStatus(r.status),
  }
}
