import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPhoneCode, requestPhoneCode } from '@/api/auth'
import Header from '@/components/Header'
import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

function RegisterPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCode = async () => {
    if (!phone.trim() || pending) return
    setPending(true)
    setError(null)
    try {
      await requestPhoneCode(phone)
      setCodeSent(true)
    } catch {
      setError('Failed to send the verification code. Please try again.')
    } finally {
      setPending(false)
    }
  }

  const handleConfirmCode = async () => {
    if (!code.trim() || pending) return
    setPending(true)
    setError(null)
    try {
      const result = await confirmPhoneCode(phone, code)
      if (result.verified) {
        setVerified(true)
      } else {
        setError('The verification code does not match.')
      }
    } catch {
      setError('The verification code does not match.')
    } finally {
      setPending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!verified) return
    navigate('/', { replace: true })
  }

  return (
    <PageLayout>
      <Header />

      <main className="flex-1 px-4">
        <h1 className="mt-5 text-[20px] font-bold text-gray-900">Complete your profile</h1>
        <p className="mt-1 text-[12px] text-gray-500">
          Enter your details to get started with TravelX
        </p>

        <ProfileCard className="mt-6" title="Signed in with Google" email="john.doe@gmail.com" />

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={verified}
                placeholder="(555) 000-0000"
                className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              />
              {!verified && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={pending || !phone.trim()}
                  className="h-11 shrink-0 cursor-pointer rounded-lg bg-primary px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
                >
                  {codeSent ? 'Resend' : 'Send code'}
                </button>
              )}
            </div>
          </label>

          {codeSent && !verified && (
            <div className="mt-3 flex gap-2.5">
              <input
                type="text"
                inputMode="numeric"
                name="verificationCode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Verification code"
                className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleConfirmCode}
                disabled={pending || !code.trim()}
                className="h-11 shrink-0 cursor-pointer rounded-lg bg-primary px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
              >
                Verify
              </button>
            </div>
          )}

          {verified && (
            <p className="mt-2 text-[12px] font-medium text-green-600">
              Phone number verified
            </p>
          )}
          {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}

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
            disabled={!verified}
            className="mt-7 h-12 w-full cursor-pointer rounded-xl bg-primary text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
          >
            Sign Up <span aria-hidden="true">→</span>
          </button>
        </form>
      </main>
    </PageLayout>
  )
}

export default RegisterPage
