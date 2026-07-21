"use client"

import { useEffect, useState } from "react"
import { Minus, Check } from "lucide-react"
import { TxPrismGrid } from "./tx-prism-grid"
import { DecodeText, Parallax, Reveal } from "./motion"

const LINES = [
  "One breach ends a funded account.",
  "Every added account multiplies error.",
  "Discipline decays at 2 a.m.",
]

const MANUAL = [
  "Late entries after hesitation",
  "Emotional overrides mid-trade",
  "Sizing drifts with confidence",
  "Rules bend after a losing streak",
  "Setups missed while you sleep",
]

const SYSTEMATIC = [
  "Defined entries, exits, and sizing",
  "The same logic on every trade",
  "Parameters fixed in advance",
  "Rules enforced, not remembered",
  "Sessions covered by the server",
]

export function ProblemSection() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden py-28">
      {/* prism grid background */}
      <div aria-hidden className="absolute inset-0" style={{ opacity: 0.55 }}>
        <TxPrismGrid interactive={!isMobile} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 50% at 45% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0.28) 65%, rgba(0,0,0,0.45))",
        }}
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6">
        <Parallax amount={28} className="max-w-2xl">
          <DecodeText
            text="THE PROBLEM"
            className="block text-xs font-medium uppercase text-zinc-500"
            duration={500}
          />
          <DecodeText
            as="h2"
            text="Manual execution doesn't scale."
            className="mt-6 block text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
            duration={700}
          />
          <div className="mt-10 space-y-4">
            {LINES.map((line, i) => (
              <Reveal key={line} delay={i * 80} as="p" className="text-lg text-zinc-400 sm:text-xl">
                {line}
              </Reveal>
            ))}
          </div>
        </Parallax>

        {/* manual vs systematic */}
        <Reveal delay={120} className="mt-16">
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
            <div className="flex flex-col gap-4 bg-black/80 p-6 backdrop-blur-sm sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Manual execution</p>
              <ul className="flex flex-col gap-3">
                {MANUAL.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-500">
                    <Minus className="mt-0.5 size-3.5 shrink-0 text-zinc-700" strokeWidth={2} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 bg-black/80 p-6 backdrop-blur-sm sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-300">Systematic execution</p>
              <ul className="flex flex-col gap-3">
                {SYSTEMATIC.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-white" strokeWidth={2} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">
            Systematic execution removes the operator variance — not the market risk. Losing trades and drawdowns
            remain part of every strategy.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
