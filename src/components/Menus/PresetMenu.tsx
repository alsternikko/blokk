import { useBlokkStore } from '../../store/useBlokkStore'
import { SOUNDSCAPE_PRESETS, applySoundscapePreset } from '../../store/soundscapes'
import menuStyles from './Menus.module.css'
import styles from './PresetMenu.module.css'

export function PresetMenu() {
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)
  const currentPresetId = useBlokkStore((s) => s.currentPresetId)

  if (activeMenu !== 'PRESET') return null

  const handleSelect = (id: string) => {
    applySoundscapePreset(id)
    setActiveMenu('NONE')
  }

  return (
    <div
      className={menuStyles.menuOverlay}
      onClick={() => setActiveMenu('NONE')}
    >
      <div
        className={styles.presetPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={menuStyles.menuHeader}>
          <span className={menuStyles.menuTitle}>SOUNDSCAPES</span>
          <button
            className={menuStyles.menuClose}
            onClick={() => setActiveMenu('NONE')}
            aria-label="Close menu"
          >
            x
          </button>
        </div>

        <div className={styles.presetGrid}>
          {SOUNDSCAPE_PRESETS.map((preset) => {
            const isActive = currentPresetId === preset.id
            return (
              <button
                key={preset.id}
                className={`${styles.presetCard} ${isActive ? styles.presetCardActive : ''}`}
                onClick={() => handleSelect(preset.id)}
              >
                <span className={styles.presetName}>{preset.name}</span>
                <span className={styles.presetDesc}>{preset.description}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
