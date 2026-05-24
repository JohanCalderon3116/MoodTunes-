/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../supabase/client'
import { upsertUserFromAuth } from '../supabase/users'
import { useAuthStore } from '../store/useAuthStore'
import { useEmotionStore } from '../store/useEmotionStore'
import { useListeningEventsStore } from '../store/useListeningEventsStore'
import { useMlStore } from '../store/useMlStore'
import { useSpotifyStore } from '../store/useSpotifyStore'

const AuthContext = createContext(null)
const AUTH_CALLBACK_PATH = '/auth/callback'
const LOGIN_PATH = '/login'

const getAuthenticatedPath = (user) => {
  return user?.onboarding_completed ? '/' : '/onboarding'
}

const shouldRedirectAuthenticatedUser = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return [AUTH_CALLBACK_PATH, LOGIN_PATH].includes(window.location.pathname)
}

const resetDomainStores = () => {
  useEmotionStore.getState().resetEmotionState()
  useListeningEventsStore.getState().resetListeningEventsState()
  useMlStore.getState().resetMlState()
  useSpotifyStore.getState().resetSpotifyState()
}

const hydrateDomainStores = (user) => {
  useEmotionStore
    .getState()
    .setCameraEnabled(Boolean(user.camera_detection_enabled))
  useMlStore
    .getState()
    .loadMlProfile(user.id)
    .catch(() => null)
}

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const session = useAuthStore((state) => state.session)
  const user = useAuthStore((state) => state.user)
  const spotifyToken = useAuthStore((state) => state.spotifyToken)
  const loading = useAuthStore((state) => state.loading)
  const authError = useAuthStore((state) => state.authError)
  const setAuthState = useAuthStore((state) => state.setAuthState)
  const setAuthError = useAuthStore((state) => state.setAuthError)
  const setLoading = useAuthStore((state) => state.setLoading)
  const clearAuthState = useAuthStore((state) => state.clearAuthState)

  useEffect(() => {
    let isMounted = true

    const syncSession = async (nextSession, { shouldRedirect = false } = {}) => {
      if (!isMounted) return

      setLoading(true)

      if (!nextSession?.user) {
        clearAuthState()
        resetDomainStores()
        return
      }

      try {
        const appUser = await upsertUserFromAuth(nextSession.user)
        const nextSpotifyToken = nextSession.provider_token ?? null

        if (!isMounted) return

        setAuthState({
          session: nextSession,
          user: appUser,
          spotifyToken: nextSpotifyToken,
        })
        hydrateDomainStores(appUser)

        if (shouldRedirect || shouldRedirectAuthenticatedUser()) {
          navigate(getAuthenticatedPath(appUser), { replace: true })
        }
      } catch (error) {
        if (!isMounted) return

        setAuthError(error.message)
      }
    }

    if (!isSupabaseConfigured) {
      clearAuthState()
      return () => {
        isMounted = false
      }
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthError(error.message)
        return
      }

      syncSession(data.session, {
        shouldRedirect: shouldRedirectAuthenticatedUser(),
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      syncSession(nextSession, {
        shouldRedirect: event === 'SIGNED_IN',
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [clearAuthState, navigate, setAuthError, setAuthState, setLoading])

  const value = useMemo(
    () => ({
      session,
      user,
      spotifyToken,
      loading,
      authError,
      isAuthenticated: Boolean(session && user),
    }),
    [authError, loading, session, spotifyToken, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthContextProvider')
  }

  return context
}
