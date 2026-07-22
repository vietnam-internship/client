import { Navigate, useLocation } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ReservationNumberCard from '@/components/ReservationNumberCard'
import { XIcon } from '@/components/icons'
import type { ReservationDetail } from '@/types'
import { formatNumber } from '@/utils/format'

function ReservationCancelledPage() {
  const reservation = useLocation().state as ReservationDetail | null

  if (!reservation) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const summary = [
    { label: 'Amount', value: `${formatNumber(reservation.amountTo)} ${reservation.currencyCode}` },
    { label: 'Location', value: reservation.branchName },
    { label: 'Date', value: `${reservation.pickupDate} · ${reservation.pickupTime}` },
  ]

  return (
    <PageLayout>
      <Header />

      <main className="flex flex-1 flex-col px-4 pb-28">
        <div className="mt-12 flex h-20 w-20 items-center justify-center self-center rounded-[24px] bg-red-50">
          <XIcon className="h-8 w-8 text-red-600" strokeWidth={2.5} />
        </div>

        <h1 className="mt-7 text-center text-[20px] font-bold text-gray-900">
          Reservation cancelled
        </h1>
        <p className="mx-auto mt-2.5 max-w-[300px] text-center text-[13px] leading-[1.5] text-gray-400">
          Your currency exchange reservation has been cancelled.
        </p>

        <ReservationNumberCard className="mt-6" number={reservation.reservationNumber} />

        <dl className="mt-auto border-t border-gray-200 pt-0">
          {summary.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-gray-200 py-3.5"
            >
              <dt className="text-[12px] text-gray-500">{label}</dt>
              <dd className="text-[13px] font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <ActionButton to="/mypage/reservations" className="mt-4">
          Back to list
        </ActionButton>
        <ActionButton to="/" variant="secondary" className="mt-2.5">
          Back to home
        </ActionButton>
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ReservationCancelledPage
