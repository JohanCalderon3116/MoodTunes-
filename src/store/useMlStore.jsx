/* eslint-disable react-refresh/only-export-components */
import { create } from 'zustand'
import {
  ML_EMOTIONS,
  calculateEmotionConfidence,
  getUserMlProfile,
  updatePreferenceVector,
} from '../supabase/mlProfiles'
import { getEmotionEventCounts } from '../supabase/listeningEvents'

const READY_CONFIDENCE = 0.8

const createEmotionMap = (value = 0) => {
  return ML_EMOTIONS.reduce((map, emotion) => {
    map[emotion] = value
    return map
  }, {})
}

const getConfidenceByEmotion = (eventCountsByEmotion) => {
  return ML_EMOTIONS.reduce((map, emotion) => {
    map[emotion] = calculateEmotionConfidence(
      eventCountsByEmotion[emotion] ?? 0,
    )
    return map
  }, {})
}

const mapProfileToState = (profile) => {
  const eventCountsByEmotion = ML_EMOTIONS.reduce((counts, emotion) => {
    counts[emotion] = profile?.[`${emotion}_events`] ?? 0
    return counts
  }, {})

  return {
    confidenceByEmotion: getConfidenceByEmotion(eventCountsByEmotion),
    eventCountsByEmotion,
    preferenceVector: profile?.preference_vector ?? null,
    topGenres: profile?.top_genres ?? [],
    topArtists: profile?.top_artists ?? [],
    totalEvents: profile?.total_events ?? 0,
  }
}

const getLearningMessageByConfidence = (emotion, confidence, events) => {
  const percentage = Math.round(confidence * 100)
  const missing = Math.max(0, 150 - events)

  if (events === 0) {
    return 'Escucha algunas canciones y MoodTunes empezara a aprender tus gustos sin interrumpirte.'
  }

  if (confidence >= READY_CONFIDENCE) {
    return `Listo: ya puedo recomendar para ${emotion} con ${percentage}% de confianza.`
  }

  if (confidence >= 0.7) {
    return `Casi listo para ${emotion}: ${percentage}% de confianza. Faltan cerca de ${missing} escuchas para afinarlo.`
  }

  return `Aprendiendo ${emotion}: ${percentage}% de confianza. Cada cancion escuchada mejora el perfil.`
}

export const useMlStore = create((set, get) => ({
  confidenceByEmotion: createEmotionMap(),
  eventCountsByEmotion: createEmotionMap(),
  preferenceVector: null,
  topGenres: [],
  topArtists: [],
  totalEvents: 0,
  loading: false,
  error: null,

  loadMlProfile: async (userId) => {
    set({ loading: true, error: null })

    try {
      const profile = await getUserMlProfile(userId)
      const nextState = mapProfileToState(profile)

      set({
        ...nextState,
        loading: false,
        error: null,
      })

      return profile
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  recalculateConfidence: (eventCountsByEmotion = get().eventCountsByEmotion) => {
    const confidenceByEmotion = getConfidenceByEmotion(eventCountsByEmotion)
    const totalEvents = Object.values(eventCountsByEmotion).reduce(
      (sum, count) => sum + count,
      0,
    )

    set({
      confidenceByEmotion,
      eventCountsByEmotion,
      totalEvents,
    })

    return confidenceByEmotion
  },

  refreshConfidenceFromEvents: async (userId) => {
    set({ loading: true, error: null })

    try {
      const eventCountsByEmotion = await getEmotionEventCounts(userId)
      const confidenceByEmotion = get().recalculateConfidence(
        eventCountsByEmotion,
      )

      set({ loading: false, error: null })

      return confidenceByEmotion
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  canRecommendEmotion: (emotion) => {
    return (get().confidenceByEmotion[emotion] ?? 0) >= READY_CONFIDENCE
  },

  getReadyEmotions: () => {
    return ML_EMOTIONS.filter((emotion) => get().canRecommendEmotion(emotion))
  },

  getLearningMessage: (emotion) => {
    const { confidenceByEmotion, eventCountsByEmotion, totalEvents } = get()

    if (!totalEvents) {
      return 'Pon musica y deja que MoodTunes aprenda tu energia poco a poco.'
    }

    if (emotion) {
      return getLearningMessageByConfidence(
        emotion,
        confidenceByEmotion[emotion] ?? 0,
        eventCountsByEmotion[emotion] ?? 0,
      )
    }

    const readyEmotions = get().getReadyEmotions()

    if (readyEmotions.length) {
      return `Ya puedo personalizar ${readyEmotions.length} emocion(es). Las demas siguen aprendiendo contigo.`
    }

    const highestConfidence = Math.max(...Object.values(confidenceByEmotion))

    if (highestConfidence >= 0.7) {
      return 'El perfil esta muy cerca de desbloquear recomendaciones emocionales realmente tuyas.'
    }

    return 'MoodTunes esta encontrando patrones en tus escuchas. Sigue sonando, el perfil se afina solo.'
  },

  updatePreferenceVectorInSupabase: async (
    userId,
    { preferenceVector, topGenres, topArtists } = {},
  ) => {
    set({ loading: true, error: null })

    try {
      const profile = await updatePreferenceVector(userId, {
        preferenceVector,
        topGenres,
        topArtists,
      })
      const nextState = mapProfileToState(profile)

      set({
        ...nextState,
        loading: false,
        error: null,
      })

      return profile
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  resetMlState: () => {
    set({
      confidenceByEmotion: createEmotionMap(),
      eventCountsByEmotion: createEmotionMap(),
      preferenceVector: null,
      topGenres: [],
      topArtists: [],
      totalEvents: 0,
      loading: false,
      error: null,
    })
  },
}))

export { READY_CONFIDENCE }
