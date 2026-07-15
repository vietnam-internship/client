import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import { MapPinIcon } from '@/components/icons'
import { findBranch } from '@/data/branches'

function BranchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const branch = findBranch(id)

  if (!branch) {
    return <Navigate to="/search" replace />
  }

  return (
    <PageLayout>
      <Header backTo={-1} />

      <main className="flex-1 px-6 pb-28">
        <div className="mt-3.5 flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-[13px] text-gray-400">Map preview</p>
        </div>

        <section className="mt-6">
          <h1 className="text-[18px] font-bold text-gray-900">{branch.name}</h1>
          <p className="mt-1.5 text-[13px] text-gray-400">{branch.address}</p>
          <p className="mt-2.5 flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1 text-gray-400">
              <MapPinIcon className="h-3.5 w-3.5" />
              {branch.distance}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              {branch.openUntil}
            </span>
          </p>
          <p className="mt-3.5 inline-block rounded-md bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
            {branch.feeNote}
          </p>
        </section>

        <section className="mt-5">
          <h2 className="text-[14px] font-bold text-gray-900">Rates at this branch</h2>
          <ul className="mt-1.5">
            {branch.rates.map(({ code, rate }) => (
              <li
                key={code}
                className="flex items-center justify-between border-b border-gray-100 py-2"
              >
                <span className="text-[13px] font-bold text-gray-900">{code}</span>
                <span className="text-[13px] font-bold text-gray-900">{rate}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h2 className="text-[14px] font-bold text-gray-900">Hours</h2>
          <ul className="mt-2">
            {branch.hours.map(({ label, time }) => (
              <li key={label} className="flex items-center justify-between py-1">
                <span className="text-[12px] text-gray-400">{label}</span>
                <span className="text-[12px] text-gray-400">{time}</span>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={() => navigate(`/reserve/${branch.id}`)}
          className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Reserve now
        </button>
      </main>

      <BottomNav active="exchange" />
    </PageLayout>
  )
}

export default BranchDetailPage
