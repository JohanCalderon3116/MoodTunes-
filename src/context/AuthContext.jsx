/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from 'react'
import { isSupabaseConfigured, supabase } from '../supabase/client'
import { createUser, getUserByAuthId } from '../supabase/users'
import { useAuthStore } from '../store/useAuthStore'

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
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

    const syncSession = async (nextSession) => {
      if (!isMounted) return

      setLoading(true)

      if (!nextSession?.user) {
        clearAuthState()
        return
      }

      try {
        const existingUser = await getUserByAuthId(nextSession.user.id)
        const appUser = existingUser ?? (await createUser(nextSession.user))
        const nextSpotifyToken = nextSession.provider_token ?? null

        if (!isMounted) return

        setAuthState({
          session: nextSession,
          user: appUser,
          spotifyToken: nextSpotifyToken,
        })
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

      syncSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncSession(nextSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [clearAuthState, setAuthError, setAuthState, setLoading])

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
