import type { WaveformType, ADSRPreset, EffectType, DelayRate } from '../types/audio'
import type { ScaleName, Mode } from '../types/music'
import type { ArpPattern, ArpChordMode, StrumSpeed, RhythmRate } from '../audio/modes'
import { useBlokkStore } from './useBlokkStore'

export interface SoundscapeParams {
  waveform: WaveformType
  adsrPreset: ADSRPreset
  effects: EffectType[]
  delayRate: DelayRate
  mode: Mode
  bpm: number
  scale: ScaleName
  arpPattern: ArpPattern
  arpChordMode: ArpChordMode
  strumSpeed: StrumSpeed
  rhythmRate: RhythmRate
  xyPadX: number
  xyPadY: number
}

export interface SoundscapePreset {
  id: string
  name: string
  description: string
  params: SoundscapeParams
}

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'robot_rock',
    name: 'Robot Rock',
    description: 'Filtered French house. Warm saw bass, heavy pump, compressed and loud.',
    params: {
      waveform: 'sawtooth',
      adsrPreset: 'SUSTAIN',
      effects: ['FILTER', 'CHORUS'],
      delayRate: '1/8',
      mode: 'ARPEGGIO',
      bpm: 120,
      scale: 'MAJOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'MEDIUM',
      rhythmRate: '1/8',
      xyPadX: 0.4,
      xyPadY: 0.2,
    },
  },
  {
    id: 'cross',
    name: 'Cross',
    description: 'Distorted, saturated, almost broken. Aggressive square stabs.',
    params: {
      waveform: 'square',
      adsrPreset: 'PLUCK',
      effects: ['FILTER'],
      delayRate: '1/16',
      mode: 'ONESHOT',
      bpm: 128,
      scale: 'NATURAL_MINOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'FAST',
      rhythmRate: '1/16',
      xyPadX: 0.8,
      xyPadY: 0.1,
    },
  },
  {
    id: 'nightcall',
    name: 'Nightcall',
    description: 'Synthwave at golden hour. Slow analog arps, neon-pink melancholy.',
    params: {
      waveform: 'fm_brass',
      adsrPreset: 'SWELL',
      effects: ['REVERB', 'CHORUS', 'DELAY'],
      delayRate: '1/8',
      mode: 'ARPEGGIO',
      bpm: 90,
      scale: 'NATURAL_MINOR',
      arpPattern: 'UP_DOWN',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'SLOW',
      rhythmRate: '1/8',
      xyPadX: 0.5,
      xyPadY: 0.6,
    },
  },
  {
    id: 'hawkins',
    name: 'Hawkins',
    description: 'Retro horror. Cold sequenced minor arps, sparse and unsettling.',
    params: {
      waveform: 'sawtooth',
      adsrPreset: 'LONG',
      effects: ['REVERB', 'DELAY'],
      delayRate: '1/4',
      mode: 'ARPEGGIO',
      bpm: 110,
      scale: 'NATURAL_MINOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'MEDIUM',
      rhythmRate: '1/8',
      xyPadX: 0.35,
      xyPadY: 0.7,
    },
  },
  {
    id: 'tears_in_rain',
    name: 'Tears in Rain',
    description: 'Cinematic dreamscape. Lush evolving pads, brassy CS-80 leads, infinite tail.',
    params: {
      waveform: 'fm_brass',
      adsrPreset: 'SWELL',
      effects: ['REVERB', 'CHORUS'],
      delayRate: 'OFF',
      mode: 'DRONE',
      bpm: 80,
      scale: 'MAJOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'SLOW',
      rhythmRate: '1/8',
      xyPadX: 0.6,
      xyPadY: 0.85,
    },
  },
  {
    id: 'autobahn',
    name: 'Autobahn',
    description: 'Clean robotic minimalism. Pure waveforms, tight sequencer pulses.',
    params: {
      waveform: 'sine',
      adsrPreset: 'PLUCK',
      effects: [],
      delayRate: '1/16',
      mode: 'ARPEGGIO',
      bpm: 130,
      scale: 'MAJOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'FAST',
      rhythmRate: '1/16',
      xyPadX: 0.7,
      xyPadY: 0.0,
    },
  },
  {
    id: 'i_feel_love',
    name: 'I Feel Love',
    description: 'Italo disco engine. Driving 16th-note bass, hypnotic four-on-the-floor.',
    params: {
      waveform: 'sawtooth',
      adsrPreset: 'PLUCK',
      effects: ['DELAY', 'CHORUS'],
      delayRate: '1/16',
      mode: 'ARPEGGIO',
      bpm: 120,
      scale: 'MAJOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'FAST',
      rhythmRate: '1/16',
      xyPadX: 0.55,
      xyPadY: 0.3,
    },
  },
  {
    id: 'geogaddi',
    name: 'Geogaddi',
    description: 'Hazy nostalgic. Detuned wow-and-flutter, woozy pads, half-remembered.',
    params: {
      waveform: 'fm_epiano',
      adsrPreset: 'SWELL',
      effects: ['CHORUS', 'REVERB'],
      delayRate: 'OFF',
      mode: 'DRONE',
      bpm: 75,
      scale: 'MAJOR',
      arpPattern: 'UP',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'SLOW',
      rhythmRate: '1/8',
      xyPadX: 0.3,
      xyPadY: 0.5,
    },
  },
  {
    id: 'selected_ambient',
    name: 'Selected Ambient',
    description: 'Glitchy and unstable. Detuned oscillators, beautifully broken.',
    params: {
      waveform: 'fm_bell',
      adsrPreset: 'SHORT',
      effects: ['DELAY', 'REVERB', 'CHORUS'],
      delayRate: '1/16T',
      mode: 'ARPEGGIO',
      bpm: 110,
      scale: 'NATURAL_MINOR',
      arpPattern: 'RANDOM',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'FAST',
      rhythmRate: '1/16',
      xyPadX: 0.5,
      xyPadY: 0.6,
    },
  },
  {
    id: 'phaedra',
    name: 'Phaedra',
    description: 'Hypnotic sequencer trance. Long evolving arps, deep cosmic pads, meditative.',
    params: {
      waveform: 'sawtooth',
      adsrPreset: 'LONG',
      effects: ['REVERB', 'DELAY', 'CHORUS', 'FILTER'],
      delayRate: '1/16',
      mode: 'ARPEGGIO',
      bpm: 100,
      scale: 'NATURAL_MINOR',
      arpPattern: 'UP_DOWN',
      arpChordMode: 'ARP_ONLY',
      strumSpeed: 'MEDIUM',
      rhythmRate: '1/16',
      xyPadX: 0.5,
      xyPadY: 0.7,
    },
  },
]

export function getPresetById(id: string): SoundscapePreset | undefined {
  return SOUNDSCAPE_PRESETS.find((p) => p.id === id)
}

export function applySoundscapePreset(id: string): void {
  const preset = getPresetById(id)
  if (!preset) return

  const store = useBlokkStore.getState()
  const { params } = preset

  store.setWaveform(params.waveform)
  store.setAdsrPreset(params.adsrPreset)
  store.setDelayRate(params.delayRate)
  store.setMode(params.mode)
  store.setBpm(params.bpm)
  store.setScale(params.scale)
  store.setArpPattern(params.arpPattern)
  store.setArpChordMode(params.arpChordMode)
  store.setStrumSpeed(params.strumSpeed)
  store.setRhythmRate(params.rhythmRate)
  store.setXYPad(params.xyPadX, params.xyPadY)

  const enabledSet = new Set(params.effects)
  const currentEffects = store.effects
  ;(Object.keys(currentEffects) as (keyof typeof currentEffects)[]).forEach((effect) => {
    const shouldBeEnabled = enabledSet.has(effect)
    if (currentEffects[effect].enabled !== shouldBeEnabled) {
      store.toggleEffect(effect)
    }
  })

  store.setCurrentPresetId(preset.id)
}
