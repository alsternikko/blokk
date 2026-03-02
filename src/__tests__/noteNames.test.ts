import { describe, it, expect } from 'vitest'
import { midiToNoteName, noteNameToMidi, keyToMidi } from '../logic/noteNames'

describe('noteNames', () => {
  it('converts MIDI 60 to C4', () => {
    expect(midiToNoteName(60)).toBe('C4')
  })

  it('converts MIDI 69 to A4', () => {
    expect(midiToNoteName(69)).toBe('A4')
  })

  it('converts C4 to MIDI 60', () => {
    expect(noteNameToMidi('C4')).toBe(60)
  })

  it('converts A4 to MIDI 69', () => {
    expect(noteNameToMidi('A4')).toBe(69)
  })

  it('round-trips correctly', () => {
    for (let midi = 21; midi <= 108; midi++) {
      expect(noteNameToMidi(midiToNoteName(midi))).toBe(midi)
    }
  })

  it('keyToMidi returns correct values', () => {
    expect(keyToMidi('C', 4)).toBe(60)
    expect(keyToMidi('A', 4)).toBe(69)
    expect(keyToMidi('C', 3)).toBe(48)
    expect(keyToMidi('F#', 4)).toBe(66)
  })
})
