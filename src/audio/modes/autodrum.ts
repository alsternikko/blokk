import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import type { DrumSynthEngine } from '../drumSynth'
import type { ChordButtonIndex, JoystickDirection } from '../../types/music'

type DrumVoice = 'kick' | 'snare' | 'hihat' | 'tom' | 'ride' | 'perc1' | 'perc2'

const BUTTON_TO_VOICE: Record<ChordButtonIndex, DrumVoice> = {
  1: 'kick', 2: 'snare', 3: 'hihat', 4: 'tom', 5: 'ride', 6: 'perc1', 7: 'perc2',
}

const DIRECTION_TO_RATE: Record<JoystickDirection, string> = {
  UP:         '4n',
  RIGHT:      '8n',
  DOWN:       '16n',
  LEFT:       '32n',
  UP_RIGHT:   '8n.',   // swing 8th (dotted)
  DOWN_RIGHT: '16n.',  // swing 16th
  DOWN_LEFT:  '8t',    // 16th triplet
  UP_LEFT:    '8n.',   // swing 8th
  CENTER:     '4n',
}

export class AutoDrumHandler {
  private drumEngine: DrumSynthEngine | null = null
  private loop: Tone.Loop | null = null
  private currentVoice: DrumVoice = 'kick'

  setDrumEngine(engine: DrumSynthEngine): void {
    this.drumEngine = engine
  }

  startAutoTrigger(button: ChordButtonIndex, direction: JoystickDirection): void {
    this.stop()
    if (!this.drumEngine || direction === 'CENTER') return

    this.currentVoice = BUTTON_TO_VOICE[button]
    const rate = DIRECTION_TO_RATE[direction]
    const engine = this.drumEngine

    this.loop = new Tone.Loop((time) => {
      engine.triggerVoice(this.currentVoice, time)
    }, rate)

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }
    this.loop.start(0)
  }

  trigger(_synth: BlokkSynth, _notes: number[]): void {
    // Triggered via startAutoTrigger instead
  }

  release(_synth: BlokkSynth): void {
    this.stop()
  }

  stop(): void {
    if (this.loop) {
      this.loop.stop()
      this.loop.dispose()
      this.loop = null
    }
  }
}
