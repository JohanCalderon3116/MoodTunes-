import { create } from 'zustand'
import { getSupabaseClient, supabase } from '../supabase/client'

export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
  'user-modify-playback-state',
  'user-read-playback-state',
]

const getRedirectTo = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.location.origin
}

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  spotifyToken: null,
  loading: true,
  authError: null,

  setAuthState: ({ session = null, user = null, spotifyToken = null }) => {
    set({
      session,
      user,
      spotifyToken,
      loading: false,
      authError: null,
    })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setAuthError: (authError) => {
    set({ authError, loading: false })
  },

  clearAuthState: () => {
    set({
      session: null,
      user: null,
      spotifyToken: null,
      loading: false,
      authError: null,
    })
  },

  loginWithGoogle: async () => {
    const supabaseClient = getSupabaseClient()
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectTo(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) throw new Error(error.message)
  },

  loginWithSpotify: async () => {
    const supabaseClient = getSupabaseClient()
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: getRedirectTo(),
        scopes: SPOTIFY_SCOPES.join(' '),
      },
    })

    if (error) throw new Error(error.message)
  },

  logout: async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut()

      if (error) throw new Error(error.message)
    }

    get().clearAuthState()
  },

  getSpotifyToken: async () => {
    const currentToken = get().spotifyToken

    if (currentToken) {
      return currentToken
    }

    if (!supabase) {
      return null
    }

    const { data, error } = await supabase.auth.getSession()

    if (error) throw new Error(error.message)

    const spotifyToken = data.session?.provider_token ?? null

    set({
      session: data.session ?? null,
      spotifyToken,
    })

    return spotifyToken
  },
}))
