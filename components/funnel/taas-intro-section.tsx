"use client"

/**
 * TaasIntroSection: the mechanism. The TAAS identity moment (letter
 * convergence) followed by the execution pipeline — how validated strategy
 * logic becomes systematic execution on a funded account. GSAP scrubs the
 * letter convergence and lights each pipeline stage in sequence; reduced
 * motion renders everything static.
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

const PIPELINE = [
  { step: "01", name: "Verified strategy data", detail: "Backtested trade lists, published gross and net" },
  { step: "02", name: "TAAS algorithms", detail: "Defined entries, exits, and sizing — no discretion" },
  { step: "03", name: "Dedicated server", detail: "Exchange-proximate, preloaded, running your licenses" },
  { step: "04", name: "NinjaTrader execution", detail: "Orders placed by the system, not by mood" },
  { step: "05", name: "Your prop-firm accounts", detail: "You keep the accounts, the capital, and control" },
  { step: "06", name: "Rules & monitoring", detail: "Firm rulesets and drawdown guardrails, per account" },
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
          const stages = root.querySelectorAll<HTMLElement>(".taas-stage")

          if (ctx.conditions?.reduce) {
            gsap.set(letters, { x: 0, autoAlpha: 1 })
            gsap.set(rules, { scaleX: 1 })
            gsap.set(stages, { autoAlpha: 1, y: 0 })
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

          // pipeline stages light in sequence as the rail crosses the viewport
          stages.forEach((el, i) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0.25, y: 12 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top 92%",
                  end: "top 68%",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
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
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6">
        <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
          The mechanism
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
          TAAS converts validated trading logic into a structured automation environment. One pipeline, end to end:
        </Reveal>

        {/* execution pipeline */}
        <ol className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-2">
          {PIPELINE.map((s, i) => (
            <li key={s.step} className="taas-stage relative flex flex-col gap-2 border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600">{s.step}</span>
                {i < PIPELINE.length - 1 && (
                  <span aria-hidden className="font-mono text-[10px] text-zinc-700 lg:absolute lg:-right-2 lg:top-1/2 lg:z-10 lg:-translate-y-1/2">
                    →
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold tracking-tight text-white">{s.name}</span>
              <span className="text-[11px] leading-relaxed text-zinc-500">{s.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
