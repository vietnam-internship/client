import { useEffect, useState } from 'react'
import { listMyReservations } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import HistoryCard from '@/pages/ExchangeHistory/components/HistoryCard'
import SegmentedTabs from '@/pages/ExchangeHistory/components/SegmentedTabs'
import type { ReservationSummary } from '@/types'

type HistoryTab = 'COMPLETED' | 'CANCELLED'

/** CANCELLED 탭은 사용자가 취소한 것과 결제 TTL 만료로 자동 해제된 것을 함께 보여준다. */
const STATUS_QUERY: Record<HistoryTab, string> = {
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED,EXPIRED',
}

function ExchangeHistoryPage() {
  const [tab, setTab] = useState<HistoryTab>('COMPLETED')

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
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {/* 탭이 바뀔 때 이전 탭의 목록이 잠깐이라도 남지 않도록 key로 새로 마운트한다. */}
        <HistoryList key={tab} status={STATUS_QUERY[tab]} />
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

function HistoryList({ status }: { status: string }) {
  const [items, setItems] = useState<ReservationSummary[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false

    listMyReservations({ status })
      .then((data) => {
        if (!cancelled) setItems(data.content)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })

    return () => {
      cancelled = true
    }
  }, [status])

  if (hasError) {
    return (
      <p className="mt-6 text-[12px] text-red-500">
        Couldn't load your history. Please try again later.
      </p>
    )
  }
  if (items === null) {
    return <p className="mt-6 text-[12px] text-gray-400">Loading…</p>
  }
  if (items.length === 0) {
    return <p className="mt-6 text-[12px] text-gray-400">Nothing here yet.</p>
  }

  return (
    <ul className="mt-2.5 flex flex-col gap-2.5">
      {items.map((reservation) => (
        <HistoryCard key={reservation.id} reservation={reservation} />
      ))}
    </ul>
  )
}

export default ExchangeHistoryPage
