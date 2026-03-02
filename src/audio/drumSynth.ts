import * as Tone from 'tone'
import type { DrumKit } from '../types/audio'
import type { ChordButtonIndex } from '../types/music'

type DrumVoice = 'kick' | 'snare' | 'hihat' | 'tom' | 'ride' | 'perc1' | 'perc2'

const BUTTON_TO_VOICE: Record<ChordButtonIndex, DrumVoice> = {
  1: 'kick', 2: 'snare', 3: 'hihat', 4: 'tom', 5: 'ride', 6: 'perc1', 7: 'perc2',
}

interface KitParams {
  kick:  { freq: number; decay: number; volume: number }
  snare: { freq: number; noiseType: 'white' | 'pink'; decay: number; volume: number }
  hihat: { freq: number; decay: number; volume: number }
  tom:   { freq: number; decay: number; volume: number }
  ride:  { freq: number; decay: number; volume: number }
  perc1: { freq: number; decay: number; volume: number }
  perc2: { freq: number; decay: number; volume: number }
}

const KIT_PARAMS: Record<DrumKit, KitParams> = {
  TIGHTKIT: {
    kick:  { freq: 55,  decay: 0.3,  volume: 0 },
    snare: { freq: 200, noiseType: 'white', decay: 0.15, volume: -3 },
    hihat: { freq: 800, decay: 0.04, volume: -8 },
    tom:   { freq: 120, decay: 0.25, volume: -2 },
    ride:  { freq: 600, decay: 0.4,  volume: -10 },
    perc1: { freq: 300, decay: 0.08, volume: -6 },
    perc2: { freq: 450, decay: 0.06, volume: -6 },
  },
  x0x_BOX: {
    kick:  { freq: 40,  decay: 0.5,  volume: 2 },
    snare: { freq: 180, noiseType: 'white', decay: 0.2, volume: -2 },
    hihat: { freq: 1000, decay: 0.03, volume: -8 },
    tom:   { freq: 80,  decay: 0.35, volume: -1 },
    ride:  { freq: 700, decay: 0.5,  volume: -10 },
    perc1: { freq: 250, decay: 0.1,  volume: -5 },
    perc2: { freq: 500, decay: 0.08, volume: -5 },
  },
  x9x_BOX: {
    kick:  { freq: 50,  decay: 0.25, volume: 2 },
    snare: { freq: 220, noiseType: 'pink', decay: 0.12, volume: -1 },
    hihat: { freq: 900, decay: 0.02, volume: -7 },
    tom:   { freq: 100, decay: 0.2,  volume: 0 },
    ride:  { freq: 650, decay: 0.35, volume: -9 },
    perc1: { freq: 350, decay: 0.07, volume: -5 },
    perc2: { freq: 550, decay: 0.05, volume: -5 },
  },
  LYNN_KIT: {
    kick:  { freq: 60,  decay: 0.4,  volume: 0 },
    snare: { freq: 190, noiseType: 'pink', decay: 0.18, volume: -3 },
    hihat: { freq: 750, decay: 0.05, volume: -9 },
    tom:   { freq: 110, decay: 0.3,  volume: -2 },
    ride:  { freq: 580, decay: 0.45, volume: -11 },
    perc1: { freq: 280, decay: 0.09, volume: -6 },
    perc2: { freq: 420, decay: 0.07, volume: -6 },
  },
  KR78: {
    kick:  { freq: 65,  decay: 0.2,  volume: -1 },
    snare: { freq: 210, noiseType: 'white', decay: 0.1, volume: -4 },
    hihat: { freq: 850, decay: 0.025, volume: -10 },
    tom:   { freq: 130, decay: 0.2,  volume: -3 },
    ride:  { freq: 550, decay: 0.3,  volume: -12 },
    perc1: { freq: 320, decay: 0.06, volume: -7 },
    perc2: { freq: 480, decay: 0.05, volume: -7 },
  },
  TRAP_BOX: {
    kick:  { freq: 35,  decay: 0.6,  volume: 3 },
    snare: { freq: 170, noiseType: 'white', decay: 0.22, volume: -1 },
    hihat: { freq: 1200, decay: 0.02, volume: -6 },
    tom:   { freq: 70,  decay: 0.4,  volume: 0 },
    ride:  { freq: 800, decay: 0.5,  volume: -9 },
    perc1: { freq: 200, decay: 0.12, volume: -4 },
    perc2: { freq: 600, decay: 0.08, volume: -4 },
  },
}

