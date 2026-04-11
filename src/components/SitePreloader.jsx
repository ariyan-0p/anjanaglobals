import { useEffect, useState } from 'react'
import logoColor from '../assets/Anjna Global Logo final.png'
import './SitePreloader.css'

export default function SitePreloader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [siteLoaded, setSiteLoaded] = useState(false)

  useEffect(() => {
    const onLoaded = () => setSiteLoaded(true)

    if (document.readyState === 'complete') onLoaded()
    else window.addEventListener('load', onLoaded, { once: true })

    return () => {
      window.removeEventListener('load', onLoaded)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const cap = siteLoaded ? 100 : 96
        if (prev >= cap) return cap
        return prev + 1
      })
    }, 22)

    return () => window.clearInterval(timer)
  }, [siteLoaded, visible])

  useEffect(() => {
    if (!(siteLoaded && progress >= 100)) return
    const doneTimer = window.setTimeout(() => setVisible(false), 420)
    return () => window.clearTimeout(doneTimer)
  }, [siteLoaded, progress])

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="site-preloader" role="status" aria-live="polite" aria-label="Loading website">
      <div className="site-preloader__inner">
        <div className="site-preloader__logo-wrap" style={{ '--progress': `${progress}%` }}>
          <div className="site-preloader__ring" aria-hidden />
          <img src={logoColor} alt="Anjna Global" className="site-preloader__logo" />
        </div>

        <p className="site-preloader__status">
          {progress < 100 ? 'INITIALIZING TRAVEL EXPERIENCE...' : 'READY'}
        </p>

        <div className="site-preloader__progress-label" aria-hidden>
          {progress}%
        </div>
      </div>
    </div>
  )
}
