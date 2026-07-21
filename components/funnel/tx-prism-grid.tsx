"use client"

/**
 * TxPrismGrid: tilted 3D hairline grid on black. Pointer movement lights individual
 * cells (white/gray) with a 1s fade trail. Monochrome brand palette. Adapted for Next.js.
 */
import {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  type CSSProperties,
} from "react"
import { motion } from "framer-motion"

const DEFAULT_COLORS = ["#FFFFFF", "#E4E4E7", "#A1A1AA", "#71717A", "#3F3F46"]
const PERSPECTIVE = 1000

function screenToPlane(sx: number, sy: number, yawDeg: number, pitchDeg: number, p = PERSPECTIVE) {
  const a = (yawDeg * Math.PI) / 180
  const b = (pitchDeg * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const cb = Math.cos(b)
  const sb = Math.sin(b)
  const a11 = p * ca - sx * sa * cb
  const a12 = sx * sb
  const a21 = p * sa * sb - sy * sa * cb
  const a22 = p * cb + sy * sb
  const det = a11 * a22 - a12 * a21
  if (!isFinite(det) || Math.abs(det) < 1e-6) return null
  const b1 = sx * p
  const b2 = sy * p
  return { x: (b1 * a22 - a12 * b2) / det, y: (a11 * b2 - b1 * a21) / det }
}

interface Cell {
  id: number
  row: number
  col: number
  color: string
}

export function TxPrismGrid({
  backgroundColor = "transparent",
  boxSize = 48,
  borderColor = "rgba(255,255,255,0.08)",
  rotate = { x: 8, y: -6 },
  colors = DEFAULT_COLORS,
  interactive = true,
  style,
}: {
  backgroundColor?: string
  boxSize?: number
  borderColor?: string
  rotate?: { x?: number; y?: number }
  colors?: string[]
  interactive?: boolean
  style?: CSSProperties
}) {
  const outDuration = 1
  const containerRef = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState(24)
  const [cols, setCols] = useState(24)
  const swingX = rotate?.x ?? 0
  const swingY = rotate?.y ?? 0

  const palette = useMemo(() => (colors && colors.length > 0 ? colors : DEFAULT_COLORS), [colors])
  const getRandomColor = () => palette[Math.floor(Math.random() * palette.length)]

  const calculateGrid = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    setCols(Math.max(1, Math.ceil(w / boxSize)))
    setRows(Math.max(1, Math.ceil(h / boxSize)))
  }, [boxSize])

  useLayoutEffect(() => {
    calculateGrid()
    window.addEventListener("resize", calculateGrid)
    return () => window.removeEventListener("resize", calculateGrid)
  }, [calculateGrid])

  const gridWidth = cols * boxSize
  const gridHeight = rows * boxSize
  const border = `1px solid ${borderColor}`

  const [lit, setLit] = useState<Cell | null>(null)
  const [fading, setFading] = useState<Cell[]>([])
  const idRef = useRef(0)
  const litRef = useRef<Cell | null>(null)

  const leave = useCallback(() => {
    const current = litRef.current
    if (current) {
      litRef.current = null
      setFading((f) => [...f, current])
      setLit(null)
    }
  }, [])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const sx = event.clientX - rect.left - rect.width / 2
      const sy = event.clientY - rect.top - rect.height / 2
      const point = screenToPlane(sx, sy, swingX, swingY)
      if (!point) return leave()
      const gx = point.x + gridWidth / 2
      const gy = point.y + gridHeight / 2
      const col = Math.floor(gx / boxSize)
      const row = Math.floor(gy / boxSize)
      if (col < 0 || col >= cols || row < 0 || row >= rows) return leave()
      const current = litRef.current
      if (current && current.row === row && current.col === col) return
      const next: Cell = { id: ++idRef.current, row, col, color: getRandomColor() }
      litRef.current = next
      if (current) setFading((f) => [...f, current])
      setLit(next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [swingX, swingY, gridWidth, gridHeight, boxSize, cols, rows, palette, leave, interactive],
  )

  useLayoutEffect(() => {
    if (fading.length === 0) return
    const timer = setTimeout(() => setFading((f) => f.slice(1)), outDuration * 1000)
    return () => clearTimeout(timer)
  }, [fading])

  // Ambient glow for non-interactive (mobile): occasionally light a random cell.
  useEffect(() => {
    if (interactive) return
    const interval = setInterval(() => {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      const cell = { id: ++idRef.current, row, col, color: getRandomColor() }
      setFading((f) => [...f.slice(-6), cell])
    }, 900)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, rows, cols])

  const boxes = useMemo(() => {
    const rowsArray = new Array(rows).fill(1)
    const colsArray = new Array(cols).fill(1)
    return rowsArray.map((_, i) => (
      <div key={`row-${i}`} style={{ display: "flex", borderLeft: border, borderBottom: i === rows - 1 ? border : undefined }}>
        {colsArray.map((_, j) => (
          <div
            key={`col-${j}`}
            style={{ width: boxSize, height: boxSize, flexShrink: 0, boxSizing: "border-box", borderRight: border, borderTop: border }}
          />
        ))}
      </div>
    ))
  }, [rows, cols, boxSize, border])

  const cellStyle = (cell: Cell): CSSProperties => ({
    position: "absolute",
    left: cell.col * boxSize,
    top: cell.row * boxSize,
    width: boxSize,
    height: boxSize,
    backgroundColor: cell.color,
    opacity: 0.5,
    pointerEvents: "none",
  })

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={leave}
      style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor }}
    >
      <div style={{ position: "absolute", inset: 0, perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "center center", transformStyle: "preserve-3d" }}>
        <div
          style={{
            transform: `translate(-50%, -50%) rotateY(${swingX}deg) rotateX(${swingY}deg)`,
            position: "absolute",
            left: "50%",
            top: "50%",
            display: "flex",
            flexDirection: "column",
            transformOrigin: "center center",
            width: gridWidth,
            height: gridHeight,
          }}
        >
          {boxes}
          {fading.map((cell) => (
            <motion.div key={cell.id} initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: outDuration }} style={cellStyle(cell)} />
          ))}
          {lit && (
            <motion.div key={lit.id} initial={{ opacity: 0.5 }} animate={{ opacity: 0.5 }} style={cellStyle(lit)} />
          )}
        </div>
      </div>
    </div>
  )
}
