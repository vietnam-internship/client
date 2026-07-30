import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getBranch, getBranchTimeSlots } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { formatNumber, parseAmount } from '@/utils/format'
import { HttpError } from '@/utils/http'
import AmountField from '@/pages/Reserve/components/AmountField'
import type { BranchDetail, BranchTimeSlot } from '@/types'

/** "08:00:00" -> "08:00" (서버 LocalTime "HH:mm:ss" 응답을 표시용으로 자름) */
function toDisplayTime(time: string) {
  return time.slice(0, 5)
}

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
  const [slots, setSlots] = useState<BranchTimeSlot[]>([])
  const [slotsOpen, setSlotsOpen] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [time, setTime] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string | null>(null)

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

  useEffect(() => {
    if (!Number.isFinite(branchId)) return undefined

    let cancelled = false
    setSlotsLoading(true)
    setTime(null)
    getBranchTimeSlots(branchId, toIsoDate(selectedDate))
      .then((data) => {
        if (cancelled) return
        setSlots(data.slots)
        setSlotsOpen(data.open)
        const firstAvailable = data.slots.find((slot) => slot.remaining > 0)
        if (firstAvailable) setTime(firstAvailable.time)
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([])
          setSlotsOpen(false)
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [branchId, selectedDate])

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
    branch.currencies.find((c) => c.currencyCode === (selectedCurrencyCode ?? wantedCurrencyCode)) ??
    branch.currencies[0] ??
    null
  const amount = parseAmount(input)
  const krw = currency ? amount * currency.finalRate : 0
  const canContinue = currency !== null && amount > 0 && time !== null

  const handleContinue = () => {
    if (!currency || !canContinue || !time) return
    const displayTime = toDisplayTime(time)
    navigate(`/reserve/${id}/review`, {
      state: {
        branchId: branch.id,
        currencyCode: currency.currencyCode,
        amount,
        pickupDate: toIsoDate(selectedDate),
        pickupTime: displayTime,
        dateTime: `${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${displayTime}`,
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
          {slotsLoading ? (
            <p className="mt-3 text-[12px] text-gray-400">Loading available times…</p>
          ) : !slotsOpen ? (
            <p className="mt-3 text-[12px] text-gray-400">This branch is closed on the selected date.</p>
          ) : slots.length === 0 ? (
            <p className="mt-3 text-[12px] text-gray-400">No time slots available.</p>
          ) : (
            <div className="mt-3 grid max-h-[220px] grid-cols-3 gap-2.5 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const full = slot.remaining <= 0
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={full}
                    onClick={() => setTime(slot.time)}
                    className={`h-[34px] cursor-pointer rounded-full text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      time === slot.time
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {toDisplayTime(slot.time)}
                  </button>
                )
              })}
            </div>
          )}
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
                currencyOptions={wantedCurrencyCode ? undefined : branch.currencies.map((c) => c.currencyCode)}
                onCurrencyChange={wantedCurrencyCode ? undefined : setSelectedCurrencyCode}
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
