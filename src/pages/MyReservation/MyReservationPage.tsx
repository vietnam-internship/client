import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { listMyReservations } from '@/api/reservation'
import { toDisplayReservation } from '@/utils/reservationDisplay'
import ReservationListCard from '@/pages/MyReservation/components/ReservationListCard'
import type { Reservation } from '@/types'

function MyReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    listMyReservations({ status: 'PENDING_PAYMENT,RESERVED' })
      .then((data) => {
        if (!cancelled) setReservations(data.content.map((r) => toDisplayReservation(r)))
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

        {!loading && reservations.length === 0 && (
          <p className="mt-6 text-[13px] text-gray-400">No active reservations.</p>
        )}

        <ul className="mt-3.5 flex flex-col gap-3">
          {reservations.map((reservation) => (
            <ReservationListCard key={reservation.id} reservation={reservation} />
          ))}
        </ul>
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default MyReservationPage
