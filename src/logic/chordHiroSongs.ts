import type { ChordButtonIndex } from '../types/music'

export interface ChordHiroNote {
  button: ChordButtonIndex
  beatOffset: number
}

export interface ChordHiroSong {
  name: string
  bpm: number
  notes: ChordHiroNote[]
}

export const CHORDHIRO_SONGS: ChordHiroSong[] = [
  {
    name: 'POP CLASSIC',
    bpm: 120,
    notes: [
      { button: 1, beatOffset: 0 },
      { button: 5, beatOffset: 4 },
      { button: 6, beatOffset: 8 },
      { button: 4, beatOffset: 12 },
      { button: 1, beatOffset: 16 },
      { button: 5, beatOffset: 20 },
      { button: 6, beatOffset: 24 },
      { button: 4, beatOffset: 28 },
    ],
  },
  {
    name: 'ROCK ANTHEM',
    bpm: 130,
    notes: [
      { button: 1, beatOffset: 0 },
      { button: 4, beatOffset: 4 },
      { button: 5, beatOffset: 8 },
      { button: 1, beatOffset: 12 },
      { button: 1, beatOffset: 16 },
      { button: 4, beatOffset: 20 },
      { button: 5, beatOffset: 24 },
      { button: 4, beatOffset: 28 },
    ],
  },
  {
    name: 'JAZZ WALK',
    bpm: 100,
    notes: [
      { button: 2, beatOffset: 0 },
      { button: 5, beatOffset: 2 },
      { button: 1, beatOffset: 4 },
      { button: 4, beatOffset: 6 },
      { button: 2, beatOffset: 8 },
      { button: 5, beatOffset: 10 },
      { button: 3, beatOffset: 12 },
      { button: 6, beatOffset: 14 },
      { button: 2, beatOffset: 16 },
      { button: 5, beatOffset: 18 },
      { button: 1, beatOffset: 20 },
      { button: 4, beatOffset: 22 },
    ],
  },
  {
    name: 'BALLAD',
    bpm: 80,
    notes: [
      { button: 1, beatOffset: 0 },
      { button: 6, beatOffset: 4 },
      { button: 4, beatOffset: 8 },
      { button: 5, beatOffset: 12 },
      { button: 1, beatOffset: 16 },
      { button: 3, beatOffset: 20 },
      { button: 4, beatOffset: 24 },
      { button: 5, beatOffset: 28 },
    ],
  },
  {
    name: 'FAST SHUFFLE',
    bpm: 150,
    notes: [
      { button: 1, beatOffset: 0 },
      { button: 4, beatOffset: 2 },
      { button: 5, beatOffset: 4 },
      { button: 1, beatOffset: 6 },
      { button: 6, beatOffset: 8 },
      { button: 4, beatOffset: 10 },
      { button: 5, beatOffset: 12 },
      { button: 1, beatOffset: 14 },
      { button: 2, beatOffset: 16 },
      { button: 5, beatOffset: 18 },
      { button: 1, beatOffset: 20 },
      { button: 4, beatOffset: 22 },
    ],
  },
]
