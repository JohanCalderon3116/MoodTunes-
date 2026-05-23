import styled from 'styled-components'
import { AuthOptions } from '../organismos/AuthOptions'

const Wrapper = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: ${({ theme }) => theme.gradients.background};
`

export const LoginTemplate = () => {
  return (
    <Wrapper>
      <AuthOptions />
    </Wrapper>
  )
}
