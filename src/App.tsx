import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import BranchDetailPage from '@/pages/BranchDetailPage'
import CurrencyDetailPage from '@/pages/CurrencyDetailPage'
import ExchangeHistoryPage from '@/pages/ExchangeHistoryPage'
import HomePage from '@/pages/HomePage'
import MapsPage from '@/pages/MapsPage'
import SearchPage from '@/pages/SearchPage'
import LoginPage from '@/pages/LoginPage'
import MyPage from '@/pages/MyPage'
import MyReservationPage from '@/pages/MyReservationPage'
import RegisterPage from '@/pages/RegisterPage'
import ReservationCancelledPage from '@/pages/ReservationCancelledPage'
import ReservationDetailPage from '@/pages/ReservationDetailPage'
import PickupDetailsPage from '@/pages/PickupDetailsPage'
import ReviewReservationPage from '@/pages/ReviewReservationPage'
import ReservationCompletePage from '@/pages/ReservationCompletePage'

function App() {
  const { isLoggedIn, login, logout } = useAuth()

  const requireAuth = (element: ReactNode) =>
    isLoggedIn ? element : <Navigate to="/login" replace />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={requireAuth(<HomePage />)} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage onComplete={login} />} />
        <Route path="/mypage" element={requireAuth(<MyPage onLogout={logout} />)} />
        <Route path="/mypage/reservations" element={requireAuth(<MyReservationPage />)} />
        <Route
          path="/mypage/reservations/:id"
          element={requireAuth(<ReservationDetailPage />)}
        />
        <Route
          path="/mypage/reservations/:id/cancelled"
          element={requireAuth(<ReservationCancelledPage />)}
        />
        <Route path="/mypage/history" element={requireAuth(<ExchangeHistoryPage />)} />
        <Route path="/search" element={requireAuth(<SearchPage />)} />
        <Route path="/currency/:code" element={requireAuth(<CurrencyDetailPage />)} />
        <Route path="/branch/:id" element={requireAuth(<BranchDetailPage />)} />
        <Route path="/maps" element={requireAuth(<MapsPage />)} />
        <Route path="/reserve/:id" element={requireAuth(<PickupDetailsPage />)} />
        <Route path="/reserve/:id/review" element={requireAuth(<ReviewReservationPage />)} />
        <Route
          path="/reserve/:id/complete"
          element={requireAuth(<ReservationCompletePage />)}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
