import styled from 'styled-components'

const Wrapper = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: ${({ theme }) => theme.gradients.background};
`

const Panel = styled.section`
  width: min(100%, 520px);
  display: grid;
  gap: 0.6rem;
  padding: 1.25rem;
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.glass.background};
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const OnboardingTemplate = () => {
  return (
    <Wrapper>
      <Panel>
        <Title>Prepara tu perfil musical</Title>
        <Text>El onboarding inicial vivira aqui en el siguiente paso del flujo.</Text>
      </Panel>
    </Wrapper>
  )
}
