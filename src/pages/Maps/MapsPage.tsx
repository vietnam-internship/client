import { useEffect, useState } from 'react'
import { listBranches } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import type { BranchSummary } from '@/types'
import MapPlaceholder from '@/pages/Maps/components/MapPlaceholder'
import OfficeRow from '@/pages/Maps/components/OfficeRow'

function MapsPage() {
  const [branches, setBranches] = useState<BranchSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    listBranches({ sort: 'RATE' })
      .then((result) => {
        if (cancelled) return
        setBranches(result)
        setError(false)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
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
          </div>

          {loading ? (
            <p className="mt-4 text-[13px] text-gray-400">Loading branches…</p>
          ) : error ? (
            <p className="mt-4 text-[13px] text-gray-400">
              Couldn&apos;t load branches. Please try again.
            </p>
          ) : branches.length === 0 ? (
            <p className="mt-4 text-[13px] text-gray-400">No branches available yet.</p>
          ) : (
            <ul className="mt-2">
              {branches.map((branch) => (
                <OfficeRow key={branch.id} branch={branch} />
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
