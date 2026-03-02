import { useBlokkStore } from '../../store/useBlokkStore'
import type { Mode } from '../../types/music'
import { DRUM_KITS } from '../../types/audio'
import { PATTERN_NAMES, VARIATION_NAMES } from '../../logic/drumPatterns'
import styles from './Menus.module.css'

const RHYTHM_RATES = ['1/1', '1/2', '1/4', '1/8', '1/16', '1/16T', '1/32'] as const
const STRUM_SPEEDS = ['SLOW', 'MEDIUM', 'FAST'] as const

const SELECTABLE_MODES: Mode[] = [
  'ONESHOT', 'STRUM', 'LEAD', 'DRONE', 'ARPEGGIO', 'REPEAT',
  'DRUMMODE', 'DRUMLOOPMODE', 'SEQUENCER', 'CHORDHIRO', 'EARTRAINER',
]

export function F3Menu() {
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)
  const mode = useBlokkStore((s) => s.mode)
  const setMode = useBlokkStore((s) => s.setMode)
  const bpm = useBlokkStore((s) => s.bpm)
  const setBpm = useBlokkStore((s) => s.setBpm)
  const strumSpeed = useBlokkStore((s) => s.strumSpeed)
  const setStrumSpeed = useBlokkStore((s) => s.setStrumSpeed)
  const rhythmRate = useBlokkStore((s) => s.rhythmRate)
  const setRhythmRate = useBlokkStore((s) => s.setRhythmRate)
  const drumKit = useBlokkStore((s) => s.drumKit)
  const setDrumKit = useBlokkStore((s) => s.setDrumKit)
  const drumLoopPattern = useBlokkStore((s) => s.drumLoopPattern)
  const setDrumLoopPattern = useBlokkStore((s) => s.setDrumLoopPattern)
  const drumLoopVariation = useBlokkStore((s) => s.drumLoopVariation)
  const setDrumLoopVariation = useBlokkStore((s) => s.setDrumLoopVariation)
  const seqLength = useBlokkStore((s) => s.sequencerLength)
  const setSequencerState = useBlokkStore((s) => s.setSequencerState)

  if (activeMenu !== 'F3_MODE' && activeMenu !== 'F3_BPM') return null

  const isModeLevel = activeMenu === 'F3_MODE'

  const handleModeNav = (delta: number) => {
    const idx = SELECTABLE_MODES.indexOf(mode)
    const current = idx === -1 ? 0 : idx
    const next = (current + delta + SELECTABLE_MODES.length) % SELECTABLE_MODES.length
    setMode(SELECTABLE_MODES[next])
  }

  const handleBpmNav = (delta: number) => {
    setBpm(bpm + delta)
  }

  const handleRateNav = (delta: number) => {
    const idx = RHYTHM_RATES.indexOf(rhythmRate as typeof RHYTHM_RATES[number])
    if (idx === -1) return
    const next = (idx + delta + RHYTHM_RATES.length) % RHYTHM_RATES.length
    setRhythmRate(RHYTHM_RATES[next])
  }

  const handleStrumNav = (delta: number) => {
    const idx = STRUM_SPEEDS.indexOf(strumSpeed as typeof STRUM_SPEEDS[number])
    if (idx === -1) return
    const next = (idx + delta + STRUM_SPEEDS.length) % STRUM_SPEEDS.length
    setStrumSpeed(STRUM_SPEEDS[next])
  }

  const handleKitNav = (delta: number) => {
    const idx = DRUM_KITS.indexOf(drumKit)
    const next = (idx + delta + DRUM_KITS.length) % DRUM_KITS.length
    setDrumKit(DRUM_KITS[next])
  }

  const handlePatternNav = (delta: number) => {
    const next = (drumLoopPattern + delta + PATTERN_NAMES.length) % PATTERN_NAMES.length
    setDrumLoopPattern(next)
  }

  const handleVariationNav = (delta: number) => {
    const next = (drumLoopVariation + delta + 8) % 8
    setDrumLoopVariation(next)
  }

  return (
    <div className={styles.menuOverlay}>
      <div className={styles.menuPanel}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>
            {isModeLevel ? 'MODE' : 'BPM'}
          </span>
          <button
            className={styles.menuClose}
            onClick={() => setActiveMenu('NONE')}
            aria-label="Close menu"
          >
            x
          </button>
        </div>

        {isModeLevel ? (
          <div className={styles.menuBody}>
            <div className={styles.navRow}>
              <button className={styles.navBtn} onClick={() => handleModeNav(-1)}>&lt;</button>
              <span className={styles.navLabel}>{mode}</span>
              <button className={styles.navBtn} onClick={() => handleModeNav(1)}>&gt;</button>
            </div>

            {mode === 'STRUM' && (
              <div className={styles.paramRow}>
                <span className={styles.paramLabel}>Speed</span>
                <div className={styles.navRow}>
                  <button className={styles.navBtn} onClick={() => handleStrumNav(-1)}>&lt;</button>
                  <span className={styles.navLabel}>{strumSpeed}</span>
                  <button className={styles.navBtn} onClick={() => handleStrumNav(1)}>&gt;</button>
                </div>
              </div>
            )}

            {(mode === 'ARPEGGIO' || mode === 'REPEAT') && (
              <div className={styles.paramRow}>
                <span className={styles.paramLabel}>Rate</span>
                <div className={styles.navRow}>
                  <button className={styles.navBtn} onClick={() => handleRateNav(-1)}>&lt;</button>
                  <span className={styles.navLabel}>{rhythmRate}</span>
                  <button className={styles.navBtn} onClick={() => handleRateNav(1)}>&gt;</button>
                </div>
              </div>
            )}

            {(mode === 'DRUMMODE' || mode === 'AUTODRUM') && (
              <div className={styles.paramRow}>
                <span className={styles.paramLabel}>Kit</span>
                <div className={styles.navRow}>
                  <button className={styles.navBtn} onClick={() => handleKitNav(-1)}>&lt;</button>
                  <span className={styles.navLabel}>{drumKit}</span>
                  <button className={styles.navBtn} onClick={() => handleKitNav(1)}>&gt;</button>
                </div>
              </div>
            )}

            {mode === 'DRUMLOOPMODE' && (
              <>
                <div className={styles.paramRow}>
                  <span className={styles.paramLabel}>Pattern</span>
                  <div className={styles.navRow}>
                    <button className={styles.navBtn} onClick={() => handlePatternNav(-1)}>&lt;</button>
                    <span className={styles.navLabel}>{PATTERN_NAMES[drumLoopPattern]}</span>
                    <button className={styles.navBtn} onClick={() => handlePatternNav(1)}>&gt;</button>
                  </div>
                </div>
                <div className={styles.paramRow}>
                  <span className={styles.paramLabel}>Variation</span>
                  <div className={styles.navRow}>
                    <button className={styles.navBtn} onClick={() => handleVariationNav(-1)}>&lt;</button>
                    <span className={styles.navLabel}>{VARIATION_NAMES[drumLoopVariation]}</span>
                    <button className={styles.navBtn} onClick={() => handleVariationNav(1)}>&gt;</button>
                  </div>
                </div>
              </>
            )}

            {mode === 'SEQUENCER' && (
              <div className={styles.paramRow}>
                <span className={styles.paramLabel}>Steps</span>
                <div className={styles.navRow}>
                  <button className={styles.navBtn} onClick={() => setSequencerState({ length: Math.max(4, seqLength - 1) })}>&lt;</button>
                  <span className={styles.navLabel}>{seqLength}</span>
                  <button className={styles.navBtn} onClick={() => setSequencerState({ length: Math.min(16, seqLength + 1) })}>&gt;</button>
                </div>
              </div>
            )}

            <div className={styles.menuHint}>
              <button
                className={styles.subMenuBtn}
                onClick={() => setActiveMenu('F3_BPM')}
              >
                BPM &uarr;
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.menuBody}>
            <div className={styles.navRow}>
              <button className={styles.navBtn} onClick={() => handleBpmNav(-5)}>&lt;&lt;</button>
              <button className={styles.navBtn} onClick={() => handleBpmNav(-1)}>&lt;</button>
              <span className={styles.navLabel}>{bpm} BPM</span>
              <button className={styles.navBtn} onClick={() => handleBpmNav(1)}>&gt;</button>
              <button className={styles.navBtn} onClick={() => handleBpmNav(5)}>&gt;&gt;</button>
            </div>
            <div className={styles.menuHint}>
              <button
                className={styles.subMenuBtn}
                onClick={() => setActiveMenu('F3_MODE')}
              >
                MODE &darr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
