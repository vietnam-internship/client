import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ReservationNumberCard from '@/components/ReservationNumberCard'
import { XIcon } from '@/components/icons'
import { getReservation } from '@/api/reservation'
import { toDisplayReservation } from '@/utils/reservationDisplay'
import type { Reservation } from '@/types'

function ReservationCancelledPage() {
  const { id } = useParams()
  const reservationId = Number(id)

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(reservationId)) return undefined

    let cancelled = false
    getReservation(reservationId)
      .then((data) => {
        if (!cancelled) setReservation(toDisplayReservation(data))
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [reservationId])

  if (!Number.isFinite(reservationId) || notFound) {
    return <Navigate to="/mypage/reservations" replace />
  }

  if (!reservation) {
    return null
  }

  const summary = [
    { label: 'Amount', value: reservation.toAmount },
    { label: 'Location', value: reservation.location },
    { label: 'Date', value: reservation.dateTime },
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
