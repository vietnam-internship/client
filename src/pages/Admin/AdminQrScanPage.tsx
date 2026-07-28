import { useState } from 'react'
import { parseQrPayload, redeemReservation } from '@/api/admin'
import { CheckIcon, XIcon } from '@/components/icons'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import { HttpError } from '@/utils/http'
import type { RedeemResponse } from '@/types'

type ScanStep = 'input' | 'completed' | 'failed'

function AdminQrScanPage() {
  const [step, setStep] = useState<ScanStep>('input')
  const [qrPayload, setQrPayload] = useState('')
  const [idVerified, setIdVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RedeemResponse | null>(null)

  const reset = () => {
    setStep('input')
    setQrPayload('')
    setIdVerified(false)
    setError(null)
    setResult(null)
  }

  const handleSubmit = async () => {
    const parsed = parseQrPayload(qrPayload)
    if (!parsed) {
      setError('QR 코드 형식이 올바르지 않습니다.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const response = await redeemReservation(
        parsed.branchId,
        parsed.reservationId,
        parsed.qrToken,
        idVerified,
      )
      setResult(response)
      setStep('completed')
    } catch (e) {
      setError(e instanceof HttpError ? e.message : '픽업 처리에 실패했습니다.')
      setStep('failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout active="qr-scan" title="QR Pickup" subtitle="Redeem a reservation at the counter">
      {step === 'input' ? (
        <section className="mt-8 max-w-[480px] rounded-lg border border-primary px-6 py-7">
          <h2 className="text-[18px] font-bold text-gray-900">Enter reservation QR code</h2>
          <p className="mt-1.5 text-[12px] text-gray-500">
            카메라 스캔은 아직 지원하지 않습니다 — 고객이 보여주는 QR 코드 텍스트를 직접
            입력하거나 붙여넣으세요.
          </p>

          <textarea
            value={qrPayload}
            onChange={(e) => setQrPayload(e.target.value)}
            placeholder="e.g. 3:12:xR7pQm9k2..."
            rows={3}
            className="mt-4 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
          />

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
              className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
            />
            <span className="text-[13px] text-gray-600">고객 신원(신분증)을 확인했습니다</span>
          </label>

          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

          <button
            type="button"
            disabled={!qrPayload.trim() || !idVerified || submitting}
            onClick={handleSubmit}
            className="mt-6 h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Processing…' : 'Complete Pickup'}
          </button>
        </section>
      ) : (
        <section className="relative mt-8 max-w-[480px] rounded-lg border border-primary px-6 py-8">
          <div className="flex flex-col items-center text-center">
            {step === 'completed' ? (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#ecf3e0]">
                <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-red-50">
                <XIcon className="h-7 w-7 text-red-600" strokeWidth={2.5} />
              </span>
            )}

            <h2 className="text-[19px] font-bold text-gray-900">
              {step === 'completed' ? 'Pickup Complete' : 'Pickup Failed'}
            </h2>
            <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-[1.5] text-gray-500">
              {step === 'completed' ? 'The reservation has been marked as picked up.' : error}
            </p>

            {step === 'completed' && result && (
              <dl className="mt-6 w-full border-t border-gray-200 text-left">
                {[
                  { label: 'Reservation number', value: result.summary.reservationNumber },
                  {
                    label: 'Amount',
                    value: `${result.summary.amount} ${result.summary.currencyCode}`,
                  },
                  { label: 'Branch', value: result.summary.branchName },
                  { label: 'Picked up at', value: result.pickedUpAt ?? '-' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-gray-200 py-3"
                  >
                    <dt className="text-[12px] text-gray-500">{label}</dt>
                    <dd className="text-[13px] font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-8 h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Scan next
            </button>
          </div>
        </section>
      )}
    </AdminLayout>
  )
}

export default AdminQrScanPage
