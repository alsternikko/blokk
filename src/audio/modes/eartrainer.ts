import * as Tone from 'tone'
import type { BlokkSynth } from '../synth'
import type { ChordButtonIndex, Key, ScaleName } from '../../types/music'
import { getDiatonicChord } from '../../logic/diatonic'
import { chordToMidiNotes } from '../../logic/chordToNotes'
import { keyToMidi } from '../../logic/noteNames'

export type EarTrainerDifficulty = 'BASIC' | 'EXTENDED' | 'PROGRESSION' | 'PROG_EXTENDED'

export interface EarTrainerState {
  active: boolean
  difficulty: EarTrainerDifficulty
  currentAnswer: ChordButtonIndex | null
  guessResult: 'correct' | 'wrong' | null
  score: number
  total: number
  streak: number
  progressionLength: number
  progressionAnswers: ChordButtonIndex[]
  progressionCurrent: number
}

export class EarTrainerMode {
  private state: EarTrainerState = this.defaultState()
  private synth: BlokkSynth | null = null
  private key: Key = 'C'
  private scale: ScaleName = 'MAJOR'
  private onStateChange: ((state: EarTrainerState) => void) | null = null

  private defaultState(): EarTrainerState {
    return {
      active: false,
      difficulty: 'BASIC',
      currentAnswer: null,
      guessResult: null,
      score: 0,
      total: 0,
      streak: 0,
      progressionLength: 1,
      progressionAnswers: [],
      progressionCurrent: 0,
    }
  }

  setCallback(cb: (state: EarTrainerState) => void): void {
    this.onStateChange = cb
  }

  getState(): EarTrainerState { return { ...this.state } }

  setDifficulty(d: EarTrainerDifficulty): void {
    this.state.difficulty = d
    this.state.progressionLength = (d === 'PROGRESSION' || d === 'PROG_EXTENDED') ?
      2 + Math.floor(Math.random() * 3) : 1
    this.notify()
  }

  setKeyAndScale(key: Key, scale: ScaleName): void {
    this.key = key
    this.scale = scale
  }

  start(synth: BlokkSynth): void {
    this.synth = synth
    this.state = { ...this.defaultState(), difficulty: this.state.difficulty, active: true }
    this.state.progressionLength = (this.state.difficulty === 'PROGRESSION' || this.state.difficulty === 'PROG_EXTENDED') ?
      2 + Math.floor(Math.random() * 3) : 1
    this.nextQuestion()
  }

  private nextQuestion(): void {
    if (!this.synth) return

    const isProgression = this.state.difficulty === 'PROGRESSION' || this.state.difficulty === 'PROG_EXTENDED'
    const length = isProgression ? this.state.progressionLength : 1

    const answers: ChordButtonIndex[] = []
    for (let i = 0; i < length; i++) {
      answers.push((Math.floor(Math.random() * 7) + 1) as ChordButtonIndex)
    }

    this.state.progressionAnswers = answers
    this.state.progressionCurrent = 0
    this.state.currentAnswer = answers[0]
    this.state.guessResult = null
    this.notify()

    this.playHint()

    setTimeout(() => {
      this.playAnswer()
    }, 1200)
  }

  playHint(): void {
    if (!this.synth) return
    const rootMidi = keyToMidi(this.key, 4)
    this.synth.triggerChord([rootMidi])
    setTimeout(() => this.synth?.releaseAll(), 800)
  }

  private playAnswer(): void {
    if (!this.synth) return

    const answers = this.state.progressionAnswers
    let delay = 0

    for (const answer of answers) {
      setTimeout(() => {
        if (!this.synth) return
        const chord = getDiatonicChord(this.key, this.scale, answer)
        const notes = chordToMidiNotes(chord.root, chord.type, 'root', 4)
        this.synth.triggerChord(notes)
        setTimeout(() => this.synth?.releaseAll(), 600)
      }, delay)
      delay += 1000
    }
  }

  handleGuess(button: ChordButtonIndex): 'correct' | 'wrong' | null {
    if (!this.state.active) return null

    const expected = this.state.progressionAnswers[this.state.progressionCurrent]
    const correct = button === expected

    if (correct) {
      this.state.progressionCurrent++

      if (this.state.progressionCurrent >= this.state.progressionAnswers.length) {
        this.state.guessResult = 'correct'
        this.state.score++
        this.state.total++
        this.state.streak++
        this.notify()

        setTimeout(() => this.nextQuestion(), 1500)
      } else {
        this.state.currentAnswer = this.state.progressionAnswers[this.state.progressionCurrent]
        this.notify()
      }
      return 'correct'
    } else {
      this.state.guessResult = 'wrong'
      this.state.total++
      this.state.streak = 0
      this.notify()

      setTimeout(() => {
        this.playAnswer()
        setTimeout(() => {
          this.state.progressionCurrent = 0
          this.state.currentAnswer = this.state.progressionAnswers[0]
          this.state.guessResult = null
          this.notify()
        }, this.state.progressionAnswers.length * 1000 + 500)
      }, 800)
      return 'wrong'
    }
  }

  private notify(): void {
    this.onStateChange?.({ ...this.state })
  }

  trigger(_synth: BlokkSynth, _notes: number[]): void {}
  release(_synth: BlokkSynth): void {}

  stop(): void {
    this.state.active = false
    this.notify()
  }
}
