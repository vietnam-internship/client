import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronRightIcon } from '../../components/icons'
import type { Reservation } from '../../data/reservations'

function HistoryCard({ reservation }: { reservation: Reservation }) {
  return (
    <li>
      <Link
        to={`/mypage/reservations/${reservation.id}`}
        className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-4 transition-colors hover:bg-gray-200"
      >
        <span>
          <span className="block text-[14px] font-bold text-gray-900">
            {reservation.location}
          </span>
          <span className="mt-1 block text-[12px] text-gray-400">{reservation.dateTime}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-gray-400">
            {reservation.fromAmount}
            <ArrowRightIcon className="h-3 w-3" />
            {reservation.toAmount}
          </span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />
      </Link>
    </li>
  )
}

export default HistoryCard
