import { useState, useCallback, useRef } from 'react'
import { useBlokkStore } from '../../store/useBlokkStore'
import { setMasterVolume } from '../../audio/engine'
import type { JoystickDirection } from '../../types/music'
import styles from './JoystickKnob.module.css'

const CLICK_THRESHOLD = 6
const CLICK_TIME_MS = 250

function getDirectionFromPosition(x: number, y: number, radius: number): JoystickDirection {
  const dx = x - radius
  const dy = y - radius
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < radius * 0.25) return 'CENTER'

  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  if (angle >= -22.5 && angle < 22.5) return 'RIGHT'
  if (angle >= 22.5 && angle < 67.5) return 'DOWN_RIGHT'
  if (angle >= 67.5 && angle < 112.5) return 'DOWN'
  if (angle >= 112.5 && angle < 157.5) return 'DOWN_LEFT'
  if (angle >= 157.5 || angle < -157.5) return 'LEFT'
  if (angle >= -157.5 && angle < -112.5) return 'UP_LEFT'
  if (angle >= -112.5 && angle < -67.5) return 'UP'
  return 'UP_RIGHT'
}

interface JoystickKnobProps {
  onJoystickClick?: () => void
}

export function JoystickKnob({ onJoystickClick }: JoystickKnobProps) {
  const setDirection = useBlokkStore((s) => s.setJoystickDirection)
  const currentDir = useBlokkStore((s) => s.joystickDirection)
  const containerRef = useRef<HTMLDivElement>(null)

  const [rotation, setRotation] = useState(210)
  const active = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const startTime = useRef(0)
  const totalDrag = useRef(0)
  const mode = useRef<'idle' | 'joystick' | 'knob'>('idle')
  const lastY = useRef(0)

  const updateVolume = useCallback((rot: number) => {
    const normalized = (rot - 30) / 300
    const db = -60 + normalized * 54
    setMasterVolume(db)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      active.current = true
      mode.current = 'idle'
      totalDrag.current = 0
      startTime.current = performance.now()
      startPos.current = { x: e.clientX, y: e.clientY }
      lastY.current = e.clientY
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const dx = x - rect.width / 2
      const dy = y - rect.height / 2
      const distFromCenter = Math.sqrt(dx * dx + dy * dy)
      const radius = rect.width / 2

      // If clicking near the outer edge, prepare for knob rotation
      if (distFromCenter > radius * 0.65) {
        mode.current = 'knob'
      }
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active.current) return

      const dx = e.clientX - startPos.current.x
      const dy = e.clientY - startPos.current.y
      totalDrag.current = Math.sqrt(dx * dx + dy * dy)

      if (mode.current === 'idle' && totalDrag.current > CLICK_THRESHOLD) {
        mode.current = 'joystick'
      }

      if (mode.current === 'joystick') {
        const rect = containerRef.current!.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setDirection(getDirectionFromPosition(x, y, rect.width / 2))
      } else if (mode.current === 'knob') {
        const delta = lastY.current - e.clientY
        lastY.current = e.clientY
        setRotation((prev) => {
          const next = Math.max(30, Math.min(330, prev + delta * 1.5))
          updateVolume(next)
          return next
        })
      }
    },
    [setDirection, updateVolume],
  )

  const handlePointerUp = useCallback(() => {
    if (!active.current) return
    const elapsed = performance.now() - startTime.current

    if (totalDrag.current < CLICK_THRESHOLD && elapsed < CLICK_TIME_MS) {
      onJoystickClick?.()
    }

    active.current = false
    mode.current = 'idle'
    setDirection('CENTER')
  }, [setDirection, onJoystickClick])

  const dirClass = currentDir !== 'CENTER' ? styles[`dir_${currentDir}`] : ''

  const DOT_POSITIONS = [
    { angle: -90, label: 'U' },
    { angle: -45, label: 'UR' },
    { angle: 0, label: 'R' },
    { angle: 45, label: 'DR' },
    { angle: 90, label: 'D' },
    { angle: 135, label: 'DL' },
    { angle: 180, label: 'L' },
    { angle: -135, label: 'UL' },
  ]

  return (
    <div className={`${styles.joystickKnobContainer} ${dirClass}`}>
      <div className={styles.dotRing}>
        {DOT_POSITIONS.map(({ angle, label }) => {
          const rad = (angle * Math.PI) / 180
          const r = 46
          const x = 50 + r * Math.cos(rad)
          const y = 50 + r * Math.sin(rad)
          return (
            <span
              key={label}
              className={styles.dirDot}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          )
        })}
      </div>
      <div
        ref={containerRef}
        className={styles.knobBody}
        style={{ '--knob-rotation': `${rotation}deg` } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="application"
        aria-label="Joystick and volume knob"
        tabIndex={0}
      >
        <div className={styles.knobIndicator} />
        <div className={styles.knobCenter} />
      </div>
    </div>
  )
}
