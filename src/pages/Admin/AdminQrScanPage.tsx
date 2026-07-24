import { useEffect, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { redeemReservation } from '@/api/reservation'
import { CheckIcon, XIcon } from '@/components/icons'
import type { RedeemResponse } from '@/types'
import { formatNumber } from '@/utils/format'
import { HttpError } from '@/utils/http'
import { decodeQrPayload } from '@/utils/qrPayload'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import StatusChip from '@/pages/Admin/components/StatusChip'

const SCANNER_ELEMENT_ID = 'admin-qr-reader'

type Step =
  | { kind: 'scanning' }
  | { kind: 'cameraError'; message: string }
  | { kind: 'confirm'; branchId: number; reservationId: number; qrToken: string }
  | { kind: 'completed'; result: RedeemResponse }
  | { kind: 'rejected'; message: string }

// 백엔드 에러 코드 → 직원 화면에 보여줄 메시지 (PRD §24 QR Scan)
const ERROR_MESSAGES: Record<string, string> = {
  QR_EXPIRED: 'This QR code has expired.',
  QR_ALREADY_USED: 'This QR code has already been used.',
  IDENTITY_MISMATCH: 'ID verification failed — customer identity does not match.',
  ALREADY_COMPLETED: 'This reservation was already completed.',
  RESERVATION_NOT_FOUND: 'No matching reservation found for this branch.',
}

function AdminQrScanPage() {
  const [step, setStep] = useState<Step>({ kind: 'scanning' })
  const [pending, setPending] = useState(false)

  // 'scanning' 상태일 때만 카메라를 켜고, 벗어나면 반드시 정리한다 (카메라 점유 방지).
  // React 18 StrictMode(dev)는 마운트 시 setup→cleanup→setup을 같은 틱에서 동기적으로
  // 실행하는데, html5-qrcode는 React 밖에서 카메라를 직접 잡기 때문에 첫 번째(버려질)
  // start() 호출이 이미 카메라 협상을 시작해버려 카메라가 2개 뜨는 문제가 생긴다.
  // 실제 start() 호출을 한 틱 미뤄서, StrictMode의 첫 setup은 cleanup에 의해 취소된 뒤
  // 카메라를 아예 켜지 않도록 한다.
  useEffect(() => {
    if (step.kind !== 'scanning') return

    let cancelled = false
    let scanner: Html5Qrcode | null = null
    let teardownPromise: Promise<void> | null = null

    const teardown = () => {
      if (teardownPromise) return teardownPromise
      const target = scanner
      teardownPromise = (async () => {
        if (!target) return
        // html5-qrcode의 stop()은 아직 스캔 중이 아니면 프로미스가 아니라 "동기적으로" throw
        // 한다 — .catch()로는 못 잡히므로 try/catch로 감싸야 한다.
        try {
          await target.stop()
        } catch {
          // 이미 멈춰있거나 start()가 아직 안 끝난 상태 — 무시
        }
        try {
          target.clear()
        } catch {
          // 이미 언마운트된 DOM 노드일 수 있음 — 무시
        }
      })()
      return teardownPromise
    }

    const timer = setTimeout(() => {
      if (cancelled) return
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 340 },
          (decodedText) => {
            if (cancelled) return
            const payload = decodeQrPayload(decodedText)
            if (!payload) return
            cancelled = true
            void teardown().then(() => setStep({ kind: 'confirm', ...payload }))
          },
          () => {
            // 프레임마다 QR을 못 읽었을 때 호출됨 — 정상적인 동작이라 무시
          },
        )
        .then(() => {
          // start()가 끝난 시점에 이미 cleanup이 요청됐다면 바로 정리한다
          if (cancelled) void teardown()

          document
            .querySelectorAll<HTMLElement>(`#${SCANNER_ELEMENT_ID} video, #${SCANNER_ELEMENT_ID} canvas`)
            .forEach((el) => {
              el.style.setProperty('transform', 'scaleX(-1)', 'important')
              el.style.setProperty('-webkit-transform', 'scaleX(-1)', 'important')
            })
        })
        .catch(() => {
          if (!cancelled) {
            setStep({
              kind: 'cameraError',
              message: 'Could not access the camera. Please check camera permission and try again.',
            })
          }
        })
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
      void teardown()
    }
  }, [step.kind])

  const handleDecision = async (idVerified: boolean) => {
    if (step.kind !== 'confirm' || pending) return
    setPending(true)
    try {
      const result = await redeemReservation(step.branchId, step.reservationId, {
        qrToken: step.qrToken,
        idVerified,
      })
      setStep({ kind: 'completed', result })
    } catch (err) {
      const code = err instanceof HttpError ? err.code : undefined
      setStep({
        kind: 'rejected',
        message: (code && ERROR_MESSAGES[code]) ?? 'Failed to process this reservation.',
      })
    } finally {
      setPending(false)
    }
  }

  const reset = () => setStep({ kind: 'scanning' })

  return (
    <AdminLayout active="qr-scan" title="Reservations" subtitle="Review and manage bookings">
      {step.kind === 'scanning' || step.kind === 'cameraError' ? (
        <section className="mt-8 rounded-lg border border-primary px-6 py-7">
          <h2 className="text-[18px] font-bold text-gray-900">Please show the QR code</h2>
          {step.kind === 'cameraError' ? (
            <div className="mt-5 flex h-[420px] w-full flex-col items-center justify-center gap-3 bg-gray-100 text-center">
              <p className="max-w-[280px] text-[12px] text-gray-500">{step.message}</p>
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-white hover:opacity-90"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* 카메라를 좌우 반전(scaleX(-1))해서 셀피처럼 자연스럽게 보이게 하고, 실제 카메라
                  해상도와 무관하게 고정 높이 박스에 꽉 채워서(object-fit: cover) 페이지가
                  늘어나지 않고 한 화면 안에 들어오도록 한다. */}
              <style>{`
                #${SCANNER_ELEMENT_ID} { height: 420px; }
                #${SCANNER_ELEMENT_ID} video,
                #${SCANNER_ELEMENT_ID} canvas {
                  transform: scaleX(-1) !important;
                  width: 100% !important;
                  height: 100% !important;
                  object-fit: cover !important;
                }
              `}</style>
              <div id={SCANNER_ELEMENT_ID} className="mt-5 w-full overflow-hidden bg-gray-200" />
            </>
          )}
        </section>
      ) : step.kind === 'confirm' ? (
        <section className="relative mt-8 rounded-lg border border-primary px-6 py-8">
          <span className="absolute top-5 right-6">
            <StatusChip status="confirmed" />
          </span>
          <p className="text-[19px] font-bold text-gray-900">Reservation #{step.reservationId}</p>
          <p className="mt-1.5 text-[13px] text-gray-500">Branch #{step.branchId}</p>
          <p className="mt-4 max-w-[420px] text-[13px] leading-[1.5] text-gray-500">
            Check the customer&apos;s ID against the reservation before completing pickup.
          </p>

          <div className="mt-8 flex flex-col gap-4 px-4">
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDecision(true)}
              className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
            >
              {pending ? 'Processing…' : 'ID matches — Complete'}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDecision(false)}
              className="h-12 w-full cursor-pointer rounded-lg bg-red-500 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
            >
              ID doesn&apos;t match — Reject
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-10 w-full cursor-pointer text-[12px] font-medium text-gray-400 hover:text-gray-600"
            >
              Cancel and scan again
            </button>
          </div>
        </section>
      ) : (
        <section className="relative mt-8 rounded-lg border border-primary px-6 py-8">
          <div className="flex flex-col items-center text-center">
            {step.kind === 'completed' ? (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#ecf3e0]">
                <CheckIcon className="h-7 w-7 text-[#4e7137]" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-red-50">
                <XIcon className="h-7 w-7 text-red-600" strokeWidth={2.5} />
              </span>
            )}
            <h2 className="text-[19px] font-bold text-gray-900">
              {step.kind === 'completed' ? 'Reservation Complete' : 'Reservation Rejected'}
            </h2>
            <p className="mx-auto mt-4 max-w-[280px] text-[13px] leading-[1.5] text-gray-500">
              {step.kind === 'completed'
                ? 'The pickup has been marked as completed.'
                : step.message}
            </p>

            {step.kind === 'completed' && (
              <>
                <div className="mt-8 w-full max-w-[320px] rounded-lg bg-gray-100 py-4">
                  <p className="text-[12px] text-gray-500">Reservation number</p>
                  <p className="mt-1 text-[18px] font-bold text-gray-900">
                    {step.result.summary.reservationNumber}
                  </p>
                </div>
                <dl className="mt-6 w-full max-w-[320px] border-t border-gray-200">
                  {[
                    {
                      label: 'Customer amount',
                      value: `${formatNumber(step.result.summary.amountTo)} ${step.result.summary.currencyCode}`,
                    },
                    { label: 'Branch', value: step.result.summary.branchName },
                    {
                      label: 'Pickup',
                      value: `${step.result.summary.pickupDate} · ${step.result.summary.pickupTime}`,
                    },
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
              </>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-10 h-12 w-full max-w-[320px] cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
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
