export const isNativeApp = (): boolean =>
  typeof (window as unknown as Record<string, unknown>).Capacitor !== 'undefined'
