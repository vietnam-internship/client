import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import { ArrowRightIcon, QrCodeIcon } from '@/components/icons'
import { findReservation } from '@/data/reservations'
import CancelDialog from './CancelDialog'
import InfoCard from '@/components/InfoCard'

const STATUS_MESSAGES = {
  completed: 'This exchange has been completed.',
  cancelled: 'This exchange has been cancelled.',
} as const

function ReservationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const reservation = findReservation(id)

  if (!reservation) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const isActive = reservation.status === 'active'

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
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

        {reservation.status === 'active' ? (
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

            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
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
      </main>

      {isCancelOpen && (
        <CancelDialog
          onKeep={() => setIsCancelOpen(false)}
          onCancel={() => navigate(`/mypage/reservations/${reservation.id}/cancelled`)}
        />
      )}

      <BottomNav active="profile" />
    </div>
  )
}

export default ReservationDetail
