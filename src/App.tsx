import { useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BranchDetail from '@/pages/BranchDetail'
import CurrencyDetail from '@/pages/CurrencyDetail'
import ExchangeHistory from '@/pages/ExchangeHistory'
import Home from '@/pages/Home'
import Maps from '@/pages/Maps'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import MyPage from '@/pages/MyPage'
import MyReservation from '@/pages/MyReservation'
import Register from '@/pages/Register'
import ReservationCancelled from '@/pages/ReservationCancelled'
import ReservationDetail from '@/pages/ReservationDetail'
import PickupDetails from '@/pages/Reserve/PickupDetails'
import ReviewReservation from '@/pages/Reserve/ReviewReservation'
import ReservationComplete from '@/pages/Reserve/ReservationComplete'

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
        <Route path="/search" element={requireAuth(<Search />)} />
        <Route path="/currency/:code" element={requireAuth(<CurrencyDetail />)} />
        <Route path="/branch/:id" element={requireAuth(<BranchDetail />)} />
        <Route path="/maps" element={requireAuth(<Maps />)} />
        <Route path="/reserve/:id" element={requireAuth(<PickupDetails />)} />
        <Route path="/reserve/:id/review" element={requireAuth(<ReviewReservation />)} />
        <Route path="/reserve/:id/complete" element={requireAuth(<ReservationComplete />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
