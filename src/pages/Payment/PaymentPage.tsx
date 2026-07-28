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
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    setErrorMessage(null)

    // 결제 승인 자체는 Stripe 웹훅(payment_intent.succeeded)으로만 확정된다. redirect: 'if_required'라
    // 카드사 3DS 등 추가 인증이 필요할 때만 return_url로 실제 페이지 이동하고, 그 외(일반 카드 결제)엔
    // 여기서 바로 결과를 받는다 — ReservationCompletePage는 목업 오피스 데이터에 의존해 실제 예약
    // id로는 못 들어가므로(신청 파트 연결 전까지) 지금은 이 페이지 안에서 성공 여부만 보여준다.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reserve/${id}/complete`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(error.message ?? '결제에 실패했어요. 다시 시도해주세요.')
      setSubmitting(false)
      return
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      setSucceeded(true)
    }
    setSubmitting(false)
  }

  if (succeeded) {
    return (
      <p className="rounded-lg bg-green-50 px-4 py-3 text-[13px] text-green-700">
        결제 성공 — 웹훅이 도착하면 예약이 RESERVED로 바뀌고 QR이 발급됩니다. (백엔드에서
        GET /reservations/{id}로 상태 확인 가능)
      </p>
    )
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
