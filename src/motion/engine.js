import { gsap, ScrollTrigger, SplitText, isFinePointer } from './gsap'
import { onReady } from './ready'

/**
 * Declarative scroll motion.
 *
 * Mark up any element and the engine animates it:
 *   data-split="lines|words"   masked text reveal (set once, on static text only)
 *   data-fade [data-y="40"]    fade + rise
 *   data-stagger               children rise in sequence
 *   data-wipe                  clip-path image reveal (+ inner zoom settle)
 *   data-parallax="10"         ±10% drift of the inner .px layer while scrolling
 *   data-scrub                 words light up as you scroll through the paragraph
 *   data-count                 number counts up once visible
 *   data-magnetic              pointer-attracted button
 * Add data-intro to play after the preloader lifts instead of on scroll,
 * and data-delay="0.2" for a stagger offset.
 *
 * Nothing is hidden in CSS — states are applied by GSAP only, so content stays
 * visible if scripting fails.
 */

const seen = {
  split: new WeakSet(),
  fade: new WeakSet(),
  stagger: new WeakSet(),
  wipe: new WeakSet(),
  parallax: new WeakSet(),
  scrub: new WeakSet(),
  count: new WeakSet(),
  magnetic: new WeakSet(),
}

const fresh = (type, nodes) => nodes.filter((n) => !seen[type].has(n) && seen[type].add(n))

const trig = (el, extra = {}) => ({ trigger: el, start: 'top 90%', once: true, ...extra })
const num = (v, d) => (v === undefined || v === '' ? d : parseFloat(v))

let cleanups = []

export function disposeEngine(ctx) {
  cleanups.forEach((fn) => { try { fn() } catch { /* noop */ } })
  cleanups = []
  if (ctx) ctx.revert()
}

function playWhenReady(tween) {
  tween.pause()
  onReady(() => tween.play())
  return tween
}

function splitReveal(el) {
  const mode = el.dataset.split === 'words' ? 'words' : 'lines'
  const intro = el.hasAttribute('data-intro')
  const delay = num(el.dataset.delay, 0)

  SplitText.create(el, {
    type: mode === 'words' ? 'words,lines' : 'lines',
    mask: mode,
    autoSplit: true,
    linesClass: 'split-line',
    wordsClass: 'split-word',
    onSplit(self) {
      const targets = mode === 'words' ? self.words : self.lines
      const tween = gsap.from(targets, {
        yPercent: 112,
        duration: 1.25,
        ease: 'expo.out',
        stagger: mode === 'words' ? 0.045 : 0.1,
        delay,
        paused: intro,
        scrollTrigger: intro ? undefined : trig(el, { start: 'top 88%' }),
      })
      if (intro) onReady(() => tween.play())
      return tween
    },
  })
}

function fade(el) {
  const tween = gsap.from(el, {
    y: num(el.dataset.y, 38),
    opacity: 0,
    duration: 1.2,
    delay: num(el.dataset.delay, 0),
    ease: 'power3.out',
    scrollTrigger: el.hasAttribute('data-intro') ? undefined : trig(el),
  })
  if (el.hasAttribute('data-intro')) playWhenReady(tween)
}

function stagger(el) {
  const kids = Array.from(el.children)
  if (!kids.length) return
  gsap.from(kids, {
    y: 46,
    opacity: 0,
    duration: 1.1,
    stagger: num(el.dataset.stagger, 0.09),
    ease: 'power3.out',
    scrollTrigger: trig(el, { start: 'top 86%' }),
  })
}

function wipe(el) {
  const inner = el.querySelector('.px, img, video')
  const tl = gsap.timeline({ scrollTrigger: trig(el, { start: 'top 92%' }) })
  tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
  if (inner) tl.fromTo(inner, { scale: 1.4 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0)
}

function parallax(el) {
  const layer = el.querySelector('.px') || el.firstElementChild
  if (!layer) return
  const amt = num(el.dataset.parallax, 10)
  gsap.fromTo(
    layer,
    { yPercent: -amt },
    {
      yPercent: amt,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    }
  )
}

function scrubText(el) {
  SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
        }
      )
    },
  })
}

function count(el) {
  const txt = el.textContent.trim()
  const m = txt.match(/^(\D*)(\d[\d.]*)(.*)$/)
  if (!m) return
  const [, pre, n, post] = m
  const end = parseFloat(n)
  if (!Number.isFinite(end)) return
  const decimals = (n.split('.')[1] || '').length
  const obj = { v: 0 }
  const write = () => { el.textContent = `${pre}${decimals ? obj.v.toFixed(decimals) : Math.round(obj.v)}${post}` }
  write()
  gsap.to(obj, {
    v: end,
    duration: 2.2,
    ease: 'power3.out',
    onUpdate: write,
    scrollTrigger: trig(el, { start: 'top 92%' }),
  })
}

function magnetic(el) {
  if (!isFinePointer()) return
  const strength = num(el.dataset.magnetic, 0.28)
  const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
  const move = (e) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { xTo(0); yTo(0) }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  cleanups.push(() => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  })
}

/** Process every not-yet-seen marked element. Returns how many were new. */
export function scan(ctx) {
  let added = 0
  ctx.add(() => {
    const q = (sel) => Array.from(document.querySelectorAll(sel))
    const run = (type, sel, fn) => {
      const nodes = fresh(type, q(sel))
      nodes.forEach(fn)
      added += nodes.length
    }
    run('split', '[data-split]', splitReveal)
    run('scrub', '[data-scrub]', scrubText)
    run('fade', '[data-fade]', fade)
    run('stagger', '[data-stagger]', stagger)
    run('wipe', '[data-wipe]', wipe)
    run('parallax', '[data-parallax]', parallax)
    run('count', '[data-count]', count)
    run('magnetic', '[data-magnetic]', magnetic)
  })
  // Triggers whose elements React has since removed would otherwise linger.
  ScrollTrigger.getAll().forEach((t) => {
    if (t.trigger && t.trigger.isConnected === false) t.kill()
  })
  return added
}
