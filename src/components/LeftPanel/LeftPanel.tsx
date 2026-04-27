import { isNativeApp } from '../../utils/platform'
import { BrandLogo } from './BrandLogo'
import { SpeakerGrille } from './SpeakerGrille'
import { JoystickKnob } from './JoystickKnob'
import styles from './LeftPanel.module.css'

const native = isNativeApp()

interface LeftPanelProps {
  onJoystickClick?: () => void
  onInfoPress?: () => void
}

export function LeftPanel({ onJoystickClick, onInfoPress }: LeftPanelProps) {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.brandRow}>
        <BrandLogo />
      </div>
      <SpeakerGrille />
      <JoystickKnob onJoystickClick={onJoystickClick} />
      <div className={styles.productText}>
        <img src="/blok-model-version-logo.svg" alt="BLOKK AS-00" className={styles.productLogo} />
      </div>
      {native && onInfoPress && (
        <button
          className={styles.infoBtn}
          onClick={onInfoPress}
          aria-label="Info"
        >
          <span className={styles.infoBtnLabel}>i</span>
          <span className={styles.infoBtnLed} />
        </button>
      )}
    </div>
  )
}
