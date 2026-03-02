import { useCallback, useMemo } from 'react'
import { useBlokkStore } from '../../store/useBlokkStore'
import type { ChordButtonIndex } from '../../types/music'
import { ChordButton } from './ChordButton'
import { XYPad } from './XYPad'
import styles from './ChordButtonGrid.module.css'

const DRUM_LABELS: Record<ChordButtonIndex, string> = {
  1: 'KCK', 2: 'SNR', 3: 'HH', 4: 'TOM', 5: 'RDE', 6: 'P1', 7: 'P2',
}

export function ChordButtonGrid() {
  const activeButton = useBlokkStore((s) => s.activeChordButton)
  const chordButtons = useBlokkStore((s) => s.chordButtons)
  const mode = useBlokkStore((s) => s.mode)
  const setActiveChordButton = useBlokkStore((s) => s.setActiveChordButton)

  const isDrumMode = mode === 'DRUMMODE' || mode === 'DRUMLOOPMODE' || mode === 'AUTODRUM'

  const handlePress = useCallback(
    (index: ChordButtonIndex) => {
      setActiveChordButton(index)
    },
    [setActiveChordButton],
  )

  const handleRelease = useCallback(
    (_index: ChordButtonIndex) => {
      setActiveChordButton(null)
    },
    [setActiveChordButton],
  )

  const buttons = useMemo(() => ([1, 2, 3, 4, 5, 6, 7] as ChordButtonIndex[]).map((i) => (
    <ChordButton
      key={i}
      index={i}
      label={isDrumMode ? DRUM_LABELS[i] : undefined}
      isActive={activeButton === i}
      isLocked={chordButtons[i].lockedType !== null}
      onPress={handlePress}
      onRelease={handleRelease}
    />
  )), [isDrumMode, activeButton, chordButtons, handlePress, handleRelease])

  return (
    <div className={styles.chordButtonGrid}>
      <div className={styles.chordRow1}>{buttons.slice(0, 4)}</div>
      <div className={styles.chordRow2}>
        {buttons.slice(4, 7)}
        <XYPad />
      </div>
    </div>
  )
}
