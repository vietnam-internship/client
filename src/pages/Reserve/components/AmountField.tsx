interface AmountFieldProps {
  flag: string
  label: string
  unit: string
  amount: string
  editable?: boolean
  onChange?: (value: string) => void
  /** 2개 이상 넘기면 label 자리가 드롭다운으로 바뀌어 사용자가 통화를 바꿀 수 있다. */
  currencyOptions?: string[]
  onCurrencyChange?: (code: string) => void
}

function AmountField({
  flag,
  label,
  unit,
  amount,
  editable = false,
  onChange,
  currencyOptions,
  onCurrencyChange,
}: AmountFieldProps) {
  const canPickCurrency = editable && onCurrencyChange && (currencyOptions?.length ?? 0) > 1

  return (
    <label
      className={`flex h-10 items-center gap-2.5 rounded-lg px-3.5 ${
        editable ? 'border border-blue-600 bg-white' : 'bg-gray-100'
      }`}
    >
      <span className="text-[13px] leading-none">{flag}</span>
      {canPickCurrency ? (
        <select
          aria-label="Select currency"
          value={label}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="flex-1 cursor-pointer bg-transparent text-[13px] font-bold text-gray-900 focus:outline-none"
        >
          {currencyOptions?.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      ) : (
        <span className="flex-1 text-[13px] font-bold text-gray-900">{label}</span>
      )}
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
