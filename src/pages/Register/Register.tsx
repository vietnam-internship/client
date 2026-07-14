import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

interface RegisterProps {
  onComplete: () => void
}

function Register({ onComplete }: RegisterProps) {
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onComplete()
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white">
      <Header />

      <main className="flex-1 px-4">
        <h1 className="mt-5 text-[20px] font-bold text-gray-900">Complete your profile</h1>
        <p className="mt-1 text-[12px] text-gray-500">
          Enter your details to get started with TravelX
        </p>

        <section className="mt-6 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3.5">
          <span className="h-9 w-9 shrink-0 rounded-full bg-blue-200" />
          <div>
            <p className="text-[14px] font-bold text-gray-900">Signed in with Google</p>
            <p className="text-[13px] text-gray-600">john.doe@gmail.com</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-9">
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-gray-500">Full Name</span>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </label>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-[11px] text-gray-500">Phone Number</span>
            <div className="flex gap-2.5">
              <span className="flex h-11 w-[52px] shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[13px] text-gray-700">
                +1
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="(555) 000-0000"
                className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
            </div>
          </label>

          <label className="mt-6 flex items-start gap-3.5">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
            />
            <span className="text-[11px] leading-[1.6] text-gray-500">
              I agree to the{' '}
              <a href="#" className="font-medium text-blue-700 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-700 hover:underline">
                Privacy Policy
              </a>
              , and consent to electronic communications.
            </span>
          </label>

          <button
            type="submit"
            className="mt-7 h-12 w-full cursor-pointer rounded-xl bg-primary text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign Up <span aria-hidden="true">→</span>
          </button>
        </form>
      </main>
    </div>
  )
}

export default Register
