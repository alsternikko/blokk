import type { BlokkSynth } from '../synth'
import type { ChordButtonIndex } from '../../types/music'
import type { ChordHiroSong, ChordHiroNote } from '../../logic/chordHiroSongs'

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
export type HitResult = 'PERFECT' | 'GREAT' | 'OK' | 'MISS'

const TIMING_WINDOWS: Record<Difficulty, { perfect: number; great: number; ok: number }> = {
  EASY:   { perfect: 100, great: 200, ok: 300 },
  MEDIUM: { perfect: 75,  great: 150, ok: 250 },
  HARD:   { perfect: 50,  great: 100, ok: 200 },
  EXPERT: { perfect: 25,  great: 50,  ok: 100 },
}

export interface ChordHiroState {
  playing: boolean
  songIndex: number
  difficulty: Difficulty
  score: number
  combo: number
  maxCombo: number
  currentNoteIndex: number
  results: HitResult[]
  countdown: number
}

export class ChordHiroMode {
  private song: ChordHiroSong | null = null
  private state: ChordHiroState = this.defaultState()
  private startTime: number = 0
  private animFrameId: number = 0

  private onStateChange: ((state: ChordHiroState) => void) | null = null

  private defaultState(): ChordHiroState {
    return {
      playing: false,
      songIndex: 0,
      difficulty: 'MEDIUM',
      score: 0,
      combo: 0,
      maxCombo: 0,
      currentNoteIndex: 0,
      results: [],
      countdown: 0,
    }
  }

  setCallback(cb: (state: ChordHiroState) => void): void {
    this.onStateChange = cb
  }

  getState(): ChordHiroState { return { ...this.state } }

  setSong(song: ChordHiroSong, index: number): void {
    this.song = song
    this.state.songIndex = index
    this.notify()
  }

  setDifficulty(d: Difficulty): void {
    this.state.difficulty = d
    this.notify()
  }

  start(): void {
    if (!this.song) return
    this.state = {
      ...this.defaultState(),
      songIndex: this.state.songIndex,
      difficulty: this.state.difficulty,
      playing: true,
      countdown: 3,
    }
    this.notify()

    let count = 3
    const countdownInterval = setInterval(() => {
      count--
      this.state.countdown = count
      this.notify()
      if (count <= 0) {
        clearInterval(countdownInterval)
        this.startTime = performance.now()
        this.runGameLoop()
      }
    }, 1000)
  }

  private runGameLoop(): void {
    const loop = () => {
      if (!this.state.playing || !this.song) return

      const elapsed = performance.now() - this.startTime
      const beatDuration = (60 / this.song.bpm) * 1000
      const notes = this.song.notes

      // Auto-miss notes that passed timing window
      const windows = TIMING_WINDOWS[this.state.difficulty]
      while (
        this.state.currentNoteIndex < notes.length &&
        this.getNoteTimeMs(notes[this.state.currentNoteIndex]) + windows.ok < elapsed
      ) {
        this.state.results.push('MISS')
        this.state.combo = 0
        this.state.currentNoteIndex++
        this.notify()
      }

      if (this.state.currentNoteIndex >= notes.length) {
        this.state.playing = false
        this.notify()
        return
      }

      this.animFrameId = requestAnimationFrame(loop)
    }
    this.animFrameId = requestAnimationFrame(loop)
  }

  private getNoteTimeMs(note: ChordHiroNote): number {
    if (!this.song) return 0
    return (note.beatOffset * 60 / this.song.bpm) * 1000
  }

  handleButtonPress(button: ChordButtonIndex): HitResult | null {
    if (!this.state.playing || !this.song) return null
    if (this.state.currentNoteIndex >= this.song.notes.length) return null

    const note = this.song.notes[this.state.currentNoteIndex]
    const elapsed = performance.now() - this.startTime
    const noteTime = this.getNoteTimeMs(note)
    const diff = Math.abs(elapsed - noteTime)

    const windows = TIMING_WINDOWS[this.state.difficulty]

    let result: HitResult
    if (note.button !== button) {
      result = 'MISS'
    } else if (diff <= windows.perfect) {
      result = 'PERFECT'
    } else if (diff <= windows.great) {
      result = 'GREAT'
    } else if (diff <= windows.ok) {
      result = 'OK'
    } else {
      result = 'MISS'
    }

    const scores: Record<HitResult, number> = { PERFECT: 300, GREAT: 200, OK: 100, MISS: 0 }
    this.state.score += scores[result] * (1 + Math.floor(this.state.combo / 10))

    if (result !== 'MISS') {
      this.state.combo++
      this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo)
    } else {
      this.state.combo = 0
    }

    this.state.results.push(result)
    this.state.currentNoteIndex++

    if (this.state.currentNoteIndex >= this.song.notes.length) {
      this.state.playing = false
    }

    this.notify()
    return result
  }

  private notify(): void {
    this.onStateChange?.({ ...this.state })
  }

  trigger(_synth: BlokkSynth, _notes: number[]): void {}
  release(_synth: BlokkSynth): void {}

  stop(): void {
    this.state.playing = false
    cancelAnimationFrame(this.animFrameId)
    this.notify()
  }
}
