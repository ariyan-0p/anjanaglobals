import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'
import { startLenis, stopLenis, getLenis, scrollToTop, scrollToEl } from './lenis'
import { scan, disposeEngine } from './engine'
import { isReady, onReady } from './ready'
import Cursor from './Cursor'

/**
 * Mounted once inside the Router. Owns smooth scrolling, the scroll progress bar,
 * the route curtain, hash scrolling, and (re)scans the page for [data-*] motion
 * whenever the DOM changes — which also covers content that arrives from the API.
 */
export default function MotionRoot() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const curtain = useRef(null)
  const bar = useRef(null)
  const busy = useRef(false)
  const prevPath = useRef(pathname)
  const isAdmin = pathname.startsWith('/admin')

  /* Per-route: smooth scroll, scan, cleanup */
  useEffect(() => {
    if (isAdmin) {
      stopLenis()
      window.scrollTo(0, 0)
      return
    }
    startLenis()
    if (!hash) scrollToTop(true)

    const ctx = gsap.context(() => {})
    let raf = 0
    let refreshT = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (scan(ctx) > 0) {
          clearTimeout(refreshT)
          refreshT = setTimeout(() => ScrollTrigger.refresh(), 120)
        }
      })
    }
    run()
    const root = document.getElementById('root')
    const mo = new MutationObserver(run)
    mo.observe(root, { childList: true, subtree: true })

    const late = [setTimeout(() => ScrollTrigger.refresh(), 700), setTimeout(() => ScrollTrigger.refresh(), 2200)]
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())

    // Layout changes after async content (images, API data) shift trigger positions.
    let lastH = document.documentElement.scrollHeight
    let roT = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(roT)
      roT = setTimeout(() => {
        const h = document.documentElement.scrollHeight
        if (Math.abs(h - lastH) > 4) { lastH = h; ScrollTrigger.refresh() }
      }, 250)
    })
    ro.observe(document.body)

    return () => {
      mo.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(refreshT)
      clearTimeout(roT)
      late.forEach(clearTimeout)
      window.removeEventListener('load', onLoad)
      disposeEngine(ctx)
    }
  }, [pathname, isAdmin]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Hash targets (e.g. /testimonials#dubai) — wait for the preloader to lift
     (Lenis ignores scrollTo while locked) and for the element, then glide */
  useEffect(() => {
    if (isAdmin || !hash) return
    let cancelled = false
    let timer = 0
    onReady(() => {
      if (cancelled) return
      let tries = 0
      timer = setInterval(() => {
        const el = document.getElementById(hash.slice(1))
        tries += 1
        if (el || tries > 30) {
          clearInterval(timer)
          if (el) scrollToEl(el, -90)
        }
      }, 100)
    })
    return () => { cancelled = true; clearInterval(timer) }
  }, [pathname, hash, isAdmin])

  /* Scroll progress bar */
  useEffect(() => {
    if (isAdmin) return
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [pathname, isAdmin])

  /* Curtain reveal after a route change */
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (isAdmin || prefersReducedMotion() || !curtain.current) return
    const el = curtain.current
    gsap.set(el, { yPercent: 0 })
    gsap.to(el, {
      yPercent: -100,
      duration: 1,
      delay: 0.08,
      ease: 'expo.inOut',
      onComplete: () => { busy.current = false },
    })
    // Never leave the page covered, even if animation frames are throttled.
    const safety = setTimeout(() => { gsap.killTweensOf(el); gsap.set(el, { yPercent: -100 }); busy.current = false }, 2400)
    return () => clearTimeout(safety)
  }, [pathname, isAdmin])

  /* Intercept internal link clicks so the curtain can close before navigating */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const onClick = (e) => {
      if (busy.current || e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      if (a.origin !== window.location.origin) return
      // Same path (even with a different query string, e.g. ?utm_source=…) is not a page change:
      // let the router handle it so no curtain closes and menus can react to the tap.
      const samePage = a.pathname === window.location.pathname
      if (samePage) return
      if (a.pathname.startsWith('/admin') || window.location.pathname.startsWith('/admin')) return
      if (!isReady() || !curtain.current) return

      e.preventDefault()
      e.stopPropagation()
      busy.current = true
      setTimeout(() => { busy.current = false }, 3000)
      getLenis()?.stop()
      const dest = a.pathname + a.search + a.hash
      let went = false
      const go = () => {
        if (went) return
        went = true
        getLenis()?.start()
        navigate(dest)
      }
      gsap.set(curtain.current, { yPercent: 100 })
      gsap.to(curtain.current, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: go })
      setTimeout(go, 1100) // frames throttled? navigate anyway
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  if (isAdmin) return null
  return (
    <>
      <div className="curtain" ref={curtain} aria-hidden />
      <div className="progress" aria-hidden><span ref={bar} /></div>
      <Cursor />
    </>
  )
}
