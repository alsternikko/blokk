import * as Tone from 'tone'
import type { WaveformType, ADSRPreset } from '../types/audio'
import { getADSRValues } from './adsr'
import { midiToNoteName } from '../logic/noteNames'

type ToneOscType = 'sine' | 'sawtooth' | 'triangle' | 'square'

const ANALOG_WAVEFORMS: Record<string, ToneOscType> = {
  sine: 'sine',
  sawtooth: 'sawtooth',
  triangle: 'triangle',
  square: 'square',
}

const FM_PRESETS: Record<string, { modulationIndex: number; harmonicity: number }> = {
  fm_epiano: { modulationIndex: 3.5, harmonicity: 2 },
  fm_hx7:    { modulationIndex: 8, harmonicity: 3.5 },
  fm_bell:   { modulationIndex: 12, harmonicity: 5.4 },
  fm_organ:  { modulationIndex: 2, harmonicity: 1 },
  fm_brass:  { modulationIndex: 5, harmonicity: 1 },
}

export class BlokkSynth {
  private polySynth: Tone.PolySynth | null = null
  private fmSynth: Tone.PolySynth<Tone.FMSynth> | null = null
  private currentType: 'analog' | 'fm' = 'analog'
  private output: Tone.ToneAudioNode
  private activeNotes: string[] = []

  constructor(output: Tone.ToneAudioNode = Tone.getDestination()) {
    this.output = output
    this.createAnalogSynth('sawtooth')
  }

  private createAnalogSynth(waveform: ToneOscType): void {
    this.dispose()
    this.polySynth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 12,
      oscillator: { type: waveform },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.5 },
    }).connect(this.output)
    this.polySynth.volume.value = -8
    this.currentType = 'analog'
  }

  private createFMSynth(preset: { modulationIndex: number; harmonicity: number }): void {
    this.dispose()
    this.fmSynth = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 12,
      modulationIndex: preset.modulationIndex,
      harmonicity: preset.harmonicity,
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.5 },
    }).connect(this.output)
    this.fmSynth.volume.value = -8
    this.currentType = 'fm'
  }

  setWaveform(waveform: WaveformType): void {
    const analog = ANALOG_WAVEFORMS[waveform]
    if (analog) {
      this.createAnalogSynth(analog)
      return
    }

    const fmPreset = FM_PRESETS[waveform]
    if (fmPreset) {
      this.createFMSynth(fmPreset)
      return
    }

    this.createAnalogSynth('sawtooth')
  }

  setADSR(preset: ADSRPreset): void {
    const vals = getADSRValues(preset)
    const synth = this.getActiveSynth()
    if (!synth) return
    synth.set({
      envelope: {
        attack: vals.attack,
        decay: vals.decay,
        sustain: vals.sustain,
        release: vals.release,
      },
    })
  }

  triggerChord(midiNotes: number[]): void {
    this.releaseAll()
    const noteNames = midiNotes.map(midiToNoteName)
    this.activeNotes = noteNames
    const synth = this.getActiveSynth()
    if (!synth) return
    synth.triggerAttack(noteNames, Tone.now())
  }

  releaseAll(): void {
    if (this.activeNotes.length === 0) return
    const synth = this.getActiveSynth()
    if (synth) {
      synth.triggerRelease(this.activeNotes, Tone.now())
    }
    this.activeNotes = []
  }

  connectTo(node: Tone.ToneAudioNode): void {
    this.output = node
    const synth = this.getActiveSynth()
    if (synth) {
      synth.disconnect()
      synth.connect(node)
    }
  }

  getActiveSynth(): Tone.PolySynth | Tone.PolySynth<Tone.FMSynth> | null {
    return this.currentType === 'analog' ? this.polySynth : this.fmSynth
  }

  dispose(): void {
    this.releaseAll()
    this.polySynth?.dispose()
    this.fmSynth?.dispose()
    this.polySynth = null
    this.fmSynth = null
  }
}
