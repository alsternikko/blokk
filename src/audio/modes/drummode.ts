import type { BlokkSynth } from '../synth'
import type { DrumSynthEngine } from '../drumSynth'
import type { ChordButtonIndex } from '../../types/music'

export class DrumModeHandler {
  private drumEngine: DrumSynthEngine | null = null

  setDrumEngine(engine: DrumSynthEngine): void {
    this.drumEngine = engine
  }

  trigger(_synth: BlokkSynth, notes: number[]): void {
    if (!this.drumEngine) return
    const button = notes[0] as ChordButtonIndex
    if (button >= 1 && button <= 7) {
      this.drumEngine.triggerButton(button as ChordButtonIndex)
    }
  }

  release(_synth: BlokkSynth): void {
    // Drum hits are one-shots, no sustained release needed
  }

  stop(): void {
    // Nothing ongoing to stop
  }
}
