import { useState } from 'react'
import { SearchIcon } from '@/components/icons'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import StatusChip, { type ChipStatus } from '@/pages/Admin/components/StatusChip'

interface AdminReservation {
  id: string
  name: string
  detail: string
  sub?: string
  note?: { text: string; tone: 'link' | 'alert' }
  status: ChipStatus
}

const RESERVATIONS: AdminReservation[] = [
  {
    id: 'TX1',
    name: 'Alexander Kim',
    detail: 'USD → Terminal 1, B',
    note: { text: 'Details', tone: 'link' },
    status: 'pending',
  },
  {
    id: 'TX2',
    name: 'Sophia Lee',
    detail: 'GBP → Arrivals Hall',
    note: { text: 'Cancelled', tone: 'alert' },
    status: 'cancelled',
  },
  {
    id: 'TX3',
    name: 'Mark Johnson',
    detail: 'CAD',
    note: { text: 'User requested cancellation at 10:45 AM', tone: 'alert' },
    status: 'cancelled',
  },
  {
    id: 'TX-90331',
    name: 'Elena Rossi',
    detail: 'EUR → USD · €2,100.00',
    sub: 'Main Hub, Gate 4 · Pickup 6:00 PM tomorrow',
    status: 'pending',
  },
]

const FILTERS = [
  { value: 'all', label: 'ALL' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

const PAGES = [1, 2, 3, 4, 5]

function AdminReservationsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const normalized = query.trim().toLowerCase()
  const results = RESERVATIONS.filter(
    (reservation) =>
      (filter === 'all' || reservation.status === filter) &&
      (!normalized ||
        reservation.name.toLowerCase().includes(normalized) ||
        reservation.id.toLowerCase().includes(normalized)),
  )

  return (
    <AdminLayout active="reservations" title="Reservations" subtitle="Review and manage bookings">
      <div className="relative mt-6">
        <SearchIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
            onClick={() => setFilter(value)}
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
          <li
            key={reservation.id}
            className="relative rounded-lg border border-gray-200 px-6 py-6"
          >
            <span className="absolute top-4 right-5">
              <StatusChip status={reservation.status} />
            </span>
            <p className="text-[19px] font-bold text-gray-900">
              {reservation.name} · #{reservation.id}
            </p>
            <p className="mt-1.5 text-[13px] text-gray-500">{reservation.detail}</p>
            {reservation.sub && <p className="mt-0.5 text-[12px] text-gray-400">{reservation.sub}</p>}
            {reservation.note &&
              (reservation.note.tone === 'link' ? (
                <a href="#" className="mt-2 inline-block text-[12px] text-blue-700 hover:underline">
                  {reservation.note.text}
                </a>
              ) : (
                <p className="mt-2 text-[12px] text-red-500">{reservation.note.text}</p>
              ))}
          </li>
        ))}
      </ul>

      <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
        <button
          type="button"
          className="h-6 cursor-pointer rounded-full bg-blue-50 px-2.5 text-[11px] font-bold text-primary"
        >
          &lt;
        </button>
        {PAGES.map((page) => (
          <button
            key={page}
            type="button"
            className={`h-6 cursor-pointer rounded-full px-2.5 text-[11px] font-bold ${
              page === 1 ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="h-6 cursor-pointer rounded-full bg-blue-50 px-2.5 text-[11px] font-bold text-primary"
        >
          &gt;
        </button>
      </nav>
    </AdminLayout>
  )
}

export default AdminReservationsPage
