import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import NotificationPanel, { type Notification } from '@/components/NotificationPanel'
import { BellIcon, SearchIcon } from '@/components/icons'
import AiReportCard from './AiReportCard'
import PickupCard from './PickupCard'
import RateCard, { type Rate } from './RateCard'

const NOTIFICATIONS: Notification[] = [
  {
    icon: 'trend',
    title: 'Myeongdong Exchange',
    description: 'JPY rate is 3.2% lower than its 30-day average.',
  },
  {
    icon: 'clock',
    title: 'Incheon Airport T2 Exchange',
    description: 'Your EUR pickup reservation is in 2 hours.',
  },
  {
    icon: 'pin',
    title: 'TravelX Hoan Kiem Branch',
    description: 'Your VND pickup reservation is confirmed.',
  },
]

const RATES: Rate[] = [
  { code: 'USD', name: 'US Dollar', value: '1,342.50', change: '-2.40' },
  { code: 'JPY (100¥)', name: 'Japanese yen', value: '894.20', change: '-0.15' },
  { code: 'EUR', name: 'Euro', value: '1,452.12', change: '-0.00' },
]

function Home() {
  const navigate = useNavigate()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <div className="relative mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header
        right={
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setIsNotificationOpen((open) => !open)}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200"
          >
            <BellIcon className="h-[18px] w-[18px]" />
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-100" />
          </button>
        }
      />

      {isNotificationOpen && (
        <NotificationPanel
          notifications={NOTIFICATIONS}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[24px] font-bold text-gray-900">Exchange overview</h1>

        <div className="mt-3">
          <PickupCard
            title="Vietnamese dong (VND) pickup"
            schedule="Jul 12, 2026, 2:00-3:00 PM, TravelX Hoan Kiem branch"
          />
        </div>

        <section className="mt-7">
          <h2 className="text-[16px] font-bold text-gray-900">Live rate comparison</h2>

          <div className="relative mt-2">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              readOnly
              onFocus={() => navigate('/search')}
              onClick={() => navigate('/search')}
              placeholder="Search a country or currency"
              className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 pr-3 pl-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </div>

          <ul className="mt-2 flex flex-col gap-2.5">
            {RATES.map((rate) => (
              <RateCard key={rate.code} {...rate} />
            ))}
          </ul>
        </section>

        <hr className="mt-4 border-gray-100" />

        <section className="mt-4">
          <h2 className="text-[16px] font-bold text-gray-900">AI Report</h2>
          <div className="mt-2.5">
            <AiReportCard
              title="Japanese yen (JPY)"
              body="JPY is 3.2% stronger against KRW than its 30-day average. Rates like this have historically lasted 2-4 days before reversing."
            />
          </div>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  )
}

export default Home
