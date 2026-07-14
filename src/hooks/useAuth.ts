import { useState } from 'react'

const AUTH_KEY = 'travelx.loggedIn'

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true',
  )

  const login = () => {
    localStorage.setItem(AUTH_KEY, 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}

export default useAuth
