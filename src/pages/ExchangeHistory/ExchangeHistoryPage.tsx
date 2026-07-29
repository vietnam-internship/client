import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { listMyReservations } from '@/api/reservation'
import { toDisplayReservation } from '@/utils/reservationDisplay'
import type { HistoryStatus, Reservation } from '@/types'
import HistoryCard from '@/pages/ExchangeHistory/components/HistoryCard'
import SegmentedTabs from '@/pages/ExchangeHistory/components/SegmentedTabs'

const STATUS_FILTERS: Record<HistoryStatus, string> = {
  completed: 'COMPLETED',
  cancelled: 'CANCELLED,EXPIRED',
}

function ExchangeHistoryPage() {
  const [tab, setTab] = useState<HistoryStatus>('completed')
  const [items, setItems] = useState<Reservation[]>([])

  useEffect(() => {
    let cancelled = false
    listMyReservations({ status: STATUS_FILTERS[tab] })
      .then((data) => {
        if (!cancelled) setItems(data.content.map((r) => toDisplayReservation(r)))
      })
    return () => {
      cancelled = true
    }
  }, [tab])

  return (
    <PageLayout>
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
    </PageLayout>
  )
}

export default ExchangeHistoryPage
