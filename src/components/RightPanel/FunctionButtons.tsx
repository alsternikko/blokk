import { useCallback } from 'react'
import { useBlokkStore } from '../../store/useBlokkStore'
import type { MenuContext } from '../../types/ui'
import styles from './FunctionButtons.module.css'

const BUTTONS: { id: 'F1' | 'F2' | 'F3'; label: string; text: string; menu: MenuContext }[] = [
  { id: 'F1', label: 'Settings', text: 'F1', menu: 'F1' },
  { id: 'F2', label: 'Sounds', text: 'F2', menu: 'F2_SOUNDS' },
  { id: 'F3', label: 'Mode', text: 'F3', menu: 'F3_MODE' },
]

export function FunctionButtons() {
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)

  const handleClick = useCallback(
    (menu: MenuContext) => {
      setActiveMenu(activeMenu === menu ? 'NONE' : menu)
    },
    [activeMenu, setActiveMenu],
  )

  const isMenuActive = (menu: MenuContext) => {
    if (menu === 'F2_SOUNDS') return activeMenu === 'F2_SOUNDS' || activeMenu === 'F2_EFFECTS'
    if (menu === 'F3_MODE') return activeMenu === 'F3_MODE' || activeMenu === 'F3_BPM'
    return activeMenu === menu
  }

  return (
    <div className={styles.functionButtons}>
      {BUTTONS.map((btn) => {
        const active = isMenuActive(btn.menu)
        return (
          <button
            key={btn.id}
            className={`${styles.fnBtn} ${styles[`btn${btn.id}`]} ${active ? styles.fnBtnActive : ''}`}
            onClick={() => handleClick(btn.menu)}
            aria-label={btn.label}
            aria-pressed={active}
          >
            <span className={styles.fnBtnLabel}>{btn.text}</span>
            <span className={styles.fnBtnLed} />
          </button>
        )
      })}
    </div>
  )
}
