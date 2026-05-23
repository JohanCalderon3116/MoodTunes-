import styled from 'styled-components'

const Wrapper = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: ${({ theme }) => theme.gradients.background};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: 0;
`

export const HomeTemplate = () => {
  return (
    <Wrapper>
      <Title>MoodTunes</Title>
    </Wrapper>
  )
}
