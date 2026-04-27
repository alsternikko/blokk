import { isNativeApp } from './platform'
import type { ImpactStyle } from '@capacitor/haptics'

type ImpactFn = (opts: { style: ImpactStyle }) => Promise<void>
let impactFn: ImpactFn | null = null

if (isNativeApp()) {
  import('@capacitor/haptics').then((mod) => {
    impactFn = (opts) => mod.Haptics.impact(opts)
  }).catch(() => { /* no-op on web */ })
}

export function lightImpact() {
  impactFn?.({ style: 'LIGHT' as ImpactStyle })
}
