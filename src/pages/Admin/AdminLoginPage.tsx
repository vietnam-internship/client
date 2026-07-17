import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface AdminLoginPageProps {
  onLogin: () => void
}

function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin()
    navigate('/admin', { replace: true })
  }

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

      <main className="flex flex-1 justify-center px-8 pt-36">
        <form onSubmit={handleSubmit} className="w-full max-w-[470px]">
          <h2 className="text-[24px] font-bold text-gray-900">Admin login</h2>
          <p className="mt-3 text-[13px] text-gray-500">Sign in with your TravelX admin account.</p>

          <label className="mt-10 block">
            <span className="mb-2 block text-[12px] text-gray-600">Email address</span>
            <input
              type="email"
              name="email"
              required
              placeholder="travelx.admin@system.com"
              className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </label>

          <label className="mt-5 block">
            <span className="mb-2 flex items-center justify-between text-[12px]">
              <span className="text-gray-600">Password</span>
              <a href="#" className="font-medium text-blue-700 hover:underline">
                Forgot password?
              </a>
            </span>
            <input
              type="password"
              name="password"
              required
              placeholder="***"
              className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </label>

          <label className="mt-16 flex items-center gap-3">
            <input
              type="checkbox"
              className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
            />
            <span className="text-[13px] text-gray-600">Keep me signed in on this device</span>
          </label>

          <button
            type="submit"
            className="mt-8 h-12 w-full cursor-pointer rounded-lg bg-primary text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Log in
          </button>
          <p className="mt-3 text-center text-[12px] text-gray-400">
            Need access? Contact your system administrator.
          </p>
        </form>
      </main>
    </div>
  )
}

export default AdminLoginPage
