import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import AuthCallbackPage from '@/pages/AuthCallback/AuthCallbackPage'
import BranchDetailPage from '@/pages/BranchDetail/BranchDetailPage'
import CurrencyDetailPage from '@/pages/CurrencyDetail/CurrencyDetailPage'
import ExchangeHistoryPage from '@/pages/ExchangeHistory/ExchangeHistoryPage'
import HomePage from '@/pages/Home/HomePage'
import MapsPage from '@/pages/Maps/MapsPage'
import SearchPage from '@/pages/Search/SearchPage'
import LoginPage from '@/pages/Login/LoginPage'
import MyPage from '@/pages/MyPage/MyPage'
import MyReservationPage from '@/pages/MyReservation/MyReservationPage'
import RegisterPage from '@/pages/Register/RegisterPage'
import ReservationCancelledPage from '@/pages/ReservationCancelled/ReservationCancelledPage'
import ReservationDetailPage from '@/pages/ReservationDetail/ReservationDetailPage'
import PickupDetailsPage from '@/pages/Reserve/PickupDetailsPage'
import ReviewReservationPage from '@/pages/Reserve/ReviewReservationPage'
import ReservationCompletePage from '@/pages/Reserve/ReservationCompletePage'

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
        <Route path="/auth/callback" element={<AuthCallbackPage onLogin={login} />} />
        <Route path="/register" element={requireAuth(<RegisterPage />)} />
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
