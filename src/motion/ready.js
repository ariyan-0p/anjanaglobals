// "Ready" = the preloader curtain has lifted. Hero intro animations wait for it
// on first load; on later route changes it is already true so they run at once.
let ready = false
const queue = []

export const isReady = () => ready

export function markReady() {
  if (ready) return
  ready = true
  while (queue.length) queue.shift()()
}

export function onReady(fn) {
  if (ready) fn()
  else queue.push(fn)
}
