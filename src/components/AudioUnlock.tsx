import { useCallback } from 'react'
import { initAudio } from '../audio/engine'
import { useBlokkStore } from '../store/useBlokkStore'

export function AudioUnlock() {
  const setAudioUnlocked = useBlokkStore((s) => s.setAudioUnlocked)

  const handleUnlock = useCallback(async () => {
    await initAudio()
    setAudioUnlocked(true)
  }, [setAudioUnlocked])

  return (
    <div className="audio-unlock-overlay" onClick={handleUnlock} onTouchEnd={handleUnlock}>
      <div className="audio-unlock-content">
        <h1 className="audio-unlock-logo">BLOKK-1</h1>
        <p className="audio-unlock-subtext">Web Synthesizer</p>
        <p className="audio-unlock-prompt">Tap anywhere to start</p>
      </div>
    </div>
  )
}
