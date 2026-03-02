import { useBlokkStore } from './useBlokkStore'

const PRESET_KEY_PREFIX = 'blokk_preset_'

interface PresetData {
  key: string
  scale: string
  globalOctave: number
  mode: string
  bpm: number
  waveform: string
  adsrPreset: string
  joystickMode: string
  effects: Record<string, { enabled: boolean }>
  delayRate: string
  drumKit: string
}

function capturePreset(): PresetData {
  const s = useBlokkStore.getState()
  return {
    key: s.key,
    scale: s.scale,
    globalOctave: s.globalOctave,
    mode: s.mode,
    bpm: s.bpm,
    waveform: s.waveform,
    adsrPreset: s.adsrPreset,
    joystickMode: s.joystickMode,
    effects: { ...s.effects },
    delayRate: s.delayRate,
    drumKit: s.drumKit,
  }
}

export function savePreset(slot: 0 | 1): void {
  const data = capturePreset()
  localStorage.setItem(PRESET_KEY_PREFIX + slot, JSON.stringify(data))
}

export function loadPreset(slot: 0 | 1): boolean {
  const raw = localStorage.getItem(PRESET_KEY_PREFIX + slot)
  if (!raw) return false

  try {
    const data: PresetData = JSON.parse(raw)
    const s = useBlokkStore.getState()

    s.setKey(data.key as Parameters<typeof s.setKey>[0])
    s.setScale(data.scale as Parameters<typeof s.setScale>[0])
    s.setGlobalOctave(data.globalOctave)
    s.setMode(data.mode as Parameters<typeof s.setMode>[0])
    s.setBpm(data.bpm)
    s.setWaveform(data.waveform as Parameters<typeof s.setWaveform>[0])
    s.setAdsrPreset(data.adsrPreset as Parameters<typeof s.setAdsrPreset>[0])
    s.setJoystickMode(data.joystickMode as Parameters<typeof s.setJoystickMode>[0])
    s.setDelayRate(data.delayRate as Parameters<typeof s.setDelayRate>[0])
    s.setDrumKit(data.drumKit as Parameters<typeof s.setDrumKit>[0])

    return true
  } catch {
    return false
  }
}

export function hasPreset(slot: 0 | 1): boolean {
  return localStorage.getItem(PRESET_KEY_PREFIX + slot) !== null
}
