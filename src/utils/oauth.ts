import { OAUTH_STATE_KEY } from '@/constants/storage'

// Google OAuth state 파라미터 — 이 탭에서 시작된 로그인인지 검증하는 CSRF 방지용 값.
// 서버(GoogleOAuth2Controller)는 이 값을 만들지 않고 그대로 relay만 하므로, 프론트가 만들어서
// /oauth2/authorization/google?state=... 에 실어 보내고, 콜백에서 저장해둔 값과 비교해야 한다.

// 로그인 리다이렉트 직전에 호출 — 생성한 state를 저장하고 그대로 반환한다.
export function markOAuthStarted(): string {
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  return state
}

// 콜백으로 돌아온 state가 이 탭에서 만든 값과 일치하는지 확인하고 즉시 삭제한다.
export function consumeOAuthStarted(state: string | null): boolean {
  const saved = sessionStorage.getItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  return saved !== null && state !== null && saved === state
}
