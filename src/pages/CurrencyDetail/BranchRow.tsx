import { Link } from 'react-router-dom'
import type { Branch } from '@/data/branches'

function BranchRow({ branch }: { branch: Branch }) {
  return (
    <li>
      <Link
        to={`/branch/${branch.id}`}
        className="flex items-center justify-between border-b border-gray-100 py-2.5 transition-colors hover:bg-gray-50"
      >
        <span>
          <span className="block text-[13px] font-bold text-gray-900">{branch.name}</span>
          <span className="block text-[11px] text-gray-400">{branch.distance}</span>
        </span>
        <span className="text-[13px] font-bold text-gray-900">{branch.listRate}</span>
      </Link>
    </li>
  )
}

export default BranchRow
