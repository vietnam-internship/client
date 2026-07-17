import { useState } from 'react'
import QrPlaceholder from '@/pages/Admin/components/QrPlaceholder'
import { CheckIcon, XIcon } from '@/components/icons'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import StatusChip from '@/pages/Admin/components/StatusChip'

type ScanStep = 'scanning' | 'confirmed' | 'completed' | 'rejected'

const SCANNED_RESERVATION = {
  id: 'TX-90331',
  name: 'Elena Rossi',
  detail: 'EUR → USD · €2,100.00',
  sub: 'Main Hub, Gate 4 · Pickup 6:00 PM tomorrow',
  reservationNumber: 'TX-20240501',
  summary: [
    { label: 'Amount', value: '5,000,000 VND' },
    { label: 'Location', value: 'Incheon T1' },
    { label: 'Date', value: 'Oct 24, 2:30 PM' },
  ],
}

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

function AdminQrScanPage() {
  const [step, setStep] = useState<ScanStep>('scanning')

  return (
    <AdminLayout active="qr-scan" title="Reservations" subtitle="Review and manage bookings">
      {step === 'scanning' ? (
        <section className="mt-8 rounded-lg border border-primary px-6 py-7">
          <h2 className="text-[18px] font-bold text-gray-900">Please show the QR code</h2>
          <button
            type="button"
            onClick={() => setStep('confirmed')}
            className="mt-5 flex h-[500px] w-full cursor-pointer items-center justify-center bg-gray-200 text-center"
          >
            <span className="text-[12px] text-gray-700">
              (camera screen)
              <br />
              scan the QR code and then go next page
            </span>
          </button>
        </section>
      ) : (
        <section className="relative mt-8 rounded-lg border border-primary px-6 py-8">
          <span className="absolute top-5 right-6">
            <StatusChip status="confirmed" />
          </span>
          <p className="text-[19px] font-bold text-gray-900">
            {SCANNED_RESERVATION.name} · #{SCANNED_RESERVATION.id}
          </p>
          <p className="mt-1.5 text-[13px] text-gray-500">{SCANNED_RESERVATION.detail}</p>
          <p className="mt-0.5 text-[12px] text-gray-400">{SCANNED_RESERVATION.sub}</p>

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
                <p className="mt-1 text-[18px] font-bold text-gray-900">
                  {SCANNED_RESERVATION.reservationNumber}
                </p>
              </div>
              <div className="mt-10">
                <QrPlaceholder />
              </div>
            </div>

            <div className="flex flex-col pt-14">
              <dl className="border-t border-gray-200">
                {SCANNED_RESERVATION.summary.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-gray-200 py-6"
                  >
                    <dt className="text-[12px] text-gray-500">{label}</dt>
                    <dd className="text-[13px] font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12 flex flex-col gap-4 px-4">
                {step === 'confirmed' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep('completed')}
                      className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('rejected')}
                      className="h-12 w-full cursor-pointer rounded-lg bg-red-500 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep('scanning')}
                    className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Back to list
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </AdminLayout>
  )
}

export default AdminQrScanPage
