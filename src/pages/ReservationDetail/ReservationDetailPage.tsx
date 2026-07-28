import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { cancelReservation, getReservation } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { ArrowRightIcon, QrCodeIcon } from '@/components/icons'
import useDisclosure from '@/hooks/useDisclosure'
import { HttpError } from '@/utils/http'
import type { ReservationDetail, ServerReservationStatus } from '@/types'
import CancelDialog from '@/pages/ReservationDetail/components/CancelDialog'
import InfoCard from '@/components/InfoCard'

const STATUS_MESSAGES: Partial<Record<ServerReservationStatus, string>> = {
  COMPLETED: 'This exchange has been completed.',
  CANCELLED: 'This exchange has been cancelled.',
  EXPIRED: 'This reservation hold expired before payment was completed.',
}

function ReservationDetailPage() {
  const { id } = useParams()
  const reservationId = Number(id)

  if (!Number.isFinite(reservationId)) {
    return <Navigate to="/mypage/reservations" replace />
  }

  // reservationId가 바뀔 때 이전 예약 상태가 남지 않도록 key로 인스턴스를 새로 마운트한다.
  return <ReservationDetailView key={reservationId} reservationId={reservationId} />
}

function ReservationDetailView({ reservationId }: { reservationId: number }) {
  const navigate = useNavigate()
  const cancelDialog = useDisclosure()

  const [reservation, setReservation] = useState<ReservationDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [qrRevealed, setQrRevealed] = useState(false)

  useEffect(() => {
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
  }, [reservationId])

  if (notFound) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const handleCancel = () => {
    if (isCancelling) return
    setIsCancelling(true)
    setCancelError(null)

    cancelReservation(reservationId)
      .then(() => {
        navigate(`/mypage/reservations/${reservationId}/cancelled`, { state: reservation })
      })
      .catch((error: unknown) => {
        setIsCancelling(false)
        cancelDialog.close()
        setCancelError(
          error instanceof HttpError ? error.message : "Couldn't cancel this reservation. Please try again.",
        )
      })
  }

  const isCancellable =
    reservation?.status === 'PENDING_PAYMENT' || reservation?.status === 'RESERVED'
  const backTo = isCancellable ? '/mypage/reservations' : '/mypage/history'

  return (
    <PageLayout>
      <Header backTo={backTo} />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-2.5 text-[20px] font-bold text-gray-900">Reservation details</h1>

        {hasError && (
          <p className="mt-6 text-[13px] text-red-500">
            Couldn't load this reservation. Please try again later.
          </p>
        )}
        {!hasError && !reservation && <p className="mt-6 text-[13px] text-gray-400">Loading…</p>}

        {reservation && (
          <>
            <div className="mt-4 flex flex-col gap-3">
              <InfoCard label="Pickup location" sub={reservation.branch.address}>
                {reservation.branch.name}
              </InfoCard>
              <InfoCard label="Pickup time">
                {reservation.pickupDate} · {reservation.pickupTime}
              </InfoCard>
              <InfoCard label="Currency">
                <span className="flex items-center gap-3">
                  {reservation.amountFrom ?? '—'} KRW
                  <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
                  {reservation.amountTo} {reservation.currencyCode}
                </span>
              </InfoCard>
              <InfoCard label="Reservation number">{reservation.reservationNumber}</InfoCard>
            </div>

            {isCancellable ? (
              <>
                {reservation.status === 'RESERVED' && reservation.qrPayload ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setQrRevealed((v) => !v)}
                      className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 text-[14px] font-bold text-primary transition-colors hover:bg-blue-100"
                    >
                      <QrCodeIcon className="h-[18px] w-[18px]" />
                      {qrRevealed ? 'Hide QR code' : 'View QR code'}
                    </button>
                    {qrRevealed && (
                      <p className="mt-2 rounded-xl bg-gray-100 px-4 py-3 text-center font-mono text-[13px] break-all text-gray-700 select-all">
                        {reservation.qrPayload}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 rounded-xl bg-yellow-50 px-4 py-3 text-[12px] text-yellow-700">
                    Payment is required to confirm this reservation. Card payment isn't available
                    in this build yet.
                  </p>
                )}

                <p className="mt-4 text-[12px] leading-[1.5] text-gray-400">
                  Rates may change if you cancel or modify after submitting. Please bring your ID
                  for verification at pickup.
                </p>

                {cancelError && <p className="mt-3 text-[12px] text-red-500">{cancelError}</p>}

                <button
                  type="button"
                  onClick={cancelDialog.open}
                  className="mt-6 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-[14px] font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  Cancel reservation
                </button>
              </>
            ) : (
              <div className="mt-3 rounded-xl bg-gray-100 py-4 text-center text-[13px] text-gray-600">
                {STATUS_MESSAGES[reservation.status]}
              </div>
            )}
          </>
        )}
      </main>

      {cancelDialog.isOpen && (
        <CancelDialog onKeep={cancelDialog.close} onCancel={handleCancel} />
      )}

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ReservationDetailPage
