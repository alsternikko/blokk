import * as Tone from 'tone'

export function setBPM(bpm: number): void {
  Tone.getTransport().bpm.value = Math.max(60, Math.min(190, bpm))
}

export function getBPM(): number {
  return Tone.getTransport().bpm.value
}

export function startTransport(): void {
  if (Tone.getTransport().state !== 'started') {
    Tone.getTransport().start()
  }
}

export function stopTransport(): void {
  Tone.getTransport().stop()
}

export function getTransportState(): string {
  return Tone.getTransport().state
}

/**
 * Convert a delay rate string (e.g. "1/4") to seconds at current BPM.
 */
export function delayRateToSeconds(rate: string): number {
  const bpm = Tone.getTransport().bpm.value
  const quarterNote = 60 / bpm

  switch (rate) {
    case '1/4':   return quarterNote
    case '1/8':   return quarterNote / 2
    case '1/16':  return quarterNote / 4
    case '1/16T': return quarterNote / 3
    case '1/32':  return quarterNote / 8
    default:      return quarterNote
  }
}
