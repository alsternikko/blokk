import type { BlokkSynth } from '../synth'

export class LeadMode {
  trigger(synth: BlokkSynth, notes: number[]): void {
    if (notes.length === 0) return
    const rootNote = notes[0]
    synth.triggerChord([rootNote])
  }

  release(synth: BlokkSynth): void {
    synth.releaseAll()
  }

  stop(): void {
    // No ongoing process
  }
}
