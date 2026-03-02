import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import { midiToNoteName } from '../../logic/noteNames'

export type StrumSpeed = 'SLOW' | 'MEDIUM' | 'FAST'

const STRUM_DELAYS: Record<StrumSpeed, number> = {
  SLOW: 0.2,
  MEDIUM: 0.08,
  FAST: 0.04,
}

export class StrumMode {
  private speed: StrumSpeed = 'MEDIUM'
  private scheduledIds: number[] = []

  setSpeed(speed: StrumSpeed): void {
    this.speed = speed
  }

  getSpeed(): StrumSpeed {
    return this.speed
  }

  trigger(synth: BlokkSynth, notes: number[]): void {
    this.stop()
    synth.releaseAll()

    const delay = STRUM_DELAYS[this.speed]
    const now = Tone.now()

    const noteNames = notes.map(midiToNoteName)
    const activeSynth = synth.getActiveSynth()
    if (!activeSynth) return

    noteNames.forEach((note, i) => {
      const id = Tone.getTransport().scheduleOnce(() => {
        activeSynth.triggerAttack(note, Tone.now())
      }, now + i * delay - Tone.getTransport().seconds)

      this.scheduledIds.push(id)
    })
  }

  release(synth: BlokkSynth): void {
    synth.releaseAll()
  }

  stop(): void {
    this.scheduledIds.forEach((id) => Tone.getTransport().clear(id))
    this.scheduledIds = []
  }
}
