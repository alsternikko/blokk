import * as Tone from 'tone'

let initialized = false

export async function initAudio(): Promise<void> {
  if (initialized) return
  await Tone.start()
  Tone.getDestination().volume.value = -6
  initialized = true
}

export function setMasterVolume(db: number): void {
  Tone.getDestination().volume.value = Math.max(-60, Math.min(0, db))
}

export function isAudioReady(): boolean {
  return initialized && Tone.getContext().state === 'running'
}
