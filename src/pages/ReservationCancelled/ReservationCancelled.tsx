import { Link, Navigate, useParams } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import Header from '../../components/Header'
import { XIcon } from '../../components/icons'
import { findReservation } from '../../data/reservations'

function ReservationCancelled() {
  const { id } = useParams()
  const reservation = findReservation(id)

  if (!reservation) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const summary = [
    { label: 'Amount', value: reservation.toAmount },
    { label: 'Location', value: reservation.location },
    { label: 'Date', value: reservation.dateTime },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header />

      <main className="flex flex-1 flex-col px-4 pb-28">
        <div className="mt-12 flex h-20 w-20 items-center justify-center self-center rounded-[24px] bg-red-50">
          <XIcon className="h-8 w-8 text-red-600" strokeWidth={2.5} />
        </div>

        <h1 className="mt-7 text-center text-[20px] font-bold text-gray-900">
          Reservation cancelled
        </h1>
        <p className="mx-auto mt-2.5 max-w-[300px] text-center text-[13px] leading-[1.5] text-gray-400">
          Your currency exchange reservation has been cancelled.
        </p>

        <section className="mt-6 rounded-xl bg-gray-100 py-4 text-center">
          <p className="text-[12px] text-gray-400">Reservation number</p>
          <p className="mt-1 text-[17px] font-bold text-gray-900">
            {reservation.reservationNumber}
          </p>
        </section>

        <dl className="mt-auto border-t border-gray-200 pt-0">
          {summary.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-gray-200 py-3.5"
            >
              <dt className="text-[12px] text-gray-500">{label}</dt>
              <dd className="text-[13px] font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <Link
          to="/mypage/reservations"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Back to list
        </Link>
        <Link
          to="/"
          className="mt-2.5 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-[14px] font-bold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Back to home
        </Link>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}

export default ReservationCancelled
