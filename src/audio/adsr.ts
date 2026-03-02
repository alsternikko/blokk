import type { ADSRPreset, ADSRValues } from '../types/audio'

export const ADSR_PRESET_VALUES: Record<ADSRPreset, ADSRValues> = {
  LONG:    { attack: 0.8,  decay: 0.5,  sustain: 0.7, release: 1.5 },
  SHORT:   { attack: 0.01, decay: 0.1,  sustain: 0.3, release: 0.15 },
  SWELL:   { attack: 1.2,  decay: 0.3,  sustain: 0.8, release: 0.8 },
  PLUCK:   { attack: 0.005,decay: 0.2,  sustain: 0.0, release: 0.1 },
  TOUCH:   { attack: 0.15, decay: 0.25, sustain: 0.6, release: 0.4 },
  SUSTAIN: { attack: 0.02, decay: 0.1,  sustain: 0.9, release: 0.5 },
}

export function getADSRValues(preset: ADSRPreset): ADSRValues {
  return ADSR_PRESET_VALUES[preset]
}
