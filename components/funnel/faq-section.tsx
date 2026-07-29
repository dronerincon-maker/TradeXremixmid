"use client"

/**
 * FaqSection: objection resolution. Every answer is grounded in facts that
 * exist elsewhere in this repo (backtest data, institutional config, apply
 * flow) — no invented claims. Accessible accordion: buttons with
 * aria-expanded + labelled regions, CSS grid-rows animation (no JS motion).
 */

import { useState } from "react"
import { Plus } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { DecodeText, Reveal } from "./motion"

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this another black-box bot?",
    a: "No. Every algorithm's logic is described — opening-range breakout and session-pivot mean reversion — and the backtests are published above, gross and net of commissions. The full trade lists are reviewed with founding members during onboarding, and you keep operator control of your accounts at all times.",
  },
  {
    q: "Is this martingale or grid trading?",
    a: "No. The suite is not built around martingale, averaging-down, or grid tactics. Each system trades defined setups with parameters fixed in advance — which is why the published drawdown figures are survivable rather than hidden.",
  },
  {
    q: "Can I verify the data?",
    a: "Yes. The equity curves and metrics in the evidence section come from NinjaTrader strategy backtests, published both without commissions and with them, so you can see exactly what execution costs do to the edge. Backtested results are hypothetical and not a promise of future returns.",
  },
  {
    q: "Which platform and firms does it work with?",
    a: "The algorithms run on NinjaTrader, preinstalled on your dedicated server. Firm-specific playbooks currently cover Tradeify, MyFundedFutures, Lucid, and Take Profit Trader.",
  },
  {
    q: "How difficult is setup? Do I need to code?",
    a: "No code and no local installs. The server arrives with NinjaTrader installed, your algorithm licenses loaded, and the data feed connected. White-glove onboarding walks you from delivery to live, backed by written SOPs.",
  },
  {
    q: "What happens after I apply?",
    a: "We review every application individually. If it's a fit, we schedule a call. Payment only happens after acceptance and a signed founding agreement — there is no checkout on this page.",
  },
  {
    q: "Can this guarantee a payout?",
    a: "No — and no honest vendor can. Trading futures involves substantial risk of loss, and backtested performance is not indicative of future results. Our guarantee covers our work: if you're not fully operational within 90 days of onboarding, we keep working with you and extend your access until you are.",
  },
  {
    q: "How is this different from copying signals?",
    a: "Signals still depend on you seeing them, trusting them, and executing them in time. Here the system itself executes — from your server, on your accounts, under rules you can inspect. You own the licenses and keep every decision about where the suite runs.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => {
    const next = open === i ? null : i
    setOpen(next)
    if (next !== null) trackEvent("faq_expand", { question: FAQS[i].q })
  }

  return (
    <section className="relative w-full py-28">
      <div className="mx-auto w-full max-w-3xl px-6">
        <DecodeText text="STRAIGHT ANSWERS" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
        <DecodeText
          as="h2"
          text="Asked by every serious trader."
          className="mt-6 block text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
          duration={700}
        />

        <Reveal delay={120} className="mt-12">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((faq, i) => {
              const expanded = open === i
              return (
                <li key={faq.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={expanded}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-white transition-colors hover:text-zinc-300 sm:text-lg"
                    >
                      {faq.q}
                      <Plus
                        aria-hidden
                        className="size-4 shrink-0 transition-transform duration-300"
                        style={{ transform: expanded ? "rotate(45deg)" : "none", color: expanded ? "var(--sig-cyan)" : "#71717a" }}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
