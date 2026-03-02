export const WAVEFORM_TYPES = [
  'sine',
  'sawtooth',
  'triangle',
  'square',
  'fm_epiano',
  'fm_hx7',
  'fm_bell',
  'fm_organ',
  'fm_brass',
  'juno_poly',
  'ocean_pad',
  'wobble_bass',
] as const
export type WaveformType = (typeof WAVEFORM_TYPES)[number]

export const EFFECT_TYPES = [
  'REVERB',
  'DELAY',
  'TREMOLO',
  'CHORUS',
  'FLANGER',
  'FILTER',
  'GLIDE',
  'STEREO',
] as const
export type EffectType = (typeof EFFECT_TYPES)[number]

export const ADSR_PRESETS = ['LONG', 'SHORT', 'SWELL', 'PLUCK', 'TOUCH', 'SUSTAIN'] as const
export type ADSRPreset = (typeof ADSR_PRESETS)[number]

export interface ADSRValues {
  attack: number
  decay: number
  sustain: number
  release: number
}

export const DELAY_RATES = ['OFF', '1/4', '1/8', '1/16', '1/16T', '1/32'] as const
export type DelayRate = (typeof DELAY_RATES)[number]

export const VOICE_COUNTS = [1, 2, 4, 8] as const
export type VoiceCount = (typeof VOICE_COUNTS)[number]

export const DRUM_KITS = [
  'TIGHTKIT',
  'x0x_BOX',
  'x9x_BOX',
  'LYNN_KIT',
  'KR78',
  'TRAP_BOX',
] as const
export type DrumKit = (typeof DRUM_KITS)[number]
