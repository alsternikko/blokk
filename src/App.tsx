import { useBlokkStore } from './store/useBlokkStore'
import { AudioUnlock } from './components/AudioUnlock'
import { DeviceFrame } from './components/DeviceFrame/DeviceFrame'
import { KeyboardHelp } from './components/KeyboardHelp'
import { useChordTrigger } from './hooks/useChordTrigger'
import { useKeyboardInput } from './hooks/useKeyboardInput'
import { useLooper } from './hooks/useLooper'
import './App.css'

function BlokkApp() {
  const { synthRef, drumEngineRef, modeEngineRef } = useChordTrigger()
  const { cycleLooper, setBarCount } = useLooper(synthRef, drumEngineRef)
  useKeyboardInput(cycleLooper, setBarCount)
  return (
    <>
      <DeviceFrame onJoystickClick={cycleLooper} />
      <KeyboardHelp />
    </>
  )
}

function App() {
  const audioUnlocked = useBlokkStore((s) => s.audioUnlocked)

  return (
    <div className="app">
      {audioUnlocked ? <BlokkApp /> : <AudioUnlock />}
    </div>
  )
}

export default App
