import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { stripePromise } from '@/utils/stripe'
import type { PaymentDraft } from '@/types'

function CheckoutForm({ id }: { id: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    setErrorMessage(null)

    // 결제 승인 자체는 Stripe 웹훅(payment_intent.succeeded)으로만 확정된다 — 이 리다이렉트는
    // 카드사 3DS 등 추가 인증이 필요할 때만 실제로 페이지를 떠나고, 그 외엔 여기서 에러만 받는다.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reserve/${id}/complete`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? '결제에 실패했어요. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <PaymentElement />

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {errorMessage}
        </p>
      )}

      <ActionButton onClick={handleSubmit} className="mt-7" disabled={submitting || !stripe}>
        {submitting ? 'Processing…' : 'Pay now'}
      </ActionButton>
    </>
  )
}

/**
 * 신청(예약 생성) 파트가 아직 백엔드 POST /reservations를 호출하지 않아, 정상 경로로는
 * clientSecret을 받을 방법이 없다. 그래서 개발 중에는 ReviewReservationPage에서 실제로
 * curl/Postman으로 예약을 만들어 받은 clientSecret을 쿼리파라미터로 붙여 이 페이지에
 * 직접 진입해 테스트한다. 신청 파트가 연결되면 location.state 경로만 쓰이고 이 우회는
 * 자연히 죽는다(DEV 빌드에서만 동작) — 그 시점에 이 블록은 지워도 된다.
 */
function useClientSecret(): string | null {
  const draft = useLocation().state as PaymentDraft | null
  const [searchParams] = useSearchParams()

  if (draft?.clientSecret) return draft.clientSecret
  if (import.meta.env.DEV) return searchParams.get('clientSecret')
  return null
}

function PaymentPage() {
  const { id } = useParams()
  const clientSecret = useClientSecret()

  if (!id || !clientSecret) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-6 text-[20px] font-bold text-gray-900">Payment</h1>
        <p className="mt-1.5 text-[13px] text-gray-400">
          Enter your card details to confirm the reservation.
        </p>

        <div className="mt-6">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm id={id} />
          </Elements>
        </div>
      </main>
    </PageLayout>
  )
}

export default PaymentPage
