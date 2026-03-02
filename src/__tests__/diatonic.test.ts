import { describe, it, expect } from 'vitest'
import { getDiatonicChord, getAllDiatonicChords } from '../logic/diatonic'

describe('getDiatonicChord', () => {
  describe('C Major scale', () => {
    it('button 1 = C Major', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 1)
      expect(chord).toEqual({ root: 'C', type: 'major', degree: 1 })
    })

    it('button 2 = D minor', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 2)
      expect(chord).toEqual({ root: 'D', type: 'minor', degree: 2 })
    })

    it('button 3 = E minor', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 3)
      expect(chord).toEqual({ root: 'E', type: 'minor', degree: 3 })
    })

    it('button 4 = F Major', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 4)
      expect(chord).toEqual({ root: 'F', type: 'major', degree: 4 })
    })

    it('button 5 = G Major', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 5)
      expect(chord).toEqual({ root: 'G', type: 'major', degree: 5 })
    })

    it('button 6 = A minor', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 6)
      expect(chord).toEqual({ root: 'A', type: 'minor', degree: 6 })
    })

    it('button 7 = B diminished', () => {
      const chord = getDiatonicChord('C', 'MAJOR', 7)
      expect(chord).toEqual({ root: 'B', type: 'dim', degree: 7 })
    })
  })

  describe('G Major scale', () => {
    it('button 1 = G Major', () => {
      expect(getDiatonicChord('G', 'MAJOR', 1)).toEqual({ root: 'G', type: 'major', degree: 1 })
    })

    it('button 5 = D Major', () => {
      expect(getDiatonicChord('G', 'MAJOR', 5)).toEqual({ root: 'D', type: 'major', degree: 5 })
    })
  })

  describe('A Natural Minor scale', () => {
    it('button 1 = A minor', () => {
      expect(getDiatonicChord('A', 'NATURAL_MINOR', 1)).toEqual({ root: 'A', type: 'minor', degree: 1 })
    })

    it('button 3 = C Major', () => {
      expect(getDiatonicChord('A', 'NATURAL_MINOR', 3)).toEqual({ root: 'C', type: 'major', degree: 3 })
    })
  })

  it('getAllDiatonicChords returns 7 chords', () => {
    const chords = getAllDiatonicChords('C', 'MAJOR')
    expect(chords).toHaveLength(7)
    expect(chords[0].root).toBe('C')
    expect(chords[6].root).toBe('B')
  })
})
