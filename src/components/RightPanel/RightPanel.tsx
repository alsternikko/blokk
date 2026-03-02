import { OledDisplay } from '../LeftPanel/OledDisplay'
import { FunctionButtons } from './FunctionButtons'
import { ChordButtonGrid } from './ChordButtonGrid'
import styles from './RightPanel.module.css'

export function RightPanel() {
  return (
    <div className={styles.rightPanel}>
      <div className={styles.controlRow}>
        <OledDisplay />
        <FunctionButtons />
      </div>
      <ChordButtonGrid />
    </div>
  )
}
