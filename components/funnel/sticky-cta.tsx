"use client"

import { useEffect, useState } from "react"
import { ApplyButton } from "./apply-button"

export function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = height > 0 ? window.scrollY / height : 0
      setVisible(progress > 0.6 && progress < 0.97)
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-md"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <p className="text-sm text-zinc-300">
          <span className="font-medium text-white">TradeXLabs</span>
          <span className="mx-2 text-zinc-600">·</span>
          <span className="text-zinc-400">50 founding seats</span>
        </p>
        <ApplyButton className="px-6 py-2.5 text-xs">Apply</ApplyButton>
      </div>
    </div>
  )
}
