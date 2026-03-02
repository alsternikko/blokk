export type LooperTrackStatus = 'OFF' | 'WAITING' | 'RECORD' | 'LOOP'

export interface LooperTrack {
  status: LooperTrackStatus
  barCount: number
}

export type MenuContext = 'NONE' | 'F1' | 'F2_SOUNDS' | 'F2_EFFECTS' | 'F3_MODE' | 'F3_BPM' | 'PRESET'

export interface DisplayContent {
  line1: string
  line2: string
  status: string
}
