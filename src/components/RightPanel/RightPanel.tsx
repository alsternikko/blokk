import { useBlokkStore } from '../../store/useBlokkStore'
import { OledDisplay } from '../LeftPanel/OledDisplay'
import { PowerButton } from '../LeftPanel/PowerButton'
import { FunctionButtons } from './FunctionButtons'
import { ChordButtonGrid } from './ChordButtonGrid'
import styles from './RightPanel.module.css'

export function RightPanel() {
  const poweredOn = useBlokkStore((s) => s.audioUnlocked)

  const panelClass = [
    styles.rightPanel,
    !poweredOn ? styles.rightPanelOff : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={panelClass}>
      <div className={styles.controlRow}>
        <OledDisplay />
        <FunctionButtons />
        <PowerButton />
      </div>
      <ChordButtonGrid />
    </div>
  )
}
