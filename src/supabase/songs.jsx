import { getSupabaseClient } from './client'

export const EMOTION_AUDIO_FEATURE_RANGES = {
  happy: {
    valence: { min: 0.65, max: 1 },
    energy: { min: 0.58, max: 1 },
  },
  sad: {
    valence: { min: 0, max: 0.38 },
    energy: { min: 0, max: 0.45 },
  },
  angry: {
    valence: { min: 0, max: 0.42 },
    energy: { min: 0.82, max: 1 },
  },
  relaxed: {
    valence: { min: 0.52, max: 1 },
    energy: { min: 0, max: 0.46 },
  },
  motivated: {
    valence: { min: 0.55, max: 1 },
    energy: { min: 0.78, max: 1 },
    tempo: { min: 105, max: 210 },
  },
}

const SONG_FIELDS = [
  'spotify_id',
  'spotify_uri',
  'spotify_url',
  'title',
  'artist_names',
  'artist_ids',
  'album_name',
  'album_image_url',
  'duration_ms',
  'valence',
  'energy',
  'tempo',
  'danceability',
  'acousticness',
  'instrumentalness',
  'genres',
  'raw_spotify_data',
]

const pickSongFields = (song) => {
  return SONG_FIELDS.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(song, field)) {
      payload[field] = song[field]
    }

    return payload
  }, {})
}

const applyRange = (query, field, range) => {
  return query.gte(field, range.min).lte(field, range.max)
}

export const getSongBySpotifyId = async (spotifyId) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('spotify_id', spotifyId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data
}

export const upsertSong = async (song) => {
  const supabase = getSupabaseClient()
  const payload = pickSongFields(song)
  const { data, error } = await supabase
    .from('songs')
    .upsert(payload, { onConflict: 'spotify_id' })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const getSongsByEmotion = async (emotion, { limit = 24 } = {}) => {
  const range = EMOTION_AUDIO_FEATURE_RANGES[emotion]

  if (!range) {
    throw new Error(`Unsupported emotion: ${emotion}`)
  }

  const supabase = getSupabaseClient()
  let query = supabase.from('songs').select('*')

  query = applyRange(query, 'valence', range.valence)
  query = applyRange(query, 'energy', range.energy)

  if (range.tempo) {
    query = applyRange(query, 'tempo', range.tempo)
  }

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return data ?? []
}
