import { describe, it, expect } from 'vitest'
import { getDrumPattern, PATTERN_NAMES } from '../logic/drumPatterns'

describe('drumPatterns', () => {
  it('has 7 pattern names', () => {
    expect(PATTERN_NAMES).toHaveLength(7)
  })

  it('each pattern returns a 16-step array', () => {
    for (const name of PATTERN_NAMES) {
      const pattern = getDrumPattern(name, 0)
      expect(pattern).toHaveLength(16)
    }
  })

  it('each pattern has 8 variations', () => {
    for (const name of PATTERN_NAMES) {
      for (let v = 0; v < 8; v++) {
        const pattern = getDrumPattern(name, v)
        expect(pattern).toHaveLength(16)
      }
    }
  })

  it('ROCK base pattern has kick on step 0', () => {
    const pattern = getDrumPattern('ROCK', 0)
    expect(pattern[0]).toContain('kick')
  })

  it('ROCK base pattern has snare on step 2', () => {
    const pattern = getDrumPattern('ROCK', 0)
    expect(pattern[2]).toContain('snare')
  })

  it('variation 1 (ghost notes) adds snare on odd empty steps', () => {
    const base = getDrumPattern('ROCK', 0)
    const ghost = getDrumPattern('ROCK', 1)
    const baseEmptyOddSteps = base.filter((s, i) => s.length === 0 && i % 2 === 1).length
    const ghostFilledOddSteps = ghost.filter((s, i) => s.length > 0 && i % 2 === 1).length
    expect(ghostFilledOddSteps).toBeGreaterThanOrEqual(baseEmptyOddSteps)
  })

  it('clamps variation out of range', () => {
    const p = getDrumPattern('JAZZ', 99)
    expect(p).toHaveLength(16)
  })
})
