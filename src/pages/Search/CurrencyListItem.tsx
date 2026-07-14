import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@/components/icons'
import type { Currency } from '@/data/currencies'

interface CurrencyListItemProps {
  currency: Currency
  onSelect?: (code: string) => void
}

function CurrencyListItem({ currency, onSelect }: CurrencyListItemProps) {
  return (
    <li>
      <Link
        to={`/currency/${currency.code.toLowerCase()}`}
        onClick={() => onSelect?.(currency.code)}
        className="flex items-center justify-between border-b border-gray-100 py-[11px] transition-colors hover:bg-gray-50"
      >
        <span>
          <span className="block text-[13px] font-bold text-gray-900">{currency.code}</span>
          <span className="block text-[11px] text-gray-400">{currency.name}</span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />
      </Link>
    </li>
  )
}

export default CurrencyListItem
