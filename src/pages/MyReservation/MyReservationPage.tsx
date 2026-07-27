import { useEffect, useState } from 'react'
import { listMyReservations } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ReservationListCard from '@/pages/MyReservation/components/ReservationListCard'
import type { ReservationSummary } from '@/types'

function MyReservationPage() {
  const [reservations, setReservations] = useState<ReservationSummary[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    listMyReservations({ status: 'PENDING_PAYMENT,RESERVED' })
      .then((data) => {
        if (!cancelled) setReservations(data.content)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageLayout>
      <Header backTo="/mypage" />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-7 text-[16px] font-bold text-gray-900">My reservation</h1>

        {hasError && (
          <p className="mt-6 text-[12px] text-red-500">
            Couldn't load your reservations. Please try again later.
          </p>
        )}
        {!hasError && reservations === null && (
          <p className="mt-6 text-[12px] text-gray-400">Loading…</p>
        )}
        {!hasError && reservations !== null && reservations.length === 0 && (
          <p className="mt-6 text-[12px] text-gray-400">You don't have any upcoming reservations.</p>
        )}

        <ul className="mt-3.5 flex flex-col gap-3">
          {reservations?.map((reservation) => (
            <ReservationListCard key={reservation.id} reservation={reservation} />
          ))}
        </ul>
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default MyReservationPage
