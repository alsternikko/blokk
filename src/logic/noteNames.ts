import type { Key } from '../types/music'
import { KEYS } from '../types/music'

/**
 * Convert a MIDI note number to a note name with octave (e.g. 60 -> "C4").
 */
export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = ((midi % 12) + 12) % 12
  return `${KEYS[noteIndex]}${octave}`
}

/**
 * Convert a note name with octave to MIDI number (e.g. "C4" -> 60).
 */
export function noteNameToMidi(name: string): number {
  const match = name.match(/^([A-G]#?)(-?\d+)$/)
  if (!match) throw new Error(`Invalid note name: ${name}`)
  const [, note, octaveStr] = match
  const noteIndex = KEYS.indexOf(note as Key)
  if (noteIndex === -1) throw new Error(`Invalid note: ${note}`)
  return (parseInt(octaveStr) + 1) * 12 + noteIndex
}

/**
 * Get the MIDI note number for a given key at a reference octave (default 4).
 */
export function keyToMidi(key: Key, octave: number = 4): number {
  return (octave + 1) * 12 + KEYS.indexOf(key)
}
