import { useCallback, useRef, useState } from 'react'
import { useBlokkStore } from '../../store/useBlokkStore'
import styles from './XYPad.module.css'

export function XYPad() {
  const xyPadX = useBlokkStore((s) => s.xyPadX)
  const xyPadY = useBlokkStore((s) => s.xyPadY)
  const setXYPad = useBlokkStore((s) => s.setXYPad)

  const surfaceRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const updateFromPointer = useCallback(
    (e: React.PointerEvent) => {
      const rect = surfaceRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
      setXYPad(x, y)
    },
    [setXYPad],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setActive(true)
      updateFromPointer(e)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active) return
      updateFromPointer(e)
    },
    [active, updateFromPointer],
  )

  const handlePointerUp = useCallback(() => {
    setActive(false)
  }, [])

  const crosshairLeft = `${xyPadX * 100}%`
  const crosshairTop = `${(1 - xyPadY) * 100}%`

  return (
    <div
      className={`${styles.xyPad} ${active ? styles['xyPad--active'] : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label="XY performance pad: horizontal controls filter cutoff, vertical controls effect depth"
      aria-valuetext={`Filter ${Math.round(xyPadX * 100)}%, Space ${Math.round(xyPadY * 100)}%`}
      tabIndex={0}
    >
      <div className={styles.surface} ref={surfaceRef}>
        <div className={styles.gridLines}>
          <div className={styles.gridLineH} />
          <div className={styles.gridLineV} />
        </div>
        <div
          className={styles.crosshair}
          style={{ left: crosshairLeft, top: crosshairTop }}
        />
      </div>
      <span className={styles.axisLabelX}>cut</span>
      <span className={styles.axisLabelY}>spc</span>
    </div>
  )
}
