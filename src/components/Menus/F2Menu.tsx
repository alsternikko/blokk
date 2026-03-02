import { useBlokkStore } from '../../store/useBlokkStore'
import { WAVEFORM_TYPES, EFFECT_TYPES, ADSR_PRESETS } from '../../types/audio'
import { SCALE_NAMES, JOYSTICK_MODES } from '../../types/music'
import type { WaveformType, EffectType } from '../../types/audio'
import styles from './Menus.module.css'

const WAVEFORM_LABELS: Record<WaveformType, string> = {
  sine: 'SINE',
  sawtooth: 'SAW',
  triangle: 'TRIANGLE',
  square: 'SQUARE',
  fm_epiano: 'FM EPIANO',
  fm_hx7: 'FM HX7',
  fm_bell: 'FM BELL',
  fm_organ: 'FM ORGAN',
  fm_brass: 'FM BRASS',
  juno_poly: 'JUNO POLY',
  ocean_pad: 'OCEAN PAD',
  wobble_bass: 'WOBBLE BASS',
}

const EFFECT_LABELS: Record<EffectType, string> = {
  REVERB: 'REVERB',
  DELAY: 'DELAY',
  TREMOLO: 'TREMOLO',
  CHORUS: 'CHORUS',
  FLANGER: 'FLANGER',
  FILTER: 'FILTER',
  GLIDE: 'GLIDE',
  STEREO: 'STEREO',
}

export function F2Menu() {
  const activeMenu = useBlokkStore((s) => s.activeMenu)
  const setActiveMenu = useBlokkStore((s) => s.setActiveMenu)
  const waveform = useBlokkStore((s) => s.waveform)
  const setWaveform = useBlokkStore((s) => s.setWaveform)
  const effects = useBlokkStore((s) => s.effects)
  const toggleEffect = useBlokkStore((s) => s.toggleEffect)
  const adsrPreset = useBlokkStore((s) => s.adsrPreset)
  const setAdsrPreset = useBlokkStore((s) => s.setAdsrPreset)
  const scale = useBlokkStore((s) => s.scale)
  const setScale = useBlokkStore((s) => s.setScale)
  const joystickMode = useBlokkStore((s) => s.joystickMode)
  const setJoystickMode = useBlokkStore((s) => s.setJoystickMode)

  if (activeMenu !== 'F2_SOUNDS' && activeMenu !== 'F2_EFFECTS') return null

  const isSoundsLevel = activeMenu === 'F2_SOUNDS'

  const handleWaveformNav = (delta: number) => {
    const idx = WAVEFORM_TYPES.indexOf(waveform)
    const next = (idx + delta + WAVEFORM_TYPES.length) % WAVEFORM_TYPES.length
    setWaveform(WAVEFORM_TYPES[next])
  }

  return (
    <div className={styles.menuOverlay}>
      <div className={styles.menuPanel}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>
            {isSoundsLevel ? 'SOUNDS' : 'EFFECTS'}
          </span>
          <button
            className={styles.menuClose}
            onClick={() => setActiveMenu('NONE')}
            aria-label="Close menu"
          >
            x
          </button>
        </div>

        {isSoundsLevel ? (
          <div className={styles.menuBody}>
            <div className={styles.navRow}>
              <button className={styles.navBtn} onClick={() => handleWaveformNav(-1)}>&lt;</button>
              <span className={styles.navLabel}>{WAVEFORM_LABELS[waveform]}</span>
              <button className={styles.navBtn} onClick={() => handleWaveformNav(1)}>&gt;</button>
            </div>
            <div className={styles.menuHint}>
              <button
                className={styles.subMenuBtn}
                onClick={() => setActiveMenu('F2_EFFECTS')}
              >
                EFFECTS &uarr;
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.menuBody}>
            <div className={styles.effectList}>
              {EFFECT_TYPES.map((fx) => (
                <button
                  key={fx}
                  className={`${styles.effectItem} ${effects[fx].enabled ? styles.effectOn : ''}`}
                  onClick={() => toggleEffect(fx)}
                >
                  {EFFECT_LABELS[fx]}
                  <span className={styles.effectStatus}>
                    {effects[fx].enabled ? 'ON' : 'OFF'}
                  </span>
                </button>
              ))}
              <div className={styles.adsrRow}>
                <span className={styles.adsrLabel}>ADSR</span>
                <div className={styles.navRow}>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = ADSR_PRESETS.indexOf(adsrPreset)
                      setAdsrPreset(ADSR_PRESETS[(idx - 1 + ADSR_PRESETS.length) % ADSR_PRESETS.length])
                    }}
                  >
                    &lt;
                  </button>
                  <span className={styles.navLabel}>{adsrPreset}</span>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = ADSR_PRESETS.indexOf(adsrPreset)
                      setAdsrPreset(ADSR_PRESETS[(idx + 1) % ADSR_PRESETS.length])
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
              <div className={styles.adsrRow}>
                <span className={styles.adsrLabel}>SCALE</span>
                <div className={styles.navRow}>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = SCALE_NAMES.indexOf(scale)
                      setScale(SCALE_NAMES[(idx - 1 + SCALE_NAMES.length) % SCALE_NAMES.length])
                    }}
                  >
                    &lt;
                  </button>
                  <span className={styles.navLabel}>{scale.replace(/_/g, ' ')}</span>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = SCALE_NAMES.indexOf(scale)
                      setScale(SCALE_NAMES[(idx + 1) % SCALE_NAMES.length])
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
              <div className={styles.adsrRow}>
                <span className={styles.adsrLabel}>JOY MODE</span>
                <div className={styles.navRow}>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = JOYSTICK_MODES.indexOf(joystickMode)
                      setJoystickMode(JOYSTICK_MODES[(idx - 1 + JOYSTICK_MODES.length) % JOYSTICK_MODES.length])
                    }}
                  >
                    &lt;
                  </button>
                  <span className={styles.navLabel}>{joystickMode}</span>
                  <button
                    className={styles.navBtn}
                    onClick={() => {
                      const idx = JOYSTICK_MODES.indexOf(joystickMode)
                      setJoystickMode(JOYSTICK_MODES[(idx + 1) % JOYSTICK_MODES.length])
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.menuHint}>
              <button
                className={styles.subMenuBtn}
                onClick={() => setActiveMenu('F2_SOUNDS')}
              >
                SOUNDS &darr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
