import { useEffect, useState } from 'react'

const SPOTIFY_SDK_ID = 'spotify-player-sdk'
const SPOTIFY_SDK_SRC = 'https://sdk.scdn.co/spotify-player.js'

export const useSpotifySdk = () => {
  const [isReady, setIsReady] = useState(() => Boolean(window.Spotify))

  useEffect(() => {
    if (window.Spotify) {
      return
    }

    const existingScript = document.getElementById(SPOTIFY_SDK_ID)

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = SPOTIFY_SDK_ID
      script.src = SPOTIFY_SDK_SRC
      script.async = true
      document.body.appendChild(script)
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsReady(true)
    }
  }, [])

  return { isSpotifySdkReady: isReady }
}
