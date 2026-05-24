import { Navigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuthContext } from '../../context/AuthContext'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: ${({ theme }) => theme.gradients.background};
`

const Panel = styled.section`
  width: min(100%, 420px);
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: ${({ theme }) => theme.glass.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.glass.background};
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
`

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: #1db954;
  animation: ${spin} 720ms linear infinite;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.96rem;
  text-align: center;
`

export const AuthCallbackTemplate = () => {
  const { isAuthenticated, loading, user } = useAuthContext()

  if (!loading && isAuthenticated) {
    return (
      <Navigate
        to={user?.onboarding_completed ? '/' : '/onboarding'}
        replace
      />
    )
  }

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Wrapper>
      <Panel>
        <Spinner aria-label="Procesando login" />
        <Text>Conectando Spotify con MoodTunes...</Text>
      </Panel>
    </Wrapper>
  )
}
