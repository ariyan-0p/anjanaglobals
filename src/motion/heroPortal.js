import { gsap } from './gsap'

/**
 * The logo portal. A cream veil with the colour logo on it; the veil is a CSS mask
 * with the logo-shaped hole punched out. The logo fills with the hero photo, then
 * the camera dives into the thick stroke of the "G" until the photo floods the
 * screen and the veil dissolves.
 *
 * PIVOT is the deepest interior point of the logo artwork (found by erosion), so
 * the zoom always ends fully inside a letter.
 */
const PIVOT = { x: 0.2852, y: 0.5691 }
const ASPECT = 3508 / 704
const S_MAX = 22

const setMask = (el, size, pos) => {
  el.style.webkitMaskSize = size
  el.style.maskSize = size
  el.style.webkitMaskPosition = pos
  el.style.maskPosition = pos
}

/** Size + centre the logo, and return the numbers the zoom needs. */
export function layoutPortal(veilBg, logo) {
  const vw = veilBg.clientWidth || window.innerWidth
  const vh = veilBg.clientHeight || window.innerHeight
  const ms0 = Math.min(vw * (vw < 640 ? 0.88 : 0.74), 1180)
  const h0 = ms0 / ASPECT
  const tlx = (vw - ms0) / 2
  const tly = (vh - h0) / 2
  Object.assign(logo.style, { left: `${tlx}px`, top: `${tly}px`, width: `${ms0}px`, height: `${h0}px` })
  gsap.set(logo, { opacity: 0, transformOrigin: `${PIVOT.x * ms0}px ${PIVOT.y * h0}px` })
  return {
    vw, vh, ms0, h0, tlx, tly,
    sx: tlx + PIVOT.x * ms0,
    sy: tly + PIVOT.y * h0,
    cx: vw / 2,
    cy: vh / 2,
  }
}

export function playPortal({ veilBg, logo, geo, onZoom, onDone }) {
  const { ms0, h0, sx, sy, cx, cy } = geo
  const ease = gsap.parseEase('power3.inOut')
  const state = { k: 0 }

  const apply = (k) => {
    const e = ease(k)
    const s = Math.exp(Math.log(S_MAX) * e)
    const px = sx + (cx - sx) * e
    const py = sy + (cy - sy) * e
    const w = ms0 * s
    const h = h0 * s
    setMask(veilBg, `${w}px ${h}px, 100% 100%`, `${px - PIVOT.x * w}px ${py - PIVOT.y * h}px, 0 0`)
    gsap.set(logo, { x: px - sx, y: py - sy, scale: s })
  }

  const tl = gsap.timeline({ onComplete: onDone })
  tl.fromTo(logo, { opacity: 0, scale: 0.9, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out' })
  tl.add(() => {
    veilBg.classList.add('has-hole')
    apply(0)
  }, '+=0.45')
  tl.addLabel('zoom')
  tl.to(logo, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 'zoom+=0.05')
  tl.to(state, { k: 1, duration: 2.4, ease: 'none', onUpdate: () => apply(state.k) }, 'zoom')
  tl.add(onZoom, 'zoom+=1.0')
  tl.to(veilBg, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 'zoom+=1.6')
  return tl
}
