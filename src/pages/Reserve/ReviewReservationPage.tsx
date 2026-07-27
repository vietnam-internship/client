import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { createReservation } from '@/api/reservation'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import InfoCard from '@/components/InfoCard'
import PageLayout from '@/components/PageLayout'
import { ArrowRightIcon } from '@/components/icons'
import { HttpError } from '@/utils/http'
import type { PickupReservationDraft } from '@/types'

function ReviewReservationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const draft = useLocation().state as PickupReservationDraft | null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!draft) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const handleConfirm = () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setErrorMessage(null)

    createReservation({
      branchId: draft.branchId,
      currencyCode: draft.currencyCode,
      amount: draft.amount,
      pickupDate: draft.pickupDate,
      pickupTime: draft.pickupTime,
    })
      .then((reservation) => {
        navigate(`/reserve/${draft.branchId}/complete`, {
          state: reservation,
          replace: true,
        })
      })
      .catch((error: unknown) => {
        setIsSubmitting(false)
        setErrorMessage(
          error instanceof HttpError ? error.message : "Couldn't submit your reservation. Please try again.",
        )
      })
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-6 text-[20px] font-bold text-gray-900">Review your reservation</h1>

        <div className="mt-5 flex flex-col gap-3">
          <InfoCard label="Pickup location">{draft.branchName}</InfoCard>
          <InfoCard label="Pickup time">
            {draft.pickupDate} · {draft.pickupTime}
          </InfoCard>
          <InfoCard label="Currency">
            <span className="flex items-center gap-3">
              {draft.amount}
              <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
              {draft.currencyCode}
            </span>
          </InfoCard>
        </div>

        <p className="mt-4 text-[11px] leading-[1.6] text-gray-400">
          Rates may change if you cancel or modify after submitting. Please bring your ID for
          verification at pickup.
        </p>

        {errorMessage && <p className="mt-4 text-[12px] text-red-500">{errorMessage}</p>}

        <ActionButton onClick={handleConfirm} className="mt-7">
          {isSubmitting ? 'Submitting…' : 'Confirm reservation'}
        </ActionButton>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default ReviewReservationPage
