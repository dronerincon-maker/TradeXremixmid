"use client"

/**
 * PrismGridHero: full-screen tilted 3D grid of hairline squares on black.
 * Pointer movement lights individual cells in white/gray with a 1s fade trail.
 * An ambient auto-glow keeps the surface alive without a pointer.
 * Ported from the provided tradexlabs_prism_grid_hero.html asset.
 *
 * - Reduced motion → static hairline grid (no ambient, no pointer trail).
 * - Pauses ambient glow when offscreen or the tab is hidden.
 * - Purely decorative: aria-hidden, DOM-cell based (no canvas), GPU-composited fades.
 */

import { useEffect, useRef } from "react"

const COLORS = ["#FFFFFF", "#E4E4E7", "#A1A1AA", "#71717A", "#3F3F46"]
const BOX = 44
const YAW = 8
const PITCH = -6
const P = 1000

export function PrismGridHero({ className = "" }: { className?: string }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const plane = planeRef.current
    if (!hero || !plane) return

    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let cols = 0
    let rows = 0
    let gw = 0
    let gh = 0

    const build = () => {
      const w = hero.clientWidth
      const h = hero.clientHeight
      cols = Math.ceil(w / BOX) + 6
      rows = Math.ceil(h / BOX) + 6
      gw = cols * BOX
      gh = rows * BOX
      plane.style.width = `${gw}px`
      plane.style.height = `${gh}px`
      plane.style.transform = `translate(-50%,-50%) rotateY(${YAW}deg) rotateX(${PITCH}deg)`
      let html = ""
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          html += `<div style="position:absolute;left:${c * BOX}px;top:${r * BOX}px;width:${BOX}px;height:${BOX}px;box-sizing:border-box;border:1px solid rgba(255,255,255,0.08)"></div>`
        }
      }
      plane.innerHTML = html
    }

    /** Invert the plane rotation to map a screen point onto grid coordinates. */
    const screenToPlane = (sx: number, sy: number) => {
      const a = (YAW * Math.PI) / 180
      const b = (PITCH * Math.PI) / 180
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      const cb = Math.cos(b)
      const sb = Math.sin(b)
      const a11 = P * ca - sx * sa * cb
      const a12 = sx * sb
      const a21 = P * sa * sb - sy * sa * cb
      const a22 = P * cb + sy * sb
      const det = a11 * a22 - a12 * a21
      if (!isFinite(det) || Math.abs(det) < 1e-6) return null
      const b1 = sx * P
      const b2 = sy * P
      return { x: (b1 * a22 - a12 * b2) / det, y: (a11 * b2 - b1 * a21) / det }
    }

    const light = (r: number, c: number) => {
      const d = document.createElement("div")
      d.style.cssText = `position:absolute;pointer-events:none;transition:opacity 1s ease;left:${c * BOX}px;top:${r * BOX}px;width:${BOX}px;height:${BOX}px;background:${COLORS[(Math.random() * COLORS.length) | 0]};opacity:1`
      plane.appendChild(d)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          d.style.opacity = "0"
        })
      })
      setTimeout(() => d.remove(), 1100)
    }

    let last: string | null = null
    const onPointerMove = (e: PointerEvent) => {
      if (reduce) return
      const rect = hero.getBoundingClientRect()
      const pt = screenToPlane(e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2)
      if (!pt) return
      const c = Math.floor((pt.x + gw / 2) / BOX)
      const r = Math.floor((pt.y + gh / 2) / BOX)
      if (c < 0 || c >= cols || r < 0 || r >= rows) return
      const key = `${r},${c}`
      if (key === last) return
      last = key
      light(r, c)
    }

    // Ambient auto-glow so the grid moves without a pointer (mobile included).
    let ambient: ReturnType<typeof setInterval> | null = null
    const startAmbient = () => {
      if (reduce || ambient) return
      ambient = setInterval(() => {
        light((Math.random() * rows) | 0, (Math.random() * cols) | 0)
      }, 420)
    }
    const stopAmbient = () => {
      if (ambient) {
        clearInterval(ambient)
        ambient = null
      }
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(hero)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (entry.isIntersecting ? startAmbient() : stopAmbient())),
      { threshold: 0.05 },
    )
    io.observe(hero)
    const onVis = () => {
      if (document.hidden) stopAmbient()
      else startAmbient()
    }
    document.addEventListener("visibilitychange", onVis)
    hero.addEventListener("pointermove", onPointerMove)

    return () => {
      stopAmbient()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      hero.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <div ref={heroRef} aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{ perspective: "1000px", perspectiveOrigin: "center center" }}
      >
        <div ref={planeRef} className="absolute left-1/2 top-1/2" style={{ transformOrigin: "center center" }} />
      </div>
    </div>
  )
}
