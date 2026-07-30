import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getBranch } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { formatNumber, parseAmount } from '@/utils/format'
import { HttpError } from '@/utils/http'
import AmountField from '@/pages/Reserve/components/AmountField'
import type { BranchDetail } from '@/types'

const TIME_SLOTS = ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30']

const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  VND: '🇻🇳',
  JPY: '🇯🇵',
  EUR: '🇪🇺',
  CNY: '🇨🇳',
}

function buildUpcomingDates(count: number) {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    return date
  })
}

function toIsoDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function PickupDetailsPage() {
  const { id } = useParams()
  const branchId = Number(id)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const wantedCurrencyCode = searchParams.get('currency')

  const [branch, setBranch] = useState<BranchDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const dates = useMemo(() => buildUpcomingDates(7), [])
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [time, setTime] = useState(TIME_SLOTS[0])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!Number.isFinite(branchId)) return undefined

    let cancelled = false
    getBranch(branchId)
      .then((data) => {
        if (!cancelled) setBranch(data)
      })
      .catch((error: unknown) => {
        if (!cancelled && error instanceof HttpError && error.status === 404) {
          setNotFound(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [branchId])

  if (!Number.isFinite(branchId) || notFound) {
    return <Navigate to="/maps" replace />
  }

  if (!branch) {
    return (
      <PageLayout>
        <Header backTo={-1} />
        <main className="flex-1 px-4 pb-28">
          <p className="mt-8 text-[13px] text-gray-400">Loading…</p>
        </main>
        <BottomNav active="exchange" />
      </PageLayout>
    )
  }

  const currency =
    branch.currencies.find((c) => c.currencyCode === wantedCurrencyCode) ??
    branch.currencies[0] ??
    null
  const amount = parseAmount(input)
  const krw = currency ? amount * currency.finalRate : 0
  const canContinue = currency !== null && amount > 0

  const handleContinue = () => {
    if (!currency || !canContinue) return
    navigate(`/reserve/${id}/review`, {
      state: {
        branchId: branch.id,
        currencyCode: currency.currencyCode,
        amount,
        pickupDate: toIsoDate(selectedDate),
        pickupTime: time,
        dateTime: `${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${time}`,
        fromAmount: `${formatNumber(krw)} KRW`,
        toAmount: `${formatNumber(amount)} ${currency.currencyCode}`,
      },
    })
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[20px] font-bold text-gray-900">Pickup details</h1>
        <p className="mt-1.5 text-[13px] text-gray-400">{branch.name}</p>

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-gray-900">Select date</h2>
          <div className="-mr-4 mt-3 flex gap-2.5 overflow-x-auto pr-4 [scrollbar-width:none]">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`h-12 w-[92px] shrink-0 cursor-pointer rounded-lg text-center transition-colors ${
                  toIsoDate(date) === toIsoDate(selectedDate)
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="block text-[11px]">
                  {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </span>
                <span className="block text-[14px] font-bold">{date.getDate()}</span>
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

          {currency ? (
            <>
              <p className="mt-1.5 text-[11px] text-gray-400">
                Rate: 1 {currency.currencyCode} = {currency.finalRate.toFixed(4)} KRW
              </p>

              <div className="mt-3">
                <AmountField flag="🇰🇷" label="Korean won" unit="KRW" amount={formatNumber(krw)} />
              </div>
              <div className="relative z-10 -my-2 flex justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white ring-4 ring-white">
                  +
                </span>
              </div>
              <AmountField
                flag={CURRENCY_FLAGS[currency.currencyCode] ?? '💱'}
                label={currency.currencyCode}
                unit={currency.currencyCode}
                amount={input}
                editable
                onChange={(value) => setInput(parseAmount(value) ? formatNumber(parseAmount(value)) : '')}
              />
            </>
          ) : (
            <p className="mt-2 text-[12px] text-gray-400">This branch has no currencies set up yet.</p>
          )}
        </section>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-5 h-10 w-full cursor-pointer rounded-[10px] bg-primary text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default PickupDetailsPage
