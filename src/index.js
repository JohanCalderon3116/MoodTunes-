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

export { AuthOptions } from './components/organismos/AuthOptions'
export { AuthCallbackTemplate } from './components/templates/AuthCallbackTemplate'
export { HomeTemplate } from './components/templates/HomeTemplate'
export { LoginTemplate } from './components/templates/LoginTemplate'
export { OnboardingTemplate } from './components/templates/OnboardingTemplate'
export { AuthContextProvider, useAuthContext } from './context/AuthContext'
export { Layout } from './hooks/Layout'
export { ProtectedRoute } from './hooks/ProtectedRoute'
export { useSpotifySdk } from './hooks/useSpotifySdk'
export { AuthCallback } from './pages/AuthCallback'
export { Home } from './pages/Home'
export { Login } from './pages/Login'
export { Onboarding } from './pages/Onboarding'
export { Myroutes } from './routers/routes'
export { useAppStore } from './store/useAppStore'
export { useAuthStore, SPOTIFY_SCOPES } from './store/useAuthStore'
export { useEmotionStore, EMOTION_REFRESH_INTERVAL_MS } from './store/useEmotionStore'
export { useListeningEventsStore } from './store/useListeningEventsStore'
export { useMlStore, READY_CONFIDENCE } from './store/useMlStore'
export { PLAYBACK_STATE, useSpotifyStore } from './store/useSpotifyStore'
export { useThemeStore } from './store/useThemeStore'
export {
  getSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from './supabase/client'
export {
  calculateImplicitScore,
  getEmotionEventCounts,
  getListeningEventsByEmotion,
  getRecentListeningEvents,
  getUserListeningStats,
  insertListeningEvent,
} from './supabase/listeningEvents'
export {
  ML_EMOTIONS,
  calculateEmotionConfidence,
  getUserMlProfile,
  updateEmotionConfidence,
  updatePreferenceVector,
  upsertUserMlProfile,
} from './supabase/mlProfiles'
export {
  EMOTION_AUDIO_FEATURE_RANGES,
  getSongBySpotifyId,
  getSongsByEmotion,
  upsertSong,
} from './supabase/songs'
export {
  completeUserOnboarding,
  createUser,
  getUserByAuthId,
  getUserWithMlProfile,
  updateUser,
  upsertUserFromAuth,
} from './supabase/users'
export { APP_NAME } from './utils/constants'
