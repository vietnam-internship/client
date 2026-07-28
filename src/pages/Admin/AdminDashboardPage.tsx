import { useEffect, useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import StatusChip, { type ChipStatus } from '@/pages/Admin/components/StatusChip'
import { adminGetDashboard } from '@/api/admin'
import type { AdminDashboardResponse } from '@/types'

const CURRENCY_BAR_COLOR = (index: number) => (index === 2 ? 'bg-amber-500' : 'bg-primary')

function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    adminGetDashboard()
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <AdminLayout active="overview" title="Dashboard">
        <p className="mt-8 text-[13px] text-red-600">Failed to load dashboard.</p>
      </AdminLayout>
    )
  }

  if (!data) {
    return (
      <AdminLayout active="overview" title="Dashboard">
        <p className="mt-8 text-[13px] text-gray-400">Loading…</p>
      </AdminLayout>
    )
  }

  const maxCount = Math.max(...data.popularCurrencies.map((c) => c.count), 1)

  return (
    <AdminLayout
      active="overview"
      title="Dashboard"
      subtitle="Reservation status and currency trends at a glance"
    >
      <div className="mt-8 grid grid-cols-2 gap-6">
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-5 py-5">
          <p className="text-[13px] text-gray-500">Total Users</p>
          <p className="mt-1.5 text-[26px] font-bold text-gray-900">{data.totalUsers}</p>
        </section>
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-5 py-5">
          <p className="text-[13px] text-gray-500">Pending Reservations</p>
          <p className="mt-1.5 text-[26px] font-bold text-gray-900">{data.pendingReservationsCount}</p>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-[22px] font-bold text-slate-500">Popular currencies</h2>
        <div className="mt-8 flex items-end gap-8">
          {data.popularCurrencies.map(({ currencyCode, count }, index) => (
            <div key={currencyCode} className="flex w-[64px] flex-col items-center">
              <div className={`w-full ${CURRENCY_BAR_COLOR(index)}`} style={{ height: (count / maxCount) * 120 }} />
              <span className="mt-10 text-[12px] text-gray-400">{currencyCode}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="border-b border-gray-200 pb-4 text-[22px] font-bold text-slate-500">
          Recent reservations
        </h2>
        <ul>
          {data.recentReservations.map((r, index) => (
            <li key={index} className="flex items-center justify-between border-b border-gray-200 py-6">
              <span>
                <span className="block text-[17px] font-bold text-gray-900">{r.customerName}</span>
                <span className="block text-[12px] text-gray-400">{r.currencyPair}</span>
              </span>
              <span className="flex flex-col items-end gap-1.5">
                <span className="text-[17px] font-bold text-gray-900">{r.amount}</span>
                <StatusChip status={r.status as ChipStatus} />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  )
}

export default AdminDashboardPage
