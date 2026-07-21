import { OAUTH_STATE_KEY } from '@/constants/storage'

// CSRF 방지용 state 값을 생성해 sessionStorage에 저장하고, /oauth2/authorization/google
// 쿼리로 전달할 수 있도록 반환한다. 이 값은 Google을 거쳐 콜백에 그대로 되돌아온다.
// 로그인 리다이렉트 직전에 호출
export function markOAuthStarted(): string {
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  return state
}

// 콜백에서 돌아온 state가 이 탭에서 시작한 요청의 state와 일치하는지 검증한다.
// 재사용 방지를 위해 검증 여부와 무관하게 저장된 값은 즉시 삭제한다.
export function consumeOAuthStarted(state: string | null): boolean {
  const saved = sessionStorage.getItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  return saved !== null && state !== null && saved === state
}
