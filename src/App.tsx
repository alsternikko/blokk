import { useState, useCallback } from 'react'
import { DeviceFrame } from './components/DeviceFrame/DeviceFrame'
import { AppLoadingScreen } from './components/AppLoadingScreen'
import { InfoDrawer } from './components/InfoDrawer'
import { KeyboardHelp } from './components/KeyboardHelp'
import { useChordTrigger } from './hooks/useChordTrigger'
import { useKeyboardInput } from './hooks/useKeyboardInput'
import { useLooper } from './hooks/useLooper'
import { isNativeApp } from './utils/platform'
import './App.css'

const native = isNativeApp()

const LEGEND_ITEMS = [
  ['1-7', 'Play chords'],
  ['Arrows', 'Joystick'],
  ['Shift+Arrows', 'XY Pad'],
  ['Q / W / E', 'Menus'],
  ['P', 'Presets'],
  ['Enter', 'Looper'],
  ['?', 'All shortcuts'],
]

function App() {
  const { synthRef, drumEngineRef } = useChordTrigger()
  const { cycleLooper, setBarCount } = useLooper(synthRef, drumEngineRef)
  useKeyboardInput(cycleLooper, setBarCount)
  const [showIntro, setShowIntro] = useState(native)
  const dismissIntro = useCallback(() => setShowIntro(false), [])
  const [infoOpen, setInfoOpen] = useState(false)
  const openInfo = useCallback(() => setInfoOpen(true), [])
  const closeInfo = useCallback(() => setInfoOpen(false), [])

  return (
    <div className={`app${native ? ' native-app' : ''}`}>
      {showIntro && <AppLoadingScreen onDone={dismissIntro} />}
      {!native && (
        <div className="page-header">
          <img src="/blokk-brand-logo.svg" alt="BLOKK" className="page-brand-logo" />
        </div>
      )}
      <DeviceFrame onJoystickClick={cycleLooper} onInfoPress={openInfo} />
      {!native && (
        <div className="keyboard-legend">
          {LEGEND_ITEMS.map(([key, desc]) => (
            <span key={key} className="legend-item">
              <kbd className="legend-key">{key}</kbd>
              <span className="legend-desc">{desc}</span>
            </span>
          ))}
        </div>
      )}
      {!native && (
        <div className="footer-group">
          <img src="/stereo-gfx.svg" alt="Stereo" className="stereo-gfx" />
          <span className="footer-text">Alste(r).ver.se01ep01 · Made with love. NK26.</span>
        </div>
      )}
      {!native && <KeyboardHelp />}
      {native && <InfoDrawer open={infoOpen} onClose={closeInfo} />}
    </div>
  )
}

export default App
