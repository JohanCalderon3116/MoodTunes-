import { getSupabaseClient } from './client'
import { ML_EMOTIONS } from './mlProfiles'

const LISTENING_EVENT_FIELDS = [
  'user_id',
  'song_id',
  'occurred_at',
  'listened_ms',
  'track_duration_ms',
  'completion_ratio',
  'skipped',
  'repeated',
  'implicit_score',
  'detected_emotion',
  'detector_confidence',
  'detection_method',
  'audio_valence',
  'audio_energy',
  'audio_tempo',
  'audio_danceability',
  'audio_acousticness',
  'audio_instrumentalness',
  'event_context',
]

const createEmptyEmotionCounts = () => {
  return ML_EMOTIONS.reduce((counts, emotion) => {
    counts[emotion] = 0
    return counts
  }, {})
}

const pickListeningEventFields = (event) => {
  return LISTENING_EVENT_FIELDS.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(event, field)) {
      payload[field] = event[field]
    }

    return payload
  }, {})
}

const getCompletionRatio = (listenedMs, trackDurationMs) => {
  if (!trackDurationMs || trackDurationMs <= 0) {
    return 0
  }

  return Math.min(1, Math.max(0, listenedMs / trackDurationMs))
}

export const calculateImplicitScore = ({
  completionRatio,
  skipped = false,
  repeated = false,
}) => {
  let implicitScore = -0.3

  if (skipped) {
    implicitScore = -0.3
  } else if (completionRatio >= 0.8) {
    implicitScore = 1
  } else if (completionRatio >= 0.5) {
    implicitScore = 0.6
  } else if (completionRatio >= 0.3) {
    implicitScore = 0.3
  }

  return repeated ? Math.min(1.5, implicitScore + 0.5) : implicitScore
}

export const insertListeningEvent = async (event) => {
  const supabase = getSupabaseClient()
  const listenedMs = Number(event.listened_ms ?? 0)
  const trackDurationMs = Number(event.track_duration_ms ?? 0)
  const completionRatio = getCompletionRatio(listenedMs, trackDurationMs)
  const skipped = event.skipped ?? completionRatio < 0.3
  const repeated = Boolean(event.repeated)
  const payload = pickListeningEventFields({
    ...event,
    listened_ms: listenedMs,
    track_duration_ms: trackDurationMs,
    completion_ratio: completionRatio,
    skipped,
    repeated,
    implicit_score: calculateImplicitScore({
      completionRatio,
      skipped,
      repeated,
    }),
  })

  const { data, error } = await supabase
    .from('listening_events')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const getRecentListeningEvents = async (userId, limit = 20) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('listening_events')
    .select('*')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return data ?? []
}

export const getListeningEventsByEmotion = async (
  userId,
  emotion,
  { limit = 50 } = {},
) => {
  if (!ML_EMOTIONS.includes(emotion)) {
    throw new Error(`Unsupported emotion: ${emotion}`)
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('listening_events')
    .select('*')
    .eq('user_id', userId)
    .eq('detected_emotion', emotion)
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return data ?? []
}

export const getEmotionEventCounts = async (userId) => {
  const supabase = getSupabaseClient()
  const countEntries = await Promise.all(
    ML_EMOTIONS.map(async (emotion) => {
      const { count, error } = await supabase
        .from('listening_events')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('detected_emotion', emotion)

      if (error) throw new Error(error.message)

      return [emotion, count ?? 0]
    }),
  )

  return countEntries.reduce((counts, [emotion, count]) => {
    counts[emotion] = count
    return counts
  }, createEmptyEmotionCounts())
}

export const getUserListeningStats = async (userId) => {
  const supabase = getSupabaseClient()
  const { data, error, count } = await supabase
    .from('listening_events')
    .select('detected_emotion,song_id,implicit_score,repeated', { count: 'exact' })
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  const emotionCounts = createEmptyEmotionCounts()
  const repeatedSongs = {}
  let implicitScoreTotal = 0
  let scoredEvents = 0
  const events = data ?? []

  events.forEach((event) => {
    if (ML_EMOTIONS.includes(event.detected_emotion)) {
      emotionCounts[event.detected_emotion] += 1
    }

    if (event.repeated && event.song_id) {
      repeatedSongs[event.song_id] = (repeatedSongs[event.song_id] ?? 0) + 1
    }

    if (typeof event.implicit_score === 'number') {
      implicitScoreTotal += event.implicit_score
      scoredEvents += 1
    }
  })

  const mostFrequentEmotion = Object.entries(emotionCounts).reduce(
    (current, next) => (next[1] > current[1] ? next : current),
    [null, 0],
  )
  const mostRepeatedSong = Object.entries(repeatedSongs).reduce(
    (current, next) => (next[1] > current[1] ? next : current),
    [null, 0],
  )

  return {
    total_events: count ?? events.length,
    most_frequent_emotion: mostFrequentEmotion[0],
    most_frequent_emotion_count: mostFrequentEmotion[1],
    most_repeated_song_id: mostRepeatedSong[0],
    most_repeated_song_count: mostRepeatedSong[1],
    average_implicit_score: scoredEvents ? implicitScoreTotal / scoredEvents : 0,
  }
}
