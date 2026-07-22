import { Link } from 'react-router-dom'
import { GaugeIcon } from '@/components/icons'
import type { BranchSummary } from '@/types'
import { formatRate } from '@/utils/format'

function OfficeRow({ branch, currency }: { branch: BranchSummary; currency: string }) {
  return (
    <li>
      <Link
        to={`/reserve/${branch.id}?currency=${encodeURIComponent(currency)}`}
        className="flex items-center justify-between border-b border-gray-100 py-3.5 transition-colors hover:bg-gray-50"
      >
        <span>
          <span className="block text-[14px] font-semibold text-gray-900">{branch.name}</span>
          <span className="mt-0.5 block text-[11px] text-gray-400">
            {branch.isOpenNow ? 'Open now' : 'Closed now'}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-900">
            {branch.finalRate !== null ? formatRate(branch.finalRate) : '-'}
          </span>
          <GaugeIcon className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </span>
      </Link>
    </li>
  )
}

export default OfficeRow
