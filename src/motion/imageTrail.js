import { gsap, isFinePointer, prefersReducedMotion } from './gsap'

/**
 * Cursor photo trail: as the pointer travels across `host`, destination photos
 * pop out of it, drift on, and dissolve. Elements are created imperatively inside
 * `layer` (which React renders empty), so React never reconciles them.
 */
export function startTrail(host, layer, images) {
  if (!host || !layer || !images.length || !isFinePointer() || prefersReducedMotion()) return () => {}

  const MAX = 9
  const live = []
  let last = { x: -9999, y: -9999 }
  let n = 0

  const spawn = (x, y, dx, dy) => {
    const el = document.createElement('div')
    el.className = 'trail'
    el.style.backgroundImage = `url(${images[n++ % images.length]})`
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    layer.appendChild(el)
    live.push(el)
    if (live.length > MAX) {
      const old = live.shift()
      gsap.killTweensOf(old)
      old.remove()
    }
    const rot = gsap.utils.random(-9, 9)
    gsap.timeline({
      onComplete: () => {
        el.remove()
        const i = live.indexOf(el)
        if (i > -1) live.splice(i, 1)
      },
    })
      .fromTo(
        el,
        { scale: 0.55, opacity: 0, rotation: rot * 1.8, xPercent: -50, yPercent: -50, clipPath: 'inset(100% 0% 0% 0%)' },
        { scale: 1, opacity: 1, rotation: rot, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.out' }
      )
      .to(el, { x: dx * 0.3, y: dy * 0.3 - 26, opacity: 0, scale: 0.86, duration: 0.95, ease: 'power2.in' }, '+=0.12')
  }

  const onMove = (e) => {
    const r = host.getBoundingClientRect()
    if (e.clientY < r.top || e.clientY > r.bottom) return
    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    if (Math.hypot(dx, dy) < 140) return
    last = { x: e.clientX, y: e.clientY }
    spawn(e.clientX - r.left, e.clientY - r.top, dx, dy)
  }

  host.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    host.removeEventListener('pointermove', onMove)
    live.forEach((el) => { gsap.killTweensOf(el); el.remove() })
    live.length = 0
  }
}
