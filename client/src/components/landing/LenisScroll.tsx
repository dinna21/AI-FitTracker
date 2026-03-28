import { useEffect } from "react"
import Lenis from "lenis"

export default function LenisScroll() {
  useEffect(() => {
    const wrapper = document.getElementById("app-scroll-container")
    const content = wrapper?.firstElementChild as HTMLElement | null

    const lenis = wrapper && content
      ? new Lenis({
          wrapper,
          content,
          duration: 1.1,
          smoothWheel: true,
        })
      : new Lenis({
          duration: 1.1,
          smoothWheel: true,
        })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
