"use client"

import { PrismGridHero } from "@/components/funnel/prism-grid-hero"
import { DecodeText, Reveal } from "@/components/funnel/motion"
import { STATS, TIER, PRICING } from "@/lib/institutional-config"
import { ChevronDown } from "lucide-react"

export function InstHero({ seatsRemaining, seatCap }: { seatsRemaining: number; seatCap: number }) {
  const pricing = PRICING[TIER]
  const soldOut = seatsRemaining <= 0

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <PrismGridHero className="opacity-80" />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 70%, transparent)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-zinc-400">
            {TIER === "founding" ? "TRADEXLABS · FOUNDING COHORT" : "TRADEXLABS · INSTITUTIONAL"}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-balance font-sans text-5xl font-light tracking-tight text-white md:text-7xl">
            The Institutional Tier
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-zinc-400 md:text-lg">
            The complete agentic system: ten algorithms, the Prop Oracle allocation engine, and done-for-you
            infrastructure: sold to a capped founding cohort while it&apos;s being built.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <DecodeText text={s.value} className="font-mono text-3xl text-white md:text-4xl" duration={500} />
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">{s.label}</span>
              </div>
            ))}
            {TIER === "founding" && (
              <div className="flex flex-col items-center gap-1">
                <DecodeText
                  text={String(seatsRemaining)}
                  className="font-mono text-3xl text-white md:text-4xl"
                  duration={500}
                />
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  of {seatCap} seats left
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={scrollToApply}
              className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-zinc-200"
            >
              {soldOut ? pricing.waitlistLabel : pricing.ctaLabel}
            </button>
            <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-600">
              APPLICATION ONLY · NOT EVERY APPLICANT IS ACCEPTED
            </p>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-600" aria-hidden>
        <ChevronDown className="size-5" />
      </div>
    </section>
  )
}
