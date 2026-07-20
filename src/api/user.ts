import { http } from '@/utils/http'
import type { UserProfile } from '@/types'

/** GET /users/me — 내 프로필 조회. 이름/이메일은 Google 계정 값으로 읽기 전용. */
export function getMyProfile(): Promise<UserProfile> {
  return http<UserProfile>('/users/me')
}
