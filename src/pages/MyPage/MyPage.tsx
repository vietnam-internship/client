import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'
import { CalendarIcon, LogoutIcon } from '@/components/icons'
import MenuCard from '@/pages/MyPage/components/MenuCard'

interface MyPageProps {
  onLogout: () => void
}

function MyPage({ onLogout }: MyPageProps) {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <Header backTo="/" />

      <main className="flex-1 px-5 pb-28">
        <h1 className="mt-4 text-[16px] font-bold text-gray-900">MyPage</h1>

        <ProfileCard className="mt-4" title="User" email="user@gmail.com" />

        <div className="mt-5 flex flex-col gap-3">
          <MenuCard
            Icon={CalendarIcon}
            title="My Reservation"
            description="Check my reservation"
            onClick={() => navigate('/mypage/reservations')}
          />
          <MenuCard
            Icon={CalendarIcon}
            title="Exchange history"
            description="Check my history"
            onClick={() => navigate('/mypage/history')}
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
    </PageLayout>
  )
}

export default MyPage
