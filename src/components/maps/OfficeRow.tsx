import { Link } from 'react-router-dom'
import { GaugeIcon } from '@/components/common/icons'
import type { PickupOffice } from '@/types'

function OfficeRow({ office }: { office: PickupOffice }) {
  return (
    <li>
      <Link
        to={`/reserve/${office.id}`}
        className="flex items-center justify-between border-b border-gray-100 py-3.5 transition-colors hover:bg-gray-50"
      >
        <span>
          <span className="block text-[14px] font-semibold text-gray-900">{office.name}</span>
          <span className="mt-0.5 block text-[11px] text-gray-400">{office.openUntil}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-900">{office.rate}</span>
          <GaugeIcon className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </span>
      </Link>
    </li>
  )
}

export default OfficeRow
