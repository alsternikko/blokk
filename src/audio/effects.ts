import * as Tone from 'tone'

export interface EffectChain {
  input: Tone.Gain
  reverb: Tone.Reverb
  delay: Tone.FeedbackDelay
  chorus: Tone.Chorus
  filter: Tone.Filter
  output: Tone.Gain
}

export function createEffectChain(): EffectChain {
  const input = new Tone.Gain(1)
  const filter = new Tone.Filter({ frequency: 20000, type: 'lowpass', rolloff: -12 })
  const chorus = new Tone.Chorus({ frequency: 0.5, delayTime: 3.5, depth: 0.7, wet: 0 })
  const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0 })
  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0 })
  const output = new Tone.Gain(1)

  input.chain(filter, chorus, delay, reverb, output)
  output.connect(Tone.getDestination())

  return { input, reverb, delay, chorus, filter, output }
}

export function toggleReverb(chain: EffectChain, enabled: boolean): void {
  chain.reverb.wet.value = enabled ? 0.4 : 0
}

export function toggleDelay(chain: EffectChain, enabled: boolean): void {
  chain.delay.wet.value = enabled ? 0.3 : 0
}

export function toggleChorus(chain: EffectChain, enabled: boolean): void {
  chain.chorus.wet.value = enabled ? 0.5 : 0
}

export function setFilterCutoff(chain: EffectChain, frequency: number): void {
  chain.filter.frequency.value = Math.max(20, Math.min(20000, frequency))
}

export function setFilterQ(chain: EffectChain, q: number): void {
  chain.filter.Q.value = Math.max(0.5, Math.min(15, q))
}

export function setReverbWet(chain: EffectChain, wet: number): void {
  chain.reverb.wet.value = Math.max(0, Math.min(1, wet))
}

export function setDelayWet(chain: EffectChain, wet: number): void {
  chain.delay.wet.value = Math.max(0, Math.min(1, wet))
}

export function setDelayTime(chain: EffectChain, time: string | number): void {
  chain.delay.delayTime.value = time
}

export function disposeEffectChain(chain: EffectChain): void {
  chain.input.dispose()
  chain.filter.dispose()
  chain.chorus.dispose()
  chain.delay.dispose()
  chain.reverb.dispose()
  chain.output.dispose()
}
