import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import ActionButton from '@/components/ActionButton'
import PageLayout from '@/components/PageLayout'
import ReservationNumberCard from '@/components/ReservationNumberCard'
import { CheckIcon, ClockIcon } from '@/components/icons'
import { getReservation } from '@/api/reservation'
import QrCode from '@/components/QrCode'
import type { PaymentDraft } from '@/types'

const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 15 // ~30s — Stripe 웹훅이 이 안에 대부분 도착한다

type ConfirmState = 'confirming' | 'confirmed' | 'pending'

function ReservationCompletePage() {
  const { id } = useParams()
  const state = useLocation().state as PaymentDraft | null

  const [confirmState, setConfirmState] = useState<ConfirmState>('confirming')
  const [qrPayload, setQrPayload] = useState<string | null>(null)
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (!state) return undefined

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const poll = () => {
      getReservation(state.reservationId)
        .then((data) => {
          if (cancelled) return
          if (data.status === 'RESERVED' && data.qrPayload) {
            setQrPayload(data.qrPayload)
            setConfirmState('confirmed')
            return
          }
          attemptsRef.current += 1
          if (attemptsRef.current >= MAX_POLLS) {
            setConfirmState('pending')
            return
          }
          timer = setTimeout(poll, POLL_INTERVAL_MS)
        })
        .catch(() => {
          if (!cancelled) setConfirmState('pending')
        })
    }
    poll()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [state])

  if (!state) {
    return <Navigate to={`/reserve/${id ?? ''}`} replace />
  }

  const summary = [
    { label: 'Amount', value: state.toAmount },
    { label: 'Date', value: state.dateTime },
  ]

  return (
    <PageLayout>
      <main className="flex flex-1 flex-col px-4 pb-8">
        <div
          className={`mt-[100px] flex h-[68px] w-[68px] items-center justify-center self-center rounded-2xl ${
            confirmState === 'confirmed' ? 'bg-[#ecf3e0]' : 'bg-blue-50'
          }`}
        >
          {confirmState === 'confirmed' ? (
            <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
          ) : (
            <ClockIcon className="h-7 w-7 animate-pulse text-primary" strokeWidth={2.5} />
          )}
        </div>

        <h1 className="mt-5 text-center text-[20px] font-bold text-gray-900">
          {confirmState === 'confirming' && 'Confirming your payment…'}
          {confirmState === 'confirmed' && 'Reservation complete'}
          {confirmState === 'pending' && 'Payment received'}
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[13px] leading-[1.5] text-gray-400">
          {confirmState === 'confirming' &&
            'Your card was charged — waiting for the reservation to be confirmed.'}
          {confirmState === 'confirmed' &&
            'Your currency exchange reservation was submitted successfully.'}
          {confirmState === 'pending' &&
            "This is taking longer than usual. Your reservation will update automatically once confirmed — check My Reservations shortly."}
        </p>

        <ReservationNumberCard className="mt-7" number={state.reservationNumber} />

        <div className="mt-8 flex justify-center">
          {confirmState === 'confirmed' && qrPayload ? (
            <QrCode value={qrPayload} />
          ) : (
            <div className="flex h-[176px] w-[176px] animate-pulse items-center justify-center rounded-lg bg-gray-100 text-[12px] text-gray-400">
              QR pending
            </div>
          )}
        </div>

        <dl className="mt-auto border-t border-gray-200 pt-1">
          {summary.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-gray-100 py-2"
            >
              <dt className="text-[12px] text-gray-500">{label}</dt>
              <dd className="text-[12px] font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <ActionButton to="/mypage/reservations" className="mt-4">
          View reservation
        </ActionButton>
        <ActionButton to="/" variant="secondary" className="mt-2.5">
          Back to home
        </ActionButton>
      </main>
    </PageLayout>
  )
}

export default ReservationCompletePage
