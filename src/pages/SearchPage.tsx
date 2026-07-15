import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNav'
import ListRowLink from '@/components/common/ListRowLink'
import PageLayout from '@/components/common/PageLayout'
import { ArrowLeftIcon, ChevronRightIcon, SearchIcon } from '@/components/common/icons'
import { CURRENCIES } from '@/data/currencies'
import useRecentSearches from '@/hooks/useRecentSearches'
import RecentSearches from '@/components/search/RecentSearches'

function SearchPage() {
  const [query, setQuery] = useState('')
  const { recent, addRecent, removeRecent, clearRecent } = useRecentSearches()

  const normalized = query.trim().toLowerCase()
  const results = normalized
    ? CURRENCIES.filter(
        (currency) =>
          currency.code.toLowerCase().includes(normalized) ||
          currency.name.toLowerCase().includes(normalized),
      )
    : CURRENCIES

  return (
    <PageLayout>
      <header className="sticky top-0 z-20 flex h-[54px] shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4">
        <Link to="/" aria-label="Back" className="shrink-0 text-primary">
          <ArrowLeftIcon className="h-[22px] w-[22px]" />
        </Link>
        <div className="relative flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a country or currency"
            className="h-[34px] w-full rounded-lg border border-gray-200 pr-3 pl-8 text-[12px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      <main className="flex-1 px-4 pb-28">
        {!normalized && (
          <div className="mt-6">
            <RecentSearches items={recent} onRemove={removeRecent} onClear={clearRecent} />
          </div>
        )}

        <h2 className="mt-8 text-[15px] font-bold text-gray-900">
          {normalized ? 'Search results' : 'Popular currencies'}
        </h2>
        <ul className="mt-2">
          {results.map((currency) => (
            <ListRowLink
              key={currency.code}
              to={`/currency/${currency.code.toLowerCase()}`}
              onClick={() => addRecent(currency.code)}
              className="py-[11px]"
              title={currency.code}
              subtitle={currency.name}
              right={<ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />}
            />
          ))}
        </ul>
      </main>

      <BottomNav active="home" />
    </PageLayout>
  )
}

export default SearchPage
