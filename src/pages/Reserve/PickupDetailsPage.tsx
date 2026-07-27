import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getBranch } from '@/api/branch'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { HttpError } from '@/utils/http'
import type { BranchDetail, PickupReservationDraft } from '@/types'

const TIME_SLOTS = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30']

interface DateOption {
  iso: string
  day: string
  date: number
}

function toDateOption(date: Date): DateOption {
  // toISOString()은 UTC로 변환해서 자정 근처 시간대에 날짜가 하루 밀릴 수 있어, 로컬 날짜
  // 필드로 직접 조립한다.
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return {
    iso: `${yyyy}-${mm}-${dd}`,
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    date: date.getDate(),
  }
}

/** 오늘 이후 7일 — 당일 픽업은 슬롯이 이미 지났을 수 있어 제외한다. */
function upcomingDates(count: number): DateOption[] {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i + 1)
    return toDateOption(date)
  })
}

function PickupDetailsPage() {
  const { id } = useParams()
  const branchId = Number(id)

  if (!Number.isFinite(branchId)) {
    return <Navigate to="/maps" replace />
  }

  // branchId가 바뀔 때 이전 지점의 선택 상태가 남지 않도록 key로 인스턴스를 새로 마운트한다.
  return <PickupDetailsView key={branchId} branchId={branchId} />
}

function PickupDetailsView({ branchId }: { branchId: number }) {
  const navigate = useNavigate()
  const dates = useMemo(() => upcomingDates(7), [])

  const [branch, setBranch] = useState<BranchDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [currencyCode, setCurrencyCode] = useState('')
  const [date, setDate] = useState(dates[0].iso)
  const [time, setTime] = useState(TIME_SLOTS[0])
  const [amount, setAmount] = useState('')

  useEffect(() => {
    let cancelled = false

    getBranch(branchId)
      .then((data) => {
        if (cancelled) return
        setBranch(data)
        if (data.currencies.length > 0) {
          setCurrencyCode(data.currencies[0].currencyCode)
        }
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
    return <Navigate to="/maps" replace />
  }

  const parsedAmount = Number(amount)
  const canContinue = branch !== null && currencyCode !== '' && parsedAmount > 0

  const handleContinue = () => {
    if (!branch || !canContinue) return

    const draft: PickupReservationDraft = {
      branchId: branch.id,
      branchName: branch.name,
      currencyCode,
      amount: parsedAmount,
      pickupDate: date,
      pickupTime: time,
    }
    navigate(`/reserve/${branchId}/review`, { state: draft })
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[20px] font-bold text-gray-900">Pickup details</h1>
        <p className="mt-1.5 text-[13px] text-gray-400">
          {branch ? branch.name : 'Choose a branch and pickup time'}
        </p>

        {hasError && (
          <p className="mt-6 text-[13px] text-red-500">
            Couldn't load this branch. Please try again later.
          </p>
        )}
        {!hasError && !branch && <p className="mt-6 text-[13px] text-gray-400">Loading…</p>}

        {branch && (
          <>
            <section className="mt-6">
              <h2 className="text-[15px] font-bold text-gray-900">Select currency</h2>
              {branch.currencies.length === 0 ? (
                <p className="mt-2 text-[12px] text-gray-400">
                  This branch hasn't set up any currencies yet.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {branch.currencies.map((rate) => (
                    <button
                      key={rate.currencyCode}
                      type="button"
                      onClick={() => setCurrencyCode(rate.currencyCode)}
                      className={`h-9 shrink-0 cursor-pointer rounded-full px-4 text-[13px] font-medium transition-colors ${
                        currencyCode === rate.currencyCode
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {rate.currencyCode}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-7">
              <h2 className="text-[15px] font-bold text-gray-900">Select date</h2>
              <div className="-mr-4 mt-3 flex gap-2.5 overflow-x-auto pr-4 [scrollbar-width:none]">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setDate(d.iso)}
                    className={`h-12 w-[92px] shrink-0 cursor-pointer rounded-lg text-center transition-colors ${
                      date === d.iso
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
                Amount to pick up, in {currencyCode || 'the selected currency'}
              </p>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                className="mt-3 h-10 w-full rounded-lg border border-blue-600 bg-white px-3.5 text-right text-[14px] font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
              />
            </section>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="mt-5 h-10 w-full cursor-pointer rounded-[10px] bg-primary text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </>
        )}
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default PickupDetailsPage
