import { LeftPanel } from '../LeftPanel/LeftPanel'
import { RightPanel } from '../RightPanel/RightPanel'
import { F2Menu } from '../Menus/F2Menu'
import { F3Menu } from '../Menus/F3Menu'
import { ChordHiro } from '../Modes/ChordHiro'
import { EarTrainer } from '../Modes/EarTrainer'
import styles from './DeviceFrame.module.css'

interface DeviceFrameProps {
  onJoystickClick?: () => void
}

export function DeviceFrame({ onJoystickClick }: DeviceFrameProps) {
  return (
    <div className={styles.deviceFrame}>
      <div className={styles.deviceInner}>
        <LeftPanel onJoystickClick={onJoystickClick} />
        <RightPanel />
        <F2Menu />
        <F3Menu />
        <ChordHiro />
        <EarTrainer />
      </div>
    </div>
  )
}
