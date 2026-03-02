import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import { midiToNoteName } from '../../logic/noteNames'

export type RhythmRate = '1/1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/16T' | '1/32'

const RATE_TO_NOTATION: Record<RhythmRate, string> = {
  '1/1': '1n',
  '1/2': '2n',
  '1/4': '4n',
  '1/8': '8n',
  '1/16': '16n',
  '1/16T': '8t',
  '1/32': '32n',
}

export class RepeatMode {
  private rate: RhythmRate = '1/8'
  private loopEvent: Tone.Loop | null = null
  private currentNotes: string[] = []

  setRate(r: RhythmRate): void { this.rate = r }
  getRate(): RhythmRate { return this.rate }

  trigger(synth: BlokkSynth, notes: number[]): void {
    this.stop()

    const noteNames = notes.map(midiToNoteName)
    this.currentNotes = noteNames
    const notation = RATE_TO_NOTATION[this.rate]

    const activeSynth = synth.getActiveSynth()
    if (!activeSynth) return

    this.loopEvent = new Tone.Loop((time) => {
      activeSynth.triggerAttackRelease(noteNames, notation, time)
    }, notation)

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }
    this.loopEvent.start(0)
  }

  release(synth: BlokkSynth): void {
    this.stop()
    synth.releaseAll()
  }

  stop(): void {
    if (this.loopEvent) {
      this.loopEvent.stop()
      this.loopEvent.dispose()
      this.loopEvent = null
    }
    this.currentNotes = []
  }
}
