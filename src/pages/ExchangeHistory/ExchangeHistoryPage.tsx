import { useEffect, useState } from 'react'
import { listMyReservations } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import type { HistoryStatus, ReservationSummary } from '@/types'
import HistoryCard from '@/pages/ExchangeHistory/components/HistoryCard'
import SegmentedTabs from '@/pages/ExchangeHistory/components/SegmentedTabs'

type FetchResult = { kind: 'ready'; items: ReservationSummary[] } | { kind: 'error' }

function ExchangeHistoryPage() {
  const [tab, setTab] = useState<HistoryStatus>('COMPLETED')
  // 결과를 조회한 tab과 함께 저장 — tab이 바뀌면 자동으로 로딩 상태로 돌아감
  const [fetched, setFetched] = useState<{ tab: HistoryStatus; result: FetchResult } | null>(null)

  useEffect(() => {
    let cancelled = false
    listMyReservations({ status: tab })
      .then((result) => {
        if (cancelled) return
        setFetched({ tab, result: { kind: 'ready', items: result.content } })
      })
      .catch(() => {
        if (cancelled) return
        setFetched({ tab, result: { kind: 'error' } })
      })
    return () => {
      cancelled = true
    }
  }, [tab])

  const result = fetched !== null && fetched.tab === tab ? fetched.result : null

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

        {result === null ? (
          <p className="mt-4 text-[13px] text-gray-400">Loading history…</p>
        ) : result.kind === 'error' ? (
          <p className="mt-4 text-[13px] text-gray-400">
            Couldn&apos;t load history. Please try again.
          </p>
        ) : result.items.length === 0 ? (
          <p className="mt-4 text-[13px] text-gray-400">Nothing here yet.</p>
        ) : (
          <ul className="mt-2.5 flex flex-col gap-2.5">
            {result.items.map((reservation) => (
              <HistoryCard key={reservation.id} reservation={reservation} />
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ExchangeHistoryPage
