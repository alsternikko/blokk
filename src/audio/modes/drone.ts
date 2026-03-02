import type { BlokkSynth } from '../synth'

export class DroneMode {
  trigger(synth: BlokkSynth, notes: number[]): void {
    synth.triggerChord(notes)
  }

  release(_synth: BlokkSynth): void {
    // Drone: do NOT release on button up -- sustain until next chord
  }

  stop(synth: BlokkSynth): void {
    synth.releaseAll()
  }
}
