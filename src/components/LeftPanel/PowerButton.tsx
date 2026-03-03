import { useCallback, useRef } from 'react'
import { initAudio } from '../../audio/engine'
import { useBlokkStore } from '../../store/useBlokkStore'
import styles from './PowerButton.module.css'

export function PowerButton() {
  const poweredOn = useBlokkStore((s) => s.audioUnlocked)
  const setPoweredOn = useBlokkStore((s) => s.setAudioUnlocked)
  const hasEverPoweredOn = useRef(false)

  if (poweredOn && !hasEverPoweredOn.current) {
    hasEverPoweredOn.current = true
  }

  const handleToggle = useCallback(async () => {
    if (!poweredOn) {
      await initAudio()
      setPoweredOn(true)
    } else {
      useBlokkStore.getState().setActiveChordButton(null)
      setPoweredOn(false)
    }
  }, [poweredOn, setPoweredOn])

  const showPulse = !poweredOn && !hasEverPoweredOn.current

  const btnClass = [
    styles.powerButton,
    showPulse ? styles.powerButtonPulse : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      className={btnClass}
      onClick={handleToggle}
      aria-label={poweredOn ? 'Power off' : 'Power on'}
      aria-pressed={poweredOn}
    >
      <svg className={styles.powerIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 1v6M4.2 3.2A6 6 0 1 0 11.8 3.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={`${styles.powerLed} ${poweredOn ? styles.powerLedOn : ''}`} />
    </button>
  )
}
