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
      <BrandLogo />
      <SpeakerGrille />
      <JoystickKnob onJoystickClick={onJoystickClick} />
      <div className={styles.productText}>
        <span>Alste(r).ver.se01ep01</span>
        <span>Made with love. NK26.</span>
      </div>
    </div>
  )
}
