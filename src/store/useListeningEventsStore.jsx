import { create } from 'zustand'
import {
  calculateImplicitScore,
  getRecentListeningEvents,
  insertListeningEvent,
} from '../supabase/listeningEvents'
import { useEmotionStore } from './useEmotionStore'
import { useMlStore } from './useMlStore'

const getTrackDurationMs = (song) => {
  return song?.duration_ms ?? song?.durationMs ?? 0
}

const getAudioFeatures = (song) => {
  return {
    audio_valence: song?.valence ?? null,
    audio_energy: song?.energy ?? null,
    audio_tempo: song?.tempo ?? null,
    audio_danceability: song?.danceability ?? null,
    audio_acousticness: song?.acousticness ?? null,
    audio_instrumentalness: song?.instrumentalness ?? null,
  }
}

const getCompletionRatio = (listenedMs, trackDurationMs) => {
  if (!trackDurationMs || trackDurationMs <= 0) {
    return 0
  }

  return Math.min(1, Math.max(0, listenedMs / trackDurationMs))
}

export const useListeningEventsStore = create((set, get) => ({
  activeTracking: null,
  recentEvents: [],
  lastSavedEvent: null,
  trackingStatus: 'idle',
  error: null,

  startTracking: ({
    userId,
    song,
    songId = song?.id,
    positionMs = 0,
    emotionSnapshot,
    eventContext = {},
  }) => {
    const emotionState = useEmotionStore.getState()
    const detectedEmotion =
      emotionSnapshot?.currentEmotion ?? emotionState.currentEmotion
    const detectorConfidence =
      emotionSnapshot?.detectorConfidence ?? emotionState.detectorConfidence
    const detectionMethod =
      emotionSnapshot?.detectionMethod ?? emotionState.detectionMethod

    set({
      activeTracking: {
        userId,
        song,
        songId,
        startedAt: new Date().toISOString(),
        startedPositionMs: positionMs,
        detectedEmotion,
        detectorConfidence,
        detectionMethod,
        eventContext,
        repeated: false,
      },
      trackingStatus: 'tracking',
      error: null,
    })
  },

  registerRepeat: () => {
    set((state) => ({
      activeTracking: state.activeTracking
        ? {
            ...state.activeTracking,
            repeated: true,
          }
        : null,
    }))
  },

  calculateImplicitScore: ({
    listenedMs,
    trackDurationMs,
    skipped = false,
    repeated = false,
  }) => {
    return calculateImplicitScore({
      completionRatio: getCompletionRatio(listenedMs, trackDurationMs),
      skipped,
      repeated,
    })
  },

  stopTracking: async ({
    positionMs,
    endedAt = new Date().toISOString(),
    skipped = false,
    repeated = false,
    eventContext = {},
  } = {}) => {
    const tracking = get().activeTracking

    if (!tracking) {
      return null
    }

    set({ trackingStatus: 'saving', error: null })

    try {
      if (!tracking.userId) {
        throw new Error('Missing user_id for listening event')
      }

      if (!tracking.songId) {
        throw new Error('Missing song_id for listening event')
      }

      const trackDurationMs = getTrackDurationMs(tracking.song)
      const fallbackListenedMs =
        new Date(endedAt).getTime() - new Date(tracking.startedAt).getTime()
      const listenedMs =
        positionMs !== undefined
          ? Math.max(0, positionMs - tracking.startedPositionMs)
          : Math.max(0, fallbackListenedMs)
      const completionRatio = getCompletionRatio(listenedMs, trackDurationMs)
      const wasSkipped = skipped || completionRatio < 0.3
      const wasRepeated = repeated || tracking.repeated
      const payload = {
        user_id: tracking.userId,
        song_id: tracking.songId,
        occurred_at: endedAt,
        listened_ms: listenedMs,
        track_duration_ms: trackDurationMs,
        skipped: wasSkipped,
        repeated: wasRepeated,
        detected_emotion: tracking.detectedEmotion,
        detector_confidence: tracking.detectorConfidence,
        detection_method: tracking.detectionMethod,
        ...getAudioFeatures(tracking.song),
        event_context: {
          ...tracking.eventContext,
          ...eventContext,
        },
      }
      const savedEvent = await insertListeningEvent(payload)

      set({
        activeTracking: null,
        recentEvents: [savedEvent, ...get().recentEvents],
        lastSavedEvent: savedEvent,
        trackingStatus: 'idle',
        error: null,
      })

      try {
        await useMlStore.getState().refreshConfidenceFromEvents(tracking.userId)
      } catch (error) {
        set({ error: error.message })
      }

      return savedEvent
    } catch (error) {
      set({ trackingStatus: 'tracking', error: error.message })
      throw error
    }
  },

  registerSkip: async (payload = {}) => {
    return get().stopTracking({
      ...payload,
      skipped: true,
    })
  },

  loadRecentEvents: async (userId, limit = 20) => {
    set({ error: null })

    try {
      const recentEvents = await getRecentListeningEvents(userId, limit)

      set({ recentEvents, error: null })

      return recentEvents
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  resetListeningEventsState: () => {
    set({
      activeTracking: null,
      recentEvents: [],
      lastSavedEvent: null,
      trackingStatus: 'idle',
      error: null,
    })
  },
}))
