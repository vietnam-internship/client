import { useState } from 'react'
import { AUTH_STORAGE_KEY } from '@/constants/storage'

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true',
  )

  const login = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}

export default useAuth
