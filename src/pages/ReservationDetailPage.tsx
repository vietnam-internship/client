import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNav'
import Header from '@/components/common/Header'
import PageLayout from '@/components/common/PageLayout'
import { ArrowRightIcon, QrCodeIcon } from '@/components/common/icons'
import { findReservation } from '@/data/reservations'
import useDisclosure from '@/hooks/useDisclosure'
import type { HistoryStatus } from '@/types'
import CancelDialog from '@/components/reservation-detail/CancelDialog'
import InfoCard from '@/components/common/InfoCard'

const STATUS_MESSAGES: Record<HistoryStatus, string> = {
  completed: 'This exchange has been completed.',
  cancelled: 'This exchange has been cancelled.',
}

function ReservationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cancelDialog = useDisclosure()
  const reservation = findReservation(id)

  if (!reservation) {
    return <Navigate to="/mypage/reservations" replace />
  }

  const isActive = reservation.status === 'active'

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
      </main>

      {cancelDialog.isOpen && (
        <CancelDialog
          onKeep={cancelDialog.close}
          onCancel={() => navigate(`/mypage/reservations/${reservation.id}/cancelled`)}
        />
      )}

      <BottomNav active="profile" />
    </PageLayout>
  )
}

export default ReservationDetailPage
