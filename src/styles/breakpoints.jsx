import { css } from 'styled-components'

export const breakpoints = {
  xs: 360,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
}

export const media = {
  up: (key) => (...args) => css`
    @media (min-width: ${breakpoints[key]}px) {
      ${css(...args)}
    }
  `,
  down: (key) => (...args) => css`
    @media (max-width: ${breakpoints[key] - 1}px) {
      ${css(...args)}
    }
  `,
  between: (minKey, maxKey) => (...args) => css`
    @media (min-width: ${breakpoints[minKey]}px) and (max-width: ${breakpoints[maxKey] - 1}px) {
      ${css(...args)}
    }
  `,
}
