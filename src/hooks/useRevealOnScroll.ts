import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight IntersectionObserver hook for GPU-accelerated scroll-reveal animations.
 * Disconnects automatically once the element becomes visible.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
