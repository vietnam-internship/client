import { OAUTH_STATE_KEY } from '@/constants/storage'

// Google OAuth 콜백이 이 탭에서 시작된 요청인지 검증하기 위한 플래그
// 이 탭에서 시작한 로그인인지 확인

// 로그인 리다이렉트 직전에 호출
export function markOAuthStarted(): void {
  sessionStorage.setItem(OAUTH_STATE_KEY, 'in-progress')
}

// 플래그 읽고 즉시 삭제
export function consumeOAuthStarted(): boolean {
  const started = sessionStorage.getItem(OAUTH_STATE_KEY) !== null
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  return started
}
