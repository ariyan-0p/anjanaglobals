import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/chrome.css'
import './styles/shared.css'
import App from './App.jsx'
import { reloadOnceForNewVersion } from './lib/chunkReload'

// Vite fires this when a lazy page chunk can't be fetched (usually: a newer deploy replaced it).
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault()
  reloadOnceForNewVersion()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
