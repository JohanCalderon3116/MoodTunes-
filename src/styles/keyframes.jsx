import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const slideUpFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const pulseLive = keyframes`
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
`

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

export const floatSoft = keyframes`
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`

export const musicWave = keyframes`
  0%,
  100% {
    transform: scaleY(0.25);
  }
  50% {
    transform: scaleY(1);
  }
`

export const chatSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const glowPulseByColor = (color) => keyframes`
  0%,
  100% {
    box-shadow: 0 0 0 0 ${color}33;
    filter: drop-shadow(0 0 2px ${color}66);
  }
  50% {
    box-shadow: 0 0 24px 6px ${color}55;
    filter: drop-shadow(0 0 14px ${color}aa);
  }
`
