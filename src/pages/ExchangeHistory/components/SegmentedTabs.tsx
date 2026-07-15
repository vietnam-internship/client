interface SegmentedTabsProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

function SegmentedTabs<T extends string>({ options, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-[10px] bg-gray-100">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-[34px] cursor-pointer rounded-[10px] text-[13px] transition-colors ${
            value === option.value
              ? 'bg-primary font-semibold text-white'
              : 'font-medium text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedTabs
