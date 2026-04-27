import { create } from 'zustand'
import type { Key, ScaleName, JoystickMode, JoystickDirection, Mode, ChordButtonIndex, Inversion } from '../types/music'
import type { WaveformType, ADSRPreset, EffectType, DelayRate, DrumKit } from '../types/audio'
import type { LooperTrack, MenuContext } from '../types/ui'
import type { StrumSpeed, ArpPattern, ArpChordMode, RhythmRate } from '../audio/modes'

interface EffectState {
  enabled: boolean
}

interface ChordButtonState {
  lockedType: null | import('../types/music').ChordType
  octaveShift: number
  inversion: Inversion
}

interface BlokkState {
  key: Key
  scale: ScaleName
  globalOctave: number
  mode: Mode
  bpm: number
  waveform: WaveformType
  adsrPreset: ADSRPreset
  voiceCount: 1 | 2 | 4 | 8
  joystickMode: JoystickMode
  joystickDirection: JoystickDirection
  activeChordButton: ChordButtonIndex | null
  chordButtons: Record<ChordButtonIndex, ChordButtonState>
  effects: Record<EffectType, EffectState>
  delayRate: DelayRate
  strumSpeed: StrumSpeed
  arpPattern: ArpPattern
  arpChordMode: ArpChordMode
  rhythmRate: RhythmRate
  drumKit: DrumKit
  drumLoopPattern: number
  drumLoopVariation: number
  drumLoopPlaying: boolean
  sequencerStepCount: number
  sequencerLength: number
  sequencerPosition: number
  sequencerPlaying: boolean
  sequencerRecording: boolean
  chordHiroState: {
    playing: boolean; songIndex: number; score: number; combo: number;
    maxCombo: number; currentNoteIndex: number; results: string[]; countdown: number;
  } | null
  earTrainerState: {
    active: boolean; difficulty: string; score: number; total: number;
    streak: number; guessResult: 'correct' | 'wrong' | null;
    progressionLength: number; progressionCurrent: number;
  } | null
  looperTracks: [LooperTrack, LooperTrack]
  activeLooperTrack: 0 | 1
  isMetronomeOn: boolean
  xyPadX: number
  xyPadY: number
  activeMenu: MenuContext
  audioUnlocked: boolean
  currentPresetId: string | null

  setXYPad: (x: number, y: number) => void
  setKey: (key: Key) => void
  setScale: (scale: ScaleName) => void
  setGlobalOctave: (octave: number) => void
  setMode: (mode: Mode) => void
  setBpm: (bpm: number) => void
  setWaveform: (wf: WaveformType) => void
  setAdsrPreset: (preset: ADSRPreset) => void
  setVoiceCount: (count: 1 | 2 | 4 | 8) => void
  setJoystickMode: (mode: JoystickMode) => void
  setJoystickDirection: (dir: JoystickDirection) => void
  setActiveChordButton: (btn: ChordButtonIndex | null) => void
  setChordButtonLock: (btn: ChordButtonIndex, type: import('../types/music').ChordType | null) => void
  setChordButtonInversion: (btn: ChordButtonIndex, inv: Inversion) => void
  setChordButtonOctave: (btn: ChordButtonIndex, shift: number) => void
  toggleEffect: (effect: EffectType) => void
  setDelayRate: (rate: DelayRate) => void
  setStrumSpeed: (speed: StrumSpeed) => void
  setArpPattern: (pattern: ArpPattern) => void
  setArpChordMode: (mode: ArpChordMode) => void
  setRhythmRate: (rate: RhythmRate) => void
  setDrumKit: (kit: DrumKit) => void
  setDrumLoopPattern: (pattern: number) => void
  setDrumLoopVariation: (variation: number) => void
  setDrumLoopPlaying: (playing: boolean) => void
  setSequencerState: (state: Partial<{ stepCount: number; length: number; position: number; playing: boolean; recording: boolean }>) => void
  setChordHiroState: (state: BlokkState['chordHiroState']) => void
  setEarTrainerState: (state: BlokkState['earTrainerState']) => void
  setLooperTrackStatus: (trackIndex: 0 | 1, status: import('../types/ui').LooperTrackStatus, barCount?: number) => void
  setActiveLooperTrack: (track: 0 | 1) => void
  setMetronome: (on: boolean) => void
  setActiveMenu: (menu: MenuContext) => void
  setAudioUnlocked: (unlocked: boolean) => void
  setCurrentPresetId: (id: string | null) => void
}

const defaultChordButton = (): ChordButtonState => ({
  lockedType: null,
  octaveShift: 0,
  inversion: 'root',
})

const defaultEffects = (): Record<EffectType, EffectState> => ({
  REVERB: { enabled: false },
  DELAY: { enabled: false },
  TREMOLO: { enabled: false },
  CHORUS: { enabled: false },
  FLANGER: { enabled: false },
  FILTER: { enabled: false },
  GLIDE: { enabled: false },
  STEREO: { enabled: false },
})

export const useBlokkStore = create<BlokkState>((set) => ({
  key: 'C',
  scale: 'MAJOR',
  globalOctave: 0,
  mode: 'ONESHOT',
  bpm: 120,
  waveform: 'sawtooth',
  adsrPreset: 'SUSTAIN',
  voiceCount: 8,
  joystickMode: 'DEFAULT',
  joystickDirection: 'CENTER',
  activeChordButton: null,
  chordButtons: {
    1: defaultChordButton(),
    2: defaultChordButton(),
    3: defaultChordButton(),
    4: defaultChordButton(),
    5: defaultChordButton(),
    6: defaultChordButton(),
    7: defaultChordButton(),
  },
  effects: defaultEffects(),
  delayRate: 'OFF',
  strumSpeed: 'MEDIUM',
  arpPattern: 'UP',
  arpChordMode: 'ARP_ONLY',
  rhythmRate: '1/8',
  drumKit: 'TIGHTKIT',
  drumLoopPattern: 0,
  drumLoopVariation: 0,
  drumLoopPlaying: false,
  sequencerStepCount: 0,
  sequencerLength: 16,
  sequencerPosition: 0,
  sequencerPlaying: false,
  sequencerRecording: false,
  chordHiroState: null,
  earTrainerState: null,
  looperTracks: [
    { status: 'OFF', barCount: 0 },
    { status: 'OFF', barCount: 0 },
  ],
  activeLooperTrack: 0,
  xyPadX: 1.0,
  xyPadY: 0.0,
  isMetronomeOn: false,
  activeMenu: 'NONE',
  audioUnlocked: false,
  currentPresetId: null,

  setXYPad: (x, y) => set({ xyPadX: Math.max(0, Math.min(1, x)), xyPadY: Math.max(0, Math.min(1, y)) }),
  setKey: (key) => set({ key }),
  setScale: (scale) => set({ scale }),
  setGlobalOctave: (globalOctave) => set({ globalOctave }),
  setMode: (mode) => set({ mode }),
  setBpm: (bpm) => set({ bpm: Math.max(60, Math.min(190, bpm)) }),
  setWaveform: (waveform) => set({ waveform }),
  setAdsrPreset: (adsrPreset) => set({ adsrPreset }),
  setVoiceCount: (voiceCount) => set({ voiceCount }),
  setJoystickMode: (joystickMode) => set({ joystickMode }),
  setJoystickDirection: (joystickDirection) => set({ joystickDirection }),
  setActiveChordButton: (activeChordButton) => set({ activeChordButton }),
  setChordButtonLock: (btn, type) =>
    set((state) => ({
      chordButtons: {
        ...state.chordButtons,
        [btn]: { ...state.chordButtons[btn], lockedType: type },
      },
    })),
  setChordButtonInversion: (btn, inv) =>
    set((state) => ({
      chordButtons: {
        ...state.chordButtons,
        [btn]: { ...state.chordButtons[btn], inversion: inv },
      },
    })),
  setChordButtonOctave: (btn, shift) =>
    set((state) => ({
      chordButtons: {
        ...state.chordButtons,
        [btn]: { ...state.chordButtons[btn], octaveShift: Math.max(-2, Math.min(2, shift)) },
      },
    })),
  toggleEffect: (effect) =>
    set((state) => ({
      effects: {
        ...state.effects,
        [effect]: { enabled: !state.effects[effect].enabled },
      },
    })),
  setDelayRate: (delayRate) => set({ delayRate }),
  setStrumSpeed: (strumSpeed) => set({ strumSpeed }),
  setArpPattern: (arpPattern) => set({ arpPattern }),
  setArpChordMode: (arpChordMode) => set({ arpChordMode }),
  setRhythmRate: (rhythmRate) => set({ rhythmRate }),
  setDrumKit: (drumKit) => set({ drumKit }),
  setDrumLoopPattern: (drumLoopPattern) => set({ drumLoopPattern }),
  setDrumLoopVariation: (drumLoopVariation) => set({ drumLoopVariation }),
  setDrumLoopPlaying: (drumLoopPlaying) => set({ drumLoopPlaying }),
  setSequencerState: (partial) =>
    set((state) => ({
      sequencerStepCount: partial.stepCount ?? state.sequencerStepCount,
      sequencerLength: partial.length ?? state.sequencerLength,
      sequencerPosition: partial.position ?? state.sequencerPosition,
      sequencerPlaying: partial.playing ?? state.sequencerPlaying,
      sequencerRecording: partial.recording ?? state.sequencerRecording,
    })),
  setChordHiroState: (chordHiroState) => set({ chordHiroState }),
  setEarTrainerState: (earTrainerState) => set({ earTrainerState }),
  setLooperTrackStatus: (trackIndex, status, barCount) =>
    set((state) => {
      const tracks = [...state.looperTracks] as [LooperTrack, LooperTrack]
      tracks[trackIndex] = {
        status,
        barCount: barCount ?? tracks[trackIndex].barCount,
      }
      return { looperTracks: tracks }
    }),
  setActiveLooperTrack: (activeLooperTrack) => set({ activeLooperTrack }),
  setMetronome: (isMetronomeOn) => set({ isMetronomeOn }),
  setActiveMenu: (activeMenu) => set({ activeMenu }),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),
  setCurrentPresetId: (currentPresetId) => set({ currentPresetId }),
}))
