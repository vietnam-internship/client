import { useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ExchangeHistory from './pages/ExchangeHistory'
import Home from './pages/Home'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import MyReservation from './pages/MyReservation'
import Register from './pages/Register'
import ReservationCancelled from './pages/ReservationCancelled'
import ReservationDetail from './pages/ReservationDetail'

const AUTH_KEY = 'travelx.loggedIn'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true',
  )

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsLoggedIn(false)
  }

  const requireAuth = (element: ReactNode) =>
    isLoggedIn ? element : <Navigate to="/login" replace />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={requireAuth(<Home />)} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/register" element={<Register onComplete={handleLogin} />} />
        <Route path="/mypage" element={requireAuth(<MyPage onLogout={handleLogout} />)} />
        <Route path="/mypage/reservations" element={requireAuth(<MyReservation />)} />
        <Route path="/mypage/reservations/:id" element={requireAuth(<ReservationDetail />)} />
        <Route
          path="/mypage/reservations/:id/cancelled"
          element={requireAuth(<ReservationCancelled />)}
        />
        <Route path="/mypage/history" element={requireAuth(<ExchangeHistory />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
