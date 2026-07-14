import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import { ArrowLeftIcon, SearchIcon } from '@/components/icons'
import { CURRENCIES } from '@/data/currencies'
import CurrencyListItem from './CurrencyListItem'
import RecentSearches from './RecentSearches'

const RECENT_KEY = 'travelx.recentSearches'

function loadRecent(): string[] {
  const saved = localStorage.getItem(RECENT_KEY)
  return saved ? JSON.parse(saved) : ['USD', 'VND']
}

function saveRecent(items: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items))
}

function Search() {
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>(loadRecent)

  const updateRecent = (items: string[]) => {
    setRecent(items)
    saveRecent(items)
  }

  const addRecent = (code: string) => {
    updateRecent([code, ...recent.filter((item) => item !== code)])
  }

  const normalized = query.trim().toLowerCase()
  const results = normalized
    ? CURRENCIES.filter(
        (currency) =>
          currency.code.toLowerCase().includes(normalized) ||
          currency.name.toLowerCase().includes(normalized),
      )
    : CURRENCIES

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
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
            <RecentSearches
              items={recent}
              onRemove={(code) => updateRecent(recent.filter((item) => item !== code))}
              onClear={() => updateRecent([])}
            />
          </div>
        )}

        <h2 className="mt-8 text-[15px] font-bold text-gray-900">
          {normalized ? 'Search results' : 'Popular currencies'}
        </h2>
        <ul className="mt-2">
          {results.map((currency) => (
            <CurrencyListItem key={currency.code} currency={currency} onSelect={addRecent} />
          ))}
        </ul>
      </main>

      <BottomNav active="home" />
    </div>
  )
}

export default Search
