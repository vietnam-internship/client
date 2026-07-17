import { useState } from 'react'

/** Mock admin session flag until the admin auth API is available. */
const ADMIN_AUTH_KEY = 'travelx.adminLoggedIn'

function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === 'true',
  )

  const login = () => {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY)
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}

export default useAdminAuth
