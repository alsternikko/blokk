import { useBlokkStore } from '../../store/useBlokkStore'
import styles from './GameModes.module.css'

export function EarTrainer() {
  const mode = useBlokkStore((s) => s.mode)
  const etState = useBlokkStore((s) => s.earTrainerState)

  if (mode !== 'EARTRAINER' || !etState) return null

  const { active, score, total, streak, guessResult, difficulty, progressionLength, progressionCurrent } = etState
  const isProgression = difficulty === 'PROGRESSION' || difficulty === 'PROG_EXTENDED'

  return (
    <div className={styles.gameOverlay}>
      <div className={styles.gamePanel}>
        {active ? (
          <>
            <div className={styles.gameHeader}>
              <span className={styles.gameScore}>{score}/{total}</span>
              <span className={styles.gameCombo}>STREAK: {streak}</span>
            </div>
            <div className={styles.gameArea}>
              {isProgression && (
                <div className={styles.noteIndex}>
                  CHORD {progressionCurrent + 1}/{progressionLength}
                </div>
              )}
              {guessResult && (
                <div className={`${styles.hitResult} ${guessResult === 'correct' ? styles.hitPERFECT : styles.hitMISS}`}>
                  {guessResult === 'correct' ? 'CORRECT' : 'WRONG'}
                </div>
              )}
              {!guessResult && (
                <div className={styles.gameHint}>Press 1-7 to guess!</div>
              )}
            </div>
            <div className={styles.gameHint}>{difficulty}</div>
          </>
        ) : (
          <div className={styles.gameResults}>
            <div className={styles.gameTitle}>EAR TRAINER</div>
            <div className={styles.gameHint}>Switch to EARTRAINER mode and press a chord button to start</div>
          </div>
        )}
      </div>
    </div>
  )
}
