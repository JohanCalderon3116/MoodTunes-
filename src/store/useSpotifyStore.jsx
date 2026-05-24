/* eslint-disable react-refresh/only-export-components */
import { create } from 'zustand'

const PLAYBACK_STATE = {
  playing: 'playing',
  paused: 'paused',
}

export const useSpotifyStore = create((set, get) => ({
  currentTrack: null,
  playbackState: PLAYBACK_STATE.paused,
  positionMs: 0,
  durationMs: 0,
  player: null,
  deviceId: null,
  recommendationQueue: [],

  setPlayer: (player) => {
    set({ player })
  },

  setDeviceId: (deviceId) => {
    set({ deviceId })
  },

  setCurrentTrack: (currentTrack) => {
    set({
      currentTrack,
      durationMs: currentTrack?.duration_ms ?? currentTrack?.durationMs ?? 0,
      positionMs: 0,
    })
  },

  setPlaybackState: (playbackState) => {
    set({ playbackState })
  },

  setPositionMs: (positionMs) => {
    set({ positionMs })
  },

  setDurationMs: (durationMs) => {
    set({ durationMs })
  },

  setPlaybackSnapshot: ({
    currentTrack,
    playbackState,
    positionMs,
    durationMs,
  } = {}) => {
    set((state) => ({
      currentTrack: currentTrack ?? state.currentTrack,
      playbackState: playbackState ?? state.playbackState,
      positionMs: positionMs ?? state.positionMs,
      durationMs: durationMs ?? state.durationMs,
    }))
  },

  play: async () => {
    const { player } = get()

    if (player?.resume) {
      await player.resume()
    }

    set({ playbackState: PLAYBACK_STATE.playing })
  },

  pause: async () => {
    const { player } = get()

    if (player?.pause) {
      await player.pause()
    }

    set({ playbackState: PLAYBACK_STATE.paused })
  },

  togglePlayback: async () => {
    const { playbackState, player } = get()

    if (player?.togglePlay) {
      await player.togglePlay()
      set({
        playbackState:
          playbackState === PLAYBACK_STATE.playing
            ? PLAYBACK_STATE.paused
            : PLAYBACK_STATE.playing,
      })
      return
    }

    if (playbackState === PLAYBACK_STATE.playing) {
      await get().pause()
      return
    }

    await get().play()
  },

  seek: async (positionMs) => {
    const { player } = get()

    if (player?.seek) {
      await player.seek(positionMs)
    }

    set({ positionMs })
  },

  nextTrack: async () => {
    const { player } = get()

    if (player?.nextTrack) {
      await player.nextTrack()
    }
  },

  previousTrack: async () => {
    const { player } = get()

    if (player?.previousTrack) {
      await player.previousTrack()
    }
  },

  setRecommendationQueue: (recommendationQueue = []) => {
    set({ recommendationQueue })
  },

  addRecommendations: (tracks = []) => {
    set((state) => ({
      recommendationQueue: [...state.recommendationQueue, ...tracks],
    }))
  },

  enqueueRecommendation: (track) => {
    set((state) => ({
      recommendationQueue: [...state.recommendationQueue, track],
    }))
  },

  dequeueRecommendation: () => {
    const [nextTrack, ...remainingQueue] = get().recommendationQueue

    set({ recommendationQueue: remainingQueue })

    return nextTrack ?? null
  },

  removeRecommendationBySpotifyId: (spotifyId) => {
    set((state) => ({
      recommendationQueue: state.recommendationQueue.filter(
        (track) => track.spotify_id !== spotifyId && track.id !== spotifyId,
      ),
    }))
  },

  clearRecommendationQueue: () => {
    set({ recommendationQueue: [] })
  },

  resetSpotifyState: () => {
    set({
      currentTrack: null,
      playbackState: PLAYBACK_STATE.paused,
      positionMs: 0,
      durationMs: 0,
      player: null,
      deviceId: null,
      recommendationQueue: [],
    })
  },
}))

export { PLAYBACK_STATE }
