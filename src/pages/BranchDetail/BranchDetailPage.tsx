import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getBranch } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { formatNumber } from '@/utils/format'
import { HttpError } from '@/utils/http'
import type { BranchDetail } from '@/types'

function BranchDetailPage() {
  const { id } = useParams()
  const branchId = Number(id)

  // id가 숫자가 아니면 조회할 필요도 없이 바로 리다이렉트.
  if (!Number.isFinite(branchId)) {
    return <Navigate to="/search" replace />
  }

  // branchId가 바뀔 때(같은 라우트 엘리먼트를 유지한 채 다른 지점으로 이동) 매번 새로
  // 마운트시켜 이전 지점의 상태가 남지 않게 한다 — effect 안에서 직접 state를 리셋하는 대신
  // key로 인스턴스 자체를 새로 만드는 편이 더 React다운 방식이다.
  return <BranchDetailView key={branchId} branchId={branchId} />
}

function BranchDetailView({ branchId }: { branchId: number }) {
  const navigate = useNavigate()

  const [branch, setBranch] = useState<BranchDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false

    getBranch(branchId)
      .then((data) => {
        if (!cancelled) setBranch(data)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof HttpError && error.status === 404) {
          setNotFound(true)
        } else {
          setHasError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [branchId])

  if (notFound) {
    return <Navigate to="/search" replace />
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-6 pb-28">
        <div className="mt-3.5 flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-[13px] text-gray-400">Map preview</p>
        </div>

        {hasError && (
          <p className="mt-6 text-[13px] text-red-500">
            Couldn't load this branch. Please try again later.
          </p>
        )}

        {!hasError && !branch && <p className="mt-6 text-[13px] text-gray-400">Loading…</p>}

        {branch && (
          <>
            <section className="mt-6">
              <h1 className="text-[18px] font-bold text-gray-900">{branch.name}</h1>
              <p className="mt-1.5 text-[13px] text-gray-400">{branch.address}</p>
              <p className="mt-2.5 flex items-center gap-1.5 text-[12px]">
                <span
                  className={`flex items-center gap-1.5 font-medium ${
                    branch.isOpenNow ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${branch.isOpenNow ? 'bg-green-600' : 'bg-gray-300'}`}
                  />
                  {branch.isOpenNow ? 'Open now' : 'Closed'}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">{branch.businessHours}</span>
              </p>
              {branch.isBestRateNearby && (
                <p className="mt-3.5 inline-block rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  Best rate nearby
                </p>
              )}
            </section>

            <section className="mt-5">
              <h2 className="text-[14px] font-bold text-gray-900">Rates at this branch</h2>
              {branch.currencies.length === 0 ? (
                <p className="mt-2 text-[12px] text-gray-400">No currencies set up yet.</p>
              ) : (
                <ul className="mt-1.5">
                  {branch.currencies.map((rate) => (
                    <li
                      key={rate.currencyCode}
                      className="flex items-center justify-between border-b border-gray-100 py-2"
                    >
                      <span className="text-[13px] font-bold text-gray-900">{rate.currencyCode}</span>
                      <span className="text-[13px] font-bold text-gray-900">
                        {formatNumber(rate.finalRate)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <button
              type="button"
              onClick={() => navigate(`/reserve/${branch.id}`)}
              className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Reserve now
            </button>
          </>
        )}
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default BranchDetailPage
