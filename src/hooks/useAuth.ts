import { useEffect, useState } from 'react'
import { logoutRequest } from '@/api/auth'
import { getMyProfile } from '@/api/user'
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY } from '@/constants/storage'
import type { GoogleLoginResponse, UserProfile } from '@/types'

// 앱 초기 렌더링 시 localStorage에서 저장된 유저 정보 읽어옴
// Lazy initialization
function loadUser(): UserProfile | null {
  const saved = localStorage.getItem(AUTH_USER_KEY)
  if (!saved) return null
  try {
    return JSON.parse(saved)
  } catch {
    // 저장된 값이 손상된 경우 — 로그아웃 상태로 초기화
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}
// 로그인 상태(토큰, 유저 정보)를 전역에서 관리
// 새로고침해도 로그인 상태 ㅇ유지되도록
function useAuth() {
  // 초기값을 localStorage에서 읽어옴
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY), 
  )
  const [user, setUser] = useState<UserProfile | null>(loadUser)

  const applyProfile = (profile: UserProfile) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  // 로그인 상태면 GET /users/me로 프로필을 다시 받아와 localStorage 캐시를 서버와 동기화
  // 401이면 http 래퍼가 세션 정리 후 /login으로
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    getMyProfile()
      .then((profile) => {
        if (!cancelled) applyProfile(profile)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [accessToken])

  // 휴대폰 인증 완료 등 서버 쪽 프로필이 바뀐 뒤 전역 상태를 다시 동기화할 때 호출
  const refreshProfile = () => getMyProfile().then(applyProfile)

  // AuthCallbackPage에서 토큰 교환 성공 시 호출됨
  const login = (session: GoogleLoginResponse) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user))
    setAccessToken(session.accessToken)
    setUser(session.user)
  }

  const logout = () => {
    logoutRequest().catch(() => {})
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setAccessToken(null)
    setUser(null)
  }
  
  return { isLoggedIn: accessToken !== null, user, login, logout, refreshProfile }
}

export default useAuth
