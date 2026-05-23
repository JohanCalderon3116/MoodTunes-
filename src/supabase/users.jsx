import { getSupabaseClient } from './client'

const mapAuthUserToProfile = (authUser) => {
  const metadata = authUser?.user_metadata ?? {}

  return {
    id: authUser.id,
    email: authUser.email ?? null,
    spotify_user_id: metadata.provider_id ?? metadata.sub ?? null,
    display_name: metadata.full_name ?? metadata.name ?? metadata.user_name ?? null,
    avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
    country: metadata.country ?? null,
    spotify_product: metadata.product ?? null,
  }
}

const mapOnboardingItems = (items = []) => {
  return items.map((item) => {
    if (typeof item === 'string') {
      return {
        name: item,
        score: 1,
      }
    }

    return item
  })
}

export const getUserByAuthId = async (authId) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', authId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data
}

export const createUser = async (authUser) => {
  const supabase = getSupabaseClient()
  const profile = mapAuthUserToProfile(authUser)
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const upsertUserFromAuth = async (authUser) => {
  const supabase = getSupabaseClient()
  const profile = mapAuthUserToProfile(authUser)
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const updateUser = async (authId, updates) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', authId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const completeUserOnboarding = async (
  authId,
  { genres = [], artists = [], cameraDetectionEnabled = false } = {},
) => {
  const supabase = getSupabaseClient()
  const completedAt = new Date().toISOString()

  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .update({
      onboarding_completed: true,
      onboarding_completed_at: completedAt,
      camera_detection_enabled: cameraDetectionEnabled,
    })
    .eq('id', authId)
    .select('*')
    .single()

  if (userError) throw new Error(userError.message)

  const { error: mlError } = await supabase
    .from('user_ml_profiles')
    .upsert(
      {
        user_id: authId,
        top_genres: mapOnboardingItems(genres),
        top_artists: mapOnboardingItems(artists),
      },
      { onConflict: 'user_id' },
    )

  if (mlError) throw new Error(mlError.message)

  return user
}

export const getUserWithMlProfile = async (authId) => {
  const supabase = getSupabaseClient()

  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', authId)
    .maybeSingle()

  if (userError) throw new Error(userError.message)

  if (!user) {
    return null
  }

  const { data: mlProfile, error: mlError } = await supabase
    .from('user_ml_profiles')
    .select('*')
    .eq('user_id', authId)
    .maybeSingle()

  if (mlError) throw new Error(mlError.message)

  return {
    ...user,
    ml_profile: mlProfile,
  }
}
