import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { markReady } from '../motion/ready'
import { lockScroll, unlockScroll } from '../motion/scrollLock'
import { layoutPortal, zoomPortal } from '../motion/heroPortal'
import logoColor from '../assets/Anjna Global Logo final.png'
import './SitePreloader.css'

// The logo fills with colour as the page loads, then the camera dives through it
// into the site. Never waits on the window `load` event (it stalls behind every
// photo and third-party tag): fonts-ready or a hard cap releases it.
const MAX_WAIT_MS = 2200
const HARD_LIMIT_MS = 7000 // never hold a visitor behind the preloader longer than this

const seenBefore = () => {
  try { return window.sessionStorage.getItem('anjna:pl') === '1' } catch { return false }
}

export default function SitePreloader() {
  const root = useRef(null)
  const bgRef = useRef(null)
  const logoRef = useRef(null)
  const colorRef = useRef(null)
  const [done, setDone] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      markReady()
      return
    }
    const html = document.documentElement
    const fast = seenBefore()
    try { window.sessionStorage.setItem('anjna:pl', '1') } catch { /* private mode */ }

    html.classList.add('intro-playing')
    lockScroll()

    const minShow = fast ? 450 : 1100
    const started = performance.now()
    const state = { v: 0 }
    let ready = false
    let leaving = false
    let gone = false

    const write = () => {
      if (colorRef.current) colorRef.current.style.clipPath = `inset(0 ${100 - state.v}% 0 0)`
    }

    layoutPortal(logoRef.current)
    write()

    const release = () => { ready = true }
    const cap = setTimeout(release, MAX_WAIT_MS)
    if (document.fonts?.ready) document.fonts.ready.then(release)
    if (document.readyState === 'complete') release()
    else window.addEventListener('load', release, { once: true })

    const finish = () => {
      if (gone) return
      gone = true
      clearTimeout(hard)
      gsap.killTweensOf([state, root.current, bgRef.current, logoRef.current])
      html.classList.remove('intro-playing')
      unlockScroll()
      setDone(true)
      markReady()
    }
    // Unconditional: a throttled/background tab must never be stuck behind the preloader.
    const hard = setTimeout(finish, HARD_LIMIT_MS)

    // A gentle breathing pulse while it loads.
    const pulse = gsap.to(logoRef.current, { scale: 1.018, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    // Eases toward 92 on its own, then sprints to 100 the moment the page is ready.
    const climb = gsap.to(state, { v: 92, duration: fast ? 1.2 : 2.6, ease: 'power2.out', onUpdate: write })

    const poll = setInterval(() => {
      if (!ready || leaving) return
      if (performance.now() - started < minShow) return
      leaving = true
      clearInterval(poll)
      climb.kill()
      gsap.to(state, {
        v: 100,
        duration: 0.45,
        ease: 'power2.inOut',
        onUpdate: write,
        onComplete: () => {
          pulse.kill()
          gsap.set(logoRef.current, { scale: 1 })
          const geo = layoutPortal(logoRef.current) // viewport may have changed while loading
          gsap.to('.pl__ghost', { opacity: 0, duration: 0.3 })
          root.current.style.pointerEvents = 'none'
          zoomPortal({ bg: bgRef.current, logoWrap: logoRef.current, geo, fast, onZoom: markReady, onDone: finish })
        },
      })
    }, 60)

    return () => {
      clearTimeout(cap)
      clearTimeout(hard)
      clearInterval(poll)
      climb.kill()
      pulse.kill()
      window.removeEventListener('load', release)
      if (!gone) {
        html.classList.remove('intro-playing')
        unlockScroll()
      }
    }
  }, [])

  if (done) return null

  return (
    <div className="pl" ref={root} role="status" aria-live="polite" aria-label="Loading website">
      <div className="pl__bg" ref={bgRef} />
      <div className="pl__logo" ref={logoRef}>
        <img className="pl__ghost" src={logoColor} alt="" />
        <img className="pl__color" ref={colorRef} src={logoColor} alt="Anjna Global" />
      </div>
    </div>
  )
}
