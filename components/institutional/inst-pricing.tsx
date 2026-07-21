"use client"

import { Reveal } from "@/components/funnel/motion"
import { PRICING, ROADMAP_TABLE, TIER } from "@/lib/institutional-config"
import { StatusBadge } from "./status-badge"

function SeatsMeter({ seatsRemaining, seatCap }: { seatsRemaining: number; seatCap: number }) {
  const taken = Math.max(0, seatCap - seatsRemaining)
  const pct = Math.min(100, Math.round((taken / seatCap) * 100))
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-zinc-500">FOUNDING SEATS</span>
        <span className="font-mono text-sm text-white">
          {seatsRemaining} <span className="text-zinc-500">of {seatCap} remaining</span>
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={seatCap}
        aria-label="Founding seats taken"
      >
        <div className="h-full bg-white transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="font-mono text-[10px] tracking-[0.1em] text-zinc-600">
        REAL SEATS. THE COUNTER REFLECTS ACTUAL CONFIRMED MEMBERS: NO TIMERS.
      </p>
    </div>
  )
}

export function InstPricing({ seatsRemaining, seatCap }: { seatsRemaining: number; seatCap: number }) {
  const pricing = PRICING[TIER]
  const soldOut = seatsRemaining <= 0

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-4xl flex-col gap-14 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">06 · FOUNDING PRICING &amp; ACCESS</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              {TIER === "founding" ? "Get in while we build. Lock the full tier forever." : "Institutional access."}
            </h2>
          </Reveal>
        </div>

        {/* Price card */}
        <Reveal>
          <div className="flex flex-col gap-8 rounded-2xl border border-white/15 bg-white/[0.03] p-8 md:p-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl text-white md:text-6xl">{pricing.price}</span>
                {TIER === "founding" && (
                  <span className="font-mono text-lg text-zinc-500 line-through">$8,000</span>
                )}
              </div>
              <p className="text-sm text-zinc-400">{pricing.priceNote}</p>
              <p className="text-sm text-zinc-500">{pricing.planNote}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">{pricing.subNote}</p>
            </div>

            {TIER === "founding" && <SeatsMeter seatsRemaining={seatsRemaining} seatCap={seatCap} />}

            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={scrollToApply}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-zinc-200"
              >
                {soldOut ? pricing.waitlistLabel : pricing.ctaLabel}
              </button>
              {TIER === "founding" && (
                <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-600">
                  WHEN FOUNDING SEATS FILL, THE PRICE STEPS TOWARD $8,000.
                </p>
              )}
            </div>
          </div>
        </Reveal>

        {TIER === "founding" && (
          <>
            {/* Grandfather explainer */}
            <Reveal>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 p-8">
                <p className="font-mono text-xs tracking-[0.25em] text-zinc-500">THE GRANDFATHER GUARANTEE</p>
                <p className="text-pretty text-lg font-light leading-relaxed text-white">
                  $4,000 today → the full $8,000 Institutional tier when complete, at no extra license cost. You
                  lock today&apos;s terms permanently.
                </p>
                <p className="text-xs leading-relaxed text-zinc-500">
                  The upgrade is automatic and written into the founding agreement, alongside the deliverable
                  roadmap and the contingency remedy if a milestone slips.
                </p>
              </div>
            </Reveal>

            {/* Now-vs-roadmap table */}
            <Reveal>
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs tracking-[0.25em] text-zinc-500">WHAT&apos;S LIVE VS. ON THE ROADMAP</p>
                <ul className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10">
                  {ROADMAP_TABLE.map((row) => (
                    <li
                      key={row.deliverable}
                      className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-zinc-200">{row.deliverable}</span>
                        <span className="text-xs text-zinc-500">{row.note}</span>
                      </div>
                      <StatusBadge status={row.status} className="shrink-0" />
                    </li>
                  ))}
                </ul>
                <p className="text-xs leading-relaxed text-zinc-600">
                  Founding access is a pre-launch commitment into a system that is actively being built. Statuses
                  above are updated as deliverables ship: nothing is presented as live unless it is.
                </p>
              </div>
            </Reveal>
          </>
        )}

        {/* Process guarantee */}
        <Reveal>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 p-8">
            <p className="font-mono text-xs tracking-[0.25em] text-zinc-500">THE 90-DAY GUARANTEE</p>
            <p className="text-pretty text-sm leading-relaxed text-zinc-300">
              Our guarantee is on our work, never on profit. If you&apos;re not fully operational within 90 days of
              onboarding, we keep working with you and extend your access until you are. The exact remedy is
              detailed in the founding agreement.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
