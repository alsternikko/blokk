import { useState, useEffect } from 'react'

const SHORTCUTS = [
  ['1-7', 'Chord buttons'],
  ['Arrow keys', 'Joystick direction'],
  ['Enter', 'Joystick click / Looper cycle'],
  ['Tab', 'Switch looper track'],
  ['Q', 'F1 menu (Key/Octave)'],
  ['W', 'F2 menu (Sounds/Effects)'],
  ['E', 'F3 menu (Mode/BPM)'],
  ['Escape', 'Close menu'],
  ['L + chord', 'Toggle chord lock'],
  ['I + chord', 'Cycle inversion'],
  ['[ / ]', 'Button octave down/up'],
  ['M', 'Toggle metronome'],
  ['Shift+1/2', 'Save preset P1/P2'],
  ['Alt+1/2', 'Load preset P1/P2'],
  ['?', 'Toggle this help'],
]

export function KeyboardHelp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '?') {
        setVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10, 11, 14, 0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Google Sans Code', monospace",
      backdropFilter: 'blur(2px)',
    }}
      onClick={() => setVisible(false)}
      role="dialog"
      aria-label="Keyboard shortcuts"
    >
      <div style={{
        background: '#16181e', border: '1px solid #1e2028',
        borderRadius: 8, padding: '20px 28px', maxWidth: 400, width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <h2 style={{
          fontSize: '0.6rem', marginBottom: 14, color: '#6a6e78', textAlign: 'center',
          letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          KEYBOARD SHORTCUTS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem',
              padding: '3px 0',
            }}>
              <span style={{
                background: '#1c1e26', padding: '2px 7px', borderRadius: 3,
                border: '1px solid #1e2028', color: '#4a4d55', minWidth: 72,
                letterSpacing: '0.04em',
              }}>
                {key}
              </span>
              <span style={{ color: '#3e4148', letterSpacing: '0.04em' }}>{desc}</span>
            </div>
          ))}
        </div>
        <div style={{
          fontSize: '0.45rem', color: '#2e3038', textAlign: 'center', marginTop: 14,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Click anywhere or press ? to close
        </div>
      </div>
    </div>
  )
}
