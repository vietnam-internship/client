import { useEffect, useState } from 'react'
import { listBranches } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import type { BranchSummary } from '@/types'
import CurrencyDropdown from '@/pages/Maps/components/CurrencyDropdown'
import MapPlaceholder from '@/pages/Maps/components/MapPlaceholder'
import OfficeRow from '@/pages/Maps/components/OfficeRow'

// 지점들이 실제로 취급하는 통화 목록 — 통화 조회 API가 아직 없어 지점 시드 데이터 기준으로 고정
const CURRENCY_OPTIONS = ['VND', 'USD']

type FetchResult = { kind: 'ready'; branches: BranchSummary[] } | { kind: 'error' }

function MapsPage() {
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0])
  // 결과를 조회한 currency와 함께 저장 — currency가 바뀌면 자동으로 로딩 상태로 돌아감
  const [fetched, setFetched] = useState<{ currency: string; result: FetchResult } | null>(null)

  useEffect(() => {
    let cancelled = false
    listBranches({ currency, sort: 'RATE' })
      .then((branches) => {
        if (cancelled) return
        setFetched({ currency, result: { kind: 'ready', branches } })
      })
      .catch(() => {
        if (cancelled) return
        setFetched({ currency, result: { kind: 'error' } })
      })
    return () => {
      cancelled = true
    }
  }, [currency])

  const result = fetched !== null && fetched.currency === currency ? fetched.result : null

  return (
    <PageLayout>
      <Header />

      <main className="flex-1 pb-28">
        <MapPlaceholder />

        <div className="mt-7 px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[17px] font-bold text-gray-900">Available pickup offices</h1>
              <p className="mt-1 text-[12px] leading-[1.5] text-gray-400">
                Select one to lock the best matching offer
              </p>
            </div>
            <div className="mt-1 shrink-0">
              <CurrencyDropdown options={CURRENCY_OPTIONS} value={currency} onChange={setCurrency} />
            </div>
          </div>

          {result === null ? (
            <p className="mt-4 text-[13px] text-gray-400">Loading branches…</p>
          ) : result.kind === 'error' ? (
            <p className="mt-4 text-[13px] text-gray-400">
              Couldn&apos;t load branches. Please try again.
            </p>
          ) : result.branches.length === 0 ? (
            <p className="mt-4 text-[13px] text-gray-400">No branches available yet.</p>
          ) : (
            <ul className="mt-2">
              {result.branches.map((branch) => (
                <OfficeRow key={branch.id} branch={branch} currency={currency} />
              ))}
            </ul>
          )}
        </div>
      </main>

      <BottomNav active="maps" />
    </PageLayout>
  )
}

export default MapsPage
