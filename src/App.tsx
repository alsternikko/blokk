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
        <h1 className="page-logo">BLOKK-1</h1>
        <p className="page-subtext">Web Synthesizer</p>
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
      <KeyboardHelp />
    </div>
  )
}

export default App
