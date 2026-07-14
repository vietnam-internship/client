import BottomNav from '../../components/BottomNav'
import Header from '../../components/Header'
import { CalendarIcon, LogoutIcon } from '../../components/icons'
import MenuCard from './MenuCard'

interface MyPageProps {
  onLogout: () => void
}

function MyPage({ onLogout }: MyPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header backTo="/" />

      <main className="flex-1 px-5 pb-28">
        <h1 className="mt-4 text-[16px] font-bold text-gray-900">MyPage</h1>

        <section className="mt-4 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3.5">
          <span className="h-9 w-9 shrink-0 rounded-full bg-blue-200" />
          <div>
            <p className="text-[14px] font-bold text-gray-900">User</p>
            <p className="text-[13px] text-gray-600">user@gmail.com</p>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3">
          <MenuCard
            Icon={CalendarIcon}
            title="My Reservation"
            description="Check my reservation"
          />
          <MenuCard
            Icon={CalendarIcon}
            title="Exchange history"
            description="Check my history"
          />
        </div>

        <div className="mt-3.5 flex justify-end">
          <button
            type="button"
            onClick={onLogout}
            className="flex cursor-pointer items-center gap-2 py-1 text-[14px] text-gray-400 transition-colors hover:text-gray-600"
          >
            <LogoutIcon className="h-5 w-5 text-gray-300" />
            Logout
          </button>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}

export default MyPage
