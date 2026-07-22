import { CheckIcon, ChevronRightIcon } from '@/components/icons'
import useDisclosure from '@/hooks/useDisclosure'

interface CurrencyDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

/**
 * Custom currency picker replacing the native <select>.
 * A native select can't have its open-state menu restyled (the browser/OS
 * renders it), so this recreates the same trigger + menu with our own markup.
 */
function CurrencyDropdown({ options, value, onChange }: CurrencyDropdownProps) {
  const { isOpen, close, toggle } = useDisclosure()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1.5 pr-2.5 pl-3.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        {value}
        <ChevronRightIcon
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Click-outside catcher, same pattern as NotificationPanel */}
          <div className="fixed inset-0 z-20" onClick={close} aria-hidden="true" />
          <ul
            role="listbox"
            className="absolute top-[calc(100%+8px)] right-0 z-30 w-[120px] overflow-hidden rounded-2xl bg-white py-1 shadow-[0_10px_40px_rgba(15,23,42,0.18)]"
          >
            {options.map((option) => {
              const selected = option === value
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option)
                      close()
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[13px] transition-colors hover:bg-gray-50 ${
                      selected ? 'font-bold text-primary' : 'text-gray-700'
                    }`}
                  >
                    {option}
                    {selected && <CheckIcon className="h-3.5 w-3.5" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default CurrencyDropdown
