import { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import { RESERVATIONS } from '@/data/reservations'
import HistoryCard from './HistoryCard'
import SegmentedTabs from './SegmentedTabs'

type HistoryTab = 'completed' | 'cancelled'

function ExchangeHistory() {
  const [tab, setTab] = useState<HistoryTab>('completed')
  const items = RESERVATIONS.filter((r) => r.status === tab)

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header backTo="/mypage" />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-2.5 text-[20px] font-bold text-gray-900">Exchange history</h1>
        <p className="mt-2 text-[12px] text-gray-400">
          Past currency exchanges — completed or cancelled.
        </p>

        <div className="mt-3.5">
          <SegmentedTabs
            options={[
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {items.map((reservation) => (
            <HistoryCard key={reservation.id} reservation={reservation} />
          ))}
        </ul>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}

export default ExchangeHistory
