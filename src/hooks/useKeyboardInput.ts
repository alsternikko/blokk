import { useEffect } from 'react'
import { useBlokkStore } from '../store/useBlokkStore'
import { savePreset, loadPreset } from '../store/presets'
import type { ChordButtonIndex, JoystickDirection, Inversion } from '../types/music'
import { KEYS, INVERSIONS } from '../types/music'
import { WAVEFORM_TYPES } from '../types/audio'
import type { Mode } from '../types/music'
import { sendChordOn, sendChordOff } from '../audio/midiOut'

const KEY_TO_CHORD: Record<string, ChordButtonIndex> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
}

const KEY_TO_DIRECTION: Record<string, JoystickDirection> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
}

const SELECTABLE_MODES: Mode[] = [
  'ONESHOT', 'STRUM', 'LEAD', 'DRONE', 'ARPEGGIO', 'REPEAT',
  'DRUMMODE', 'DRUMLOOPMODE', 'SEQUENCER', 'CHORDHIRO', 'EARTRAINER',
]

export function useKeyboardInput(
  cycleLooper?: () => void,
  setBarCount?: (delta: number) => void,
) {
  const setActiveChordButton = useBlokkStore((s) => s.setActiveChordButton)
  const setJoystickDirection = useBlokkStore((s) => s.setJoystickDirection)
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)

  useEffect(() => {
    const heldChords = new Set<ChordButtonIndex>()
    const heldDirections = new Set<JoystickDirection>()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const store = useBlokkStore.getState()
      if (!store.audioUnlocked) return

      const chordBtn = KEY_TO_CHORD[e.key]
      if (chordBtn) {
        heldChords.add(chordBtn)
        setActiveChordButton(chordBtn)
        return
      }

      const dir = KEY_TO_DIRECTION[e.key]
      if (dir) {
        e.preventDefault()

        // Shift+Arrow = XY pad control (filter cutoff / effect depth)
        if (e.shiftKey && activeMenu === 'NONE') {
          const step = 0.05
          if (dir === 'LEFT' || dir === 'RIGHT') {
            const delta = dir === 'RIGHT' ? step : -step
            store.setXYPad(store.xyPadX + delta, store.xyPadY)
          } else if (dir === 'UP' || dir === 'DOWN') {
            const delta = dir === 'UP' ? step : -step
            store.setXYPad(store.xyPadX, store.xyPadY + delta)
          }
          return
        }

        if (activeMenu === 'F1') {
          if (dir === 'LEFT' || dir === 'RIGHT') {
            const idx = KEYS.indexOf(store.key)
            const next = dir === 'RIGHT' ? (idx + 1) % 12 : (idx - 1 + 12) % 12
            store.setKey(KEYS[next])
          } else if (dir === 'UP' || dir === 'DOWN') {
            const delta = dir === 'UP' ? 1 : -1
            store.setGlobalOctave(Math.max(-1, Math.min(2, store.globalOctave + delta)))
          }
          return
        }

        if (activeMenu === 'F2_SOUNDS') {
          if (dir === 'LEFT' || dir === 'RIGHT') {
            const idx = WAVEFORM_TYPES.indexOf(store.waveform)
            const delta = dir === 'RIGHT' ? 1 : -1
            const next = (idx + delta + WAVEFORM_TYPES.length) % WAVEFORM_TYPES.length
            store.setWaveform(WAVEFORM_TYPES[next])
          } else if (dir === 'UP') {
            setActiveMenu('F2_EFFECTS')
          } else if (dir === 'DOWN') {
            setActiveMenu('NONE')
          }
          return
        }

        if (activeMenu === 'F2_EFFECTS') {
          if (dir === 'DOWN') {
            setActiveMenu('F2_SOUNDS')
          }
          return
        }

        if (activeMenu === 'F3_MODE') {
          if (dir === 'LEFT' || dir === 'RIGHT') {
            const idx = SELECTABLE_MODES.indexOf(store.mode)
            const current = idx === -1 ? 0 : idx
            const delta = dir === 'RIGHT' ? 1 : -1
            const next = (current + delta + SELECTABLE_MODES.length) % SELECTABLE_MODES.length
            store.setMode(SELECTABLE_MODES[next])
          } else if (dir === 'UP') {
            setActiveMenu('F3_BPM')
          } else if (dir === 'DOWN') {
            setActiveMenu('NONE')
          }
          return
        }

        if (activeMenu === 'F3_BPM') {
          if (dir === 'LEFT' || dir === 'RIGHT') {
            const delta = dir === 'RIGHT' ? 1 : -1
            store.setBpm(store.bpm + delta)
          } else if (dir === 'UP') {
            store.setBpm(store.bpm + 5)
          } else if (dir === 'DOWN') {
            setActiveMenu('F3_MODE')
          }
          return
        }

        // Looper bar count adjustment when in WAITING state
        if (activeMenu === 'NONE' && (dir === 'LEFT' || dir === 'RIGHT')) {
          const waitingTrack = store.looperTracks.findIndex((t) => t.status === 'WAITING')
          if (waitingTrack !== -1 && setBarCount) {
            setBarCount(dir === 'RIGHT' ? 1 : -1)
            return
          }
        }

        heldDirections.add(dir)
        setJoystickDirection(dir)
        return
      }

      // Enter = joystick click -> cycle looper
      if (e.key === 'Enter' && activeMenu === 'NONE') {
        e.preventDefault()
        cycleLooper?.()
        return
      }

      // Toggle active looper track with Tab
      if (e.key === 'Tab' && activeMenu === 'NONE') {
        e.preventDefault()
        const next: 0 | 1 = store.activeLooperTrack === 0 ? 1 : 0
        store.setActiveLooperTrack(next)
        return
      }

      // Toggle metronome with M
      if (e.key === 'm' || e.key === 'M') {
        store.setMetronome(!store.isMetronomeOn)
        return
      }

      // Chord lock: L while holding a chord button
      if ((e.key === 'l' || e.key === 'L') && heldChords.size > 0) {
        const btn = [...heldChords][heldChords.size - 1]
        const btnState = store.chordButtons[btn]
        if (btnState.lockedType) {
          store.setChordButtonLock(btn, null)
        } else {
          store.setChordButtonLock(btn, 'major')
        }
        return
      }

      // Cycle inversion: I while holding a chord button
      if ((e.key === 'i' || e.key === 'I') && heldChords.size > 0) {
        const btn = [...heldChords][heldChords.size - 1]
        const btnState = store.chordButtons[btn]
        const idx = INVERSIONS.indexOf(btnState.inversion)
        const next = INVERSIONS[(idx + 1) % INVERSIONS.length]
        store.setChordButtonInversion(btn, next)
        return
      }

      // Per-button octave: [ = down, ] = up while holding chord
      if (e.key === '[' && heldChords.size > 0) {
        const btn = [...heldChords][heldChords.size - 1]
        store.setChordButtonOctave(btn, store.chordButtons[btn].octaveShift - 1)
        return
      }
      if (e.key === ']' && heldChords.size > 0) {
        const btn = [...heldChords][heldChords.size - 1]
        store.setChordButtonOctave(btn, store.chordButtons[btn].octaveShift + 1)
        return
      }

      // Presets: Shift+1 = save P1, Shift+2 = save P2, Alt+1 = load P1, Alt+2 = load P2
      if (e.key === '!' && e.shiftKey) { savePreset(0); return }
      if (e.key === '@' && e.shiftKey) { savePreset(1); return }
      if (e.altKey && e.key === '1') { loadPreset(0); return }
      if (e.altKey && e.key === '2') { loadPreset(1); return }

      if (e.key === 'q' || e.key === 'Q') {
        setActiveMenu(activeMenu === 'F1' ? 'NONE' : 'F1')
      } else if (e.key === 'w' || e.key === 'W') {
        if (activeMenu === 'F2_SOUNDS' || activeMenu === 'F2_EFFECTS') {
          setActiveMenu('NONE')
        } else {
          setActiveMenu('F2_SOUNDS')
        }
      } else if (e.key === 'e' || e.key === 'E') {
        if (activeMenu === 'F3_MODE' || activeMenu === 'F3_BPM') {
          setActiveMenu('NONE')
        } else {
          setActiveMenu('F3_MODE')
        }
      } else if (e.key === 'p' || e.key === 'P') {
        setActiveMenu(activeMenu === 'PRESET' ? 'NONE' : 'PRESET')
      } else if (e.key === 'Escape') {
        setActiveMenu('NONE')
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (!useBlokkStore.getState().audioUnlocked) return
      const chordBtn = KEY_TO_CHORD[e.key]
      if (chordBtn) {
        heldChords.delete(chordBtn)
        if (heldChords.size === 0) {
          setActiveChordButton(null)
        } else {
          const remaining = [...heldChords]
          setActiveChordButton(remaining[remaining.length - 1])
        }
        return
      }

      const dir = KEY_TO_DIRECTION[e.key]
      if (dir) {
        heldDirections.delete(dir)
        if (heldDirections.size === 0) {
          setJoystickDirection('CENTER')
        } else {
          const remaining = [...heldDirections]
          setJoystickDirection(remaining[remaining.length - 1])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [activeMenu, setActiveChordButton, setJoystickDirection, setActiveMenu, cycleLooper, setBarCount])
}
