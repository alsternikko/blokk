import type { ScaleName, ChordType } from '../types/music'

/**
 * Semitone intervals from root for each scale.
 * Each array has 7 entries representing scale degrees 1-7.
 */
export const SCALE_INTERVALS: Record<ScaleName, readonly number[]> = {
  MAJOR:            [0, 2, 4, 5, 7, 9, 11],
  NATURAL_MINOR:    [0, 2, 3, 5, 7, 8, 10],
  HARMONIC_MINOR:   [0, 2, 3, 5, 7, 8, 11],
  MELODIC_MINOR:    [0, 2, 3, 5, 7, 9, 11],
  MAJOR_PENTATONIC: [0, 2, 4, 7, 9, 12, 14],
  MINOR_PENTATONIC: [0, 3, 5, 7, 10, 12, 15],
  BLUES:            [0, 3, 5, 6, 7, 10, 12],
  DORIAN:           [0, 2, 3, 5, 7, 9, 10],
  MIXOLYDIAN:       [0, 2, 4, 5, 7, 9, 10],
  LYDIAN:           [0, 2, 4, 6, 7, 9, 11],
}

/**
 * Default chord quality for each scale degree (1-indexed, array is 0-indexed).
 * Uppercase = major, lowercase = minor, dim = diminished, aug = augmented.
 */
export const SCALE_CHORD_QUALITIES: Record<ScaleName, readonly ChordType[]> = {
  MAJOR:            ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'],
  NATURAL_MINOR:    ['minor', 'dim',   'major', 'minor', 'minor', 'major', 'major'],
  HARMONIC_MINOR:   ['minor', 'dim',   'aug',   'minor', 'major', 'major', 'dim'],
  MELODIC_MINOR:    ['minor', 'minor', 'aug',   'major', 'major', 'dim',   'dim'],
  MAJOR_PENTATONIC: ['major', 'minor', 'major', 'major', 'minor', 'major', 'minor'],
  MINOR_PENTATONIC: ['minor', 'major', 'minor', 'minor', 'major', 'minor', 'major'],
  BLUES:            ['minor', 'major', 'minor', 'dim',   'minor', 'major', 'minor'],
  DORIAN:           ['minor', 'minor', 'major', 'major', 'minor', 'dim',   'major'],
  MIXOLYDIAN:       ['major', 'minor', 'dim',   'major', 'minor', 'minor', 'major'],
  LYDIAN:           ['major', 'major', 'minor', 'dim',   'major', 'minor', 'minor'],
}
