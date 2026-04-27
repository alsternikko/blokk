import { useBlokkStore } from '../../store/useBlokkStore'
import { getPresetById } from '../../store/soundscapes'
import { getDiatonicChord } from '../../logic/diatonic'
import { applyJoystickMod } from '../../logic/joystickMods'
import { VOICE_LABELS } from '../../audio/drumSynth'
import { PATTERN_NAMES } from '../../logic/drumPatterns'
import type { WaveformType } from '../../types/audio'
import type { ChordButtonIndex } from '../../types/music'
import styles from './OledDisplay.module.css'

const WAVEFORM_LABELS: Record<WaveformType, string> = {
  sine: 'SINE', sawtooth: 'SAW', triangle: 'TRI', square: 'SQR',
  fm_epiano: 'EPIANO', fm_hx7: 'HX7', fm_bell: 'BELL',
  fm_organ: 'ORGAN', fm_brass: 'BRASS', juno_poly: 'JUNO',
  ocean_pad: 'OCEAN', wobble_bass: 'WOBBLE',
}

function formatChordName(root: string, type: string): string {
  const typeDisplay: Record<string, string> = {
    major: '', minor: 'm', dim: 'dim', aug: 'aug',
    sus4: 'sus4', sus2: 'sus2', maj7: 'maj7', min7: 'm7',
    dom7: '7', halfDim7: 'm7b5', maj6: '6', min6: 'm6',
    maj9: 'maj9', min9: 'm9', dom9: '9', min11: 'm11',
    add9: 'add9', add11: 'add11', sus4_7: '7sus4',
    dom7sharp9: '7#9', minMaj7: 'mMaj7', maj13: 'maj13',
    dom13: '13', maj7sharp11: 'maj7#11', dom7flat9: '7b9',
    dom7alt: '7alt', sixNine: '6/9',
  }
  return `${root}${typeDisplay[type] ?? type}`
}

