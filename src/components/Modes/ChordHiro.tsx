import { useBlokkStore } from '../../store/useBlokkStore'
import styles from './GameModes.module.css'

export function ChordHiro() {
  const mode = useBlokkStore((s) => s.mode)
  const chState = useBlokkStore((s) => s.chordHiroState)

  if (mode !== 'CHORDHIRO' || !chState) return null

  const { playing, countdown, score, combo, currentNoteIndex, results, songIndex } = chState
  const lastResult = results.length > 0 ? results[results.length - 1] : null

  return (
    <div className={styles.gameOverlay}>
      <div className={styles.gamePanel}>
        {countdown > 0 ? (
          <div className={styles.countdown}>{countdown}</div>
        ) : playing ? (
          <>
            <div className={styles.gameHeader}>
              <span className={styles.gameScore}>SCORE: {score}</span>
              <span className={styles.gameCombo}>COMBO: {combo}</span>
            </div>
            <div className={styles.gameArea}>
              <div className={styles.noteIndex}>NOTE {currentNoteIndex + 1}</div>
              {lastResult && (
                <div className={`${styles.hitResult} ${styles[`hit${lastResult}`]}`}>
                  {lastResult}
                </div>
              )}
            </div>
            <div className={styles.gameHint}>Press chord buttons to hit!</div>
          </>
        ) : (
          <div className={styles.gameResults}>
            <div className={styles.gameTitle}>RESULTS</div>
            <div className={styles.gameScore}>SCORE: {score}</div>
            <div className={styles.gameStats}>
              <span>MAX COMBO: {chState.maxCombo}</span>
              <span>PERFECT: {results.filter((r) => r === 'PERFECT').length}</span>
              <span>GREAT: {results.filter((r) => r === 'GREAT').length}</span>
              <span>MISS: {results.filter((r) => r === 'MISS').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
