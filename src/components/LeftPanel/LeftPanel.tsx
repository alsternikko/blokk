import { BrandLogo } from './BrandLogo'
import { SpeakerGrille } from './SpeakerGrille'
import { JoystickKnob } from './JoystickKnob'
import styles from './LeftPanel.module.css'

interface LeftPanelProps {
  onJoystickClick?: () => void
}

export function LeftPanel({ onJoystickClick }: LeftPanelProps) {
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
    </div>
  )
}
