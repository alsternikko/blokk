import { useCallback, useRef } from 'react'
import type { ChordButtonIndex } from '../../types/music'
import { lightImpact } from '../../utils/haptics'
import styles from './ChordButton.module.css'

interface ChordButtonProps {
  index: ChordButtonIndex
  label?: string
  isActive: boolean
  isLocked: boolean
  onPress: (index: ChordButtonIndex) => void
  onRelease: (index: ChordButtonIndex) => void
}

export function ChordButton({ index, label, isActive, isLocked, onPress, onRelease }: ChordButtonProps) {
  const pointerPressed = useRef(false)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      pointerPressed.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      lightImpact()
      onPress(index)
    },
    [index, onPress],
  )

  const handlePointerUp = useCallback(() => {
    if (!pointerPressed.current) return
    pointerPressed.current = false
    onRelease(index)
  }, [index, onRelease])

  const className = [
    styles.chordBtn,
    isActive ? styles['chordBtn--active'] : '',
    isLocked ? styles['chordBtn--locked'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={className}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label={label ? `${label} button` : `Chord button ${index}`}
      aria-pressed={isActive}
    >
      <span className={styles.chordBtnId}>{label ?? index}</span>
      <span className={styles.chordBtnLed} />
    </button>
  )
}
