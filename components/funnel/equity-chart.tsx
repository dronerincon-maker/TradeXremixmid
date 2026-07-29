"use client"

/**
 * EquityChart: dependency-free SVG line chart for backtest equity curves.
 * Renders real [date, cumulative $] points from lib/backtest-data.ts.
 * The draw-in is a CSS stroke-dash transition (no rAF loop, no library),
 * skipped entirely under prefers-reduced-motion.
 */

import { useMemo } from "react"
import type { EquityPoint } from "@/lib/backtest-data"
import { useInView, usePrefersReducedMotion } from "./motion"

const W = 720
const H = 240
const PAD = { top: 12, right: 8, bottom: 22, left: 54 }

function formatUsd(v: number) {
  const abs = Math.abs(v)
  const s = abs >= 1000 ? `$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k` : `$${abs.toFixed(0)}`
  return v < 0 ? `-${s}` : s
}

export function EquityChart({ points, id }: { points: EquityPoint[]; id: string }) {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })

  const { path, area, ticksY, ticksX, zeroY } = useMemo(() => {
    const values = points.map((p) => p[1])
    const min = Math.min(0, ...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const iw = W - PAD.left - PAD.right
    const ih = H - PAD.top - PAD.bottom

    const x = (i: number) => PAD.left + (i / (points.length - 1)) * iw
    const y = (v: number) => PAD.top + (1 - (v - min) / span) * ih

    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join("")
    const area = `${path}L${x(points.length - 1).toFixed(1)},${y(min).toFixed(1)}L${x(0).toFixed(1)},${y(min).toFixed(1)}Z`

    const step = span / 4
    const ticksY = Array.from({ length: 5 }, (_, i) => {
      const v = min + i * step
      return { v, y: y(v) }
    })

    // ~5 year labels across the record
    const n = points.length
    const idxs = [0, Math.floor(n * 0.25), Math.floor(n * 0.5), Math.floor(n * 0.75), n - 1]
    const ticksX = idxs.map((i) => {
      const [d] = points[i]
      const year = d.split("/")[2]
      return { label: `’${year.slice(-2)}`, x: x(i) }
    })

    return { path, area, ticksY, ticksX, zeroY: min < 0 ? y(0) : null }
  }, [points])

  const drawn = reduce || inView

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Cumulative backtest profit over time"
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {ticksY.map((t) => (
          <g key={t.v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={PAD.left - 8} y={t.y + 3} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.38)" fontFamily="var(--font-geist-mono)">
              {formatUsd(t.v)}
            </text>
          </g>
        ))}
        {zeroY !== null && (
          <line x1={PAD.left} x2={W - PAD.right} y1={zeroY} y2={zeroY} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
        )}
        {ticksX.map((t) => (
          <text key={t.x} x={t.x} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.38)" fontFamily="var(--font-geist-mono)">
            {t.label}
          </text>
        ))}

        <path d={area} fill={`url(#${id}-fill)`} opacity={drawn ? 1 : 0} style={{ transition: "opacity 900ms ease 500ms" }} />
        <path
          d={path}
          fill="none"
          stroke="#fff"
          strokeWidth="1.75"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: reduce ? "none" : "stroke-dashoffset 1400ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
    </div>
  )
}
