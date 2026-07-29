import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { ArrowRightIcon, QrCodeIcon } from '@/components/icons'
import { cancelReservation, getReservation } from '@/api/reservation'
import { toDisplayReservation } from '@/utils/reservationDisplay'
import useDisclosure from '@/hooks/useDisclosure'
import type { HistoryStatus, Reservation } from '@/types'
import CancelDialog from '@/pages/ReservationDetail/components/CancelDialog'
import InfoCard from '@/components/InfoCard'
import QrCode from '@/components/QrCode'

const STATUS_MESSAGES: Record<HistoryStatus, string> = {
  completed: 'This exchange has been completed.',
  cancelled: 'This exchange has been cancelled.',
}

function ReservationDetailPage() {
  const { id } = useParams()
  const reservationId = Number(id)
  const navigate = useNavigate()
  const cancelDialog = useDisclosure()

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [qrPayload, setQrPayload] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const qrDisclosure = useDisclosure()

  useEffect(() => {
    if (!Number.isFinite(reservationId)) return undefined

    let cancelled = false
    getReservation(reservationId)
      .then((data) => {
        if (!cancelled) {
          setReservation(toDisplayReservation(data, data.branch?.address ?? ''))
          setQrPayload(data.qrPayload)
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [reservationId])

  if (!Number.isFinite(reservationId) || notFound) {
    return <Navigate to="/mypage/reservations" replace />
  }

  if (!reservation) {
    return (
      <PageLayout>
        <Header backTo="/mypage/reservations" />
        <main className="flex-1 px-3.5 pb-28">
          <p className="mt-8 text-[13px] text-gray-400">Loading…</p>
        </main>
        <BottomNav active="profile" />
      </PageLayout>
    )
  }

  const isActive = reservation.status === 'active'

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelReservation(reservationId)
      navigate(`/mypage/reservations/${reservationId}/cancelled`)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <PageLayout>
      <Header backTo={isActive ? '/mypage/reservations' : '/mypage/history'} />

      <main className="flex-1 px-3.5 pb-28">
        <h1 className="mt-2.5 text-[20px] font-bold text-gray-900">Reservation details</h1>

        <div className="mt-4 flex flex-col gap-3">
          <InfoCard label="Pickup location" sub={reservation.locationDetail}>
            {reservation.location}
          </InfoCard>
          <InfoCard label="Pickup time">{reservation.dateTime}</InfoCard>
          <InfoCard label="Currency">
            <span className="flex items-center gap-3">
              {reservation.fromAmount}
              <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
              {reservation.toAmount}
            </span>
          </InfoCard>
          <InfoCard label="Reservation number">{reservation.reservationNumber}</InfoCard>
        </div>

        {isActive ? (
          <>
            {qrPayload ? (
              <>
                <button
                  type="button"
                  onClick={qrDisclosure.toggle}
                  className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 text-[14px] font-bold text-primary transition-colors hover:bg-blue-100"
                >
                  <QrCodeIcon className="h-[18px] w-[18px]" />
                  {qrDisclosure.isOpen ? 'Hide QR code' : 'View QR code'}
                </button>

                {qrDisclosure.isOpen && (
                  <div className="mt-4 flex justify-center rounded-xl bg-gray-100 py-6">
                    <QrCode value={qrPayload} />
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 rounded-xl bg-gray-100 px-4 py-3.5 text-center text-[13px] text-gray-500">
                QR code will appear once payment is confirmed.
              </p>
            )}

            <p className="mt-4 text-[12px] leading-[1.5] text-gray-400">
              Rates may change if you cancel or modify after submitting. Please bring your ID
              for verification at pickup.
            </p>

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
        <CancelDialog
          onKeep={cancelDialog.close}
          onCancel={handleCancel}
          cancelling={cancelling}
        />
      )}

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ReservationDetailPage
