export { GlobalStyles } from './styles/GlobalStyles'
export { darkTheme, lightTheme, themes } from './styles/themes'
export { spacing, radius, zIndex, transitions } from './styles/variables'
export { breakpoints, media } from './styles/breakpoints'
export {
  fadeIn,
  slideUpFade,
  pulseLive,
  shimmer,
  floatSoft,
  musicWave,
  chatSlideIn,
  glowPulseByColor,
} from './styles/keyframes'

export { HomeTemplate } from './components/templates/HomeTemplate'
export { LoginTemplate } from './components/templates/LoginTemplate'
export { OnboardingTemplate } from './components/templates/OnboardingTemplate'
export { AuthOptions } from './components/organismos/AuthOptions'
export { AuthContextProvider, useAuthContext } from './context/AuthContext'
export { Layout } from './hooks/Layout'
export { ProtectedRoute } from './hooks/ProtectedRoute'
export { useSpotifySdk } from './hooks/useSpotifySdk'
export { Home } from './pages/Home'
export { Login } from './pages/Login'
export { Onboarding } from './pages/Onboarding'
export { Myroutes } from './routers/routes'
export { useAuthStore, SPOTIFY_SCOPES } from './store/useAuthStore'
export { useAppStore } from './store/useAppStore'
export { useThemeStore } from './store/useThemeStore'
export {
  getSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from './supabase/client'
export {
  completeUserOnboarding,
  createUser,
  getUserByAuthId,
  getUserWithMlProfile,
  updateUser,
  upsertUserFromAuth,
} from './supabase/users'
export { APP_NAME } from './utils/constants'
