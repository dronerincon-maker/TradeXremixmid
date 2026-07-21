"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* prefers-reduced-motion                                              */
/* ------------------------------------------------------------------ */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(mq.matches)
    const handler = () => setReduce(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduce
}

/* ------------------------------------------------------------------ */
/* useInView: fires once when the element enters the viewport         */
/* ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.2 },
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.unobserve(entry.target)
        }
      })
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, inView }
}

/* ------------------------------------------------------------------ */
/* Reveal: GSAP + ScrollTrigger. Rises + fades once when the element  */
/* enters the viewport. Reduced-motion safe via gsap.matchMedia().     */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  y = 24,
}: {
  children: React.ReactNode
  delay?: number
  as?: React.ElementType
  className?: string
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set(el, { autoAlpha: 1, y: 0 })
            return
          }
          gsap.fromTo(
            el,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              delay: delay / 1000,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          )
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as never} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Parallax: GSAP scrubbed vertical drift as the element crosses the  */
/* viewport. Cheap immersion for headlines and framed blocks.          */
/* ------------------------------------------------------------------ */
export function Parallax({
  children,
  className,
  as: Tag = "div",
  amount = 40,
}: {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { y: amount },
          {
            y: -amount,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* SlideIn: GSAP scrubbed directional entrance. Elements drift in     */
/* from the left or right and settle as they cross the viewport.      */
/* ------------------------------------------------------------------ */
export function SlideIn({
  children,
  className,
  as: Tag = "div",
  from = "left",
  amount = 80,
}: {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  from?: "left" | "right"
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set(el, { autoAlpha: 1, x: 0 })
            return
          }
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: from === "left" ? -amount : amount },
            {
              autoAlpha: 1,
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          )
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as never} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* DecodeText: characters flicker through random glyphs, then lock    */
/* left-to-right. Non-looping, reduced-motion safe.                    */
/* ------------------------------------------------------------------ */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#$%".split("")

export function DecodeText({
  text,
  className,
  as: Tag = "span",
  duration = 600,
  startDelay = 0,
}: {
  text: string
  className?: string
  as?: React.ElementType
  duration?: number
  startDelay?: number
}) {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [display, setDisplay] = useState(reduce ? text : "")
  const started = useRef(false)

  const run = useCallback(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const total = text.length

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const locked = Math.floor(progress * total)
      let out = ""
      for (let i = 0; i < total; i++) {
        const ch = text[i]
        if (ch === " ") {
          out += " "
        } else if (i < locked) {
          out += ch
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
      }
      setDisplay(out)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }
    requestAnimationFrame(tick)
  }, [text, duration])

  useEffect(() => {
    if (reduce) {
      setDisplay(text)
      return
    }
    if (inView) {
      const t = setTimeout(run, startDelay)
      return () => clearTimeout(t)
    }
  }, [inView, reduce, run, startDelay, text])

  return (
    <Tag ref={ref as never} className={cn("tabular-nums", className)} aria-label={text}>
      <span aria-hidden>{display || "\u00A0"}</span>
    </Tag>
  )
}
