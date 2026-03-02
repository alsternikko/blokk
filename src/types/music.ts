export const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export type Key = (typeof KEYS)[number]

export const SCALE_NAMES = [
  'MAJOR',
  'NATURAL_MINOR',
  'HARMONIC_MINOR',
  'MELODIC_MINOR',
  'MAJOR_PENTATONIC',
  'MINOR_PENTATONIC',
  'BLUES',
  'DORIAN',
  'MIXOLYDIAN',
  'LYDIAN',
] as const
export type ScaleName = (typeof SCALE_NAMES)[number]

export const CHORD_TYPES = [
  'major',
  'minor',
  'dim',
  'aug',
  'sus4',
  'sus2',
  'maj7',
  'min7',
  'dom7',
  'halfDim7',
  'maj6',
  'min6',
  'maj9',
  'min9',
  'dom9',
  'min11',
  'add9',
  'add11',
  'sus4_7',
  'dom7sharp9',
  'minMaj7',
  'maj13',
  'dom13',
  'maj7sharp11',
  'dom7flat9',
  'dom7alt',
  'sixNine',
] as const
export type ChordType = (typeof CHORD_TYPES)[number]

export type ChordButtonIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const JOYSTICK_DIRECTIONS = [
  'UP',
  'DOWN',
  'LEFT',
  'RIGHT',
  'UP_LEFT',
  'UP_RIGHT',
  'DOWN_LEFT',
  'DOWN_RIGHT',
  'CENTER',
] as const
export type JoystickDirection = (typeof JOYSTICK_DIRECTIONS)[number]

export const JOYSTICK_MODES = ['DEFAULT', 'EXTENDED', 'CHROMATIC'] as const
export type JoystickMode = (typeof JOYSTICK_MODES)[number]

export const MODES = [
  'ONESHOT',
  'STRUM',
  'LEAD',
  'DRONE',
  'ARPEGGIO',
  'REPEAT',
  'DRUMMODE',
  'DRUMLOOPMODE',
  'AUTODRUM',
  'SEQUENCER',
  'CHORDHIRO',
  'EARTRAINER',
] as const
export type Mode = (typeof MODES)[number]

export interface ChordInfo {
  root: Key
  type: ChordType
  degree: number
}

export const INVERSIONS = ['root', 'first', 'second'] as const
export type Inversion = (typeof INVERSIONS)[number]
