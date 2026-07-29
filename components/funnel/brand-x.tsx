"use client"

/**
 * BrandX: the TradeXLabs mark — two crossing blades with the brand
 * cyan → blue → magenta gradient (left cool, right warm), matching the
 * supplied logo. The gradient lives ONLY on the mark; the rest of the UI
 * stays monochrome, so the accent reads as brand identity rather than a
 * generic gradient wash.
 *
 * A soft outer glow + a bright crossing-point core give it depth; a subtle
 * pointer-parallax tilt makes it feel like a solid object in the tunnel.
 * Reduced motion / no JS → static and centered.
 */

import { useEffect, useRef } from "react"
import { usePrefersReducedMotion } from "./motion"

export function BrandX({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const state = { rx: 0, ry: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      state.tx = (e.clientX / window.innerWidth) * 2 - 1
      state.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const tick = () => {
      state.rx += (state.ty * -6 - state.rx) * 0.06
      state.ry += (state.tx * 8 - state.ry) * 0.06
      el.style.transform = `perspective(1000px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <div ref={wrapRef} className={`will-change-transform ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label="TradeXLabs">
        <defs>
          {/* cool → warm along each blade: left ends cyan, right ends magenta */}
          <linearGradient id="brandx-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2FC6F6" />
            <stop offset="48%" stopColor="#5B6EF0" />
            <stop offset="100%" stopColor="#C33BE1" />
          </linearGradient>
          <filter id="brandx-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#brandx-glow)">
          {/* \ blade: top-left (cyan) → bottom-right (magenta) */}
          <rect x="8" y="50" width="104" height="20" rx="5" fill="url(#brandx-grad)" transform="rotate(45 60 60)" />
          {/* / blade: bottom-left (cyan) → top-right (magenta) */}
          <rect x="8" y="50" width="104" height="20" rx="5" fill="url(#brandx-grad)" transform="rotate(-45 60 60)" />
          {/* brighter crossing core */}
          <rect x="49" y="49" width="22" height="22" rx="4" fill="#ffffff" opacity="0.55" transform="rotate(45 60 60)" />
        </g>
      </svg>
    </div>
  )
}
