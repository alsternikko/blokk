import { DeviceFrame } from './components/DeviceFrame/DeviceFrame'
import { KeyboardHelp } from './components/KeyboardHelp'
import { useChordTrigger } from './hooks/useChordTrigger'
import { useKeyboardInput } from './hooks/useKeyboardInput'
import { useLooper } from './hooks/useLooper'
import './App.css'

const LEGEND_ITEMS = [
  ['1-7', 'Play chords'],
  ['Arrows', 'Joystick'],
  ['Shift+Arrows', 'XY Pad'],
  ['Q / W / E', 'Menus'],
  ['Enter', 'Looper'],
  ['?', 'All shortcuts'],
]

function App() {
  const { synthRef, drumEngineRef } = useChordTrigger()
  const { cycleLooper, setBarCount } = useLooper(synthRef, drumEngineRef)
  useKeyboardInput(cycleLooper, setBarCount)

  return (
    <div className="app">
      <div className="page-header">
        <img src="/blokk-brand-logo.svg" alt="BLOKK" className="page-brand-logo" />
      </div>
      <DeviceFrame onJoystickClick={cycleLooper} />
      <div className="keyboard-legend">
        {LEGEND_ITEMS.map(([key, desc]) => (
          <span key={key} className="legend-item">
            <kbd className="legend-key">{key}</kbd>
            <span className="legend-desc">{desc}</span>
          </span>
        ))}
      </div>
      <div className="footer-group">
        <img src="/stereo-gfx.svg" alt="Stereo" className="stereo-gfx" />
        <span className="footer-text">Alste(r).ver.se01ep01 · Made with love. NK26.</span>
      </div>
      <KeyboardHelp />
    </div>
  )
}

export default App
