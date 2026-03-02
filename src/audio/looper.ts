import * as Tone from 'tone'
import type { LooperTrackStatus } from '../types/ui'
import type { ChordButtonIndex, Mode } from '../types/music'

export interface LooperEvent {
  time: number
  notes: number[]
  mode: Mode
  button?: ChordButtonIndex
}

interface TrackState {
  status: LooperTrackStatus
  barCount: number
  events: LooperEvent[]
  loopDuration: number
  part: Tone.Part | null
  recordStartTime: number
}

export class LooperEngine {
  private tracks: [TrackState, TrackState]
  private metronomeLoop: Tone.Loop | null = null
  private metronomeSynth: Tone.MembraneSynth | null = null
  private _metronomeEnabled: boolean = false
  private onStateChange: ((trackIndex: 0 | 1, status: LooperTrackStatus, barCount: number) => void) | null = null

  constructor() {
    this.tracks = [this.createTrack(), this.createTrack()]
  }

  private createTrack(): TrackState {
    return {
      status: 'OFF',
      barCount: 0,
      events: [],
      loopDuration: 0,
      part: null,
      recordStartTime: 0,
    }
  }

  setStateChangeCallback(cb: (trackIndex: 0 | 1, status: LooperTrackStatus, barCount: number) => void): void {
    this.onStateChange = cb
  }

  private notifyState(trackIndex: 0 | 1): void {
    const t = this.tracks[trackIndex]
    this.onStateChange?.(trackIndex, t.status, t.barCount)
  }

  getTrackStatus(trackIndex: 0 | 1): LooperTrackStatus {
    return this.tracks[trackIndex].status
  }

  getTrackBarCount(trackIndex: 0 | 1): number {
    return this.tracks[trackIndex].barCount
  }

  setBarCount(trackIndex: 0 | 1, count: number): void {
    if (this.tracks[trackIndex].status !== 'WAITING') return
    this.tracks[trackIndex].barCount = Math.max(0, Math.min(8, count))
    this.notifyState(trackIndex)
  }

  cycleState(trackIndex: 0 | 1, replayCallback?: (event: LooperEvent) => void): void {
    const track = this.tracks[trackIndex]
    switch (track.status) {
      case 'OFF':
        track.status = 'WAITING'
        track.events = []
        track.barCount = 0
        this.notifyState(trackIndex)
        break
      case 'WAITING':
        this.startRecording(trackIndex)
        break
      case 'RECORD':
        this.stopRecording(trackIndex, replayCallback)
        break
      case 'LOOP':
        this.stopPlayback(trackIndex)
        break
    }
  }

  private startRecording(trackIndex: 0 | 1): void {
    const track = this.tracks[trackIndex]
    track.status = 'RECORD'
    track.events = []

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }

    track.recordStartTime = Tone.getTransport().seconds
    this.startMetronome()
    this.notifyState(trackIndex)
  }

  recordEvent(trackIndex: 0 | 1, event: Omit<LooperEvent, 'time'>): void {
    const track = this.tracks[trackIndex]
    if (track.status !== 'RECORD') return

    const relativeTime = Tone.getTransport().seconds - track.recordStartTime
    track.events.push({ ...event, time: relativeTime })
  }

  private stopRecording(trackIndex: 0 | 1, replayCallback?: (event: LooperEvent) => void): void {
    const track = this.tracks[trackIndex]
    this.stopMetronome()

    const elapsed = Tone.getTransport().seconds - track.recordStartTime

    if (track.barCount > 0) {
      const beatsPerBar = 4
      const secondsPerBeat = 60 / Tone.getTransport().bpm.value
      track.loopDuration = track.barCount * beatsPerBar * secondsPerBeat
    } else {
      track.loopDuration = elapsed
    }

    // Track 2 syncs to Track 1
    if (trackIndex === 1 && this.tracks[0].status === 'LOOP' && this.tracks[0].loopDuration > 0) {
      track.loopDuration = this.tracks[0].loopDuration
    }

    if (track.events.length === 0) {
      track.status = 'OFF'
      this.notifyState(trackIndex)
      return
    }

    track.status = 'LOOP'
    this.startPlayback(trackIndex, replayCallback)
    this.notifyState(trackIndex)
  }

  private startPlayback(trackIndex: 0 | 1, replayCallback?: (event: LooperEvent) => void): void {
    const track = this.tracks[trackIndex]
    this.stopPart(trackIndex)

    if (!replayCallback || track.events.length === 0) return

    const partEvents = track.events.map((evt) => ({
      time: evt.time,
      notes: evt.notes,
      mode: evt.mode,
      button: evt.button,
    }))

    const part = new Tone.Part((time, value) => {
      replayCallback({ ...value, time })
    }, partEvents.map((evt) => [evt.time, evt]))

    part.loop = true
    part.loopEnd = track.loopDuration
    part.start(0)

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }

    track.part = part
  }

  private stopPlayback(trackIndex: 0 | 1): void {
    this.stopPart(trackIndex)
    const track = this.tracks[trackIndex]
    track.status = 'OFF'
    track.events = []
    track.loopDuration = 0
    this.notifyState(trackIndex)
  }

  private stopPart(trackIndex: 0 | 1): void {
    const part = this.tracks[trackIndex].part
    if (part) {
      part.stop()
      part.dispose()
      this.tracks[trackIndex].part = null
    }
  }

  bounceEvents(trackIndex: 0 | 1, events: LooperEvent[], duration: number, replayCallback?: (event: LooperEvent) => void): void {
    const track = this.tracks[trackIndex]
    if (track.status !== 'OFF') return

    track.events = events
    track.loopDuration = duration
    track.status = 'LOOP'
    this.startPlayback(trackIndex, replayCallback)
    this.notifyState(trackIndex)
  }

  getFirstFreeTrack(): (0 | 1) | null {
    if (this.tracks[0].status === 'OFF') return 0
    if (this.tracks[1].status === 'OFF') return 1
    return null
  }

  get metronomeEnabled(): boolean {
    return this._metronomeEnabled
  }

  set metronomeEnabled(val: boolean) {
    this._metronomeEnabled = val
    if (!val) this.stopMetronome()
  }

  private startMetronome(): void {
    if (!this._metronomeEnabled) return
    this.stopMetronome()

    if (!this.metronomeSynth) {
      this.metronomeSynth = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
        volume: -12,
      }).toDestination()
    }

    const synth = this.metronomeSynth
    this.metronomeLoop = new Tone.Loop((time) => {
      synth.triggerAttackRelease('C5', '32n', time)
    }, '4n')
    this.metronomeLoop.start(0)
  }

  private stopMetronome(): void {
    if (this.metronomeLoop) {
      this.metronomeLoop.stop()
      this.metronomeLoop.dispose()
      this.metronomeLoop = null
    }
  }

  isAnyTrackRecording(): boolean {
    return this.tracks.some((t) => t.status === 'RECORD')
  }

  isAnyTrackLooping(): boolean {
    return this.tracks.some((t) => t.status === 'LOOP')
  }

  dispose(): void {
    this.stopPart(0)
    this.stopPart(1)
    this.stopMetronome()
    this.metronomeSynth?.dispose()
    this.metronomeSynth = null
  }
}
