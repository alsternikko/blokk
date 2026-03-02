import styles from './LeftPanel.module.css'

export function SpeakerGrille() {
  const dots: JSX.Element[] = []
  const rows = 10
  const cols = 10

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = c - (cols - 1) / 2
      const dy = r - (rows - 1) / 2
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= 4.8) {
        dots.push(
          <div
            key={`${r}-${c}`}
            className={styles.speakerDot}
            style={{
              gridRow: r + 1,
              gridColumn: c + 1,
            }}
          />,
        )
      }
    }
  }

  return (
    <div className={styles.speakerGrille}>
      <div className={styles.speakerGrid}>{dots}</div>
    </div>
  )
}
