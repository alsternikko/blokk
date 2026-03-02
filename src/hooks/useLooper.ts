import { useEffect, useRef, useCallback } from 'react'
import { useBlokkStore } from '../store/useBlokkStore'
import { LooperEngine } from '../audio/looper'
import type { LooperEvent } from '../audio/looper'
import type { BlokkSynth } from '../audio/synth'
import type { DrumSynthEngine } from '../audio/drumSynth'
import { getDiatonicChord } from '../logic/diatonic'
import { applyJoystickMod } from '../logic/joystickMods'
import { chordToMidiNotes } from '../logic/chordToNotes'
import type { ChordButtonIndex } from '../types/music'

export function useLooper(
  synthRef: React.RefObject<BlokkSynth | null>,
  drumEngineRef: React.RefObject<DrumSynthEngine | null>,
) {
  const looperRef = useRef<LooperEngine | null>(null)
  const activeLooperTrack = useBlokkStore((s) => s.activeLooperTrack)
  const isMetronomeOn = useBlokkStore((s) => s.isMetronomeOn)
  const activeButton = useBlokkStore((s) => s.activeChordButton)
  const mode = useBlokkStore((s) => s.mode)

  useEffect(() => {
    const looper = new LooperEngine()
    looperRef.current = looper

    looper.setStateChangeCallback((trackIndex, status, barCount) => {
      useBlokkStore.getState().setLooperTrackStatus(trackIndex, status, barCount)
    })

    return () => {
      looper.dispose()
    }
  }, [])

  useEffect(() => {
    if (looperRef.current) {
      looperRef.current.metronomeEnabled = isMetronomeOn
    }
  }, [isMetronomeOn])

  const replayCallback = useCallback((event: LooperEvent) => {
    const synth = synthRef.current
    const drumEngine = drumEngineRef.current
    if (!synth) return

    const isDrum = event.mode === 'DRUMMODE' || event.mode === 'AUTODRUM'

    if (isDrum && drumEngine && event.button) {
      drumEngine.triggerButton(event.button as ChordButtonIndex)
    } else {
      synth.triggerChord(event.notes)
    }
  }, [synthRef, drumEngineRef])

  useEffect(() => {
    const looper = looperRef.current
    if (!looper || !activeButton) return
    if (!looper.isAnyTrackRecording()) return

    const recordTrack = looper.getTrackStatus(0) === 'RECORD' ? 0 : looper.getTrackStatus(1) === 'RECORD' ? 1 : null
    if (recordTrack === null) return

    const store = useBlokkStore.getState()
    const isDrum = mode === 'DRUMMODE' || mode === 'AUTODRUM'

    if (isDrum) {
      looper.recordEvent(recordTrack, {
        notes: [activeButton],
        mode,
        button: activeButton,
      })
    } else {
      const chord = getDiatonicChord(store.key, store.scale, activeButton)
      const btnState = store.chordButtons[activeButton]
      const baseType = btnState.lockedType ?? chord.type
      const modType = applyJoystickMod(baseType, store.joystickDirection, store.joystickMode)
      const octave = 4 + store.globalOctave + btnState.octaveShift
      const notes = chordToMidiNotes(chord.root, modType, btnState.inversion, octave)
      looper.recordEvent(recordTrack, { notes, mode })
    }
  }, [activeButton, mode])

  const cycleLooper = useCallback(() => {
    const looper = looperRef.current
    if (!looper) return
    looper.cycleState(activeLooperTrack, replayCallback)
  }, [activeLooperTrack, replayCallback])

  const setBarCount = useCallback((delta: number) => {
    const looper = looperRef.current
    if (!looper) return
    const current = looper.getTrackBarCount(activeLooperTrack)
    looper.setBarCount(activeLooperTrack, current + delta)
  }, [activeLooperTrack])

  const bounceToLooper = useCallback((events: LooperEvent[], duration: number) => {
    const looper = looperRef.current
    if (!looper) return
    const freeTrack = looper.getFirstFreeTrack()
    if (freeTrack === null) return
    looper.bounceEvents(freeTrack, events, duration, replayCallback)
  }, [replayCallback])

  return { looperRef, cycleLooper, setBarCount, bounceToLooper }
}
