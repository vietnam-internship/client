import AdminLayout from '@/pages/Admin/components/AdminLayout'
import StatusChip, { type ChipStatus } from '@/pages/Admin/components/StatusChip'

const STATS = [
  { label: 'Total Users', value: '128', note: '+12% this month', noteClass: 'text-green-700' },
  { label: 'Pending Reservations', value: '24', note: 'High priority', noteClass: 'text-amber-600' },
]

const POPULAR_CURRENCIES = [
  { code: 'USD', height: 118, color: 'bg-primary' },
  { code: 'JPY', height: 90, color: 'bg-primary' },
  { code: 'EUR', height: 68, color: 'bg-amber-500' },
  { code: 'CNY', height: 38, color: 'bg-primary' },
  { code: 'GBP', height: 28, color: 'bg-primary' },
]

const RECENT_RESERVATIONS: {
  name: string
  pair: string
  amount: string
  status: ChipStatus
}[] = [
  { name: 'Kim Min-su', pair: 'USD → KRW', amount: '$1,200', status: 'completed' },
  { name: 'Lee Ji-won', pair: 'JPY → KRW', amount: '¥50,000', status: 'pending' },
  { name: 'Park Jun-ho', pair: 'EUR → KRW', amount: '€850', status: 'cancelled' },
]

function AdminDashboardPage() {
  return (
    <AdminLayout
      active="overview"
      title="Dashboard"
      subtitle="Reservation status and currency trends at a glance"
    >
      <div className="mt-8 grid grid-cols-2 gap-6">
        {STATS.map(({ label, value, note, noteClass }) => (
          <section key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-5 py-5">
            <p className="text-[13px] text-gray-500">{label}</p>
            <p className="mt-1.5 text-[26px] font-bold text-gray-900">{value}</p>
            <p className={`mt-1 text-[12px] ${noteClass}`}>{note}</p>
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-[22px] font-bold text-slate-500">Popular currencies</h2>
        <div className="mt-8 flex items-end gap-8">
          {POPULAR_CURRENCIES.map(({ code, height, color }) => (
            <div key={code} className="flex w-[64px] flex-col items-center">
              <div className={`w-full ${color}`} style={{ height }} />
              <span className="mt-10 text-[12px] text-gray-400">{code}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="border-b border-gray-200 pb-4 text-[22px] font-bold text-slate-500">
          Recent reservations
        </h2>
        <ul>
          {RECENT_RESERVATIONS.map(({ name, pair, amount, status }) => (
            <li
              key={name}
              className="flex items-center justify-between border-b border-gray-200 py-6"
            >
              <span>
                <span className="block text-[17px] font-bold text-gray-900">{name}</span>
                <span className="block text-[12px] text-gray-400">{pair}</span>
              </span>
              <span className="flex flex-col items-end gap-1.5">
                <span className="text-[17px] font-bold text-gray-900">{amount}</span>
                <StatusChip status={status} />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  )
}

export default AdminDashboardPage
