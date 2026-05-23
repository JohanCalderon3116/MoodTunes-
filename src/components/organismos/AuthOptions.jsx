import { useState } from 'react'
import { FaGoogle, FaSpotify } from 'react-icons/fa'
import { toast } from 'sonner'
import styled from 'styled-components'
import { useAuthStore } from '../../store/useAuthStore'

const Panel = styled.section`
  width: min(100%, 420px);
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.glass.background};
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
`

const Header = styled.div`
  display: grid;
  gap: 0.4rem;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
`

const ButtonGroup = styled.div`
  display: grid;
  gap: 0.75rem;
`

const AuthButton = styled.button`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textOnAccent};
  background: ${({ $provider, theme }) =>
    $provider === 'spotify' ? '#1db954' : theme.colors.bg3};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }
`

export const AuthOptions = () => {
  const [pendingProvider, setPendingProvider] = useState(null)
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
  const loginWithSpotify = useAuthStore((state) => state.loginWithSpotify)

  const handleLogin = async (provider) => {
    const login = provider === 'spotify' ? loginWithSpotify : loginWithGoogle

    try {
      setPendingProvider(provider)
      await login()
    } catch (error) {
      toast.error(error.message)
      setPendingProvider(null)
    }
  }

  return (
    <Panel>
      <Header>
        <Title>MoodTunes</Title>
        <Text>Conecta tu cuenta para activar recomendaciones y reproduccion en el navegador.</Text>
      </Header>

      <ButtonGroup>
        <AuthButton
          type="button"
          $provider="spotify"
          disabled={Boolean(pendingProvider)}
          onClick={() => handleLogin('spotify')}
        >
          <FaSpotify />
          Spotify
        </AuthButton>

        <AuthButton
          type="button"
          $provider="google"
          disabled={Boolean(pendingProvider)}
          onClick={() => handleLogin('google')}
        >
          <FaGoogle />
          Google
        </AuthButton>
      </ButtonGroup>
    </Panel>
  )
}
