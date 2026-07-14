import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { CheckIcon } from '@/components/icons'
import { findPickupLocation } from '@/data/offices'
import type { ReservationDraft } from './ReviewReservation'
import QrPlaceholder from './QrPlaceholder'

type CompleteState = ReservationDraft & { reservationNumber: string }

function ReservationComplete() {
  const { id } = useParams()
  const state = useLocation().state as CompleteState | null
  const location = findPickupLocation(id)

  if (!location || !state) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const summary = [
    { label: 'Amount', value: state.toAmount },
    { label: 'Location', value: location.name },
    { label: 'Date', value: state.dateTime },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col px-4 pb-8">
        <div className="mt-[100px] flex h-[68px] w-[68px] items-center justify-center self-center rounded-2xl bg-[#ecf3e0]">
          <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
        </div>

        <h1 className="mt-5 text-center text-[20px] font-bold text-gray-900">
          Reservation complete
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[13px] leading-[1.5] text-gray-400">
          Your currency exchange reservation was submitted successfully.
        </p>

        <section className="mt-7 rounded-xl bg-gray-100 py-4 text-center">
          <p className="text-[12px] text-gray-400">Reservation number</p>
          <p className="mt-1 text-[17px] font-bold text-gray-900">{state.reservationNumber}</p>
        </section>

        <div className="mt-8 flex justify-center">
          <QrPlaceholder />
        </div>

        <dl className="mt-auto border-t border-gray-200 pt-1">
          {summary.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-gray-100 py-2"
            >
              <dt className="text-[12px] text-gray-500">{label}</dt>
              <dd className="text-[12px] font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <Link
          to="/mypage/reservations"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          View reservation
        </Link>
        <Link
          to="/"
          className="mt-2.5 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-[14px] font-bold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Back to home
        </Link>
      </main>
    </div>
  )
}

export default ReservationComplete
