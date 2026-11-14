import { getLenis } from './lenis'

let locks = 0

export function lockScroll() {
  locks += 1
  if (locks === 1) {
    getLenis()?.stop()
    document.body.style.overflow = 'hidden'
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    getLenis()?.start()
    document.body.style.overflow = ''
  }
}
