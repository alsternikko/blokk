import type { Key, ScaleName, ChordButtonIndex, ChordInfo } from '../types/music'
import { KEYS } from '../types/music'
import { SCALE_INTERVALS, SCALE_CHORD_QUALITIES } from './scales'

/**
 * Get the diatonic chord for a given key, scale, and button index (1-7).
 * Returns the root note, chord type, and scale degree.
 */
export function getDiatonicChord(
  key: Key,
  scale: ScaleName,
  button: ChordButtonIndex,
): ChordInfo {
  const degreeIndex = button - 1
  const intervals = SCALE_INTERVALS[scale]
  const qualities = SCALE_CHORD_QUALITIES[scale]

  const rootSemitone = KEYS.indexOf(key) + intervals[degreeIndex]
  const rootNote = KEYS[((rootSemitone % 12) + 12) % 12]

  return {
    root: rootNote,
    type: qualities[degreeIndex],
    degree: button,
  }
}

/**
 * Get all 7 diatonic chords for a given key and scale.
 */
export function getAllDiatonicChords(key: Key, scale: ScaleName): ChordInfo[] {
  return ([1, 2, 3, 4, 5, 6, 7] as ChordButtonIndex[]).map((btn) =>
    getDiatonicChord(key, scale, btn),
  )
}
