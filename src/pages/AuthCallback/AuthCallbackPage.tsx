import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeGoogleCode } from '@/api/auth'
import PageLayout from '@/components/PageLayout'
import { consumeOAuthStarted } from '@/utils/oauth'
import type { GoogleLoginResponse } from '@/types'

interface AuthCallbackPageProps {
  onLogin: (session: GoogleLoginResponse) => void
}
// 리다이렉트시키는 중간 페이지
function AuthCallbackPage({ onLogin }: AuthCallbackPageProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    // 이 탭에서 시작한 로그인 플로우인지 state로 검증 (저장된 값은 읽는 즉시 소멸 — 재진입 방지)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    if (!consumeOAuthStarted(state) || !code) {
      navigate('/login?error=oauth', { replace: true })
      return
    }
    // 백엔드에 authorization code 보내 실제 accessToken으로 교환
    exchangeGoogleCode(code)
      .then((session) => {
        onLogin(session)
        // 신규 유저는 프로필 완성(휴대폰 인증) 화면으로 유도
        navigate(session.isNewUser ? '/register' : '/', { replace: true })
      })
      .catch(() => {
        navigate('/login?error=oauth', { replace: true })
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
