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
import type { PickupSelection } from '@/types'

function ReviewReservationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const draft = useLocation().state as PickupSelection | null
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!draft) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const reservation = await createReservation({
        branchId: draft.branchId,
        currencyCode: draft.currencyCode,
        amount: draft.amount,
        pickupDate: draft.pickupDate,
        pickupTime: draft.pickupTime,
      })

      if (!reservation.paymentClientSecret) {
        setErrorMessage('Could not start payment for this reservation. Please try again.')
        setSubmitting(false)
        return
      }

      navigate(`/reserve/${id}/payment`, {
        state: {
          ...draft,
          reservationId: reservation.id,
          reservationNumber: reservation.reservationNumber,
          clientSecret: reservation.paymentClientSecret,
        },
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof HttpError ? error.message : 'Failed to create reservation. Please try again.',
      )
      setSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-6 text-[20px] font-bold text-gray-900">Review your reservation</h1>

        <div className="mt-5 flex flex-col gap-3">
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

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">{errorMessage}</p>
        )}

        <ActionButton onClick={handleConfirm} className="mt-7" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Confirm reservation'}
        </ActionButton>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default ReviewReservationPage
