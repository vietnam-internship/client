import { XIcon } from '@/components/icons'

interface RecentSearchesProps {
  items: string[]
  onRemove: (code: string) => void
  onClear: () => void
}

function RecentSearches({ items, onRemove, onClear }: RecentSearchesProps) {
  if (items.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-gray-900">Recent searches</h2>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer text-[12px] font-medium text-blue-700 hover:underline"
        >
          Clear
        </button>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2.5">
        {items.map((code) => (
          <li
            key={code}
            className="flex h-[30px] items-center gap-1.5 rounded-lg border border-gray-200 px-3"
          >
            <span className="text-[13px] font-medium text-gray-900">{code}</span>
            <button
              type="button"
              aria-label={`Remove ${code}`}
              onClick={() => onRemove(code)}
              className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentSearches
