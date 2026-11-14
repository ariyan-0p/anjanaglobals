import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from './gsap'

const INTERACTIVE = 'a, button, [role="button"], summary, label[for], [data-cursor]'
const TEXTUAL = 'input, textarea, select, [contenteditable="true"], video[controls]'

/** Dot + trailing ring. Grows over links, shows a label over [data-cursor="Label"]. */
export default function Cursor() {
  const root = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return
    const el = root.current
    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'none' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'none' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    let shown = false

    const move = (e) => {
      if (!shown) {
        shown = true
        el.classList.add('is-on')
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const over = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      if (t.closest(TEXTUAL)) { el.classList.add('is-hidden'); return }
      el.classList.remove('is-hidden')
      const hit = t.closest(INTERACTIVE)
      const text = hit && hit.getAttribute('data-cursor')
      el.classList.toggle('is-link', !!hit && !text)
      el.classList.toggle('is-label', !!text)
      label.current.textContent = text || ''
    }
    const leave = () => { shown = false; el.classList.remove('is-on') }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div className="cursor" ref={root} aria-hidden>
      <div className="cursor__ring" ref={ring}><span className="cursor__label" ref={label} /></div>
      <div className="cursor__dot" ref={dot} />
    </div>
  )
}
