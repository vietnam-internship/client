import BottomNav from '@/components/common/BottomNav'
import Header from '@/components/common/Header'
import PageLayout from '@/components/common/PageLayout'
import { PICKUP_OFFICES } from '@/data/offices'
import MapPlaceholder from '@/components/maps/MapPlaceholder'
import OfficeRow from '@/components/maps/OfficeRow'

function MapsPage() {
  return (
    <PageLayout>
      <Header />

      <main className="flex-1 pb-28">
        <MapPlaceholder />

        <div className="mt-7 px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[17px] font-bold text-gray-900">Available pickup offices</h1>
              <p className="mt-1 text-[12px] leading-[1.5] text-gray-400">
                Select one to lock the best matching offer
              </p>
            </div>
            <button
              type="button"
              className="mt-1 shrink-0 cursor-pointer text-[12px] text-gray-400 transition-colors hover:text-gray-600"
            >
              AI recommendation ▾
            </button>
          </div>

          <ul className="mt-2">
            {PICKUP_OFFICES.map((office) => (
              <OfficeRow key={office.id} office={office} />
            ))}
          </ul>
        </div>
      </main>

      <BottomNav active="maps" />
    </PageLayout>
  )
}

export default MapsPage
