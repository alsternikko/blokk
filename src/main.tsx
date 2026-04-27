import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { isNativeApp } from './utils/platform'
import './index.css'
import App from './App.tsx'

if (isNativeApp()) {
  import(/* @vite-ignore */ '@capacitor/status-bar').then(({ StatusBar }) => {
    StatusBar.setOverlaysWebView({ overlay: true })
    StatusBar.hide()
  }).catch(() => { /* no-op on web */ })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
