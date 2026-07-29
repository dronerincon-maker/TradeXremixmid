"use client"

/**
 * BrandX: the TradeX mark, extracted verbatim from public/icon.svg (the two
 * "foreground" paths), scaled up to a hero centerpiece. It carries a soft
 * outer glow and a very subtle pointer-parallax tilt so it reads as a solid
 * object floating in the tunnel — not a flat sticker.
 *
 * Reduced motion / no JS: renders static and centered. The parallax is a
 * progressive enhancement applied only when motion is allowed.
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
      <svg viewBox="0 0 180 180" className="h-full w-full" role="img" aria-label="TradeXLabs">
        <defs>
          <linearGradient id="brandx-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="brandx-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g style={{ transform: "scale(0.95)", transformOrigin: "center" }} filter="url(#brandx-glow)">
          <path
            fill="url(#brandx-fill)"
            d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z"
          />
          <path
            fill="url(#brandx-fill)"
            d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z"
          />
        </g>
      </svg>
    </div>
  )
}
