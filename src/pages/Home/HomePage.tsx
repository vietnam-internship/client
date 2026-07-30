import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { SearchIcon } from '@/components/icons'
import { getCurrencies, type CurrencySummary } from '@/api/currency'
import PickupCard from '@/pages/Home/components/PickupCard'
import RateCard from '@/pages/Home/components/RateCard'

function HomePage() {
  const navigate = useNavigate()
  const [currencies, setCurrencies] = useState<CurrencySummary[]>([])

  useEffect(() => {
    getCurrencies()
      .then((data) => setCurrencies((data.popularCurrencies ?? data.results).slice(0, 5)))
      .catch(() => setCurrencies([]))
  }, [])

  return (
    <PageLayout>
      <Header />

      <main className="flex-1 px-4 pb-28">
        <h1 className="mt-8 text-[24px] font-bold text-gray-900">Exchange overview</h1>

        <div className="mt-3">
          <PickupCard
            title="Vietnamese dong (VND) pickup"
            schedule="Jul 12, 2026, 2:00-3:00 PM, TravelX Hoan Kiem branch"
          />
        </div>

        <section className="mt-7">
          <h2 className="text-[16px] font-bold text-gray-900">Live rate comparison</h2>

          <div className="relative mt-2">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              readOnly
              onFocus={() => navigate('/search')}
              onClick={() => navigate('/search')}
              placeholder="Search a country or currency"
              className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 pr-3 pl-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </div>

          <ul className="mt-2 flex flex-col gap-2.5">
            {currencies.map((currency) => (
              <Link key={currency.code} to={`/currency/${currency.code.toLowerCase()}`}>
                <RateCard
                  code={currency.code}
                  name={currency.country}
                  value={currency.sellRate.toLocaleString('en-US')}
                  change=""
                />
              </Link>
            ))}
          </ul>
        </section>
      </main>

      <BottomNav active="home" />
    </PageLayout>
  )
}

export default HomePage
