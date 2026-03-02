import { describe, it, expect } from 'vitest'
import { chordToMidiNotes } from '../logic/chordToNotes'

describe('chordToMidiNotes', () => {
  it('C Major root position = C4, E4, G4', () => {
    const notes = chordToMidiNotes('C', 'major')
    expect(notes).toEqual([60, 64, 67])
  })

  it('D minor root position = D4, F4, A4', () => {
    const notes = chordToMidiNotes('D', 'minor')
    expect(notes).toEqual([62, 65, 69])
  })

  it('C Major 1st inversion = E4, G4, C5', () => {
    const notes = chordToMidiNotes('C', 'major', 'first')
    expect(notes).toEqual([64, 67, 72])
  })

  it('C Major 2nd inversion = G4, C5, E5', () => {
    const notes = chordToMidiNotes('C', 'major', 'second')
    expect(notes).toEqual([67, 72, 76])
  })

  it('C Maj7 = C4, E4, G4, B4', () => {
    const notes = chordToMidiNotes('C', 'maj7')
    expect(notes).toEqual([60, 64, 67, 71])
  })

  it('B diminished = B4, D5, F5', () => {
    const notes = chordToMidiNotes('B', 'dim')
    expect(notes).toEqual([71, 74, 77])
  })

  it('F# sus4 = F#4, B4, C#5', () => {
    const notes = chordToMidiNotes('F#', 'sus4')
    expect(notes).toEqual([66, 71, 73])
  })

  it('respects octave parameter', () => {
    const notes = chordToMidiNotes('C', 'major', 'root', 3)
    expect(notes).toEqual([48, 52, 55])
  })
})
