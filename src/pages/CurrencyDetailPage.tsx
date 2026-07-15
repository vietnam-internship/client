import { Navigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNav'
import Header from '@/components/common/Header'
import ListRowLink from '@/components/common/ListRowLink'
import PageLayout from '@/components/common/PageLayout'
import { ExchangeIcon } from '@/components/common/icons'
import { BRANCHES } from '@/data/branches'
import { findCurrency } from '@/data/currencies'
import AiRecommendationCard from '@/components/currency-detail/AiRecommendationCard'
import RateTrendChart from '@/components/currency-detail/RateTrendChart'

function CurrencyDetailPage() {
  const { code } = useParams()
  const currency = findCurrency(code)

  if (!currency) {
    return <Navigate to="/search" replace />
  }

  const isUp = currency.change.startsWith('+')

  return (
    <PageLayout>
      <Header backTo="/search" />

      <main className="flex-1 px-4 pb-28">
        <section className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <ExchangeIcon className="h-4 w-4 text-gray-500" />
          </span>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold text-gray-900">{currency.pair}</h1>
            <p className="text-[12px] text-gray-400">{currency.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold text-gray-900">{currency.rate}</p>
            <p className={`text-[11px] font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
              {currency.change}
            </p>
          </div>
        </section>

        <div className="mt-3">
          <AiRecommendationCard note={currency.aiNote} />
        </div>

        <section className="mt-4">
          <h2 className="text-[14px] font-bold text-gray-900">7-day rate trend</h2>
          <p className="mt-1 text-[12px] text-gray-400">Range: {currency.range}</p>
          <div className="mt-3">
            <RateTrendChart points={currency.trend} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>05/18</span>
            <span>Today</span>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-[14px] font-bold text-gray-900">
            Recommended nearby branches by AI
          </h2>
          <ul className="mt-1">
            {BRANCHES.map((branch) => (
              <ListRowLink
                key={branch.id}
                to={`/branch/${branch.id}`}
                className="py-2.5"
                title={branch.name}
                subtitle={branch.distance}
                right={
                  <span className="text-[13px] font-bold text-gray-900">{branch.listRate}</span>
                }
              />
            ))}
          </ul>
        </section>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default CurrencyDetailPage
