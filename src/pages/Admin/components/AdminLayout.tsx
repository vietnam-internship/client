import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', to: '/admin' },
  { key: 'rates', label: 'Exchange Rates', to: '/admin/rates' },
  { key: 'inventory', label: 'Inventory', to: '/admin/inventory' },
  { key: 'reservations', label: 'Reservations', to: '/admin/reservations' },
  { key: 'qr-scan', label: 'QR Scan', to: '/admin/qr-scan' },
  { key: 'settings', label: 'Settings', to: '/admin/settings' },
] as const

export type AdminNavKey = (typeof NAV_ITEMS)[number]['key']

interface AdminLayoutProps {
  active: AdminNavKey
  title: string
  subtitle?: string
  children: ReactNode
}

function AdminLayout({ active, title, subtitle, children }: AdminLayoutProps) {
  return (
    <div className="flex w-full flex-1 bg-white">
      <aside className="flex w-[290px] shrink-0 flex-col border-r border-gray-200 bg-gray-50 px-3 pt-16">
        <Link to="/admin" className="px-2 text-[26px] font-extrabold tracking-tight text-primary">
          TravelX Admin
        </Link>
        <p className="px-2 text-[12px] text-gray-400">travelx.admin@system.com</p>

        <nav className="mt-10 flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ key, label, to }) => (
            <Link
              key={key}
              to={to}
              className={`rounded-lg px-4 py-2.5 text-[16px] transition-colors ${
                active === key
                  ? 'bg-primary font-bold text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-10 py-9">
        <h1 className="text-[26px] font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-[12px] text-gray-500">{subtitle}</p>}
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
