"use client"

/**
 * TxParticleX: a brand "X" made of flowing particles (canvas 2D).
 * Adapted from the provided asset: particles steer toward targets sampled
 * from an offscreen-rendered X, with motion-blur trails and soft mouse repel.
 * Monochrome palette to honor the funnel's black/white design rail.
 *
 * - Decorative only (aria-hidden). Reduced motion → static particle X.
 * - Pauses when offscreen or the tab is hidden.
 */

import { useEffect, useRef } from "react"

interface RGB {
  r: number
  g: number
  b: number
}
const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

class Particle {
  x = 0
  y = 0
  vx = 0
  vy = 0
  tx = 0
  ty = 0
  r = 255
  g = 255
  b = 255
  size = 2
  maxSpeed = Math.random() * 2 + 2
  maxForce = this.maxSpeed * 0.06

  step(mx: number, my: number, mAct: boolean) {
    let dx = this.tx - this.x
    let dy = this.ty - this.y
    const d = Math.hypot(dx, dy) || 1
    const near = d < 90 ? d / 90 : 1
    dx = (dx / d) * this.maxSpeed * near
    dy = (dy / d) * this.maxSpeed * near
    let sx = dx - this.vx
    let sy = dy - this.vy
    const sm = Math.hypot(sx, sy) || 1
    sx = (sx / sm) * this.maxForce
    sy = (sy / sm) * this.maxForce
    this.vx += sx
    this.vy += sy
    if (mAct) {
      const ox = this.x - mx
      const oy = this.y - my
      const od = Math.hypot(ox, oy)
      if (od < 110 && od > 0.001) {
        const f = (1 - od / 110) * 2.4
        this.vx += (ox / od) * f
        this.vy += (oy / od) * f
      }
    }
    this.vx *= 0.92
    this.vy *= 0.92
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}

export interface TxParticleXProps {
  background?: string
  /** gradient endpoints, left→right of the X */
  palette?: [string, string]
  className?: string
}

export function TxParticleX({
  background = "#000000",
  palette = ["#ffffff", "#52525b"],
  className = "",
}: TxParticleXProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bg = hexToRgb(background)
    const c1 = hexToRgb(palette[0])
    const c2 = hexToRgb(palette[1])
    const spark = [hexToRgb("#e4e4e7"), hexToRgb("#a1a1aa")]
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let particles: Particle[] = []
    let W = 0
    let H = 0
    const mouse = { x: -1e4, y: -1e4, active: false }

    /** Sample target points from a big X drawn offscreen, and (re)assign particles. */
    const buildTargets = () => {
      W = canvas.width
      H = canvas.height
      const off = document.createElement("canvas")
      off.width = W
      off.height = H
      const octx = off.getContext("2d")
      if (!octx) return
      const size = Math.min(W, H) * 0.62
      const cx = W / 2
      const cy = H * 0.5
      const r = size / 2
      octx.strokeStyle = "#fff"
      octx.lineWidth = size * 0.15
      octx.lineCap = "round"
      octx.beginPath()
      octx.moveTo(cx - r, cy - r)
      octx.lineTo(cx + r, cy + r)
      octx.moveTo(cx + r, cy - r)
      octx.lineTo(cx - r, cy + r)
      octx.stroke()

      const data = octx.getImageData(0, 0, W, H).data
      const step = W < 620 ? 6 : 5
      const coords: Array<{ x: number; y: number }> = []
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 0) coords.push({ x, y })
        }
      }
      for (let i = coords.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0
        ;[coords[i], coords[j]] = [coords[j], coords[i]]
      }
      while (particles.length < coords.length) {
        const p = new Particle()
        p.x = Math.random() * W
        p.y = Math.random() * H
        particles.push(p)
      }
      particles.length = coords.length
      const xL = cx - r
      const span = 2 * r
      for (let i = 0; i < coords.length; i++) {
        const p = particles[i]
        p.tx = coords[i].x
        p.ty = coords[i].y
        if (Math.random() < 0.06) {
          const s = spark[(Math.random() * spark.length) | 0]
          p.r = s.r
          p.g = s.g
          p.b = s.b
        } else {
          const t = Math.min(1, Math.max(0, (coords[i].x - xL) / span))
          p.r = Math.round(lerp(c1.r, c2.r, t))
          p.g = Math.round(lerp(c1.g, c2.g, t))
          p.b = Math.round(lerp(c1.b, c2.b, t))
        }
        if (reduce) {
          p.x = p.tx
          p.y = p.ty
        }
      }
    }

    const renderStatic = () => {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, W, H)
      for (const p of particles) {
        p.x = p.tx
        p.y = p.ty
        p.draw(ctx)
      }
    }

    const sizeCanvas = () => {
      canvas.width = Math.max(320, Math.round(wrap.clientWidth))
      canvas.height = Math.max(320, Math.round(wrap.clientHeight))
      buildTargets()
      if (reduce) renderStatic()
    }

    let raf = 0
    let running = false
    const frame = () => {
      if (!running) return
      ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},0.14)` // motion-blur trail
      ctx.fillRect(0, 0, W, H)
      for (const p of particles) {
        p.step(mouse.x, mouse.y, mouse.active)
        p.draw(ctx)
      }
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (!running && !reduce) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    sizeCanvas()
    const ro = new ResizeObserver(sizeCanvas)
    ro.observe(wrap)
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), {
      threshold: 0.05,
    })
    io.observe(wrap)
    const onVis = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener("visibilitychange", onVis)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    if (reduce) renderStatic()
    else start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
    }
  }, [background, palette])

  return (
    <div ref={wrapRef} aria-hidden className={className} style={{ background }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
