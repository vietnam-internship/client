const STYLES = {
  completed: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-600',
  confirmed: 'bg-blue-50 text-blue-700',
} as const

const LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
} as const

export type ChipStatus = keyof typeof STYLES

function StatusChip({ status }: { status: ChipStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}

export default StatusChip
