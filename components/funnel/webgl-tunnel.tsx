"use client"

/**
 * WebGLTunnel: a procedural wormhole / data-corridor rendered with raw WebGL
 * (a single full-screen fragment shader — no Three.js, ~3KB of GPU code).
 *
 * It is the funnel's unifying "institutional command center" backdrop:
 * a monochrome grid tunnel flying toward the viewer, with restrained cool
 * accents. Everything is procedural, so there is no image/video to download —
 * the LCP stays text/CTA, not a heavy asset.
 *
 * Performance & correctness:
 * - DPR capped (1.5 desktop / 1 mobile); resolution scaled by `quality`.
 * - requestAnimationFrame paused when offscreen (IntersectionObserver) and
 *   when the tab is hidden (visibilitychange).
 * - Pointer / scroll parallax fed as uniforms (no React re-render per frame).
 * - prefers-reduced-motion → a single static frame, no rAF loop.
 * - No WebGL support → transparent; a CSS gradient fallback shows through.
 * - Full teardown: cancel rAF, remove listeners, delete GL objects, lose ctx.
 *
 * Props let each usage tune speed, intensity, hue and density so the same
 * engine can read as "hero fly-through" or "quiet ambient corridor".
 */

import { useEffect, useRef } from "react"

type Props = {
  className?: string
  /** forward flight speed */
  speed?: number
  /** overall brightness 0..1 */
  intensity?: number
  /** grid density (rings/spokes) */
  density?: number
  /** subtle accent tint, [r,g,b] 0..1 — kept near-white for the monochrome brand */
  accent?: [number, number, number]
  /** 0..1 render-scale multiplier; lower = cheaper */
  quality?: number
  /** couple flight speed to scroll velocity for the "fly through" feel */
  scrollReactive?: boolean
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// Polar "tunnel": for each pixel we take angle + inverse-radius as texture
// coordinates, march them forward in time, and draw a procedural grid with a
// soft core glow and vignette. Cheap enough for integrated mobile GPUs.
const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;   // -1..1
uniform float u_speed;
uniform float u_intensity;
uniform float u_density;
uniform vec3  u_accent;

float hash(float n){ return fract(sin(n)*43758.5453123); }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;

  // pointer + gentle drift steer the vanishing point
  vec2 center = u_pointer*0.12 + vec2(sin(u_time*0.05)*0.02, cos(u_time*0.04)*0.02);
  vec2 p = uv - center;

  float r = length(p);
  float a = atan(p.y, p.x);

  // tunnel coordinates: v flies forward as time advances
  float depth = 1.0 / (r + 0.06);
  float v = depth + u_time * u_speed;
  float uang = a / 3.14159265;

  // procedural grid — rings (along depth) and spokes (around angle)
  float rings = abs(sin(v * u_density));
  float spokes = abs(sin(uang * u_density * 3.0 + v*0.5));
  float grid = pow(1.0 - min(rings, 1.0), 6.0) + pow(1.0 - min(spokes,1.0), 10.0)*0.6;

  // depth fade + flicker so distant grid dissolves into black
  float fog = smoothstep(0.0, 1.6, r);
  float flick = 0.85 + 0.15*hash(floor(v*2.0)+floor(uang*6.0));
  grid *= (1.0 - fog) * flick;

  // faint glow down the throat — kept dim so foreground copy stays legible
  float core = pow(max(0.0, 1.0 - r*1.7), 3.0) * 0.22;

  vec3 base = vec3(0.82, 0.88, 0.96);           // near-white grid
  vec3 col = base * grid + u_accent * (grid*0.45 + core);
  col += u_accent * core;

  // dark central well + vignette so the headline never fights the grid
  col *= smoothstep(0.10, 0.65, r);             // hollow out the middle
  col *= smoothstep(1.30, 0.35, r);             // outer vignette
  col *= u_intensity;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function WebGLTunnel({
  className = "",
  speed = 0.35,
  intensity = 1,
  density = 9,
  accent = [0.35, 0.55, 0.75],
  quality = 1,
  scrollReactive = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches ?? false

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl", { antialias: false })) as WebGLRenderingContext | null
    if (!gl) return // fallback gradient shows through

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    // full-screen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")
    const uPointer = gl.getUniformLocation(prog, "u_pointer")
    const uSpeed = gl.getUniformLocation(prog, "u_speed")
    const uIntensity = gl.getUniformLocation(prog, "u_intensity")
    const uDensity = gl.getUniformLocation(prog, "u_density")
    const uAccent = gl.getUniformLocation(prog, "u_accent")

    gl.uniform1f(uIntensity, intensity)
    gl.uniform1f(uDensity, density)
    gl.uniform3f(uAccent, accent[0], accent[1], accent[2])

    const dprCap = isMobile ? 1 : 1.5
    const scale = Math.max(0.4, Math.min(1, quality)) * (isMobile ? 0.85 : 1)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * scale
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    // pointer (lerped) + scroll velocity
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    let lastScroll = window.scrollY
    let scrollBoost = 0
    const onScroll = () => {
      const dy = window.scrollY - lastScroll
      lastScroll = window.scrollY
      if (scrollReactive) scrollBoost = Math.min(3, scrollBoost + Math.abs(dy) * 0.01)
    }

    let raf = 0
    let running = false
    const start = performance.now()

    const frame = (now: number) => {
      const t = (now - start) / 1000
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      scrollBoost *= 0.92
      gl.uniform1f(uTime, t)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform1f(uSpeed, speed * (1 + scrollBoost))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }

    const renderStatic = () => {
      gl.uniform1f(uTime, 12)
      gl.uniform2f(uPointer, 0, 0)
      gl.uniform1f(uSpeed, speed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const play = () => {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const pause = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    resize()
    if (reduce) {
      renderStatic()
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true })
      window.addEventListener("scroll", onScroll, { passive: true })
    }
    window.addEventListener("resize", resize)

    // only run while visible
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting)
        if (visible && !document.hidden) play()
        else pause()
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)
    const onVis = () => {
      if (document.hidden) pause()
      else play()
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      pause()
      io.disconnect()
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      const lose = gl.getExtension("WEBGL_lose_context")
      lose?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* CSS fallback: shows when WebGL is unavailable or before first paint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, rgba(30,45,70,0.35), rgba(0,0,0,0) 55%), #000",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
