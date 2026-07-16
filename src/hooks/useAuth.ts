import { useState } from 'react'
import { logoutRequest } from '@/api/auth'
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY } from '@/constants/storage'
import type { GoogleLoginResponse, UserProfile } from '@/types'

function loadUser(): UserProfile | null {
  const saved = localStorage.getItem(AUTH_USER_KEY)
  return saved ? JSON.parse(saved) : null
}

function useAuth() {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  )
  const [user, setUser] = useState<UserProfile | null>(loadUser)

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

  return { isLoggedIn: accessToken !== null, user, login, logout }
}

export default useAuth
