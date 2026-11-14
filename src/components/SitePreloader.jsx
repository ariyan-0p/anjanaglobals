import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { markReady } from '../motion/ready'
import { lockScroll, unlockScroll } from '../motion/scrollLock'
import './SitePreloader.css'

// Counts to 100 once fonts are ready (or after a hard cap) — never waits on the
// window `load` event, which stalls behind every photo and third-party tag.
const MAX_WAIT_MS = 2200
const MIN_SHOW_MS = 900
const HARD_LIMIT_MS = 6000 // never hold a visitor behind the preloader longer than this

export default function SitePreloader() {
  const root = useRef(null)
  const countRef = useRef(null)
  const lineRef = useRef(null)
  const [done, setDone] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      markReady()
      return
    }
    lockScroll()
    const started = performance.now()
    const state = { v: 0 }
    let ready = false
    let finished = false
    let leaving = false

    const release = () => {
      if (ready) return
      ready = true
    }
    const cap = setTimeout(release, MAX_WAIT_MS)
    let gone = false
    const finish = () => {
      if (gone) return
      gone = true
      clearTimeout(hard)
      gsap.killTweensOf([state, root.current, '.preloader__center'])
      unlockScroll()
      setDone(true)
      markReady()
    }
    // Unconditional: a throttled/background tab must never be stuck behind the preloader.
    const hard = setTimeout(finish, HARD_LIMIT_MS)
    if (document.fonts?.ready) document.fonts.ready.then(release)
    if (document.readyState === 'complete') release()
    else window.addEventListener('load', release, { once: true })

    const write = () => {
      const n = Math.round(state.v)
      if (countRef.current) countRef.current.textContent = String(n).padStart(3, '0')
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${state.v / 100})`
    }

    // Eases toward 92 on its own, then sprints to 100 the moment the page is ready.
    const climb = gsap.to(state, { v: 92, duration: 2.4, ease: 'power2.out', onUpdate: write })
    const poll = setInterval(() => {
      if (!ready || finished) return
      if (performance.now() - started < MIN_SHOW_MS) return
      if (leaving) return
      finished = true
      leaving = true
      clearInterval(poll)
      climb.kill()
      gsap.to(state, {
        v: 100,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: write,
        onComplete: () => {
          const tl = gsap.timeline({
            onComplete: finish,
          })
          tl.to('.preloader__center', { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power3.in' })
            .to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
          // hero intro starts as the curtain is mid-lift
          tl.call(markReady, null, '-=0.55')
        },
      })
    }, 60)

    return () => {
      clearTimeout(cap)
      clearTimeout(hard)
      clearInterval(poll)
      climb.kill()
      window.removeEventListener('load', release)
      if (!gone) unlockScroll()
    }
  }, [])

  if (done) return null

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite" aria-label="Loading website">
      <div className="preloader__top">
        <span className="mono">Anjna Global</span>
        <span className="mono">Est. 2013</span>
      </div>
      <div className="preloader__center">
        <p className="preloader__tag">Fabulously planned…<br /><em>remembered always.</em></p>
      </div>
      <div className="preloader__bottom">
        <span className="preloader__count" ref={countRef}>000</span>
        <span className="preloader__bar"><i ref={lineRef} /></span>
        <span className="mono">Loading experience</span>
      </div>
    </div>
  )
}
