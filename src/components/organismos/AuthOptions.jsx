import { useState } from 'react'
import { FaSpotify } from 'react-icons/fa'
import { toast } from 'sonner'
import styled from 'styled-components'
import { useAuthStore } from '../../store/useAuthStore'
import { floatSoft, musicWave, slideUpFade } from '../../styles/keyframes'
import { APP_NAME } from '../../utils/constants'

const WAVE_BARS = [
  { height: 34, color: '#1db954', delay: '0ms' },
  { height: 72, color: '#38bdf8', delay: '120ms' },
  { height: 48, color: '#f4d35e', delay: '240ms' },
  { height: 86, color: '#1db954', delay: '80ms' },
  { height: 58, color: '#7cd992', delay: '180ms' },
  { height: 76, color: '#f59e0b', delay: '300ms' },
  { height: 42, color: '#38bdf8', delay: '140ms' },
  { height: 68, color: '#1db954', delay: '220ms' },
]

const EMOTION_TONES = ['#f4d35e', '#7fb3ff', '#ef4444', '#7cd992', '#f59e0b']

const Panel = styled.section`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.82fr);
  align-items: center;
  gap: 3rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const Content = styled.div`
  display: grid;
  gap: 1.35rem;
  animation: ${slideUpFade} 620ms ease both;
`

const Title = styled.h1`
  max-width: 9ch;
  color: #f8fafc;
  font-size: 5rem;
  line-height: 0.92;
  font-weight: 800;
  letter-spacing: 0;

  @media (max-width: 767px) {
    font-size: 3.45rem;
  }

  @media (max-width: 420px) {
    font-size: 2.9rem;
  }
`

const TitleAccent = styled.span`
  display: block;
  color: #1db954;
  text-shadow: 0 0 34px rgba(29, 185, 84, 0.34);
`

const Text = styled.p`
  max-width: 560px;
  color: rgba(248, 250, 252, 0.78);
  font-size: 1.18rem;
  line-height: 1.75;

  @media (max-width: 767px) {
    font-size: 1rem;
  }
`

const Actions = styled.div`
  display: grid;
  gap: 0.75rem;
  width: min(100%, 390px);
  margin-top: 0.45rem;
`

const AuthButton = styled.button`
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.95rem 1.3rem;
  border-radius: 8px;
  color: #041009;
  background: #1ed760;
  font-size: 1rem;
  font-weight: 800;
  box-shadow:
    0 18px 42px rgba(29, 185, 84, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.34);
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  svg {
    width: 1.35rem;
    height: 1.35rem;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #29e86c;
    box-shadow:
      0 22px 52px rgba(29, 185, 84, 0.36),
      inset 0 1px 0 rgba(255, 255, 255, 0.42);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }
`

const PremiumNote = styled.p`
  color: rgba(248, 250, 252, 0.54);
  font-size: 0.88rem;
  text-align: center;
`

const VisualStage = styled.div`
  min-height: 480px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03)),
    rgba(5, 10, 8, 0.62);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(18px);
  animation: ${floatSoft} 7s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 16%;
    border: 1px solid rgba(29, 185, 84, 0.22);
    border-radius: 999px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 28%;
    border: 1px solid rgba(56, 189, 248, 0.18);
    border-radius: 999px;
  }

  @media (max-width: 860px) {
    min-height: 290px;
  }
`

const Disc = styled.div`
  width: 220px;
  aspect-ratio: 1;
  position: absolute;
  top: 54px;
  right: 42px;
  border-radius: 999px;
  background:
    radial-gradient(circle at center, #06100a 0 15%, transparent 16%),
    repeating-radial-gradient(circle, rgba(248, 250, 252, 0.13) 0 1px, transparent 1px 10px),
    conic-gradient(from 40deg, #1db954, #38bdf8, #f4d35e, #1db954);
  box-shadow: 0 26px 80px rgba(29, 185, 84, 0.18);
  opacity: 0.9;

  @media (max-width: 860px) {
    width: 150px;
    top: 28px;
    right: 28px;
  }
`

const DiscCore = styled.div`
  width: 58px;
  aspect-ratio: 1;
  position: absolute;
  inset: 0;
  margin: auto;
  border: 10px solid rgba(4, 6, 5, 0.72);
  border-radius: 999px;
  background: #1ed760;
`

const Equalizer = styled.div`
  height: 168px;
  position: absolute;
  left: 42px;
  right: 42px;
  bottom: 46px;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 0.72rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(4, 6, 5, 0.36);

  @media (max-width: 860px) {
    height: 132px;
    left: 22px;
    right: 22px;
    bottom: 22px;
    gap: 0.5rem;
  }
`

const Bar = styled.span`
  width: 18px;
  height: ${({ $height }) => $height}px;
  border-radius: 999px 999px 4px 4px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 22px ${({ $color }) => $color}66;
  transform-origin: bottom;
  animation: ${musicWave} 1.35s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};

  @media (max-width: 480px) {
    width: 13px;
  }
`

const ToneRail = styled.div`
  position: absolute;
  left: 42px;
  top: 48px;
  display: flex;
  gap: 0.55rem;

  @media (max-width: 860px) {
    left: 24px;
    top: 28px;
  }
`

const Tone = styled.span`
  width: 34px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 18px ${({ $color }) => $color}66;
  opacity: 0.88;
`

export const AuthOptions = () => {
  const [pendingProvider, setPendingProvider] = useState(null)
  const loginWithSpotify = useAuthStore((state) => state.loginWithSpotify)

  const handleLogin = async () => {
    try {
      setPendingProvider('spotify')
      await loginWithSpotify()
    } catch (error) {
      toast.error(error.message)
      setPendingProvider(null)
    }
  }

  return (
    <Panel>
      <Content>
        <Title>
          {APP_NAME}
          <TitleAccent>suena contigo</TitleAccent>
        </Title>
        <Text>
          Recomendaciones inteligentes que aprenden tus gustos y se adaptan a tu
          momento sin sacarte del navegador.
        </Text>

        <Actions>
          <AuthButton
            type="button"
            disabled={Boolean(pendingProvider)}
            onClick={handleLogin}
          >
            <FaSpotify />
            Continuar con Spotify
          </AuthButton>
          <PremiumNote>Requieres Spotify Premium</PremiumNote>
        </Actions>
      </Content>

      <VisualStage aria-hidden="true">
        <ToneRail>
          {EMOTION_TONES.map((color) => (
            <Tone key={color} $color={color} />
          ))}
        </ToneRail>
        <Disc>
          <DiscCore />
        </Disc>
        <Equalizer>
          {WAVE_BARS.map((bar) => (
            <Bar
              key={`${bar.color}-${bar.height}-${bar.delay}`}
              $color={bar.color}
              $delay={bar.delay}
              $height={bar.height}
            />
          ))}
        </Equalizer>
      </VisualStage>
    </Panel>
  )
}
