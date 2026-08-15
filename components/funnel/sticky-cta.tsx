"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ApplyButton } from "./apply-button"
import { CLAIMED_SEATS, TOTAL_SEATS } from "./funnel-context"

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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <p className="text-sm text-zinc-300">
              <span className="font-medium text-white">TradeXLabs</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="text-zinc-400">
                <span className="text-white">{TOTAL_SEATS - CLAIMED_SEATS}</span> of {TOTAL_SEATS} founding seats left
              </span>
            </p>
            <ApplyButton className="px-6 py-2.5 text-xs">Claim a seat</ApplyButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
