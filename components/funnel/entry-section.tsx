"use client"

import { Check } from "lucide-react"
import { DecodeText, Reveal, useInView, usePrefersReducedMotion } from "./motion"
import { ApplyButton } from "./apply-button"
import { GlitterWarp } from "./glitter-warp"
import { useFunnel } from "./funnel-context"

const RECEIVE = [
  "The four live institutional algorithms — licenses owned for life",
  "Preloaded, exchange-proximate trading server, delivered day one",
  "SOPs, prop-firm knowledge base, and firm-specific playbooks",
  "White-glove onboarding, then the founding cohort mastermind",
  "Every future release inherited as it ships — quarterly drops",
]

export function EntrySection() {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 })
  const { seatCap, seatsRemaining } = useFunnel()
  const claimed = Math.max(0, seatCap - seatsRemaining)
  const pct = seatCap > 0 ? (claimed / seatCap) * 100 : 0
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
        <DecodeText text="FOUNDING CHARTER" className="sig-eyebrow block text-xs font-medium uppercase" duration={500} />
        <DecodeText
          as="h2"
          text={`${seatCap} seats. Ever.`}
          className="mt-6 block text-balance text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
          duration={700}
        />
        <Reveal delay={80} as="p" className="mt-6 max-w-2xl text-lg text-zinc-300">
          Built for funded futures traders who already run evaluations and payouts — and want desk-grade execution
          instead of another indicator.
        </Reveal>

        {/* seat meter — real confirmed members, no timers */}
        <Reveal delay={120} className="mt-12">
          <div
            ref={ref}
            role="meter"
            aria-valuenow={claimed}
            aria-valuemin={0}
            aria-valuemax={seatCap}
            aria-label="Founding seats claimed"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm text-zinc-400">
                <span className="text-white">{claimed}</span> of {seatCap} claimed
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
                {seatsRemaining} remaining
              </span>
            </div>
            <div className="mt-3 h-px w-full bg-white/10">
              <div
                className="sig-gradient-bar h-px"
                style={{ width: `${fill}%`, transition: reduce ? "none" : "width 1200ms cubic-bezier(0.16,1,0.3,1)" }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-700">
              Real seats — the counter reflects confirmed members. No timers.
            </p>
          </div>
        </Reveal>

        {/* what you receive */}
        <Reveal delay={160} className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">A founding seat includes</p>
          <ul className="mt-4 flex flex-col gap-3">
            {RECEIVE.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-zinc-300">
                <Check className="mt-1 size-4 shrink-0 text-white" strokeWidth={1.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200} className="mt-12">
          <ApplyButton section="entry">
            {seatsRemaining > 0 ? "Apply for a founding seat" : "Join the waitlist"}
          </ApplyButton>
          <p className="mt-4 text-sm text-zinc-500">
            Application → review → call → founding agreement. Payment only after acceptance.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-zinc-600">
            Trading futures involves substantial risk of loss. Backtested performance is not indicative of future
            results, and no outcome — including prop-firm payouts — is guaranteed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
