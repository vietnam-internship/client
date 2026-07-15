interface CancelDialogProps {
  onKeep: () => void
  onCancel: () => void
}

function CancelDialog({ onKeep, onCancel }: CancelDialogProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-5"
      onClick={onKeep}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cancel this reservation?"
        className="w-full max-w-[350px] rounded-2xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-bold text-gray-900">Cancel this reservation?</h2>
        <p className="mt-2 text-[13px] leading-[1.5] text-gray-400">
          This can't be undone. Your rate may not be honored if you rebook later.
        </p>

        <button
          type="button"
          onClick={onKeep}
          className="mt-5 h-11 w-full cursor-pointer rounded-[14px] bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Keep reservation
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 h-10 w-full cursor-pointer text-[14px] font-bold text-red-600 transition-colors hover:text-red-700"
        >
          Cancel reservation
        </button>
      </div>
    </div>
  )
}

export default CancelDialog
