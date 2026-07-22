import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getBranch } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { ArrowUpDownIcon } from '@/components/icons'
import { CURRENCY_INFO, DEFAULT_RESERVATION_CURRENCY, KRW_PER_100_VND } from '@/constants/exchange'
import useCurrencyConverter from '@/hooks/useCurrencyConverter'
import type { BranchDetail } from '@/types'
import { HttpError } from '@/utils/http'
import AmountField from '@/pages/Reserve/components/AmountField'

const TIME_SLOTS = ['10:00', '12:00', '14:00']

// 오늘부터 7일치 날짜 버튼 생성 (표시용 라벨 + API에 보낼 ISO 날짜)
function buildDates(count: number) {
  const base = new Date()
  base.setDate(base.getDate() + 1)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: d.getDate(),
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  })
}

type FetchResult = { kind: 'ready'; branch: BranchDetail } | { kind: 'notFound' } | { kind: 'error' }

function PickupDetailsPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const branchId = id ? Number(id) : NaN
  const validId = id !== undefined && !Number.isNaN(branchId)

  // Maps/BranchDetail에서 선택한 통화를 쿼리로 넘겨받음 (없으면 기본값)
  const currency = searchParams.get('currency') ?? DEFAULT_RESERVATION_CURRENCY
  const currencyInfo = CURRENCY_INFO[currency] ?? { flag: '💱', label: currency }

  const [dates] = useState(() => buildDates(7))
  const [dateIndex, setDateIndex] = useState(0)
  const [time, setTime] = useState(TIME_SLOTS[1])
  const { input, swapped, toggleSwapped, handleAmountChange, krw, vnd, vndAmount } =
    useCurrencyConverter()

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
    return <Navigate to="/maps" replace />
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
  const selectedDate = dates[dateIndex]

  const handleContinue = () => {
    navigate(`/reserve/${id}/review`, {
      state: {
        branchId: branch.id,
        branchName: branch.name,
        currencyCode: currency,
        amount: vndAmount,
        pickupDate: selectedDate.iso,
        pickupTime: time,
        dateTimeLabel: `${selectedDate.label} · ${time}`,
        amountLabel: `${krw} KRW → ${vnd} ${currency}`,
      },
    })
  }

  const fields = [
    { flag: '🇰🇷', label: 'Korean won', unit: 'KRW', amount: krw },
    { flag: currencyInfo.flag, label: currencyInfo.label, unit: currency, amount: vnd },
  ]
  if (swapped) fields.reverse()

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[20px] font-bold text-gray-900">Pickup details</h1>
        <p className="mt-1.5 text-[13px] text-gray-400">{branch.name}</p>

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-gray-900">Select date</h2>
          <div className="-mr-4 mt-3 flex gap-2.5 overflow-x-auto pr-4 [scrollbar-width:none]">
            {dates.map((d, index) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDateIndex(index)}
                className={`h-12 w-[92px] shrink-0 cursor-pointer rounded-lg text-center transition-colors ${
                  dateIndex === index
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="block text-[11px]">{d.day}</span>
                <span className="block text-[14px] font-bold">{d.date}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[15px] font-bold text-gray-900">Select time slot</h2>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`h-[34px] cursor-pointer rounded-full text-[12px] font-medium transition-colors ${
                  time === slot
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-bold text-gray-900">Enter amount</h2>
          <p className="mt-1.5 text-[11px] text-gray-400">
            Rate: 100 {currency} = {KRW_PER_100_VND} KRW
          </p>

          <div className="mt-3">
            <AmountField {...fields[0]} />
          </div>
          <div className="relative z-10 -my-2 flex justify-center">
            <button
              type="button"
              aria-label="Swap currencies"
              onClick={toggleSwapped}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white ring-4 ring-white transition-opacity hover:opacity-90"
            >
              <ArrowUpDownIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <AmountField {...fields[1]} editable amount={input} onChange={handleAmountChange} />
        </section>

        <button
          type="button"
          onClick={handleContinue}
          disabled={vndAmount <= 0}
          className="mt-5 h-10 w-full cursor-pointer rounded-[10px] bg-primary text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
        >
          Continue
        </button>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default PickupDetailsPage
