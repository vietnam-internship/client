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
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const returnedState = searchParams.get('state')
    const storedState = consumeStoredOAuthState()
    // state : CSRF 방지를 위한 값으로 로그인 시작 시 저장해둔 값(consumeStoredOAuthState())과 일치하는지 검증
    if (!returnedState || !storedState || returnedState !== storedState) {
      navigate('/login', { replace: true })
      return
    }

    const code = searchParams.get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }
    // 신규 유저
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
