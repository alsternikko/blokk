type DrumVoice = 'kick' | 'snare' | 'hihat' | 'tom' | 'ride' | 'perc1' | 'perc2'

/**
 * A 16-step drum pattern. Each step is an array of voices that trigger on that step.
 */
export type DrumPattern = DrumVoice[][]

export const PATTERN_NAMES = ['ROCK', 'DISCO', 'REGGAE', 'FUNK', 'HIP-HOP', 'ELECTRO', 'JAZZ'] as const
export type PatternName = (typeof PATTERN_NAMES)[number]

export const VARIATION_NAMES = [
  'ORIGINAL', 'GHOST', 'BUSY HH', 'SYNCOPATED',
  'FILLS', 'HALF-TIME', 'DOUBLE-TIME', 'COMPLEX',
] as const

function p(voices: string): DrumVoice[] {
  if (!voices) return []
  return voices.split(',') as DrumVoice[]
}

const ROCK_BASE: DrumPattern = [
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
]

const DISCO_BASE: DrumPattern = [
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p('hihat'),
]

const REGGAE_BASE: DrumPattern = [
  p('kick'), p(''), p('hihat'), p('snare'),
  p(''), p('kick'), p('hihat'), p(''),
  p('kick'), p(''), p('hihat'), p('snare'),
  p(''), p('kick'), p('hihat'), p(''),
]

const FUNK_BASE: DrumPattern = [
  p('kick,hihat'), p('hihat'), p('snare,hihat'), p(''),
  p('kick'), p('hihat'), p('snare,hihat'), p('kick'),
  p('hihat'), p('kick,hihat'), p('snare,hihat'), p('hihat'),
  p('kick'), p(''), p('snare,hihat'), p('hihat'),
]

const HIPHOP_BASE: DrumPattern = [
  p('kick,hihat'), p('hihat'), p('hihat'), p('snare,hihat'),
  p('hihat'), p('kick,hihat'), p('hihat'), p('hihat'),
  p('kick,hihat'), p('hihat'), p('hihat'), p('snare,hihat'),
  p('hihat'), p('kick'), p('hihat'), p('hihat'),
]

const ELECTRO_BASE: DrumPattern = [
  p('kick'), p(''), p('hihat'), p(''),
  p('snare'), p(''), p('hihat'), p('kick'),
  p(''), p('kick'), p('hihat'), p(''),
  p('snare'), p(''), p('hihat'), p('kick'),
]

const JAZZ_BASE: DrumPattern = [
  p('ride,kick'), p(''), p('ride'), p(''),
  p('ride'), p(''), p('ride,hihat'), p(''),
  p('ride'), p('kick'), p('ride'), p(''),
  p('ride'), p(''), p('ride,hihat'), p(''),
]

function addGhostNotes(pattern: DrumPattern): DrumPattern {
  return pattern.map((step, i) => {
    if (step.length === 0 && i % 2 === 1) return ['snare' as DrumVoice]
    return step
  })
}

function busyHihats(pattern: DrumPattern): DrumPattern {
  return pattern.map((step) => {
    if (!step.includes('hihat' as DrumVoice) && !step.includes('ride' as DrumVoice)) {
      return [...step, 'hihat' as DrumVoice]
    }
    return step
  })
}

function syncopateKicks(pattern: DrumPattern): DrumPattern {
  return pattern.map((step, i) => {
    const hasKick = step.includes('kick' as DrumVoice)
    if (hasKick && i % 4 === 0) {
      return step.filter((v) => v !== 'kick')
    }
    if (!hasKick && i % 4 === 3) {
      return [...step, 'kick' as DrumVoice]
    }
    return step
  })
}

function addFills(pattern: DrumPattern): DrumPattern {
  return pattern.map((step, i) => {
    if (i >= 12) return [...step, 'tom' as DrumVoice]
    return step
  })
}

function halfTime(pattern: DrumPattern): DrumPattern {
  const result: DrumPattern = []
  for (let i = 0; i < 16; i++) {
    result.push(i % 2 === 0 ? pattern[Math.floor(i / 2)] : [])
  }
  return result
}

function doubleTime(pattern: DrumPattern): DrumPattern {
  const result: DrumPattern = []
  for (let i = 0; i < 16; i++) {
    result.push(pattern[i % 8])
  }
  return result
}

function complexify(pattern: DrumPattern): DrumPattern {
  return addGhostNotes(syncopateKicks(busyHihats(pattern)))
}

function buildVariations(base: DrumPattern): DrumPattern[] {
  return [
    base,
    addGhostNotes(base),
    busyHihats(base),
    syncopateKicks(base),
    addFills(base),
    halfTime(base),
    doubleTime(base),
    complexify(base),
  ]
}

const ALL_PATTERNS: Record<PatternName, DrumPattern[]> = {
  ROCK:     buildVariations(ROCK_BASE),
  DISCO:    buildVariations(DISCO_BASE),
  REGGAE:   buildVariations(REGGAE_BASE),
  FUNK:     buildVariations(FUNK_BASE),
  'HIP-HOP': buildVariations(HIPHOP_BASE),
  ELECTRO:  buildVariations(ELECTRO_BASE),
  JAZZ:     buildVariations(JAZZ_BASE),
}

export function getDrumPattern(pattern: PatternName, variation: number): DrumPattern {
  const v = Math.max(0, Math.min(7, variation))
  return ALL_PATTERNS[pattern][v]
}
