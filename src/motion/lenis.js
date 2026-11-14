import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis = null
let tick = null

export const getLenis = () => lenis

export function startLenis() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    anchors: { offset: -72 },
    autoRaf: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopLenis() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
}

export function scrollToEl(target, offset = -80) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 })
  else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
