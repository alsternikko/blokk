import styles from './InfoDrawer.module.css'

const TOUCH_CONTROLS = [
  ['1–7', 'Tap chord buttons'],
  ['Drag', 'Joystick control'],
  ['Drag', 'XY Pad (filter / FX)'],
  ['Outer ring', 'Volume knob'],
  ['Tap joystick', 'Looper cycle'],
  ['Tap display', 'Soundscape presets'],
  ['F1 / F2 / F3', 'Open menus'],
]

interface InfoDrawerProps {
  open: boolean
  onClose: () => void
}

export function InfoDrawer({ open, onClose }: InfoDrawerProps) {
  return (
    <>
      <div
        className={`${styles.backdrop}${open ? ` ${styles.open}` : ''}`}
        onClick={onClose}
      />

      <div className={`${styles.drawer}${open ? ` ${styles.open}` : ''}`}>
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Touch Controls</span>
          {TOUCH_CONTROLS.map(([label, desc]) => (
            <div key={desc} className={styles.controlItem}>
              <span className={styles.controlLabel}>{label}</span>
              <span className={styles.controlDesc}>{desc}</span>
            </div>
          ))}
        </div>

        <div className={styles.brand}>
          <img src="/blokk-brand-logo.svg" alt="BLOKK" className={styles.brandLogo} />
          <span className={styles.brandText}>
            Alste(r).ver.se01ep01 · Made with love. NK26.
          </span>
        </div>
      </div>
    </>
  )
}
