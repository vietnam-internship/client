import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { createReservation } from '@/api/reservation'
import ActionButton from '@/components/ActionButton'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import InfoCard from '@/components/InfoCard'
import PageLayout from '@/components/PageLayout'
import { ArrowRightIcon } from '@/components/icons'
import type { ReservationDraft } from '@/types'
import { HttpError } from '@/utils/http'

// 백엔드 에러 코드 → 사용자에게 보여줄 메시지
const ERROR_MESSAGES: Record<string, string> = {
  PHONE_NOT_VERIFIED: 'Phone verification is required before reserving.',
  NO_SHOW_LIMIT: "You can't reserve right now due to previous no-shows.",
  STOCK_EXCEEDED: 'This branch is out of reservable stock for this currency.',
  TIME_SLOT_FULL: 'This pickup time is fully booked. Please choose another slot.',
}

function ReviewReservationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const draft = useLocation().state as ReservationDraft | null
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!draft) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const handleConfirm = async () => {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      const reservation = await createReservation({
        currencyCode: draft.currencyCode,
        branchId: draft.branchId,
        amount: draft.amount,
        pickupDate: draft.pickupDate,
        pickupTime: draft.pickupTime,
      })
      navigate(`/reserve/${id}/complete`, { state: reservation, replace: true })
    } catch (err) {
      const code = err instanceof HttpError ? err.code : undefined
      setError(
        (code && ERROR_MESSAGES[code]) ?? 'Failed to create the reservation. Please try again.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-6 text-[20px] font-bold text-gray-900">Review your reservation</h1>

        <div className="mt-5 flex flex-col gap-3">
          <InfoCard label="Pickup location">{draft.branchName}</InfoCard>
          <InfoCard label="Pickup time">{draft.dateTimeLabel}</InfoCard>
          <InfoCard label="Currency">
            <span className="flex items-center gap-3">
              {draft.amountLabel.split(' → ')[0]}
              <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
              {draft.amountLabel.split(' → ')[1]}
            </span>
          </InfoCard>
        </div>

        <p className="mt-4 text-[11px] leading-[1.6] text-gray-400">
          Rates may change if you cancel or modify after submitting. Please bring your ID for
          verification at pickup.
        </p>

        {error && <p className="mt-3 text-[12px] text-red-500">{error}</p>}

        <ActionButton onClick={handleConfirm} disabled={pending} className="mt-7">
          {pending ? 'Confirming…' : 'Confirm reservation'}
        </ActionButton>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default ReviewReservationPage
