"use client"

/**
 * PixelCard: monochrome (white -> gray) shimmering pixel field on black.
 * Adapted from the provided Originkit PixelCard asset for Next.js. Engine unchanged;
 * here it auto-animates ("canvas" mode) so it works as a full-bleed ambient hero field.
 */
import { useEffect, useRef, type CSSProperties } from "react"

class Pixel {
  width: number
  height: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  color: string
  speed: number
  size: number
  sizeStep: number
  minSize: number
  maxSizeInteger: number
  maxSize: number
  delay: number
  counter: number
  counterStep: number
  isIdle: boolean
  isReverse: boolean
  isShimmer: boolean
  /** 0..1 pointer-proximity energy: surges size + brightness near touch/cursor */
  boost = 0

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
    maxPx: number,
  ) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    const factor = maxPx / 2
    this.sizeStep = Math.random() * 0.4 * factor
    this.minSize = 0.5 * factor
    this.maxSizeInteger = maxPx
    this.maxSize = this.getRandomValue(this.minSize, maxPx)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const size = this.size + this.boost * this.maxSizeInteger * 2
    const centerOffset = this.maxSizeInteger * 0.5 - size * 0.5
    this.ctx.fillStyle = this.boost > 0.35 ? "#ffffff" : this.color
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, size, size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }
    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }
    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }
    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0
  const max = 100
  const throttle = 0.001
  if (value <= min || reducedMotion) return min
  if (value >= max) return max * throttle
  return value * throttle
}

const DEFAULT_COLORS = ["#ffffff", "#d4d4d8", "#71717a"]

export function PixelCard({
  gap = 5,
  speed = 35,
  colors = DEFAULT_COLORS,
  pixelSize = 2,
  className,
  style,
}: {
  gap?: number
  speed?: number
  colors?: string[]
  pixelSize?: number
  className?: string
  style?: CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const rafRef = useRef<number | null>(null)
  const timePrevRef = useRef(0)
  const runningRef = useRef(false)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const initPixels = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const width = Math.floor(container.clientWidth)
      const height = Math.floor(container.clientHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const step = Math.max(1, gap)
      const pxs: Pixel[] = []
      let idx = 0
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const c = colors[idx % colors.length]
          idx++
          const dx = x - width / 2
          const dy = y - height / 2
          const delay = reducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy)
          pxs.push(
            new Pixel(canvas, ctx, x, y, c, getEffectiveSpeed(speed, reducedMotion), delay, Math.max(0.1, pixelSize)),
          )
        }
      }
      pixelsRef.current = pxs
    }

    const drawStatic = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pixelsRef.current) {
        p.size = p.maxSize
        p.draw()
      }
    }

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const now = performance.now()
      const passed = now - timePrevRef.current
      const interval = 1000 / 60
      if (passed < interval) return
      timePrevRef.current = now - (passed % interval)
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ptr = pointerRef.current
      const R = 130
      for (const p of pixelsRef.current) {
        // pointer/touch energy: pixels near the cursor surge, then ease back
        let target = 0
        if (ptr.active) {
          const dx = p.x - ptr.x
          const dy = p.y - ptr.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < R) target = 1 - d / R
        }
        p.boost += (target - p.boost) * (target > p.boost ? 0.3 : 0.06)
        p.appear()
      }
    }

    const start = () => {
      if (runningRef.current) return
      runningRef.current = true
      rafRef.current = requestAnimationFrame(animate)
    }
    const stop = () => {
      runningRef.current = false
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }

    initPixels()
    if (reducedMotion) {
      drawStatic()
    } else {
      start()
    }

    const ro = new ResizeObserver(() => {
      initPixels()
      if (reducedMotion) drawStatic()
    })
    ro.observe(container)

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting && !reducedMotion ? start() : stop())),
      { threshold: 0.02 },
    )
    io.observe(container)

    const onVis = () => {
      if (document.hidden) stop()
      else if (!reducedMotion) start()
    }
    document.addEventListener("visibilitychange", onVis)

    // Listen on window so the field reacts to touch/cursor even under overlaid copy.
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointerRef.current = { x, y, active: inside }
    }
    const onPointerEnd = () => {
      pointerRef.current.active = false
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("pointerdown", onPointer, { passive: true })
    window.addEventListener("pointerup", onPointerEnd, { passive: true })
    window.addEventListener("pointercancel", onPointerEnd, { passive: true })

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("pointerup", onPointerEnd)
      window.removeEventListener("pointercancel", onPointerEnd)
    }
  }, [gap, speed, colors, pixelSize])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", ...style }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}
