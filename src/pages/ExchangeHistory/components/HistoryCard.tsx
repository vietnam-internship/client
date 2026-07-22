import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@/components/icons'
import type { ReservationSummary } from '@/types'
import { formatNumber } from '@/utils/format'

function HistoryCard({ reservation }: { reservation: ReservationSummary }) {
  return (
    <li>
      <Link
        to={`/mypage/reservations/${reservation.id}`}
        className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-4 transition-colors hover:bg-gray-200"
      >
        <span>
          <span className="block text-[14px] font-bold text-gray-900">
            {reservation.branchName}
          </span>
          <span className="mt-1 block text-[12px] text-gray-400">
            {reservation.pickupDate} · {reservation.pickupTime}
          </span>
          <span className="mt-0.5 block text-[12px] text-gray-400">
            {formatNumber(reservation.amount)} {reservation.currencyCode}
          </span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />
      </Link>
    </li>
  )
}

export default HistoryCard
