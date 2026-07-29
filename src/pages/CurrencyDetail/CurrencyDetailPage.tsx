import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ListRowLink from '@/components/ListRowLink'
import PageLayout from '@/components/PageLayout'
import { ExchangeIcon } from '@/components/icons'
import {
  getCurrencyDetail,
  getCurrencyHistory,
  getTimingRecommendation,
  type CurrencyDetailResponse,
  type RateHistoryEntry,
  type TimingRecommendation,
} from '@/api/currency'
import { listBranches } from '@/api/branch'
import {
  createBranchRecommendation,
  getBranchRecommendation,
  recordRecommendationClick,
  type BranchRecommendation,
} from '@/api/branchRecommendation'
import type { BranchSummary } from '@/types'
import AiRecommendationCard from '@/pages/CurrencyDetail/components/AiRecommendationCard'
import RateTrendChart from '@/pages/CurrencyDetail/components/RateTrendChart'

const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 30000
const DEFAULT_AMOUNT = 100
const DEFAULT_RADIUS_KM = 5

function CurrencyDetailPage() {
  const { code } = useParams<{ code: string }>()
  const upperCode = code?.toUpperCase() ?? ''

  const [detail, setDetail] = useState<CurrencyDetailResponse | null>(null)
  const [history, setHistory] = useState<RateHistoryEntry[]>([])
  const [recommendation, setRecommendation] = useState<TimingRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [aiRecommendations, setAiRecommendations] = useState<BranchRecommendation[]>([])
  const [fallbackBranches, setFallbackBranches] = useState<BranchSummary[]>([])
  const [branchDisclaimer, setBranchDisclaimer] = useState<string | null>(null)
  const [branchLoading, setBranchLoading] = useState(true)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!upperCode) return
    setLoading(true)
    Promise.all([
      getCurrencyDetail(upperCode),
      getCurrencyHistory(upperCode, 7),
      getTimingRecommendation(upperCode),
    ])
      .then(([d, h, r]) => {
        setDetail(d)
        setHistory(h)
        setRecommendation(r)
      })
      .catch((err) => {
        if (err?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [upperCode])

  useEffect(() => {
    if (!upperCode) return
    setBranchLoading(true)
    setAiRecommendations([])
    setFallbackBranches([])

    let aborted = false

    const stop = () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    }

    const fetchFallback = () => {
      if (aborted) return
      listBranches({ currency: upperCode })
        .then((b) => { if (!aborted) setFallbackBranches(b.slice(0, 4)) })
        .catch(() => {})
        .finally(() => { if (!aborted) setBranchLoading(false) })
    }

    const startPolling = (sessionId: number) => {
      const poll = () => {
        if (aborted) return
        getBranchRecommendation(sessionId)
          .then((res) => {
            if (aborted) return
            if (res.status === 'COMPLETED') {
              stop()
              setAiRecommendations(res.results.slice(0, 4))
              setBranchDisclaimer(res.disclaimer)
              setBranchLoading(false)
            } else if (res.status === 'FAILED') {
              stop()
              fetchFallback()
            }
          })
          .catch(() => { if (!aborted) { stop(); fetchFallback() } })
      }

      pollRef.current = setInterval(poll, POLL_INTERVAL_MS)
      poll()

      timeoutRef.current = setTimeout(() => {
        if (!aborted) { stop(); fetchFallback() }
      }, POLL_TIMEOUT_MS)
    }

    if (!navigator.geolocation) {
      fetchFallback()
      return () => { aborted = true }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (aborted) return
        createBranchRecommendation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          radiusKm: DEFAULT_RADIUS_KM,
          currency: upperCode,
          amount: DEFAULT_AMOUNT,
        })
          .then(({ sessionId }) => { if (!aborted) startPolling(sessionId) })
          .catch(() => fetchFallback())
      },
      () => fetchFallback(),
      { timeout: 5000 },
    )

    return () => {
      aborted = true
      stop()
    }
  }, [upperCode])

  if (notFound) return <Navigate to="/search" replace />

  if (loading) {
    return (
      <PageLayout>
        <Header backTo="/search" />
        <main className="flex-1 px-4 pb-28 pt-8">
          <p className="text-[14px] text-gray-400">Loading...</p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  if (!detail) return null

  const rates = history.map((h) => h.rate)
  const trendPoints = rates.length > 0 ? rates : [detail.sellRate]

  const ma7Points =
    rates.length > 1
      ? rates.map((_, i) => {
          const window = rates.slice(Math.max(0, i - 6), i + 1)
          return window.reduce((sum, r) => sum + r, 0) / window.length
        })
      : undefined

  const latestRate = rates.at(-1) ?? detail.sellRate
  const prevRate = rates.at(-2) ?? detail.sellRate
  const change = latestRate - prevRate
  const changePct = prevRate !== 0 ? (change / prevRate) * 100 : 0
  const changeStr =
    rates.length >= 2
      ? `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${Math.abs(changePct).toFixed(2)}%)`
      : ''
  const isUp = change >= 0

  const rangeStr =
    rates.length > 0
      ? `${Math.min(...rates).toFixed(2)} - ${Math.max(...rates).toFixed(2)}`
      : ''

  const todayStr = new Date().toISOString().slice(0, 10)
  const dateLabels = history.map((h) => {
    const mmdd = h.date.slice(5).replace('-', '/')
    return h.date === todayStr ? `${mmdd}` : mmdd
  })

  const isAiResult = aiRecommendations.length > 0
  const displayBranches = isAiResult ? aiRecommendations : fallbackBranches

  return (
    <PageLayout>
      <Header backTo="/search" />

      <main className="flex-1 px-4 pb-28">
        <section className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <ExchangeIcon className="h-4 w-4 text-gray-500" />
          </span>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold text-gray-900">{upperCode} / KRW</h1>
            <p className="text-[12px] text-gray-400">{detail.country}</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold text-gray-900">
              {detail.sellRate.toLocaleString('en-US')}
            </p>
            {changeStr && (
              <p className={`text-[11px] font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                {changeStr}
              </p>
            )}
          </div>
        </section>

        {recommendation && recommendation.signal !== 'COLLECTING_DATA' && (
          <div className="mt-3">
            <AiRecommendationCard recommendation={recommendation} />
          </div>
        )}

        <section className="mt-4">
          <h2 className="text-[14px] font-bold text-gray-900">7-day rate trend</h2>
          {rangeStr && <p className="mt-1 text-[12px] text-gray-400">Range: {rangeStr}</p>}
          <div className="mt-3">
            <RateTrendChart points={trendPoints} ma7Points={ma7Points} />
          </div>
          {dateLabels.length > 0 && (
            <div className="relative mt-1 h-4">
              {dateLabels.map((label, i) => {
                const pct = dateLabels.length > 1 ? (i / (dateLabels.length - 1)) * 100 : 0
                const isFirst = i === 0
                const isLast = i === dateLabels.length - 1
                return (
                  <span
                    key={label}
                    className="absolute text-[10px] text-gray-400 whitespace-nowrap"
                    style={{
                      left: isLast ? undefined : `${pct}%`,
                      right: isLast ? '0%' : undefined,
                      transform: isFirst || isLast ? undefined : 'translateX(-50%)',
                    }}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-[14px] font-bold text-gray-900">
            Recommended nearby branches by AI
          </h2>

          {branchLoading ? (
            <div className="mt-3 flex items-center justify-center py-4">
              <div
                role="status"
                aria-label="Finding best branches nearby"
                className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary"
              />
            </div>
          ) : (
            <>
              <ul className="mt-1">
                {displayBranches.map((branch) => (
                  <ListRowLink
                    key={branch.id}
                    to={`/branch/${branch.id}`}
                    onClick={() => {
                      if (isAiResult) recordRecommendationClick(branch.id).catch(() => {})
                    }}
                    className="py-2.5"
                    title={
                      isAiResult
                        ? `${(branch as BranchRecommendation).ranking}. ${branch.name}${(branch as BranchRecommendation).isBestRateNearby ? ' ★' : ''}`
                        : branch.name
                    }
                    subtitle={branch.distanceKm != null ? `${branch.distanceKm}km` : ''}
                    right={
                      <span className="text-[13px] font-bold text-gray-900">
                        {branch.finalRate?.toLocaleString('en-US') ?? ''}
                      </span>
                    }
                  />
                ))}
              </ul>
              {branchDisclaimer && (
                <p className="mt-2 text-[10px] text-gray-400">{branchDisclaimer}</p>
              )}
            </>
          )}
        </section>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default CurrencyDetailPage
