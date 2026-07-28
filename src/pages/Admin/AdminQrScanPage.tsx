import { useCallback, useState } from 'react'
import QrPlaceholder from '@/pages/Admin/components/QrPlaceholder'
import QrCameraScanner from '@/pages/Admin/components/QrCameraScanner'
import { CheckIcon, XIcon } from '@/components/icons'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'
import StatusChip from '@/pages/Admin/components/StatusChip'
import { adminLookupReservationByQr, adminCompleteReservation, adminRejectReservation } from '@/api/admin'
import useAdminBranch from '@/hooks/useAdminBranch'
import type { AdminReservationDetail, UserProfile } from '@/types'

type ScanStep = 'scanning' | 'confirmed' | 'completed' | 'rejected'

const RESULT_HEADINGS: Record<Exclude<ScanStep, 'scanning'>, string> = {
  confirmed: 'Reservation Information',
  completed: 'Reservation Complete',
  rejected: 'Reservation Rejected',
}

const RESULT_MESSAGES: Record<Exclude<ScanStep, 'scanning'>, string> = {
  confirmed: 'Your currency exchange reservation was submitted successfully.',
  completed: 'Your currency exchange reservation was submitted successfully.',
  rejected: 'Your currency exchange reservation was rejected by the shop',
}

interface AdminQrScanPageProps {
  user: UserProfile | null
}

function AdminQrScanPage({ user }: AdminQrScanPageProps) {
  const { branchId, setBranchId, branches, locked } = useAdminBranch(user)
  const [step, setStep] = useState<ScanStep>('scanning')
  const [reservation, setReservation] = useState<AdminReservationDetail | null>(null)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [looking, setLooking] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [manualToken, setManualToken] = useState('')

  const handleToken = useCallback(
    async (token: string) => {
      if (branchId === null || looking) return
      setLooking(true)
      setLookupError(null)
      try {
        const detail = await adminLookupReservationByQr(branchId, token)
        setReservation(detail)
        setQrToken(token)
        setStep('confirmed')
      } catch {
        setLookupError('이 지점의 예약을 찾을 수 없습니다. 다시 스캔해주세요.')
      } finally {
        setLooking(false)
      }
    },
    [branchId, looking],
  )

  const handleManualSubmit = () => {
    if (!manualToken.trim()) return
    handleToken(manualToken.trim())
    setManualToken('')
  }

  const handleComplete = async () => {
    if (!reservation || !qrToken || branchId === null) return
    await adminCompleteReservation(branchId, reservation.id, qrToken)
    setStep('completed')
  }

  const handleReject = async () => {
    if (!reservation || branchId === null) return
    await adminRejectReservation(branchId, reservation.id)
    setStep('rejected')
  }

  if (step === 'scanning' || !reservation) {
    return (
      <AdminLayout active="qr-scan" title="Reservations" subtitle="Review and manage bookings">
        {!locked && (
          <div className="mt-6">
            <BranchSelect branches={branches} value={branchId} onChange={setBranchId} />
          </div>
        )}

        <section className="mt-8 rounded-lg border border-primary px-6 py-7">
          <h2 className="text-[18px] font-bold text-gray-900">Please show the QR code</h2>
          <div className="relative mt-5">
            <QrCameraScanner onDecode={handleToken} paused={looking || branchId === null} />
            {looking && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-[13px] font-semibold text-white">Looking up reservation…</span>
              </div>
            )}
          </div>

          {lookupError && <p className="mt-3 text-[12px] text-red-600">{lookupError}</p>}

          <div className="mt-5 flex gap-2.5">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="카메라가 안 되면 QR 코드를 직접 입력하세요"
              className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={!manualToken.trim() || looking}
              className="h-11 shrink-0 cursor-pointer rounded-lg bg-primary px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              조회
            </button>
          </div>
        </section>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout active="qr-scan" title="Reservations" subtitle="Review and manage bookings">
      <section className="relative mt-8 rounded-lg border border-primary px-6 py-8">
        <span className="absolute top-5 right-6">
          <StatusChip status="confirmed" />
        </span>
        <p className="text-[19px] font-bold text-gray-900">
          {reservation.customerName} · #{reservation.reservationNumber}
        </p>
        <p className="mt-1.5 text-[13px] text-gray-500">
          {reservation.currencyPair} · {reservation.amount}
        </p>
        <p className="mt-0.5 text-[12px] text-gray-400">
          {reservation.branchName} · {reservation.pickupDetail}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-16 px-4 pb-6">
          <div className="flex flex-col items-center text-center">
            {step === 'completed' && (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#ecf3e0]">
                <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
              </span>
            )}
            {step === 'rejected' && (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-red-50">
                <XIcon className="h-7 w-7 text-red-600" strokeWidth={2.5} />
              </span>
            )}
            <h2 className="text-[19px] font-bold text-gray-900">{RESULT_HEADINGS[step]}</h2>
            <p className="mx-auto mt-4 max-w-[220px] text-[13px] leading-[1.5] text-gray-500">
              {RESULT_MESSAGES[step]}
            </p>
            <div className="mt-8 w-full rounded-lg bg-gray-100 py-4">
              <p className="text-[12px] text-gray-500">Reservation number</p>
              <p className="mt-1 text-[18px] font-bold text-gray-900">{reservation.reservationNumber}</p>
            </div>
            <div className="mt-10">
              <QrPlaceholder />
            </div>
          </div>

          <div className="flex flex-col pt-14">
            <div className="mt-12 flex flex-col gap-4 px-4">
              {step === 'confirmed' ? (
                <>
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="h-12 w-full cursor-pointer rounded-lg bg-red-500 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStep('scanning')
                    setReservation(null)
                    setQrToken(null)
                  }}
                  className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Back to list
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminQrScanPage
