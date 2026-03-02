import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { useBlokkStore } from '../store/useBlokkStore'
import { getDiatonicChord } from '../logic/diatonic'
import { applyJoystickMod } from '../logic/joystickMods'
import { chordToMidiNotes } from '../logic/chordToNotes'
import { BlokkSynth } from '../audio/synth'
import { DrumSynthEngine } from '../audio/drumSynth'
import {
  createEffectChain,
  toggleReverb,
  toggleDelay,
  toggleChorus,
  setFilterCutoff,
  setDelayTime,
  setReverbWet,
  setDelayWet,
  disposeEffectChain,
} from '../audio/effects'
import type { EffectChain } from '../audio/effects'
import { ModeEngine } from '../audio/modes'
import { setBPM, delayRateToSeconds } from '../audio/transport'
import { PATTERN_NAMES } from '../logic/drumPatterns'
import { sendChordOn, sendChordOff } from '../audio/midiOut'

export function useChordTrigger() {
  const synthRef = useRef<BlokkSynth | null>(null)
  const effectChainRef = useRef<EffectChain | null>(null)
  const modeEngineRef = useRef<ModeEngine | null>(null)
  const drumEngineRef = useRef<DrumSynthEngine | null>(null)

  const activeButton = useBlokkStore((s) => s.activeChordButton)
  const key = useBlokkStore((s) => s.key)
  const scale = useBlokkStore((s) => s.scale)
  const globalOctave = useBlokkStore((s) => s.globalOctave)
  const joystickDir = useBlokkStore((s) => s.joystickDirection)
  const joystickMode = useBlokkStore((s) => s.joystickMode)
  const waveform = useBlokkStore((s) => s.waveform)
  const adsrPreset = useBlokkStore((s) => s.adsrPreset)
  const effects = useBlokkStore((s) => s.effects)
  const chordButtons = useBlokkStore((s) => s.chordButtons)
  const mode = useBlokkStore((s) => s.mode)
  const bpm = useBlokkStore((s) => s.bpm)
  const delayRate = useBlokkStore((s) => s.delayRate)
  const strumSpeed = useBlokkStore((s) => s.strumSpeed)
  const arpPattern = useBlokkStore((s) => s.arpPattern)
  const arpChordMode = useBlokkStore((s) => s.arpChordMode)
  const rhythmRate = useBlokkStore((s) => s.rhythmRate)
  const drumKit = useBlokkStore((s) => s.drumKit)
  const drumLoopPattern = useBlokkStore((s) => s.drumLoopPattern)
  const drumLoopVariation = useBlokkStore((s) => s.drumLoopVariation)
  const xyPadX = useBlokkStore((s) => s.xyPadX)
  const xyPadY = useBlokkStore((s) => s.xyPadY)

  // Init audio engine
  useEffect(() => {
    const chain = createEffectChain()
    const synth = new BlokkSynth(chain.input)
    const drumEngine = new DrumSynthEngine(Tone.getDestination())
    const engine = new ModeEngine()
    engine.setDrumEngine(drumEngine)

    effectChainRef.current = chain
    synthRef.current = synth
    modeEngineRef.current = engine
    drumEngineRef.current = drumEngine

    return () => {
      engine.stop(synth)
      synth.dispose()
      drumEngine.dispose()
      disposeEffectChain(chain)
    }
  }, [])

  // Waveform changes
  useEffect(() => {
    synthRef.current?.setWaveform(waveform)
  }, [waveform])

  // ADSR preset changes
  useEffect(() => {
    synthRef.current?.setADSR(adsrPreset)
  }, [adsrPreset])

  // BPM changes
  useEffect(() => {
    setBPM(bpm)
  }, [bpm])

  // Effect toggles (binary on/off from menu)
  useEffect(() => {
    const chain = effectChainRef.current
    if (!chain) return
    toggleChorus(chain, effects.CHORUS.enabled)
    // Reverb/delay/filter are also driven by XY pad; menu toggles only apply
    // when the pad is at its default position (x=1, y=0).
    const padMoved = xyPadX < 1 || xyPadY > 0
    if (!padMoved) {
      toggleReverb(chain, effects.REVERB.enabled)
      toggleDelay(chain, effects.DELAY.enabled)
      setFilterCutoff(chain, effects.FILTER.enabled ? 2000 : 20000)
    }
  }, [effects, xyPadX, xyPadY])

  // XY pad -> continuous filter cutoff + effect space depth
  useEffect(() => {
    const chain = effectChainRef.current
    if (!chain) return
    const cutoffHz = 80 * Math.pow(250, xyPadX)
    setFilterCutoff(chain, cutoffHz)
    setReverbWet(chain, xyPadY * 0.6)
    setDelayWet(chain, xyPadY * 0.4)
  }, [xyPadX, xyPadY])

  // Delay rate
  useEffect(() => {
    const chain = effectChainRef.current
    if (!chain) return
    if (delayRate === 'OFF') {
      toggleDelay(chain, false)
    } else {
      toggleDelay(chain, true)
      setDelayTime(chain, delayRateToSeconds(delayRate))
    }
  }, [delayRate])

  // Mode changes
  useEffect(() => {
    const engine = modeEngineRef.current
    const synth = synthRef.current
    if (!engine || !synth) return
    engine.setMode(mode, synth)

    if (mode === 'EARTRAINER') {
      const store = useBlokkStore.getState()
      engine.eartrainer.setKeyAndScale(store.key, store.scale)
      engine.eartrainer.start(synth)
    }
  }, [mode])

  // Strum speed
  useEffect(() => {
    modeEngineRef.current?.strum.setSpeed(strumSpeed)
  }, [strumSpeed])

  // Arpeggio pattern
  useEffect(() => {
    modeEngineRef.current?.arpeggio.setPattern(arpPattern)
  }, [arpPattern])

  // Arpeggio chord mode
  useEffect(() => {
    modeEngineRef.current?.arpeggio.setChordMode(arpChordMode)
  }, [arpChordMode])

  // Rhythm rate (shared by arp + repeat)
  useEffect(() => {
    modeEngineRef.current?.arpeggio.setRate(rhythmRate)
    modeEngineRef.current?.repeat.setRate(rhythmRate)
  }, [rhythmRate])

  // Drum kit
  useEffect(() => {
    drumEngineRef.current?.setKit(drumKit)
  }, [drumKit])

  // Drum loop pattern & variation
  useEffect(() => {
    const engine = modeEngineRef.current
    if (!engine) return
    const patternName = PATTERN_NAMES[drumLoopPattern] ?? 'ROCK'
    engine.drumloop.setPattern(patternName)
    engine.drumloop.setVariation(drumLoopVariation)
  }, [drumLoopPattern, drumLoopVariation])

  // Sequencer & game mode callbacks
  useEffect(() => {
    const engine = modeEngineRef.current
    if (!engine) return
    const store = useBlokkStore.getState()
    engine.sequencer.setCallbacks({
      onPositionChange: (pos) => store.setSequencerState({ position: pos }),
      onPlayingChange: (playing) => store.setSequencerState({ playing }),
      onStepsChange: (steps, length) =>
        store.setSequencerState({ stepCount: steps.length, length }),
    })
    engine.chordhiro.setCallback((state) => store.setChordHiroState(state))
    engine.eartrainer.setCallback((state) => store.setEarTrainerState(state))
  }, [])

  // Main trigger effect -- handles all modes including drum and sequencer
  useEffect(() => {
    const synth = synthRef.current
    const engine = modeEngineRef.current
    if (!synth || !engine) return

    if (!activeButton) {
      engine.release(synth)
      return
    }

    const isDrum = engine.isDrumMode()

    if (isDrum) {
      if (Tone.getTransport().state !== 'started') {
        Tone.getTransport().start()
      }

      if (mode === 'DRUMMODE') {
        if (joystickDir !== 'CENTER') {
          engine.setMode('AUTODRUM', synth)
          engine.autodrum.startAutoTrigger(activeButton, joystickDir)
        } else {
          if (engine.getMode() === 'AUTODRUM') {
            engine.autodrum.stop()
            engine.setMode('DRUMMODE', synth)
          }
          engine.trigger(synth, [activeButton])
        }
      } else if (mode === 'DRUMLOOPMODE') {
        engine.trigger(synth, [activeButton])
      } else if (mode === 'AUTODRUM') {
        engine.autodrum.startAutoTrigger(activeButton, joystickDir)
      }
      return
    }

    // Compute chord notes for non-drum modes
    const chord = getDiatonicChord(key, scale, activeButton)
    const buttonState = chordButtons[activeButton]
    const baseType = buttonState.lockedType ?? chord.type
    const modifiedType = applyJoystickMod(baseType, joystickDir, joystickMode)
    const octave = 4 + globalOctave + buttonState.octaveShift
    const notes = chordToMidiNotes(chord.root, modifiedType, buttonState.inversion, octave)

    // Sequencer: record step instead of triggering audio
    if (mode === 'SEQUENCER' && engine.sequencer.isRecording()) {
      engine.sequencer.recordStep({
        root: chord.root,
        type: modifiedType,
        inversion: buttonState.inversion,
        octave,
        notes,
        button: activeButton,
      })
      synth.triggerChord(notes)
      return
    }

    // CHORDHIRO: send button press to game
    if (mode === 'CHORDHIRO') {
      engine.chordhiro.handleButtonPress(activeButton)
      synth.triggerChord(notes)
      return
    }

    // EARTRAINER: send guess
    if (mode === 'EARTRAINER') {
      engine.eartrainer.handleGuess(activeButton)
      return
    }

    if (mode === 'ARPEGGIO' || mode === 'REPEAT') {
      if (Tone.getTransport().state !== 'started') {
        Tone.getTransport().start()
      }
    }

    sendChordOn(notes)
    engine.trigger(synth, notes)
  }, [activeButton, key, scale, globalOctave, joystickDir, joystickMode, chordButtons, mode])

  // AUTODRUM joystick direction changes while button held
  useEffect(() => {
    const engine = modeEngineRef.current
    if (!engine || !activeButton) return
    if (mode === 'DRUMMODE' && joystickDir !== 'CENTER') {
      engine.autodrum.startAutoTrigger(activeButton, joystickDir)
    } else if (mode === 'DRUMMODE' && joystickDir === 'CENTER') {
      engine.autodrum.stop()
    }
  }, [joystickDir, activeButton, mode])

  return { synthRef, drumEngineRef, modeEngineRef }
}