export const VOICE_LABELS: Record<DrumVoice, string> = {
  kick: 'KICK', snare: 'SNARE', hihat: 'HIHAT',
  tom: 'TOM', ride: 'RIDE', perc1: 'PERC1', perc2: 'PERC2',
}

export class DrumSynthEngine {
  private kickSynth: Tone.MembraneSynth
  private snareSynth: Tone.NoiseSynth
  private snareBody: Tone.MembraneSynth
  private metalSynth: Tone.MetalSynth
  private tomSynth: Tone.MembraneSynth
  private percSynth1: Tone.MembraneSynth
  private percSynth2: Tone.MetalSynth
  private output: Tone.ToneAudioNode
  private currentKit: DrumKit = 'TIGHTKIT'

  constructor(output: Tone.ToneAudioNode = Tone.getDestination()) {
    this.output = output

    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 6, oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).connect(output)

    this.snareBody = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 4, oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
      volume: -8,
    }).connect(output)

    this.snareSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
      volume: -6,
    }).connect(output)

    this.metalSynth = new Tone.MetalSynth({
      frequency: 800, envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5, volume: -10,
    }).connect(output)

    this.tomSynth = new Tone.MembraneSynth({
      pitchDecay: 0.03, octaves: 4, oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
      volume: -4,
    }).connect(output)

    this.percSynth1 = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 2, oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
      volume: -8,
    }).connect(output)

    this.percSynth2 = new Tone.MetalSynth({
      frequency: 450, envelope: { attack: 0.001, decay: 0.06, release: 0.01 },
      harmonicity: 3, modulationIndex: 16, resonance: 3000, octaves: 1, volume: -8,
    }).connect(output)

    this.applyKit('TIGHTKIT')
  }

  setKit(kit: DrumKit): void {
    this.currentKit = kit
    this.applyKit(kit)
  }

  getKit(): DrumKit {
    return this.currentKit
  }

  private applyKit(kit: DrumKit): void {
    const p = KIT_PARAMS[kit]
    this.kickSynth.set({ envelope: { decay: p.kick.decay }, volume: p.kick.volume })
    this.snareSynth.set({
      noise: { type: p.snare.noiseType },
      envelope: { decay: p.snare.decay },
      volume: p.snare.volume,
    })
    this.metalSynth.set({
      frequency: p.hihat.freq,
      envelope: { decay: p.hihat.decay },
      volume: p.hihat.volume,
    })
    this.tomSynth.set({ envelope: { decay: p.tom.decay }, volume: p.tom.volume })
    this.percSynth1.set({ envelope: { decay: p.perc1.decay }, volume: p.perc1.volume })
    this.percSynth2.set({
      frequency: p.perc2.freq,
      envelope: { decay: p.perc2.decay },
      volume: p.perc2.volume,
    })
  }

  triggerVoice(voice: DrumVoice, time?: number): void {
    const t = time ?? Tone.now()
    const p = KIT_PARAMS[this.currentKit]
    switch (voice) {
      case 'kick':
        this.kickSynth.triggerAttackRelease(p.kick.freq, '8n', t)
        break
      case 'snare':
        this.snareBody.triggerAttackRelease(p.snare.freq, '16n', t)
        this.snareSynth.triggerAttackRelease('16n', t)
        break
      case 'hihat':
        this.metalSynth.triggerAttackRelease('32n', t)
        break
      case 'tom':
        this.tomSynth.triggerAttackRelease(p.tom.freq, '8n', t)
        break
      case 'ride':
        this.metalSynth.triggerAttackRelease('8n', t, 0.4)
        break
      case 'perc1':
        this.percSynth1.triggerAttackRelease(p.perc1.freq, '16n', t)
        break
      case 'perc2':
        this.percSynth2.triggerAttackRelease('32n', t)
        break
    }
  }

  triggerButton(button: ChordButtonIndex, time?: number): void {
    const voice = BUTTON_TO_VOICE[button]
    this.triggerVoice(voice, time)
  }

  getVoiceForButton(button: ChordButtonIndex): DrumVoice {
    return BUTTON_TO_VOICE[button]
  }

  dispose(): void {
    this.kickSynth.dispose()
    this.snareSynth.dispose()
    this.snareBody.dispose()
    this.metalSynth.dispose()
    this.tomSynth.dispose()
    this.percSynth1.dispose()
    this.percSynth2.dispose()
  }
}
