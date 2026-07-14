import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { ArrowUpDownIcon } from '@/components/icons'
import { findPickupLocation } from '@/data/offices'
import useCurrencyConverter from '@/hooks/useCurrencyConverter'
import AmountField from './AmountField'

const DATES = [
  { day: 'MON', date: 24 },
  { day: 'TUE', date: 25 },
  { day: 'WED', date: 26 },
  { day: 'THU', date: 27 },
  { day: 'FRI', date: 28 },
  { day: 'SAT', date: 29 },
  { day: 'SUN', date: 30 },
]

const TIME_SLOTS = ['10:00', '12:00', '14:00']

function PickupDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [date, setDate] = useState(25)
  const [time, setTime] = useState('12:00')
  const { input, swapped, toggleSwapped, handleAmountChange, krw, vnd } = useCurrencyConverter()

  const location = findPickupLocation(id)
  if (!location) {
    return <Navigate to="/maps" replace />
  }

  const handleContinue = () => {
    navigate(`/reserve/${id}/review`, {
      state: {
        dateTime: `Oct ${date}, 2026 · ${time}`,
        fromAmount: `${krw} KRW`,
        toAmount: `${vnd} VND`,
      },
    })
  }

  const fields = [
    { flag: '🇰🇷', label: 'Korean won', unit: 'KRW', amount: krw },
    { flag: '🇻🇳', label: 'Vietnamese dong', unit: 'VND', amount: vnd },
  ]
  if (swapped) fields.reverse()

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[20px] font-bold text-gray-900">Pickup details</h1>
        <p className="mt-1.5 text-[13px] text-gray-400">Choose a branch and pickup time</p>

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-gray-900">Select date</h2>
          <div className="-mr-4 mt-3 flex gap-2.5 overflow-x-auto pr-4 [scrollbar-width:none]">
            {DATES.map(({ day, date: d }) => (
              <button
                key={d}
                type="button"
                onClick={() => setDate(d)}
                className={`h-12 w-[92px] shrink-0 cursor-pointer rounded-lg text-center transition-colors ${
                  date === d
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="block text-[11px]">{day}</span>
                <span className="block text-[14px] font-bold">{d}</span>
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
          <p className="mt-1.5 text-[11px] text-gray-400">Rate: 100 VND = 5.79 KRW</p>

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
          className="mt-5 h-10 w-full cursor-pointer rounded-[10px] bg-primary text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default PickupDetails
