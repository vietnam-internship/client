import { Link } from 'react-router-dom'
import type { Reservation } from '@/types'

function ReservationListCard({ reservation }: { reservation: Reservation }) {
  return (
    <li>
      <Link
        to={`/mypage/reservations/${reservation.id}`}
        className="flex items-start justify-between rounded-xl bg-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-200"
      >
        <span>
          <span className="block text-[14px] font-bold text-gray-900">
            {reservation.location}
          </span>
          <span className="mt-1 block text-[12px] text-gray-400">{reservation.dateTime}</span>
        </span>
        <span className="text-[13px] font-bold text-gray-900">{reservation.toAmount}</span>
      </Link>
    </li>
  )
}

export default ReservationListCard
