import { useState, useEffect } from 'react'
import styles from './AppLoadingScreen.module.css'

const HOLD_MS = 1600
const FADE_MS = 400

export function AppLoadingScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const holdTimer = setTimeout(() => setFadeOut(true), HOLD_MS)
    const doneTimer = setTimeout(onDone, HOLD_MS + FADE_MS)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  const handleTap = () => {
    if (!fadeOut) {
      setFadeOut(true)
      setTimeout(onDone, FADE_MS)
    }
  }

  return (
    <div
      className={`${styles.overlay}${fadeOut ? ` ${styles.fadeOut}` : ''}`}
      onClick={handleTap}
    >
      <img src="/blokk-brand-logo.svg" alt="BLOKK" className={styles.logo} />
      <span className={styles.productText}>
        Alste(r).ver.se01ep01 · Made with love. NK26.
      </span>
    </div>
  )
}
