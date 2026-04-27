import { useBlokkStore } from '../../store/useBlokkStore'
import { isNativeApp } from '../../utils/platform'
import { LeftPanel } from '../LeftPanel/LeftPanel'
import { RightPanel } from '../RightPanel/RightPanel'
import { F2Menu } from '../Menus/F2Menu'
import { F3Menu } from '../Menus/F3Menu'
import { PresetMenu } from '../Menus/PresetMenu'
import { ChordHiro } from '../Modes/ChordHiro'
import { EarTrainer } from '../Modes/EarTrainer'
import styles from './DeviceFrame.module.css'

const native = isNativeApp()

interface DeviceFrameProps {
  onJoystickClick?: () => void
  onInfoPress?: () => void
}

export function DeviceFrame({ onJoystickClick, onInfoPress }: DeviceFrameProps) {
  const poweredOn = useBlokkStore((s) => s.audioUnlocked)

  const frameClass = [
    styles.deviceFrame,
    native ? styles.nativeFrame : '',
  ].filter(Boolean).join(' ')

  const innerClass = [
    styles.deviceInner,
    !poweredOn ? styles.poweredOff : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={frameClass}>
      <div className={innerClass}>
        <LeftPanel onJoystickClick={onJoystickClick} onInfoPress={onInfoPress} />
        <RightPanel />
        <F2Menu />
        <F3Menu />
        <PresetMenu />
        <ChordHiro />
        <EarTrainer />
      </div>
    </div>
  )
}
