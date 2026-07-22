import { Link } from 'react-router-dom'
import type { ReservationSummary } from '@/types'
import { formatNumber } from '@/utils/format'

function ReservationListCard({ reservation }: { reservation: ReservationSummary }) {
  return (
    <li>
      <Link
        to={`/mypage/reservations/${reservation.id}`}
        className="flex items-start justify-between rounded-xl bg-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-200"
      >
        <span>
          <span className="block text-[14px] font-bold text-gray-900">
            {reservation.branchName}
          </span>
          <span className="mt-1 block text-[12px] text-gray-400">
            {reservation.pickupDate} · {reservation.pickupTime}
          </span>
        </span>
        <span className="text-[13px] font-bold text-gray-900">
          {formatNumber(reservation.amount)} {reservation.currencyCode}
        </span>
      </Link>
    </li>
  )
}

export default ReservationListCard
