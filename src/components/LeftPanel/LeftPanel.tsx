import { BrandLogo } from './BrandLogo'
import { PowerButton } from './PowerButton'
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
        <PowerButton />
      </div>
      <SpeakerGrille />
      <JoystickKnob onJoystickClick={onJoystickClick} />
      <div className={styles.productText}>
        <span>Alste(r).ver.se01ep01</span>
        <span>Made with love. NK26.</span>
      </div>
    </div>
  )
}
