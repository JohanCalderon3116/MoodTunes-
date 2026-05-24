import styled from 'styled-components'
import { AuthOptions } from '../organismos/AuthOptions'
import { fadeIn, shimmer } from '../../styles/keyframes'

const Wrapper = styled.main`
  min-height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 2rem;
  background:
    linear-gradient(115deg, rgba(29, 185, 84, 0.18) 0%, rgba(8, 16, 28, 0) 34%),
    linear-gradient(235deg, rgba(56, 189, 248, 0.15) 0%, rgba(8, 16, 28, 0) 38%),
    linear-gradient(135deg, #040605 0%, #07110b 36%, #0b1020 72%, #040605 100%);
  background-size: 180% 180%;
  animation: ${shimmer} 28s ease-in-out infinite alternate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 78%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 34%;
    background: linear-gradient(to top, rgba(4, 6, 5, 0.88), rgba(4, 6, 5, 0));
    pointer-events: none;
  }

  @media (max-width: 767px) {
    min-height: 100svh;
    padding: 1.25rem;
  }
`

const Shell = styled.div`
  width: min(100%, 1120px);
  position: relative;
  z-index: 1;
  margin: 0 auto;
  animation: ${fadeIn} 520ms ease both;
`

export const LoginTemplate = () => {
  return (
    <Wrapper>
      <Shell>
        <AuthOptions />
      </Shell>
    </Wrapper>
  )
}
