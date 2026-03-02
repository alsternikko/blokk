import { describe, it, expect } from 'vitest'
import { applyJoystickMod } from '../logic/joystickMods'

describe('applyJoystickMod', () => {
  describe('DEFAULT mode', () => {
    it('CENTER returns base type unchanged', () => {
      expect(applyJoystickMod('major', 'CENTER', 'DEFAULT')).toBe('major')
    })

    it('UP on major -> minor', () => {
      expect(applyJoystickMod('major', 'UP', 'DEFAULT')).toBe('minor')
    })

    it('UP on minor -> major', () => {
      expect(applyJoystickMod('minor', 'UP', 'DEFAULT')).toBe('major')
    })

    it('DOWN -> sus4', () => {
      expect(applyJoystickMod('major', 'DOWN', 'DEFAULT')).toBe('sus4')
      expect(applyJoystickMod('minor', 'DOWN', 'DEFAULT')).toBe('sus4')
    })

    it('LEFT on major -> dim', () => {
      expect(applyJoystickMod('major', 'LEFT', 'DEFAULT')).toBe('dim')
    })

    it('RIGHT on major -> maj7', () => {
      expect(applyJoystickMod('major', 'RIGHT', 'DEFAULT')).toBe('maj7')
    })

    it('RIGHT on minor -> min7', () => {
      expect(applyJoystickMod('minor', 'RIGHT', 'DEFAULT')).toBe('min7')
    })

    it('UP_LEFT -> aug', () => {
      expect(applyJoystickMod('major', 'UP_LEFT', 'DEFAULT')).toBe('aug')
    })

    it('UP_RIGHT -> dom7', () => {
      expect(applyJoystickMod('major', 'UP_RIGHT', 'DEFAULT')).toBe('dom7')
    })

    it('DOWN_LEFT on major -> maj6', () => {
      expect(applyJoystickMod('major', 'DOWN_LEFT', 'DEFAULT')).toBe('maj6')
    })

    it('DOWN_LEFT on minor -> sus2', () => {
      expect(applyJoystickMod('minor', 'DOWN_LEFT', 'DEFAULT')).toBe('sus2')
    })

    it('DOWN_RIGHT on major -> maj9', () => {
      expect(applyJoystickMod('major', 'DOWN_RIGHT', 'DEFAULT')).toBe('maj9')
    })

    it('DOWN_RIGHT on minor -> min9', () => {
      expect(applyJoystickMod('minor', 'DOWN_RIGHT', 'DEFAULT')).toBe('min9')
    })
  })

  describe('EXTENDED mode', () => {
    it('UP on major -> minor', () => {
      expect(applyJoystickMod('major', 'UP', 'EXTENDED')).toBe('minor')
    })

    it('DOWN -> dom7sharp9', () => {
      expect(applyJoystickMod('major', 'DOWN', 'EXTENDED')).toBe('dom7sharp9')
    })

    it('LEFT -> sus4_7', () => {
      expect(applyJoystickMod('major', 'LEFT', 'EXTENDED')).toBe('sus4_7')
    })

    it('RIGHT -> add11', () => {
      expect(applyJoystickMod('major', 'RIGHT', 'EXTENDED')).toBe('add11')
    })

    it('UP_LEFT -> halfDim7', () => {
      expect(applyJoystickMod('major', 'UP_LEFT', 'EXTENDED')).toBe('halfDim7')
    })

    it('UP_RIGHT -> dom9', () => {
      expect(applyJoystickMod('major', 'UP_RIGHT', 'EXTENDED')).toBe('dom9')
    })

    it('DOWN_LEFT -> add9', () => {
      expect(applyJoystickMod('major', 'DOWN_LEFT', 'EXTENDED')).toBe('add9')
    })

    it('DOWN_RIGHT -> min11', () => {
      expect(applyJoystickMod('major', 'DOWN_RIGHT', 'EXTENDED')).toBe('min11')
    })
  })

  describe('CHROMATIC mode', () => {
    it('UP -> minMaj7', () => {
      expect(applyJoystickMod('major', 'UP', 'CHROMATIC')).toBe('minMaj7')
    })

    it('DOWN -> maj13', () => {
      expect(applyJoystickMod('major', 'DOWN', 'CHROMATIC')).toBe('maj13')
    })

    it('LEFT -> halfDim7', () => {
      expect(applyJoystickMod('major', 'LEFT', 'CHROMATIC')).toBe('halfDim7')
    })

    it('RIGHT -> sixNine', () => {
      expect(applyJoystickMod('major', 'RIGHT', 'CHROMATIC')).toBe('sixNine')
    })

    it('UP_LEFT -> maj7sharp11', () => {
      expect(applyJoystickMod('major', 'UP_LEFT', 'CHROMATIC')).toBe('maj7sharp11')
    })

    it('DOWN_RIGHT -> dom7alt', () => {
      expect(applyJoystickMod('major', 'DOWN_RIGHT', 'CHROMATIC')).toBe('dom7alt')
    })
  })
})
