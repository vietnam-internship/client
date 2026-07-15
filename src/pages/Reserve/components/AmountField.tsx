interface AmountFieldProps {
  flag: string
  label: string
  unit: string
  amount: string
  editable?: boolean
  onChange?: (value: string) => void
}

function AmountField({ flag, label, unit, amount, editable = false, onChange }: AmountFieldProps) {
  return (
    <label
      className={`flex h-10 items-center gap-2.5 rounded-lg px-3.5 ${
        editable ? 'border border-blue-600 bg-white' : 'bg-gray-100'
      }`}
    >
      <span className="text-[13px] leading-none">{flag}</span>
      <span className="flex-1 text-[13px] font-bold text-gray-900">{label}</span>
      {editable ? (
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="0"
          className="w-28 bg-transparent text-right text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      ) : (
        <span className="text-[12px] text-gray-500">{amount || '0'}</span>
      )}
      <span className="text-[12px] text-gray-500">{unit}</span>
    </label>
  )
}

export default AmountField
