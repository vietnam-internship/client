import { useSearchParams } from 'react-router-dom'
import PageLayout from '@/components/PageLayout'
import { API_BASE_URL } from '@/constants/api'
import { markOAuthStarted } from '@/utils/oauth'
import txLogo from '@/assets/tx_logo.svg'

function GoogleIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0"
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

function LoginPage() {
  const [searchParams] = useSearchParams()
  const errorParam = searchParams.get('error')
  // oauth: 구글 로그인 플로우 실패 / session: 토큰 만료·무효로 401을 받아 로그아웃된 경우
  const errorMessage =
    errorParam === 'oauth'
      ? 'Google 로그인에 실패했어요. 잠시 후 다시 시도해주세요.'
      : errorParam === 'session'
        ? '로그인이 만료됐어요. 다시 로그인해주세요.'
        : null

  const handleGoogleLogin = () => {
    const state = markOAuthStarted() // CSRF 방지용 state 생성 — 콜백에서 이 값과 비교해 검증
    // 백엔드의 OAuth 엔드포인트로 이동
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google?state=${encodeURIComponent(state)}`
  }

  return (
    <PageLayout className="relative text-center">
      <header className="absolute top-0 left-0 p-4">
      
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
        <img src={txLogo} alt="TravelX logo" className="w-[84px]" />

        <h1 className="mt-6 text-[22px] leading-[1.3] font-bold text-gray-900">
          TravelX
        </h1>
        <p className="mt-3 max-w-[260px] text-sm leading-[1.55] text-gray-500">
          Your gateway to seamless global currency exchange
        </p>

        {errorMessage && (
          <p className="mt-8 w-full rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`${errorMessage ? 'mt-4' : 'mt-11'} flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-gray-200 bg-white text-[15px] font-semibold text-gray-700 transition-colors hover:bg-gray-50`}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-7 text-[13px] text-gray-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="cursor-pointer font-bold text-blue-700 hover:underline"
          >
            Sign up for TravelX
          </button>
        </p>

        <p className="mt-3.5 text-[11px] text-gray-400">🔒 Bank-level security</p>
      </main>
    </PageLayout>
  )
}

export default LoginPage
