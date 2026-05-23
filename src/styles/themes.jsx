import { radius, transitions } from './variables'

const emotionPalette = {
  happy: '#f4d35e',
  sad: '#7fb3ff',
  angry: '#ef4444',
  relaxed: '#7cd992',
  motivated: '#f59e0b',
}

const semanticPalette = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}

const commonTokens = {
  emotion: emotionPalette,
  semantic: semanticPalette,
  radius,
  transitions,
}

export const darkTheme = {
  mode: 'dark',
  colors: {
    bg: '#0b1020',
    bg2: '#11182e',
    bg3: '#17203b',
    bg4: '#212a4a',
    accentPrimary: '#8b5cf6',
    accentSecondary: '#a78bfa',
    textPrimary: '#f8fafc',
    textSecondary: '#d5dded',
    textMuted: '#93a0be',
    textOnAccent: '#ffffff',
    ...emotionPalette,
    ...semanticPalette,
  },
  gradients: {
    background: 'radial-gradient(circle at 16% 12%, #1f2a52 0%, #0b1020 45%, #070b16 100%)',
    accent: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 45%, #c4b5fd 100%)',
    glass: 'linear-gradient(140deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    blur: '14px',
  },
  shadows: {
    xs: '0 4px 10px rgba(2, 6, 23, 0.28)',
    sm: '0 8px 24px rgba(2, 6, 23, 0.34)',
    md: '0 16px 40px rgba(2, 6, 23, 0.42)',
    glow: '0 0 28px rgba(139, 92, 246, 0.45)',
  },
  ...commonTokens,
}

export const lightTheme = {
  mode: 'light',
  colors: {
    bg: '#f3f5fb',
    bg2: '#e7ebf6',
    bg3: '#dbe2f0',
    bg4: '#ced8eb',
    accentPrimary: '#7c3aed',
    accentSecondary: '#a78bfa',
    textPrimary: '#101828',
    textSecondary: '#344054',
    textMuted: '#667085',
    textOnAccent: '#ffffff',
    ...emotionPalette,
    ...semanticPalette,
  },
  gradients: {
    background: 'radial-gradient(circle at 14% 10%, #dfe6fb 0%, #f3f5fb 45%, #e8edf8 100%)',
    accent: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #c4b5fd 100%)',
    glass: 'linear-gradient(140deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.56)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    blur: '14px',
  },
  shadows: {
    xs: '0 2px 8px rgba(15, 23, 42, 0.08)',
    sm: '0 8px 22px rgba(15, 23, 42, 0.12)',
    md: '0 14px 34px rgba(15, 23, 42, 0.16)',
    glow: '0 0 20px rgba(124, 58, 237, 0.28)',
  },
  ...commonTokens,
}

export const themes = {
  dark: darkTheme,
  light: lightTheme,
}
