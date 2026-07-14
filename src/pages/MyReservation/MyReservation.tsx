import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import { RESERVATIONS } from '@/data/reservations'
import ReservationListCard from './ReservationListCard'

function MyReservation() {
  const reservations = RESERVATIONS.filter((r) => r.status === 'active')

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header backTo="/mypage" />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-7 text-[16px] font-bold text-gray-900">My reservation</h1>

        <ul className="mt-3.5 flex flex-col gap-3">
          {reservations.map((reservation) => (
            <ReservationListCard key={reservation.id} reservation={reservation} />
          ))}
        </ul>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}

export default MyReservation
