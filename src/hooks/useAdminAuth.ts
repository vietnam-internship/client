import type { UserProfile } from '@/types'

/**
 * 별도 관리자 로그인 API는 없다 — 기존 Google OAuth + JWT 세션의 role 클레임이
 * 'ADMIN'인지로만 관리자 화면 접근을 가른다.
 */
function useAdminAuth(user: UserProfile | null) {
  return { isLoggedIn: user?.role === 'ADMIN' }
}

export default useAdminAuth
