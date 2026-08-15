"use client"

/**
 * TaasIntroSection: a compact introduction band for the TradeXLabs
 * Automated Algorithmic Suite (TAAS). Sits between the hero/VSL and
 * "The Problem". Deliberately understated: one line of wordmark, the
 * expansion words, and a single sentence. GSAP scrubs a subtle
 * horizontal convergence on the letters and draws the rules.
 */

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { Reveal } from "./motion"

const EXPANSION = [
  { letter: "T", word: "TradeXLabs" },
  { letter: "A", word: "Automated" },
  { letter: "A", word: "Algorithmic" },
  { letter: "S", word: "Suite" },
]

export function TaasIntroSection() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const letters = root.querySelectorAll<HTMLElement>(".taas-letter")
          const rules = root.querySelectorAll<HTMLElement>(".taas-rule")

          if (ctx.conditions?.reduce) {
            gsap.set(letters, { x: 0, autoAlpha: 1 })
            gsap.set(rules, { scaleX: 1 })
            return
          }

          const spread = [-1.5, -0.5, 0.5, 1.5]
          letters.forEach((el, i) => {
            gsap.fromTo(
              el,
              { x: () => spread[i] * Math.min(48, window.innerWidth * 0.04), autoAlpha: 0.3 },
              {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top 90%",
                  end: "top 45%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            )
          })

          rules.forEach((el, i) => {
            gsap.fromTo(
              el,
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: "left center",
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: `top ${72 - i * 6}%`,
                  end: `top ${50 - i * 6}%`,
                  scrub: 0.6,
                },
              },
            )
          })
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="relative w-full py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6">
        <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
          Introducing
        </Reveal>

        <h2
          className="mt-4 flex items-baseline justify-center font-mono font-bold italic leading-none tracking-tight text-white"
          aria-label="TAAS: TradeXLabs Automated Algorithmic Suite"
        >
          {["T", "A", "A", "S"].map((l, i) => (
            <span key={i} aria-hidden className="taas-letter inline-block text-5xl will-change-transform sm:text-6xl md:text-7xl">
              {l}
            </span>
          ))}
        </h2>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
          {EXPANSION.map(({ letter, word }) => (
            <div key={word} className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-zinc-600">{letter}</span>
              <span className="text-xs font-semibold tracking-tight text-zinc-300 sm:text-sm">{word}</span>
              <span className="taas-rule block h-px w-full bg-white/30" style={{ transform: "scaleX(0)" }} aria-hidden />
            </div>
          ))}
        </div>

        <Reveal
          as="p"
          delay={100}
          className="mt-8 max-w-xl text-balance text-center text-sm leading-relaxed text-zinc-500 sm:text-base"
        >
          One suite. Every algorithm, every account, every session — executed by machines that never tilt, never hesitate, never sleep.
        </Reveal>
      </div>
    </section>
  )
}
