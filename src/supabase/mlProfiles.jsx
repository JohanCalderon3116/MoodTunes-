import { getSupabaseClient } from './client'

export const ML_EMOTIONS = ['happy', 'sad', 'angry', 'relaxed', 'motivated']

const ML_PROFILE_FIELDS = [
  'user_id',
  'preference_vector',
  'happy_events',
  'sad_events',
  'angry_events',
  'relaxed_events',
  'motivated_events',
  'happy_confidence',
  'sad_confidence',
  'angry_confidence',
  'relaxed_confidence',
  'motivated_confidence',
  'top_genres',
  'top_artists',
  'total_events',
  'last_trained_at',
]

const pickMlProfileFields = (profile) => {
  return ML_PROFILE_FIELDS.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(profile, field)) {
      payload[field] = profile[field]
    }

    return payload
  }, {})
}

const assertSupportedEmotion = (emotion) => {
  if (!ML_EMOTIONS.includes(emotion)) {
    throw new Error(`Unsupported emotion: ${emotion}`)
  }
}

export const calculateEmotionConfidence = (events) => {
  return Math.min(0.95, events / (events + 30))
}

export const getUserMlProfile = async (userId) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_ml_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data
}

export const upsertUserMlProfile = async (userId, updates = {}) => {
  const supabase = getSupabaseClient()
  const payload = pickMlProfileFields({
    ...updates,
    user_id: userId,
  })

  const { data, error } = await supabase
    .from('user_ml_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const updateEmotionConfidence = async (userId, emotion, confidence) => {
  assertSupportedEmotion(emotion)

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_ml_profiles')
    .update({ [`${emotion}_confidence`]: confidence })
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const updatePreferenceVector = async (
  userId,
  { preferenceVector, topGenres, topArtists } = {},
) => {
  const payload = {}

  if (preferenceVector !== undefined) {
    payload.preference_vector = preferenceVector
  }

  if (topGenres !== undefined) {
    payload.top_genres = topGenres
  }

  if (topArtists !== undefined) {
    payload.top_artists = topArtists
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_ml_profiles')
    .update(payload)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}
