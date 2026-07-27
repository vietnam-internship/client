import { useEffect, useState } from 'react'
import { listBranches } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ListRowLink from '@/components/ListRowLink'
import PageLayout from '@/components/PageLayout'
import MapPlaceholder from '@/pages/Maps/components/MapPlaceholder'
import type { BranchSummary } from '@/types'

function MapsPage() {
  const [branches, setBranches] = useState<BranchSummary[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    listBranches()
      .then((data) => {
        if (!cancelled) setBranches(data)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
            <button
              type="button"
              className="mt-1 shrink-0 cursor-pointer text-[12px] text-gray-400 transition-colors hover:text-gray-600"
            >
              AI recommendation ▾
            </button>
          </div>

          {hasError && (
            <p className="mt-6 text-[12px] text-red-500">
              Couldn't load branches. Please try again later.
            </p>
          )}
          {!hasError && branches === null && (
            <p className="mt-6 text-[12px] text-gray-400">Loading branches…</p>
          )}
          {!hasError && branches !== null && branches.length === 0 && (
            <p className="mt-6 text-[12px] text-gray-400">No branches to show.</p>
          )}

          <ul className="mt-2">
            {branches?.map((branch) => (
              <ListRowLink
                key={branch.id}
                to={`/branch/${branch.id}`}
                title={branch.name}
                subtitle={branch.address}
                right={
                  <span
                    className={`flex items-center gap-1.5 text-[12px] font-medium ${
                      branch.isOpenNow ? 'text-green-700' : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${branch.isOpenNow ? 'bg-green-600' : 'bg-gray-300'}`}
                    />
                    {branch.isOpenNow ? 'Open now' : 'Closed'}
                  </span>
                }
                className="py-3.5"
              />
            ))}
          </ul>
        </div>
      </main>

      <BottomNav active="maps" />
    </PageLayout>
  )
}

export default MapsPage
