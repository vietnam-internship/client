import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { stripePromise } from '@/utils/stripe'
import type { PaymentDraft } from '@/types'

function CheckoutForm({ id, draft }: { id: string; draft: PaymentDraft }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    setErrorMessage(null)

    // 결제 승인 자체는 Stripe 웹훅(payment_intent.succeeded)으로만 확정된다. redirect: 'if_required'라
    // 카드사 3DS 등 추가 인증이 필요할 때만 return_url로 실제 페이지 이동하고, 그 외(일반 카드 결제)엔
    // 여기서 바로 결과를 받아 완료 페이지로 넘긴다.
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
      navigate(`/reserve/${id}/complete`, { state: draft, replace: true })
      return
    }
    setSubmitting(false)
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

function PaymentPage() {
  const { id } = useParams()
  const draft = useLocation().state as PaymentDraft | null

  if (!id || !draft?.clientSecret) {
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
          <Elements stripe={stripePromise} options={{ clientSecret: draft.clientSecret }}>
            <CheckoutForm id={id} draft={draft} />
          </Elements>
        </div>
      </main>
    </PageLayout>
  )
}

export default PaymentPage
