import { useEffect, useState, type RefObject } from 'react'

/** Whether the element is at least partly visible in the viewport. */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
