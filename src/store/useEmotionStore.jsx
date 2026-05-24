/* eslint-disable react-refresh/only-export-components */
import { create } from 'zustand'
import { getRecentListeningEvents } from '../supabase/listeningEvents'
import { ML_EMOTIONS } from '../supabase/mlProfiles'

const EMOTION_REFRESH_INTERVAL_MS = 30 * 60 * 1000

const createEmotionScores = () => {
  return ML_EMOTIONS.reduce((scores, emotion) => {
    scores[emotion] = 0
    return scores
  }, {})
}

const getTopEmotion = (scores) => {
  return Object.entries(scores).reduce(
    (current, next) => (next[1] > current[1] ? next : current),
    [null, 0],
  )
}

const getContextBiases = (date = new Date()) => {
  const scores = createEmotionScores()
  const hour = date.getHours()
  const day = date.getDay()
  const reasons = []

  if (hour >= 22 || hour < 6) {
    scores.sad += 0.28
    scores.relaxed += 0.34
    reasons.push('late_night')
  }

  if (hour >= 6 && hour < 10) {
    scores.motivated += 0.36
    reasons.push('early_morning')
  }

  if (day === 5 || day === 6) {
    scores.happy += 0.32
    reasons.push('weekend_energy')
  }

  if (day === 1) {
    scores.motivated += 0.3
    reasons.push('monday_start')
  }

  return {
    scores,
    reasons,
  }
}

const getDominantEmotionFromEvents = (events) => {
  const counts = createEmotionScores()

  events.forEach((event) => {
    if (ML_EMOTIONS.includes(event.detected_emotion)) {
      counts[event.detected_emotion] += 1
    }
  })

  return getTopEmotion(counts)
}

export const useEmotionStore = create((set, get) => ({
  currentEmotion: null,
  detectorConfidence: 0,
  detectionMethod: null,
  cameraEnabled: false,
  lastUpdatedAt: null,
  contextBiases: createEmotionScores(),
  behaviorAnalysis: null,
  isAnalyzing: false,
  error: null,

  setCameraEnabled: (cameraEnabled) => {
    set({ cameraEnabled })
  },

  setDetectedEmotion: ({
    emotion,
    confidence = 0,
    method = 'context',
    occurredAt = new Date().toISOString(),
  }) => {
    if (!ML_EMOTIONS.includes(emotion)) {
      throw new Error(`Unsupported emotion: ${emotion}`)
    }

    const { detectorConfidence, lastUpdatedAt } = get()
    const lastUpdateTime = lastUpdatedAt ? new Date(lastUpdatedAt).getTime() : 0
    const hasWaitedEnough =
      Date.now() - lastUpdateTime > EMOTION_REFRESH_INTERVAL_MS
    const shouldUpdate =
      !lastUpdatedAt || confidence > detectorConfidence || hasWaitedEnough

    if (!shouldUpdate) {
      return false
    }

    set({
      currentEmotion: emotion,
      detectorConfidence: confidence,
      detectionMethod: method,
      lastUpdatedAt: occurredAt,
    })

    return true
  },

  analyzeContext: (date = new Date()) => {
    const { scores, reasons } = getContextBiases(date)
    const [emotion, score] = getTopEmotion(scores)
    const confidence = score ? Math.min(0.72, 0.44 + score) : 0.38
    const analysis = {
      scores,
      reasons,
      suggestedEmotion: emotion ?? 'relaxed',
      confidence,
      method: 'context',
    }

    set({ contextBiases: scores })

    return analysis
  },

  analyzeBehavior: async (userId, { limit = 12 } = {}) => {
    set({ isAnalyzing: true, error: null })

    try {
      const events = await getRecentListeningEvents(userId, limit)
      const totalEvents = events.length
      const skippedEvents = events.filter((event) => event.skipped).length
      const repeatedEvents = events.filter((event) => event.repeated).length
      const skipRatio = totalEvents ? skippedEvents / totalEvents : 0
      const repeatRatio = totalEvents ? repeatedEvents / totalEvents : 0
      const [dominantEmotion] = getDominantEmotionFromEvents(events)
      let suggestedEmotion = dominantEmotion ?? 'relaxed'
      let confidence = totalEvents ? 0.46 : 0.32
      let pattern = 'neutral'

      if (skipRatio >= 0.45 && totalEvents >= 4) {
        suggestedEmotion = 'angry'
        confidence = Math.min(0.76, 0.48 + skipRatio)
        pattern = 'many_skips'
      } else if (repeatRatio >= 0.25 && totalEvents >= 3) {
        suggestedEmotion = dominantEmotion ?? 'relaxed'
        confidence = Math.min(0.74, 0.5 + repeatRatio)
        pattern = 'emotionally_engaged'
      }

      const analysis = {
        totalEvents,
        skippedEvents,
        repeatedEvents,
        skipRatio,
        repeatRatio,
        pattern,
        suggestedEmotion,
        confidence,
        method: 'behavior',
      }

      set({
        behaviorAnalysis: analysis,
        isAnalyzing: false,
        error: null,
      })

      return analysis
    } catch (error) {
      set({ isAnalyzing: false, error: error.message })
      throw error
    }
  },

  inferEmotion: async (userId, date = new Date()) => {
    const context = get().analyzeContext(date)
    const behavior = userId ? await get().analyzeBehavior(userId) : null
    const candidate =
      behavior && behavior.confidence >= context.confidence ? behavior : context

    get().setDetectedEmotion({
      emotion: candidate.suggestedEmotion,
      confidence: candidate.confidence,
      method: candidate.method,
    })

    return candidate
  },

  resetEmotionState: () => {
    set({
      currentEmotion: null,
      detectorConfidence: 0,
      detectionMethod: null,
      cameraEnabled: false,
      lastUpdatedAt: null,
      contextBiases: createEmotionScores(),
      behaviorAnalysis: null,
      isAnalyzing: false,
      error: null,
    })
  },
}))

export { EMOTION_REFRESH_INTERVAL_MS }
