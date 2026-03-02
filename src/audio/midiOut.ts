let midiAccess: MIDIAccess | null = null
let midiOutput: MIDIOutput | null = null

export async function initMIDI(): Promise<boolean> {
  if (!navigator.requestMIDIAccess) return false
  try {
    midiAccess = await navigator.requestMIDIAccess()
    const outputs = Array.from(midiAccess.outputs.values())
    midiOutput = outputs[0] ?? null
    return midiOutput !== null
  } catch {
    return false
  }
}

export function getMIDIOutputs(): MIDIOutput[] {
  if (!midiAccess) return []
  return Array.from(midiAccess.outputs.values())
}

export function setMIDIOutput(output: MIDIOutput): void {
  midiOutput = output
}

export function sendNoteOn(note: number, velocity: number = 100, channel: number = 0): void {
  if (!midiOutput) return
  midiOutput.send([0x90 | channel, note, velocity])
}

export function sendNoteOff(note: number, channel: number = 0): void {
  if (!midiOutput) return
  midiOutput.send([0x80 | channel, note, 0])
}

export function sendChordOn(notes: number[], velocity: number = 100, channel: number = 0): void {
  for (const note of notes) {
    sendNoteOn(note, velocity, channel)
  }
}

export function sendChordOff(notes: number[], channel: number = 0): void {
  for (const note of notes) {
    sendNoteOff(note, channel)
  }
}

export function isMIDIAvailable(): boolean {
  return midiOutput !== null
}
