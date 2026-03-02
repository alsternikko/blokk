import type { Mode } from '../../types/music'
import type { BlokkSynth } from '../synth'
import type { DrumSynthEngine } from '../drumSynth'
import { OneshotMode } from './oneshot'
import { StrumMode } from './strum'
import type { StrumSpeed } from './strum'
import { LeadMode } from './lead'
import { DroneMode } from './drone'
import { ArpeggioMode } from './arpeggio'
import type { ArpPattern, ArpChordMode } from './arpeggio'
import { RepeatMode } from './repeat'
import type { RhythmRate } from './repeat'
import { DrumModeHandler } from './drummode'
import { DrumLoopModeHandler } from './drumloop'
import { AutoDrumHandler } from './autodrum'
import { SequencerMode } from './sequencer'
import { ChordHiroMode } from './chordhiro'
import { EarTrainerMode } from './eartrainer'

export type { StrumSpeed, ArpPattern, ArpChordMode, RhythmRate }

interface ModeHandler {
  trigger(synth: BlokkSynth, notes: number[]): void
  release(synth: BlokkSynth): void
  stop(synth?: BlokkSynth): void
}

export class ModeEngine {
  private handlers: Record<string, ModeHandler>
  private currentMode: Mode = 'ONESHOT'
  readonly oneshot = new OneshotMode()
  readonly strum = new StrumMode()
  readonly lead = new LeadMode()
  readonly drone = new DroneMode()
  readonly arpeggio = new ArpeggioMode()
  readonly repeat = new RepeatMode()
  readonly drummode = new DrumModeHandler()
  readonly drumloop = new DrumLoopModeHandler()
  readonly autodrum = new AutoDrumHandler()
  readonly sequencer = new SequencerMode()
  readonly chordhiro = new ChordHiroMode()
  readonly eartrainer = new EarTrainerMode()

  constructor() {
    this.handlers = {
      ONESHOT: this.oneshot,
      STRUM: this.strum,
      LEAD: this.lead,
      DRONE: this.drone,
      ARPEGGIO: this.arpeggio,
      REPEAT: this.repeat,
      DRUMMODE: this.drummode,
      DRUMLOOPMODE: this.drumloop,
      AUTODRUM: this.autodrum,
      SEQUENCER: this.sequencer,
      CHORDHIRO: this.chordhiro,
      EARTRAINER: this.eartrainer,
    }
  }

  setDrumEngine(engine: DrumSynthEngine): void {
    this.drummode.setDrumEngine(engine)
    this.drumloop.setDrumEngine(engine)
    this.autodrum.setDrumEngine(engine)
  }

  setMode(mode: Mode, synth: BlokkSynth): void {
    if (mode === this.currentMode) return
    const prev = this.handlers[this.currentMode]
    prev?.stop(synth)
    synth.releaseAll()
    this.currentMode = mode
  }

  getMode(): Mode {
    return this.currentMode
  }

  isDrumMode(): boolean {
    return this.currentMode === 'DRUMMODE' ||
           this.currentMode === 'DRUMLOOPMODE' ||
           this.currentMode === 'AUTODRUM'
  }

  trigger(synth: BlokkSynth, notes: number[]): void {
    const handler = this.handlers[this.currentMode]
    if (handler) {
      handler.trigger(synth, notes)
    } else {
      this.oneshot.trigger(synth, notes)
    }
  }

  release(synth: BlokkSynth): void {
    const handler = this.handlers[this.currentMode]
    if (handler) {
      handler.release(synth)
    } else {
      this.oneshot.release(synth)
    }
  }

  stop(synth: BlokkSynth): void {
    const handler = this.handlers[this.currentMode]
    handler?.stop(synth)
  }
}
