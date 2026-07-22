import { useEffect, useState } from 'react'
import { listMyReservations } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import type { ReservationSummary } from '@/types'
import ReservationListCard from '@/pages/MyReservation/components/ReservationListCard'

function MyReservationPage() {
  const [reservations, setReservations] = useState<ReservationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    listMyReservations({ status: 'RESERVED' })
      .then((result) => {
        if (cancelled) return
        setReservations(result.content)
        setError(false)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
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

        {loading ? (
          <p className="mt-4 text-[13px] text-gray-400">Loading reservations…</p>
        ) : error ? (
          <p className="mt-4 text-[13px] text-gray-400">
            Couldn&apos;t load reservations. Please try again.
          </p>
        ) : reservations.length === 0 ? (
          <p className="mt-4 text-[13px] text-gray-400">No upcoming reservations.</p>
        ) : (
          <ul className="mt-3.5 flex flex-col gap-3">
            {reservations.map((reservation) => (
              <ReservationListCard key={reservation.id} reservation={reservation} />
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default MyReservationPage
