"use client"

import { useEffect, useState } from "react"
import { trackScrollDepth } from "@/lib/analytics"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const p = height > 0 ? scrollTop / height : 0
      setProgress(p)
      trackScrollDepth(p)
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="sig-gradient-bar fixed left-0 top-0 z-[60] h-px"
      style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
    />
  )
}
