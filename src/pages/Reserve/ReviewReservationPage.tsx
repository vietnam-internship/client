import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import InfoCard from '@/components/InfoCard'
import PageLayout from '@/components/PageLayout'
import { ArrowRightIcon } from '@/components/icons'
import { findPickupLocation } from '@/data/offices'
import type { ReservationDraft } from '@/types'

function ReviewReservationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const draft = useLocation().state as ReservationDraft | null
  const location = findPickupLocation(id)

  if (!location || !draft) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const handleConfirm = () => {
    navigate(`/reserve/${id}/complete`, {
      state: {
        ...draft,
        reservationNumber: `TX-${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      },
      replace: true,
    })
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-6 text-[20px] font-bold text-gray-900">Review your reservation</h1>

        <div className="mt-5 flex flex-col gap-3">
          <InfoCard label="Pickup location" sub={location.detail}>
            {location.name}
          </InfoCard>
          <InfoCard label="Pickup time">{draft.dateTime}</InfoCard>
          <InfoCard label="Currency">
            <span className="flex items-center gap-3">
              {draft.fromAmount}
              <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
              {draft.toAmount}
            </span>
          </InfoCard>
        </div>

        <p className="mt-4 text-[11px] leading-[1.6] text-gray-400">
          Rates may change if you cancel or modify after submitting. Please bring your ID for
          verification at pickup.
        </p>

        <ActionButton onClick={handleConfirm} className="mt-7">
          Confirm reservation
        </ActionButton>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default ReviewReservationPage
