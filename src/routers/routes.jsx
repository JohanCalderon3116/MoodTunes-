import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../hooks/ProtectedRoute'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Onboarding } from '../pages/Onboarding'

export const Myroutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute unauthenticatedOnly>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
