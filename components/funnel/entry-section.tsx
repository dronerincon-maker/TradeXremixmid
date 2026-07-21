"use client"

import { DecodeText, Reveal, useInView, usePrefersReducedMotion } from "./motion"
import { ApplyButton } from "./apply-button"
import { GlitterWarp } from "./glitter-warp"
import { CLAIMED_SEATS, TOTAL_SEATS } from "./funnel-context"

export function EntrySection() {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 })
  const pct = (CLAIMED_SEATS / TOTAL_SEATS) * 100
  const fill = reduce ? pct : inView ? pct : 0

  return (
    <section className="relative w-full overflow-hidden py-32">
      <GlitterWarp className="opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 60% at 50% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4))",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <DecodeText text="FOUNDING CHARTER" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
        <DecodeText
          as="h2"
          text="50 seats. Ever."
          className="mt-6 block text-balance text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
          duration={700}
        />

        {/* seat meter */}
        <Reveal delay={120} className="mt-14">
          <div ref={ref}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm text-zinc-400">
                <span className="text-white">{CLAIMED_SEATS}</span> of {TOTAL_SEATS} claimed
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
                {TOTAL_SEATS - CLAIMED_SEATS} remaining
              </span>
            </div>
            <div className="mt-3 h-px w-full bg-white/10">
              <div
                className="h-px bg-white"
                style={{ width: `${fill}%`, transition: reduce ? "none" : "width 1200ms cubic-bezier(0.16,1,0.3,1)" }}
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-12 space-y-2">
          <Reveal as="p" className="text-lg text-zinc-300">
            Founding members grandfather into everything we ship.
          </Reveal>
          <Reveal delay={80} as="p" className="text-lg text-zinc-500">
            When it&apos;s full, it&apos;s full.
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-12">
          <ApplyButton>Apply for a seat</ApplyButton>
          <p className="mt-4 text-sm text-zinc-600">Application required. Not every applicant is accepted.</p>
        </Reveal>
      </div>
    </section>
  )
}
