import type { Key, ChordType, Inversion } from '../types/music'
import { keyToMidi } from './noteNames'

/**
 * Semitone intervals from root for each chord type.
 * These define the "shape" of the chord.
 */
const CHORD_INTERVALS: Record<ChordType, readonly number[]> = {
  major:       [0, 4, 7],
  minor:       [0, 3, 7],
  dim:         [0, 3, 6],
  aug:         [0, 4, 8],
  sus4:        [0, 5, 7],
  sus2:        [0, 2, 7],
  maj7:        [0, 4, 7, 11],
  min7:        [0, 3, 7, 10],
  dom7:        [0, 4, 7, 10],
  halfDim7:    [0, 3, 6, 10],
  maj6:        [0, 4, 7, 9],
  min6:        [0, 3, 7, 9],
  maj9:        [0, 4, 7, 11, 14],
  min9:        [0, 3, 7, 10, 14],
  dom9:        [0, 4, 7, 10, 14],
  min11:       [0, 3, 7, 10, 14, 17],
  add9:        [0, 4, 7, 14],
  add11:       [0, 4, 7, 17],
  sus4_7:      [0, 5, 7, 10],
  dom7sharp9:  [0, 4, 7, 10, 15],
  minMaj7:     [0, 3, 7, 11],
  maj13:       [0, 4, 7, 11, 14, 21],
  dom13:       [0, 4, 7, 10, 14, 21],
  maj7sharp11: [0, 4, 7, 11, 18],
  dom7flat9:   [0, 4, 7, 10, 13],
  dom7alt:     [0, 4, 6, 10, 13],
  sixNine:     [0, 4, 7, 9, 14],
}

/**
 * Apply inversion by raising the lowest N notes up an octave.
 */
function applyInversion(notes: number[], inversion: Inversion): number[] {
  const sorted = [...notes].sort((a, b) => a - b)
  if (inversion === 'root') return sorted

  const count = inversion === 'first' ? 1 : 2
  for (let i = 0; i < count && i < sorted.length; i++) {
    sorted[i] += 12
  }
  return sorted.sort((a, b) => a - b)
}

/**
 * Convert a chord (root + type) to an array of MIDI note numbers.
 *
 * @param root - Root note name (e.g. 'C', 'F#')
 * @param type - Chord quality
 * @param inversion - Voicing inversion
 * @param octave - Base octave (default 4)
 * @returns Array of MIDI note numbers, sorted low to high
 */
export function chordToMidiNotes(
  root: Key,
  type: ChordType,
  inversion: Inversion = 'root',
  octave: number = 4,
): number[] {
  const rootMidi = keyToMidi(root, octave)
  const intervals = CHORD_INTERVALS[type]
  const rawNotes = intervals.map((interval) => rootMidi + interval)
  return applyInversion(rawNotes, inversion)
}

/**
 * Get the interval array for a chord type (useful for analysis/display).
 */
export function getChordIntervals(type: ChordType): readonly number[] {
  return CHORD_INTERVALS[type]
}