export function OledDisplay() {
  const poweredOn = useBlokkStore((s) => s.audioUnlocked)
  const key = useBlokkStore((s) => s.key)
  const scale = useBlokkStore((s) => s.scale)
  const mode = useBlokkStore((s) => s.mode)
  const bpm = useBlokkStore((s) => s.bpm)
  const waveform = useBlokkStore((s) => s.waveform)
  const activeButton = useBlokkStore((s) => s.activeChordButton)
  const joystickDir = useBlokkStore((s) => s.joystickDirection)
  const joystickMode = useBlokkStore((s) => s.joystickMode)
  const looperTracks = useBlokkStore((s) => s.looperTracks)
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)
  const currentPresetId = useBlokkStore((s) => s.currentPresetId)

  const isRecording = looperTracks.some((t) => t.status === 'RECORD')
  const isLooping = looperTracks.some((t) => t.status === 'LOOP')
  const isWaiting = looperTracks.some((t) => t.status === 'WAITING')

  const seqRecording = useBlokkStore((s) => s.sequencerRecording)
  const seqPlaying = useBlokkStore((s) => s.sequencerPlaying)
  const seqPosition = useBlokkStore((s) => s.sequencerPosition)
  const seqStepCount = useBlokkStore((s) => s.sequencerStepCount)
  const seqLength = useBlokkStore((s) => s.sequencerLength)

  const currentPreset = currentPresetId ? getPresetById(currentPresetId) : null

  let line1 = currentPreset ? currentPreset.name.toUpperCase() : `Key: ${key}`
  let line2 = mode as string

  if (mode === 'SEQUENCER') {
    if (seqRecording) {
      line1 = `STEP ${seqStepCount}/${seqLength}`
      line2 = 'REC SEQ'
    } else if (seqPlaying) {
      line1 = `STEP ${seqPosition + 1}/${seqStepCount}`
      line2 = 'PLAY SEQ'
    } else {
      line1 = seqStepCount > 0 ? `${seqStepCount} STEPS` : 'EMPTY'
      line2 = 'SEQUENCER'
    }
  } else if (isRecording) {
    line2 = 'REC'
  } else if (isWaiting) {
    const waitTrack = looperTracks.find((t) => t.status === 'WAITING')
    line2 = waitTrack && waitTrack.barCount > 0 ? `WAIT ${waitTrack.barCount} BAR` : 'WAIT FREE'
  } else if (isLooping) {
    line2 = `${mode} LOOP`
  }

  if (activeMenu === 'F1') {
    line1 = `KEY: ${key}`
    const globalOctave = useBlokkStore.getState().globalOctave
    line2 = `OCT: ${globalOctave >= 0 ? '+' : ''}${globalOctave}`
  } else if (activeMenu === 'F2_SOUNDS') {
    line1 = WAVEFORM_LABELS[waveform] ?? waveform
    line2 = 'SOUNDS'
  } else if (activeMenu === 'F2_EFFECTS') {
    line1 = 'EFFECTS'
    line2 = 'TOGGLE ON/OFF'
  } else if (activeMenu === 'F3_MODE') {
    line1 = mode
    line2 = 'MODE SELECT'
  } else if (activeMenu === 'F3_BPM') {
    line1 = `${bpm} BPM`
    line2 = 'TEMPO'
  } else if (activeMenu === 'PRESET') {
    line1 = 'SOUNDSCAPES'
    line2 = 'TAP TO LOAD'
  } else if (activeButton) {
    const isDrum = mode === 'DRUMMODE' || mode === 'AUTODRUM'
    const isDrumLoop = mode === 'DRUMLOOPMODE'

    if (isDrum) {
      const voiceMap: Record<ChordButtonIndex, string> = {
        1: 'kick', 2: 'snare', 3: 'hihat', 4: 'tom', 5: 'ride', 6: 'perc1', 7: 'perc2',
      }
      const voice = voiceMap[activeButton] as keyof typeof VOICE_LABELS
      line1 = VOICE_LABELS[voice] ?? `BTN ${activeButton}`
      line2 = mode === 'AUTODRUM' ? 'AUTO' : 'DRUM'
    } else if (isDrumLoop) {
      const store = useBlokkStore.getState()
      const patternName = PATTERN_NAMES[store.drumLoopPattern] ?? 'ROCK'
      line1 = patternName
      line2 = `VAR ${store.drumLoopVariation}`
    } else {
      const chord = getDiatonicChord(key, scale, activeButton)
      const modifiedType = applyJoystickMod(chord.type, joystickDir, joystickMode)
      line1 = formatChordName(chord.root, modifiedType)
      line2 = `${activeButton}`
    }
  }

  const tappable = poweredOn && activeMenu === 'NONE'

  const displayClass = [
    styles.oledDisplay,
    poweredOn ? styles.displayOn : styles.displayOff,
    tappable ? styles.displayTappable : '',
  ].filter(Boolean).join(' ')

  const handleTap = () => {
    if (!poweredOn) return
    if (activeMenu === 'NONE') {
      setActiveMenu('PRESET')
    }
  }

  return (
    <div
      className={displayClass}
      role={tappable ? 'button' : 'status'}
      aria-live="polite"
      aria-label={tappable ? 'Open soundscape presets' : 'Display'}
      onClick={handleTap}
      tabIndex={tappable ? 0 : -1}
      onKeyDown={(e) => {
        if (tappable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleTap()
        }
      }}
    >
      <div className={styles.displayContent}>
        <div className={styles.displayLine1}>{line1}</div>
        <div className={styles.displayLine2}>{line2}</div>
        <div className={styles.displayStatus}>
          <span>{bpm} BPM</span>
          <span className={styles.waveformTag}>{WAVEFORM_LABELS[waveform]}</span>
          <span className={styles.looperDots}>
            {looperTracks.map((t, i) => (
              <span
                key={i}
                className={[
                  styles.looperDot,
                  t.status === 'RECORD' ? styles.looperDotRecord : '',
                  t.status === 'LOOP' ? styles.looperDotActive : '',
                  t.status === 'WAITING' ? styles.looperDotWaiting : '',
                ].filter(Boolean).join(' ')}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
