"use client"

/**
 * GridBackdrop: the hero's tilted 3D hairline grid, repurposed as a fixed,
 * page-wide backdrop. Sits behind all content (-z-10); sections that keep
 * their own bg-black / shaders occlude it, while transparent sections reveal it.
 *
 * Differences from PrismGridHero:
 * - position: fixed, full viewport, single instance per page (one DOM grid total).
 * - pointermove is listened on window (content sits above the backdrop).
 * - Reduced motion → static hairline grid. Tab hidden → ambient paused.
 */

import { useEffect, useRef } from "react"

const COLORS = ["#FFFFFF", "#E4E4E7", "#A1A1AA", "#71717A", "#3F3F46"]
const BOX = 44
const YAW = 8
const PITCH = -6
const P = 1000

export function GridBackdrop({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const plane = planeRef.current
    if (!root || !plane) return

    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let cols = 0
    let rows = 0
    let gw = 0
    let gh = 0

    const build = () => {
      const w = window.innerWidth
      const h = window.innerHeight
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
          html += `<div style="position:absolute;left:${c * BOX}px;top:${r * BOX}px;width:${BOX}px;height:${BOX}px;box-sizing:border-box;border:1px solid rgba(255,255,255,0.22)"></div>`
        }
      }
      plane.innerHTML = html
    }

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
      const pt = screenToPlane(e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2)
      if (!pt) return
      const c = Math.floor((pt.x + gw / 2) / BOX)
      const r = Math.floor((pt.y + gh / 2) / BOX)
      if (c < 0 || c >= cols || r < 0 || r >= rows) return
      const key = `${r},${c}`
      if (key === last) return
      last = key
      light(r, c)
    }

    let ambient: ReturnType<typeof setInterval> | null = null
    const startAmbient = () => {
      if (reduce || ambient) return
      ambient = setInterval(() => {
        light((Math.random() * rows) | 0, (Math.random() * cols) | 0)
      }, 340)
    }
    const stopAmbient = () => {
      if (ambient) {
        clearInterval(ambient)
        ambient = null
      }
    }

    build()
    startAmbient()
    const onResize = () => build()
    const onVis = () => {
      if (document.hidden) stopAmbient()
      else startAmbient()
    }
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVis)
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    return () => {
      stopAmbient()
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ perspective: "1000px", perspectiveOrigin: "center center" }}>
        <div ref={planeRef} className="absolute left-1/2 top-1/2" style={{ transformOrigin: "center center" }} />
      </div>
      {/* dim wash so foreground copy stays primary: heavier in the center column where copy lives */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(62% 52% at 50% 50%, rgba(0,0,0,0.5), rgba(0,0,0,0.12) 75%, transparent)",
        }}
      />
    </div>
  )
}
