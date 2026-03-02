import type { ChordType, JoystickDirection, JoystickMode } from '../types/music'

type BaseQuality = 'major' | 'minor' | 'dim'

/**
 * DEFAULT mode joystick map.
 * Some directions depend on whether the base chord is major, minor, or dim.
 */
const DEFAULT_MAP: Record<JoystickDirection, Partial<Record<BaseQuality, ChordType>> | ChordType | null> = {
  CENTER:     null,
  UP:         { major: 'minor', minor: 'major', dim: 'major' },
  DOWN:       'sus4',
  LEFT:       { major: 'dim', minor: 'dim', dim: 'minor' },
  RIGHT:      { major: 'maj7', minor: 'min7', dim: 'min7' },
  UP_LEFT:    'aug',
  UP_RIGHT:   'dom7',
  DOWN_LEFT:  { major: 'maj6', minor: 'sus2', dim: 'sus2' },
  DOWN_RIGHT: { major: 'maj9', minor: 'min9', dim: 'min9' },
}

/**
 * EXTENDED mode joystick map.
 * Most directions produce fixed chord types regardless of base.
 */
const EXTENDED_MAP: Record<JoystickDirection, Partial<Record<BaseQuality, ChordType>> | ChordType | null> = {
  CENTER:     null,
  UP:         { major: 'minor', minor: 'major', dim: 'major' },
  DOWN:       'dom7sharp9',
  LEFT:       'sus4_7',
  RIGHT:      'add11',
  UP_LEFT:    'halfDim7',
  UP_RIGHT:   'dom9',
  DOWN_LEFT:  'add9',
  DOWN_RIGHT: 'min11',
}

/**
 * CHROMATIC mode joystick map.
 * Jazz voicings - all fixed chord types.
 */
const CHROMATIC_MAP: Record<JoystickDirection, ChordType | null> = {
  CENTER:     null,
  UP:         'minMaj7',
  DOWN:       'maj13',
  LEFT:       'halfDim7',
  RIGHT:      'sixNine',
  UP_LEFT:    'maj7sharp11',
  UP_RIGHT:   'dom13',
  DOWN_LEFT:  'dom7flat9',
  DOWN_RIGHT: 'dom7alt',
}

function resolveBaseQuality(type: ChordType): BaseQuality {
  if (type === 'dim' || type === 'halfDim7') return 'dim'
  if (
    type === 'minor' ||
    type === 'min7' ||
    type === 'min9' ||
    type === 'min11' ||
    type === 'min6' ||
    type === 'minMaj7'
  )
    return 'minor'
  return 'major'
}

/**
 * Apply a joystick modification to a base chord type.
 *
 * @returns The modified ChordType, or the original if direction is CENTER or no mapping exists.
 */
export function applyJoystickMod(
  baseType: ChordType,
  direction: JoystickDirection,
  joystickMode: JoystickMode,
): ChordType {
  if (direction === 'CENTER') return baseType

  let map: Record<JoystickDirection, Partial<Record<BaseQuality, ChordType>> | ChordType | null>
  switch (joystickMode) {
    case 'DEFAULT':
      map = DEFAULT_MAP
      break
    case 'EXTENDED':
      map = EXTENDED_MAP
      break
    case 'CHROMATIC':
      map = CHROMATIC_MAP as Record<JoystickDirection, ChordType | null>
      break
  }

  const entry = map[direction]
  if (entry === null || entry === undefined) return baseType

  if (typeof entry === 'string') return entry

  const quality = resolveBaseQuality(baseType)
  return entry[quality] ?? baseType
}
