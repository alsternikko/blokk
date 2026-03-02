import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import { midiToNoteName } from '../../logic/noteNames'

export type ArpPattern = 'UP' | 'DOWN' | 'UP_DOWN' | 'RANDOM' | 'FINGERPICK'
export type ArpChordMode = 'ARP_ONLY' | 'CHORD_ARP' | 'RHYTHM_ARP'
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

function buildSequence(notes: number[], pattern: ArpPattern): number[] {
  const sorted = [...notes].sort((a, b) => a - b)
  switch (pattern) {
    case 'UP':
      return sorted
    case 'DOWN':
      return [...sorted].reverse()
    case 'UP_DOWN': {
      if (sorted.length <= 1) return sorted
      const down = [...sorted].reverse().slice(1, -1)
      return [...sorted, ...down]
    }
    case 'RANDOM':
      return sorted.map((_, i, arr) => arr[Math.floor(Math.random() * arr.length)])
    case 'FINGERPICK': {
      if (sorted.length < 3) return sorted
      const [root, ...upper] = sorted
      const result: number[] = []
      for (let i = 0; i < upper.length; i++) {
        result.push(root, upper[i])
      }
      return result
    }
  }
}

export class ArpeggioMode {
  private pattern: ArpPattern = 'UP'
  private chordMode: ArpChordMode = 'ARP_ONLY'
  private rate: RhythmRate = '1/8'
  private loopEvent: Tone.Sequence | null = null
  private currentNotes: number[] = []

  setPattern(p: ArpPattern): void { this.pattern = p }
  getPattern(): ArpPattern { return this.pattern }
  setChordMode(m: ArpChordMode): void { this.chordMode = m }
  getChordMode(): ArpChordMode { return this.chordMode }
  setRate(r: RhythmRate): void {
    this.rate = r
    if (this.loopEvent) {
      this.restart()
    }
  }
  getRate(): RhythmRate { return this.rate }

  trigger(synth: BlokkSynth, notes: number[]): void {
    this.stop()
    this.currentNotes = notes

    if (this.chordMode === 'CHORD_ARP') {
      synth.triggerChord(notes)
    }

    const seq = buildSequence(notes, this.pattern)
    const noteNames = seq.map(midiToNoteName)
    const notation = RATE_TO_NOTATION[this.rate]

    const activeSynth = synth.getActiveSynth()
    if (!activeSynth) return

    this.loopEvent = new Tone.Sequence(
      (time, note) => {
        activeSynth.triggerAttackRelease(note, notation, time)
      },
      noteNames,
      notation,
    )
    this.loopEvent.loop = true

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
  }

  private restart(): void {
    if (this.currentNotes.length === 0) return
    // Will be re-triggered via useChordTrigger when rate changes
  }
}
