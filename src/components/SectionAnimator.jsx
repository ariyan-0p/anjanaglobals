import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function SectionAnimator() {
  const location = useLocation()

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll('main section, .page-hero, .home-stats')
    ).filter((el) => !el.classList.contains('home-hero'))

    const variants = ['reveal-up', 'reveal-left', 'reveal-right']

    nodes.forEach((el, index) => {
      const variant = variants[index % variants.length]
      el.classList.add('reveal-section', variant)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [location.pathname])

  return null
}
