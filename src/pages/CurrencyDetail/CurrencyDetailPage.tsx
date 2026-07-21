import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getCurrency, getCurrencyHistory, getTimingRecommendation } from '@/api/currency'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ListRowLink from '@/components/ListRowLink'
import PageLayout from '@/components/PageLayout'
import { ExchangeIcon } from '@/components/icons'
import { BRANCHES } from '@/data/branches'
import AiRecommendationCard from '@/pages/CurrencyDetail/components/AiRecommendationCard'
import RateTrendChart from '@/pages/CurrencyDetail/components/RateTrendChart'
import type { CurrencyDetail, RateHistoryEntry, TimingRecommendation } from '@/types'
import { HttpError } from '@/utils/http'
import { formatRate } from '@/utils/format'

const HISTORY_DAYS = 7

// '2026-07-12' → '07/12' (차트 시작 날짜 라벨) 
const toMonthDay = (date: string) => date.slice(5).replace('-', '/')

// 이력 마지막 이틀로 전일 대비 변동 표시 문자열 생성 (예: '+1.20 (0.09%)') 
function formatChange(history: RateHistoryEntry[]): { text: string; isUp: boolean } | null {
  if (history.length < 2) return null
  const prev = history[history.length - 2].rate
  const last = history[history.length - 1].rate
  const diff = last - prev
  const percent = prev !== 0 ? (Math.abs(diff) / prev) * 100 : 0
  const sign = diff >= 0 ? '+' : '-'
  return {
    text: `${sign}${formatRate(Math.abs(diff))} (${percent.toFixed(2)}%)`,
    isUp: diff >= 0,
  }
}

// AI 추천 신호를 카드에 표시할 문장으로 변환 
function recommendationNote(rec: TimingRecommendation): string {
  const message =
    rec.signal === 'NOW'
      ? 'Now looks like a good time to exchange.'
      : rec.signal === 'WAIT'
        ? 'Rates may move in your favor — consider waiting.'
        : 'No strong signal either way right now.'
  const prediction =
    rec.predictedRate !== null
      ? ` AI predicts ${formatRate(rec.predictedRate)} tomorrow (current ${formatRate(rec.currentRate)}).`
      : ''
  return `${message}${prediction} ${rec.disclaimer}`
}

type FetchResult =
  | {
      kind: 'ready'
      currency: CurrencyDetail
      history: RateHistoryEntry[]
      recommendation: TimingRecommendation | null
    }
  | { kind: 'notFound' }
  | { kind: 'error' }

function CurrencyDetailPage() {
  const { code } = useParams()

  // 결과를 조회한 code와 함께 저장 — code가 바뀌면 자동으로 로딩 상태로 돌아감
  const [fetched, setFetched] = useState<{ code: string; result: FetchResult } | null>(null)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    // 추천은 실패해도 페이지는 보여야 하므로(워밍업 등) 실패 시 null 처리
    Promise.all([
      getCurrency(code),
      getCurrencyHistory(code, HISTORY_DAYS),
      getTimingRecommendation(code).catch(() => null),
    ])
      .then(([currency, history, recommendation]) => {
        if (cancelled) return
        setFetched({ code, result: { kind: 'ready', currency, history, recommendation } })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const notFound = err instanceof HttpError && err.status === 404
        setFetched({ code, result: { kind: notFound ? 'notFound' : 'error' } })
      })
    return () => {
      cancelled = true
    }
  }, [code])

  const result = fetched !== null && fetched.code === code ? fetched.result : null

  if (!code || result?.kind === 'notFound') {
    return <Navigate to="/search" replace />
  }

  if (result === null) {
    return (
      <PageLayout>
        <Header backTo="/search" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">Loading currency…</p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  if (result.kind === 'error') {
    return (
      <PageLayout>
        <Header backTo="/search" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">
            Couldn&apos;t load this currency. Please try again.
          </p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  const { currency, history, recommendation } = result
  const change = formatChange(history)
  const rates = history.map((entry) => entry.rate)
  const range =
    rates.length > 0
      ? `${formatRate(Math.min(...rates))} - ${formatRate(Math.max(...rates))}`
      : null
  // 워밍업(COLLECTING_DATA) 상태면 추천 배지를 표시하지 않음 (PRD §9.4)
  const showRecommendation = recommendation !== null && recommendation.signal !== 'COLLECTING_DATA'

  return (
    <PageLayout>
      <Header backTo="/search" />

      <main className="flex-1 px-4 pb-28">
        <section className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <ExchangeIcon className="h-4 w-4 text-gray-500" />
          </span>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
              {currency.code} / KRW
              {currency.highVolatility && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
                  High volatility
                </span>
              )}
            </h1>
            <p className="text-[12px] text-gray-400">{currency.country}</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold text-gray-900">{formatRate(currency.buyRate)}</p>
            {change && (
              <p
                className={`text-[11px] font-medium ${change.isUp ? 'text-green-600' : 'text-red-500'}`}
              >
                {change.text}
              </p>
            )}
          </div>
        </section>

        {showRecommendation && (
          <div className="mt-3">
            <AiRecommendationCard note={recommendationNote(recommendation)} />
          </div>
        )}

        <section className="mt-4">
          <h2 className="text-[14px] font-bold text-gray-900">7-day rate trend</h2>
          {range && <p className="mt-1 text-[12px] text-gray-400">Range: {range}</p>}
          {rates.length >= 2 ? (
            <>
              <div className="mt-3">
                <RateTrendChart points={rates} />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                <span>{toMonthDay(history[0].date)}</span>
                <span>Today</span>
              </div>
            </>
          ) : (
            <p className="mt-3 text-[12px] text-gray-400">Not enough history to draw a chart.</p>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-[14px] font-bold text-gray-900">
            Recommended nearby branches by AI
          </h2>
          <ul className="mt-1">
            {BRANCHES.map((branch) => (
              <ListRowLink
                key={branch.id}
                to={`/branch/${branch.id}`}
                className="py-2.5"
                title={branch.name}
                subtitle={branch.distance}
                right={
                  <span className="text-[13px] font-bold text-gray-900">{branch.listRate}</span>
                }
              />
            ))}
          </ul>
        </section>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default CurrencyDetailPage
