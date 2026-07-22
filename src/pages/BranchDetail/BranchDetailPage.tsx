import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getBranch } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { MapPinIcon } from '@/components/icons'
import type { BranchDetail } from '@/types'
import { HttpError } from '@/utils/http'
import { formatRate } from '@/utils/format'

type FetchResult = { kind: 'ready'; branch: BranchDetail } | { kind: 'notFound' } | { kind: 'error' }

function BranchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const branchId = id ? Number(id) : NaN
  const validId = id !== undefined && !Number.isNaN(branchId)

  // 결과를 조회한 id와 함께 저장 — id가 바뀌면 자동으로 로딩 상태로 돌아감
  const [fetched, setFetched] = useState<{ id: string; result: FetchResult } | null>(null)

  useEffect(() => {
    if (!validId) return
    let cancelled = false
    getBranch(branchId)
      .then((branch) => {
        if (cancelled) return
        setFetched({ id: id!, result: { kind: 'ready', branch } })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const notFound = err instanceof HttpError && err.status === 404
        setFetched({ id: id!, result: { kind: notFound ? 'notFound' : 'error' } })
      })
    return () => {
      cancelled = true
    }
  }, [id, branchId, validId])

  const result = fetched !== null && fetched.id === id ? fetched.result : null

  if (!validId || result?.kind === 'notFound') {
    return <Navigate to="/search" replace />
  }

  if (result === null) {
    return (
      <PageLayout>
        <Header backTo={-1} />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">Loading branch…</p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  if (result.kind === 'error') {
    return (
      <PageLayout>
        <Header backTo={-1} />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">
            Couldn&apos;t load this branch. Please try again.
          </p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  const { branch } = result

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-6 pb-28">
        <div className="mt-3.5 flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-[13px] text-gray-400">Map preview</p>
        </div>

        <section className="mt-6">
          <h1 className="text-[18px] font-bold text-gray-900">{branch.name}</h1>
          <p className="mt-1.5 text-[13px] text-gray-400">{branch.address}</p>
          <p className="mt-2.5 flex items-center gap-3 text-[12px]">
            {branch.distanceKm !== null && (
              <span className="flex items-center gap-1 text-gray-400">
                <MapPinIcon className="h-3.5 w-3.5" />
                {branch.distanceKm.toFixed(1)} km
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 font-medium ${branch.isOpenNow ? 'text-green-700' : 'text-gray-400'}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${branch.isOpenNow ? 'bg-green-600' : 'bg-gray-300'}`}
              />
              {branch.isOpenNow ? 'Open now' : 'Closed now'}
            </span>
          </p>
          <p className="mt-3.5 inline-block rounded-md bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
            {branch.pickupLocationDetail}
          </p>
        </section>

        <section className="mt-5">
          <h2 className="text-[14px] font-bold text-gray-900">Rates at this branch</h2>
          {branch.currencies.length === 0 ? (
            <p className="mt-2 text-[12px] text-gray-400">No rates available yet.</p>
          ) : (
            <ul className="mt-1.5">
              {branch.currencies.map(({ currencyCode, finalRate }) => (
                <li
                  key={currencyCode}
                  className="flex items-center justify-between border-b border-gray-100 py-2"
                >
                  <span className="text-[13px] font-bold text-gray-900">{currencyCode}</span>
                  <span className="text-[13px] font-bold text-gray-900">
                    {finalRate !== null ? formatRate(finalRate) : '-'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-5">
          <h2 className="text-[14px] font-bold text-gray-900">Hours</h2>
          <p className="mt-2 text-[12px] text-gray-400">{branch.businessHours}</p>
        </section>

        <button
          type="button"
          onClick={() => navigate(`/reserve/${branch.id}`)}
          className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Reserve now
        </button>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default BranchDetailPage
