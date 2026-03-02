import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import type { ChordButtonIndex, Key, ChordType, Inversion } from '../../types/music'

export interface SequencerStep {
  root: Key
  type: ChordType
  inversion: Inversion
  octave: number
  notes: number[]
  button: ChordButtonIndex
}

export class SequencerMode {
  private steps: (SequencerStep | null)[] = []
  private maxLength: number = 16
  private position: number = 0
  private recording: boolean = false
  private playing: boolean = false
  private sequence: Tone.Sequence | null = null
  private synth: BlokkSynth | null = null

  private onPositionChange: ((pos: number) => void) | null = null
  private onPlayingChange: ((playing: boolean) => void) | null = null
  private onStepsChange: ((steps: (SequencerStep | null)[], length: number) => void) | null = null

  setCallbacks(cbs: {
    onPositionChange?: (pos: number) => void
    onPlayingChange?: (playing: boolean) => void
    onStepsChange?: (steps: (SequencerStep | null)[], length: number) => void
  }): void {
    this.onPositionChange = cbs.onPositionChange ?? null
    this.onPlayingChange = cbs.onPlayingChange ?? null
    this.onStepsChange = cbs.onStepsChange ?? null
  }

  getSteps(): (SequencerStep | null)[] { return this.steps }
  getPosition(): number { return this.position }
  isRecording(): boolean { return this.recording }
  isPlaying(): boolean { return this.playing }
  getMaxLength(): number { return this.maxLength }

  setMaxLength(len: number): void {
    this.maxLength = Math.max(4, Math.min(16, len))
    if (this.steps.length > this.maxLength) {
      this.steps = this.steps.slice(0, this.maxLength)
    }
    this.onStepsChange?.(this.steps, this.maxLength)
  }

  getFilledStepCount(): number {
    return this.steps.filter((s) => s !== null).length
  }

  startRecording(): void {
    this.stopPlayback()
    this.recording = true
    this.steps = []
    this.position = 0
    this.onPositionChange?.(0)
    this.onStepsChange?.(this.steps, this.maxLength)
  }

  recordStep(step: SequencerStep): boolean {
    if (!this.recording) return false
    if (this.steps.length >= this.maxLength) return false

    this.steps.push(step)
    this.position = this.steps.length
    this.onPositionChange?.(this.position)
    this.onStepsChange?.(this.steps, this.maxLength)

    if (this.steps.length >= this.maxLength) {
      this.recording = false
    }

    return true
  }

  stopRecording(): void {
    this.recording = false
  }

  editStep(index: number, step: SequencerStep): void {
    if (index < 0 || index >= this.steps.length) return
    this.steps[index] = step
    this.onStepsChange?.(this.steps, this.maxLength)
  }

  navigateStep(delta: number): void {
    if (this.steps.length === 0) return
    this.position = (this.position + delta + this.steps.length) % this.steps.length
    this.onPositionChange?.(this.position)
  }

  startPlayback(synth: BlokkSynth): void {
    if (this.steps.length === 0) return
    this.stopPlayback()
    this.synth = synth
    this.playing = true

    const stepIndices = Array.from({ length: this.steps.length }, (_, i) => i)

    this.sequence = new Tone.Sequence(
      (time, stepIdx) => {
        const step = this.steps[stepIdx]
        this.position = stepIdx
        this.onPositionChange?.(stepIdx)

        if (step) {
          const freqs = step.notes.map((n) => Tone.Frequency(n, 'midi').toFrequency())
          const activeSynth = synth.getActiveSynth()
          if (activeSynth) {
            activeSynth.triggerAttackRelease(freqs, '8n', time)
          }
        }
      },
      stepIndices,
      '4n',
    )
    this.sequence.loop = true

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }
    this.sequence.start(0)
    this.onPlayingChange?.(true)
  }

  stopPlayback(): void {
    if (this.sequence) {
      this.sequence.stop()
      this.sequence.dispose()
      this.sequence = null
    }
    this.playing = false
    this.synth = null
    this.onPlayingChange?.(false)
  }

  togglePlayback(synth: BlokkSynth): void {
    if (this.playing) {
      this.stopPlayback()
    } else {
      this.startPlayback(synth)
    }
  }

  getLoopDuration(): number {
    const bpm = Tone.getTransport().bpm.value
    const secondsPerBeat = 60 / bpm
    return this.steps.length * secondsPerBeat
  }

  trigger(_synth: BlokkSynth, _notes: number[]): void {
    // In sequencer mode, buttons record steps or edit steps
  }

  release(_synth: BlokkSynth): void {
    // No sustain release needed
  }

  stop(synth?: BlokkSynth): void {
    this.stopPlayback()
    this.recording = false
  }

  clear(): void {
    this.stopPlayback()
    this.recording = false
    this.steps = []
    this.position = 0
    this.onPositionChange?.(0)
    this.onStepsChange?.(this.steps, this.maxLength)
  }
}
