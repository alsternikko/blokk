import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import type { DrumSynthEngine } from '../drumSynth'
import { getDrumPattern, PATTERN_NAMES } from '../../logic/drumPatterns'
import type { PatternName, DrumPattern } from '../../logic/drumPatterns'

type DrumVoice = 'kick' | 'snare' | 'hihat' | 'tom' | 'ride' | 'perc1' | 'perc2'

export class DrumLoopModeHandler {
  private drumEngine: DrumSynthEngine | null = null
  private sequence: Tone.Sequence | null = null
  private activePattern: PatternName = 'ROCK'
  private activeVariation: number = 0
  private playing: boolean = false

  setDrumEngine(engine: DrumSynthEngine): void {
    this.drumEngine = engine
  }

  getActivePattern(): PatternName { return this.activePattern }
  getActiveVariation(): number { return this.activeVariation }
  isPlaying(): boolean { return this.playing }

  setPattern(pattern: PatternName): void {
    this.activePattern = pattern
    if (this.playing) {
      this.restartLoop()
    }
  }

  setVariation(variation: number): void {
    this.activeVariation = Math.max(0, Math.min(7, variation))
    if (this.playing) {
      this.restartLoop()
    }
  }

  trigger(_synth: BlokkSynth, _notes: number[]): void {
    if (this.playing) {
      this.stopLoop()
    } else {
      this.startLoop()
    }
  }

  release(_synth: BlokkSynth): void {
    // Loops continue playing after button release
  }

  startLoop(): void {
    if (!this.drumEngine) return
    this.stopLoop()

    const pattern = getDrumPattern(this.activePattern, this.activeVariation)
    const engine = this.drumEngine

    this.sequence = new Tone.Sequence(
      (time, step) => {
        const voices = pattern[step as number]
        if (voices) {
          for (const voice of voices) {
            engine.triggerVoice(voice as DrumVoice, time)
          }
        }
      },
      Array.from({ length: 16 }, (_, i) => i),
      '16n',
    )
    this.sequence.loop = true

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }
    this.sequence.start(0)
    this.playing = true
  }

  private stopLoop(): void {
    if (this.sequence) {
      this.sequence.stop()
      this.sequence.dispose()
      this.sequence = null
    }
    this.playing = false
  }

  private restartLoop(): void {
    if (this.playing) {
      this.stopLoop()
      this.startLoop()
    }
  }

  stop(): void {
    this.stopLoop()
  }
}
