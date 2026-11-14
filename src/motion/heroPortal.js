import { gsap } from './gsap'

/**
 * The logo portal. The preloader is a cream veil whose mask has the logo-shaped hole
 * punched out; once loading finishes, the logo fills with the live page behind it and
 * the camera dives into the thick stroke of the "G" until the page floods the screen.
 *
 * PIVOT is the deepest interior point of the logo artwork (found by erosion), so the
 * zoom always ends fully inside a letter.
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

/** Size + centre the logo wrapper; returns the numbers the zoom needs. */
export function layoutPortal(logoWrap) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const ms0 = Math.min(vw * (vw < 640 ? 0.88 : 0.72), 1180)
  const h0 = ms0 / ASPECT
  const tlx = (vw - ms0) / 2
  const tly = (vh - h0) / 2
  Object.assign(logoWrap.style, { left: `${tlx}px`, top: `${tly}px`, width: `${ms0}px`, height: `${h0}px` })
  gsap.set(logoWrap, { transformOrigin: `${PIVOT.x * ms0}px ${PIVOT.y * h0}px` })
  return { ms0, h0, sx: tlx + PIVOT.x * ms0, sy: tly + PIVOT.y * h0, cx: vw / 2, cy: vh / 2 }
}

/** Dive through the logo. `fast` shortens it for repeat visits. */
export function zoomPortal({ bg, logoWrap, geo, fast, onZoom, onDone }) {
  const { ms0, h0, sx, sy, cx, cy } = geo
  const ease = gsap.parseEase('power3.inOut')
  const state = { k: 0 }
  const dur = fast ? 1.6 : 2.5

  const apply = (k) => {
    const e = ease(k)
    const s = Math.exp(Math.log(S_MAX) * e)
    const px = sx + (cx - sx) * e
    const py = sy + (cy - sy) * e
    const w = ms0 * s
    const h = h0 * s
    setMask(bg, `${w}px ${h}px, 100% 100%`, `${px - PIVOT.x * w}px ${py - PIVOT.y * h}px, 0 0`)
    gsap.set(logoWrap, { x: px - sx, y: py - sy, scale: s })
  }

  const tl = gsap.timeline({ onComplete: onDone })
  tl.add(() => {
    bg.classList.add('has-hole')
    apply(0)
  })
  tl.addLabel('zoom')
  tl.to(logoWrap, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 'zoom+=0.05')
  tl.to(state, { k: 1, duration: dur, ease: 'none', onUpdate: () => apply(state.k) }, 'zoom')
  tl.add(onZoom, `zoom+=${dur * 0.42}`)
  tl.to(bg, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, `zoom+=${dur * 0.66}`)
  return tl
}
