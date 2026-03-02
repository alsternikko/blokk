import type { BlokkSynth } from '../synth'

export class OneshotMode {
  trigger(synth: BlokkSynth, notes: number[]): void {
    synth.triggerChord(notes)
  }

  release(synth: BlokkSynth): void {
    synth.releaseAll()
  }

  stop(): void {
    // No ongoing process to stop
  }
}
