import { useState } from 'react'
import { adminLogin } from '@/api/auth'
import { ADMIN_ACCESS_TOKEN_KEY, ADMIN_USER_KEY } from '@/constants/storage'
import type { UserProfile } from '@/types'

function loadAdminUser(): UserProfile | null {
  const saved = localStorage.getItem(ADMIN_USER_KEY)
  if (!saved) return null
  try {
    return JSON.parse(saved)
  } catch {
    localStorage.removeItem(ADMIN_USER_KEY)
    return null
  }
}

function useAdminAuth() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY))
  const [user, setUser] = useState<UserProfile | null>(loadAdminUser)

  const login = async (email: string, password: string) => {
    const session = await adminLogin(email, password)
    localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, session.accessToken)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session.user))
    setAccessToken(session.accessToken)
    setUser(session.user)
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
    setAccessToken(null)
    setUser(null)
  }

  return { isLoggedIn: accessToken !== null, user, login, logout }
}

export default useAdminAuth
