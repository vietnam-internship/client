import { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { getReservation } from '@/api/reservation'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ReservationNumberCard from '@/components/ReservationNumberCard'
import { XIcon } from '@/components/icons'
import { HttpError } from '@/utils/http'
import type { ReservationDetail } from '@/types'

function ReservationCancelledPage() {
  const { id } = useParams()
  const reservationId = Number(id)
  // ReservationDetailPage에서 취소 직후 넘어올 때는 다시 불러올 필요 없이 그대로 쓴다.
  // state가 없으면(새로고침 등) id로 다시 조회한다.
  const stateReservation = useLocation().state as ReservationDetail | null

  const [reservation, setReservation] = useState<ReservationDetail | null>(stateReservation)
  const [notFound, setNotFound] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (stateReservation || !Number.isFinite(reservationId)) return

    let cancelled = false
    getReservation(reservationId)
      .then((data) => {
        if (!cancelled) setReservation(data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stateReservation은 마운트 시점 값만 필요
  }, [reservationId])

  if (!Number.isFinite(reservationId) || notFound) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const summary = reservation
    ? [
        { label: 'Amount', value: `${reservation.amountTo} ${reservation.currencyCode}` },
        { label: 'Location', value: reservation.branch.name },
        { label: 'Date', value: `${reservation.pickupDate} · ${reservation.pickupTime}` },
      ]
    : []

  return (
    <PageLayout>
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

        {hasError && (
          <p className="mt-6 text-center text-[13px] text-red-500">
            Couldn't load the reservation details.
          </p>
        )}

        {reservation && (
          <>
            <ReservationNumberCard className="mt-6" number={reservation.reservationNumber} />

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
          </>
        )}

        <ActionButton to="/mypage/reservations" className={reservation ? 'mt-4' : 'mt-auto'}>
          Back to list
        </ActionButton>
        <ActionButton to="/" variant="secondary" className="mt-2.5">
          Back to home
        </ActionButton>
      </main>

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ReservationCancelledPage
