import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => theme.mode};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    width: 100%;
    min-height: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    transition:
      background-color ${({ theme }) => theme.transitions.normal},
      color ${({ theme }) => theme.transitions.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a,
  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  ul,
  ol {
    list-style: none;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentPrimary};
    color: ${({ theme }) => theme.colors.textOnAccent};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.accentPrimary} ${({ theme }) => theme.colors.bg2};
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg2};
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 999px;
    border: 2px solid ${({ theme }) => theme.colors.bg2};
    background: ${({ theme }) => theme.colors.accentPrimary};
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accentSecondary};
  }
`
