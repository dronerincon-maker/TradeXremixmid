"use client"

import { useEffect, useState } from "react"
import { TxPrismGrid } from "./tx-prism-grid"
import { DecodeText, Parallax, Reveal } from "./motion"

const LINES = [
  "One breach ends a funded account.",
  "Every added account multiplies error.",
  "Discipline decays at 2 a.m.",
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
      </div>
    </section>
  )
}
