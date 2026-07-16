import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeGoogleCode } from '@/api/auth'
import PageLayout from '@/components/PageLayout'
import { consumeStoredOAuthState } from '@/utils/oauth'
import type { GoogleLoginResponse } from '@/types'

interface AuthCallbackPageProps {
  onLogin: (session: GoogleLoginResponse) => void
}

function AuthCallbackPage({ onLogin }: AuthCallbackPageProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // The authorization code is single-use, so guard against duplicate effect runs
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    // Consume (and clear) the stashed state up front regardless of outcome,
    // so a stale/leftover value can never be reused by a later attempt.
    const returnedState = searchParams.get('state')
    const storedState = consumeStoredOAuthState()

    if (!returnedState || !storedState || returnedState !== storedState) {
      navigate('/login', { replace: true })
      return
    }

    const code = searchParams.get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }

    exchangeGoogleCode(code)
      .then((session) => {
        onLogin(session)
        navigate(session.isNewUser ? '/register' : '/', { replace: true })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
  }, [searchParams, navigate, onLogin])

  return (
    <PageLayout>
      <main className="flex flex-1 items-center justify-center">
        <p className="text-[13px] text-gray-400">Signing you in…</p>
      </main>
    </PageLayout>
  )
}

export default AuthCallbackPage
