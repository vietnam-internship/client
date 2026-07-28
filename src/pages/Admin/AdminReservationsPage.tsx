import { useEffect, useState } from 'react'
import { SearchIcon } from '@/components/icons'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'
import StatusChip, { type ChipStatus } from '@/pages/Admin/components/StatusChip'
import { adminListReservations } from '@/api/admin'
import useAdminBranch from '@/hooks/useAdminBranch'
import type { AdminReservationSummary, UserProfile } from '@/types'

const FILTERS = [
  { value: 'ALL', label: 'ALL' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'PENDING', label: 'Pending' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

interface AdminReservationsPageProps {
  user: UserProfile | null
}

function AdminReservationsPage({ user }: AdminReservationsPageProps) {
  const { branchId, setBranchId, branches, locked } = useAdminBranch(user)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('ALL')
  const [page, setPage] = useState(0)
  const [results, setResults] = useState<AdminReservationSummary[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (branchId === null) return
    adminListReservations(branchId, { status: filter, q: query || undefined, page })
      .then((res) => {
        setResults(res.reservations)
        setTotalPages(res.totalPages)
      })
      .catch(() => setResults([]))
  }, [branchId, filter, query, page])

  return (
    <AdminLayout active="reservations" title="Reservations" subtitle="Review and manage bookings">
      {!locked && (
        <div className="mt-6">
          <BranchSelect branches={branches} value={branchId} onChange={setBranchId} />
        </div>
      )}

      <div className="relative mt-6">
        <SearchIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setPage(0)
            setQuery(e.target.value)
          }}
          placeholder="Search reservations"
          className="h-12 w-full rounded-lg border border-gray-200 pr-4 pl-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          className="h-8 cursor-pointer rounded-full bg-gray-200 px-5 text-[12px] font-bold text-gray-600 transition-colors hover:bg-gray-300"
        >
          Filter
        </button>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setPage(0)
              setFilter(value)
            }}
            className={`h-8 cursor-pointer rounded-full px-5 text-[12px] font-bold transition-colors ${
              filter === value
                ? 'bg-primary text-white'
                : 'bg-blue-50 text-primary hover:bg-blue-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-5">
        {results.map((reservation) => (
          <li key={reservation.id} className="relative rounded-lg border border-gray-200 px-6 py-6">
            <span className="absolute top-4 right-5">
              <StatusChip status={reservation.status as ChipStatus} />
            </span>
            <p className="text-[19px] font-bold text-gray-900">
              {reservation.customerName} · #{reservation.reservationNumber}
            </p>
            <p className="mt-1.5 text-[13px] text-gray-500">
              {reservation.currencyPair} · {reservation.amount}
            </p>
          </li>
        ))}
      </ul>

      <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="h-6 cursor-pointer rounded-full bg-blue-50 px-2.5 text-[11px] font-bold text-primary disabled:opacity-40"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={`h-6 cursor-pointer rounded-full px-2.5 text-[11px] font-bold ${
              p === page ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
            }`}
          >
            {p + 1}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          className="h-6 cursor-pointer rounded-full bg-blue-50 px-2.5 text-[11px] font-bold text-primary disabled:opacity-40"
        >
          &gt;
        </button>
      </nav>
    </AdminLayout>
  )
}

export default AdminReservationsPage
