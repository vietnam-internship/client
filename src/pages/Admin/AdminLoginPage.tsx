import { Link } from 'react-router-dom'
import type { UserProfile } from '@/types'

interface AdminLoginPageProps {
  isLoggedIn: boolean
  user: UserProfile | null
}

// 별도 관리자 로그인 API가 없어 기존 Google OAuth + JWT 세션의 role만으로 접근을 가른다.
function AdminLoginPage({ isLoggedIn, user }: AdminLoginPageProps) {
  return (
    <div className="flex w-full flex-1">
      <aside className="relative hidden w-[54%] flex-col bg-primary px-14 pt-36 text-white md:flex">
        <p className="text-[32px] font-bold">TravelX</p>
        <h1 className="mt-12 max-w-[420px] text-[26px] leading-[1.35] font-bold">
          Run every branch, rate and reservation from one place.
        </h1>
        <p className="mt-3 max-w-[440px] text-[14px] text-blue-100">
          Manage exchange rates, inventory and bookings across all TravelX locations.
        </p>
        <p className="mt-28 text-[12px] text-blue-200">2026 TravelX. Internal use only.</p>
        <span aria-hidden="true" className="absolute bottom-2 left-5 text-[24px] font-bold">
          t
        </span>
      </aside>

      <main className="flex flex-1 flex-col justify-center px-8">
        <div className="w-full max-w-[420px]">
          {!isLoggedIn ? (
            <>
              <h2 className="text-[24px] font-bold text-gray-900">Admin login</h2>
              <p className="mt-3 text-[13px] text-gray-500">
                Sign in with your TravelX account to continue. Access is granted to admin
                accounts only.
              </p>
              <Link
                to="/login"
                className="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
              >
                Sign in with Google
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-[24px] font-bold text-gray-900">Access required</h2>
              <p className="mt-3 text-[13px] text-gray-500">
                {user?.email}은(는) 관리자 권한이 없습니다. 관리자 계정으로 다시 로그인하거나
                시스템 관리자에게 권한을 요청하세요.
              </p>
              <Link
                to="/"
                className="mt-8 flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back to TravelX
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminLoginPage
