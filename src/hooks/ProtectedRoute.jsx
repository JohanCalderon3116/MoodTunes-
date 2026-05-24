import { Navigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuthContext } from '../context/AuthContext'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Centered = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.gradients.background};
`

const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 3px solid ${({ theme }) => theme.glass.background};
  border-top-color: ${({ theme }) => theme.colors.accentPrimary};
  animation: ${spin} 720ms linear infinite;
`

export const ProtectedRoute = ({
  children,
  unauthenticatedOnly = false,
  requireOnboarding = true,
  redirectTo = '/login',
  authenticatedRedirectTo = '/',
  onboardingPath = '/onboarding',
}) => {
  const { isAuthenticated, loading, user } = useAuthContext()

  if (loading) {
    return (
      <Centered>
        <Spinner aria-label="Loading session" />
      </Centered>
    )
  }

  if (unauthenticatedOnly) {
    const authenticatedPath = user?.onboarding_completed
      ? authenticatedRedirectTo
      : onboardingPath

    return isAuthenticated ? (
      <Navigate to={authenticatedPath} replace />
    ) : (
      children
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (requireOnboarding && !user?.onboarding_completed) {
    return <Navigate to={onboardingPath} replace />
  }

  return children
}
