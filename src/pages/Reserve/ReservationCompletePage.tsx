import { Navigate, useLocation, useParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import PageLayout from '@/components/PageLayout'
import ReservationNumberCard from '@/components/ReservationNumberCard'
import { CheckIcon } from '@/components/icons'
import type { ReservationDetail } from '@/types'
import QrPlaceholder from '@/pages/Reserve/components/QrPlaceholder'

function ReservationCompletePage() {
  const { id } = useParams()
  const reservation = useLocation().state as ReservationDetail | null

  if (!reservation) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  // 예약 생성은 PENDING_PAYMENT 상태로만 이뤄진다 — Stripe 결제 UI는 아직 없어서, 실제로
  // RESERVED(결제 완료)까지 가는 경우는 지금 없다. 그 상태를 그대로 보여준다.
  const isPendingPayment = reservation.status === 'PENDING_PAYMENT'

  const summary = [
    { label: 'Amount', value: `${reservation.amountTo} ${reservation.currencyCode}` },
    { label: 'Location', value: reservation.branch.name },
    { label: 'Date', value: `${reservation.pickupDate} · ${reservation.pickupTime}` },
  ]

  return (
    <PageLayout>
      <main className="flex flex-1 flex-col px-4 pb-8">
        <div className="mt-[100px] flex h-[68px] w-[68px] items-center justify-center self-center rounded-2xl bg-[#ecf3e0]">
          <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
        </div>

        <h1 className="mt-5 text-center text-[20px] font-bold text-gray-900">
          {isPendingPayment ? 'Reservation held' : 'Reservation complete'}
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[13px] leading-[1.5] text-gray-400">
          {isPendingPayment
            ? "Payment is required to confirm your pickup. Card payment isn't available in this build yet."
            : 'Your currency exchange reservation was submitted successfully.'}
        </p>

        <ReservationNumberCard className="mt-7" number={reservation.reservationNumber} />

        {reservation.qrPayload && (
          <div className="mt-8 flex justify-center">
            <QrPlaceholder />
          </div>
        )}

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

        <ActionButton to="/mypage/reservations" className="mt-4">
          View reservation
        </ActionButton>
        <ActionButton to="/" variant="secondary" className="mt-2.5">
          Back to home
        </ActionButton>
      </main>
    </PageLayout>
  )
}

export default ReservationCompletePage
