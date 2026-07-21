import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCurrencies } from '@/api/currency'
import BottomNav from '@/components/BottomNav'
import ListRowLink from '@/components/ListRowLink'
import PageLayout from '@/components/PageLayout'
import { ArrowLeftIcon, ChevronRightIcon, SearchIcon } from '@/components/icons'
import RecentSearches from '@/pages/Search/components/RecentSearches'
import type { CurrencySummary } from '@/types'

function SearchPage() {
  const [query, setQuery] = useState('')

  const [results, setResults] = useState<CurrencySummary[]>([])
  const [popular, setPopular] = useState<CurrencySummary[]>([])
  // 로그인 사용자의 최근 검색 통화 — GET /currencies 응답의 recentSearches를 그대로 사용
  const [recentSearches, setRecentSearches] = useState<CurrencySummary[]>([])
  // 서버에 개별/전체 삭제 API가 없어, 삭제·전체 지우기는 이 화면에서만 숨김 처리한다
  const [dismissedRecent, setDismissedRecent] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const normalized = query.trim()

  // 입력이 멈춘 뒤 300ms 후에 검색 — 타이핑마다 요청하지 않도록 디바운스
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(
      () => {
        listCurrencies(normalized || undefined)
          .then((data) => {
            if (cancelled) return
            setResults(data.results)
            setPopular(data.popularCurrencies ?? [])
            // recentSearches는 q 미입력 시에만 내려옴 — 검색 중에는 이전 값을 유지
            if (!normalized) setRecentSearches(data.recentSearches ?? [])
            setError(false)
          })
          .catch(() => {
            if (!cancelled) setError(true)
          })
          .finally(() => {
            if (!cancelled) setLoading(false)
          })
      },
      normalized ? 300 : 0,
    )
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [normalized])

  // 검색어가 없으면 인기 통화(집계값, 없으면 전체 목록), 있으면 검색 결과
  const listed = normalized ? results : popular.length > 0 ? popular : results
  const visibleRecent = recentSearches
    .filter((currency) => !dismissedRecent.has(currency.code))
    .map((currency) => currency.code)

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
            <RecentSearches
              items={visibleRecent}
              onRemove={(code) => setDismissedRecent((prev) => new Set(prev).add(code))}
              onClear={() =>
                setDismissedRecent(new Set(recentSearches.map((currency) => currency.code)))
              }
            />
          </div>
        )}

        <h2 className="mt-8 text-[15px] font-bold text-gray-900">
          {normalized ? 'Search results' : 'Popular currencies'}
        </h2>
        {loading ? (
          <p className="mt-4 text-[13px] text-gray-400">Loading currencies…</p>
        ) : error ? (
          <p className="mt-4 text-[13px] text-gray-400">
            Couldn&apos;t load currencies. Please try again.
          </p>
        ) : listed.length === 0 ? (
          <p className="mt-4 text-[13px] text-gray-400">No results found.</p>
        ) : (
          <ul className="mt-2">
            {listed.map((currency) => (
              <ListRowLink
                key={currency.code}
                to={`/currency/${currency.code.toLowerCase()}`}
                className="py-[11px]"
                title={currency.code}
                subtitle={currency.country}
                right={<ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />}
              />
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="home" />
    </PageLayout>
  )
}

export default SearchPage
