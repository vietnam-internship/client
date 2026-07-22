import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { cancelReservation, getReservation } from '@/api/reservation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { QrCodeIcon } from '@/components/icons'
import useDisclosure from '@/hooks/useDisclosure'
import type { HistoryStatus, ReservationDetail } from '@/types'
import { HttpError } from '@/utils/http'
import { formatNumber } from '@/utils/format'
import CancelDialog from '@/pages/ReservationDetail/components/CancelDialog'
import InfoCard from '@/components/InfoCard'

const STATUS_MESSAGES: Record<HistoryStatus, string> = {
  COMPLETED: 'This exchange has been completed.',
  CANCELLED: 'This exchange has been cancelled.',
}

type FetchResult =
  | { kind: 'ready'; reservation: ReservationDetail }
  | { kind: 'notFound' }
  | { kind: 'error' }

function ReservationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cancelDialog = useDisclosure()
  const reservationId = id ? Number(id) : NaN
  const validId = id !== undefined && !Number.isNaN(reservationId)

  const [fetched, setFetched] = useState<{ id: string; result: FetchResult } | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!validId) return
    let cancelled = false
    getReservation(reservationId)
      .then((reservation) => {
        if (cancelled) return
        setFetched({ id: id!, result: { kind: 'ready', reservation } })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const notFound = err instanceof HttpError && err.status === 404
        setFetched({ id: id!, result: { kind: notFound ? 'notFound' : 'error' } })
      })
    return () => {
      cancelled = true
    }
  }, [id, reservationId, validId])

  const result = fetched !== null && fetched.id === id ? fetched.result : null

  if (!validId || result?.kind === 'notFound') {
    return <Navigate to="/mypage/reservations" replace />
  }

  if (result === null) {
    return (
      <PageLayout>
        <Header backTo="/mypage/reservations" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">Loading reservation…</p>
        </main>
        <BottomNav active="profile" />
      </PageLayout>
    )
  }

  if (result.kind === 'error') {
    return (
      <PageLayout>
        <Header backTo="/mypage/reservations" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-gray-400">
            Couldn&apos;t load this reservation. Please try again.
          </p>
        </main>
        <BottomNav active="profile" />
      </PageLayout>
    )
  }

  const { reservation } = result
  const isActive = reservation.status === 'RESERVED'

  const handleCancel = async () => {
    if (cancelling) return
    setCancelling(true)
    setCancelError(null)
    try {
      await cancelReservation(reservation.id)
      navigate(`/mypage/reservations/${reservation.id}/cancelled`, {
        state: reservation,
        replace: true,
      })
    } catch {
      setCancelling(false)
      setCancelError('Failed to cancel the reservation. Please try again.')
      cancelDialog.close()
    }
  }

  return (
    <PageLayout>
      <Header backTo={isActive ? '/mypage/reservations' : '/mypage/history'} />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-2.5 text-[20px] font-bold text-gray-900">Reservation details</h1>

        <div className="mt-4 flex flex-col gap-3">
          <InfoCard label="Pickup location" sub={reservation.branch.address}>
            {reservation.branchName}
          </InfoCard>
          <InfoCard label="Pickup time">
            {reservation.pickupDate} · {reservation.pickupTime}
          </InfoCard>
          <InfoCard label="Currency">
            {formatNumber(reservation.amountTo)} {reservation.currencyCode}
          </InfoCard>
          <InfoCard label="Reservation number">{reservation.reservationNumber}</InfoCard>
        </div>

        {isActive ? (
          <>
            <button
              type="button"
              className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 text-[14px] font-bold text-primary transition-colors hover:bg-blue-100"
            >
              <QrCodeIcon className="h-[18px] w-[18px]" />
              View QR code
            </button>

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
            {STATUS_MESSAGES[reservation.status as HistoryStatus]}
          </div>
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
