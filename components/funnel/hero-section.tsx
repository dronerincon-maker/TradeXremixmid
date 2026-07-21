"use client"

/**
 * HeroSection: scroll-into-evidence scene on GSAP ScrollTrigger.
 *
 * A shimmering dot field (PixelCard engine) sits behind the value
 * proposition. Scrolling pins the stage and scrubs a timeline: the dots
 * zoom toward the viewer and dissolve, the copy lifts away, and a
 * verified-performance panel (real NinjaTrader backtest equity curve)
 * clip-path-reveals into place. The cue scrolls you through it.
 *
 * Reduced motion → no pin: static copy hero with the panel stacked below.
 */

import { useRef } from "react"
import { ChevronDown } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger } from "@/lib/gsap"
import { BACKTESTS } from "@/lib/backtest-data"
import { trackEvent } from "@/lib/analytics"
import { PixelCard } from "./pixel-card"
import { ApplyButton } from "./apply-button"
import { EquityChart } from "./equity-chart"
import { usePrefersReducedMotion } from "./motion"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const reduce = usePrefersReducedMotion()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current
        if (!section || !headlineRef.current) return

        // Intro: masked per-word reveal + staggered support copy/CTAs/cue.
        SplitText.create(headlineRef.current, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 110,
              duration: 0.8,
              ease: "power4.out",
              stagger: 0.05,
              delay: 0.1,
            })
          },
        })
        gsap
          .timeline({ delay: 0.4, defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { autoAlpha: 0, y: -10, duration: 0.6 }, 0)
          .from(".hero-sub", { autoAlpha: 0, y: 14, duration: 0.7 }, 0.25)
          .from(".hero-ctas", { autoAlpha: 0, y: 14, duration: 0.7 }, 0.4)
          .from(".hero-trust", { autoAlpha: 0, duration: 0.7 }, 0.55)
          .from(".hero-cue", { autoAlpha: 0, duration: 0.8 }, "+=0.4")

        // Scrubbed scene: dots zoom through, copy lifts, evidence panel reveals.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: "+=160%",
            invalidateOnRefresh: true,
          },
        })
        tl.to(".hero-dots", { scale: 2.6, autoAlpha: 0, ease: "power2.in", duration: 1 }, 0)
          .to(".hero-copy", { y: -140, autoAlpha: 0, ease: "none", duration: 0.65 }, 0)
          .to(".hero-cue", { autoAlpha: 0, ease: "none", duration: 0.3 }, 0)
          .fromTo(
            ".hero-panel",
            { autoAlpha: 0, scale: 0.86, clipPath: "inset(16% 10% 16% 10% round 20px)" },
            {
              autoAlpha: 1,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 20px)",
              ease: "power2.out",
              duration: 0.65,
            },
            0.35,
          )
        stRef.current = tl.scrollTrigger ?? null
      })
    },
    { scope: sectionRef },
  )

  const scrollToEvidence = () => {
    const st = stRef.current
    if (st) {
      window.scrollTo({ top: st.end, behavior: "smooth" })
    } else {
      document.getElementById("proof")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const strategy = BACKTESTS[0]
  const view = strategy.net

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      <div className="relative h-[100svh] w-full">
        {/* dot field */}
        <div className="hero-dots absolute inset-0 will-change-transform">
          <PixelCard gap={6} speed={30} pixelSize={2} className="h-full w-full" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.78), rgba(0,0,0,0.2) 70%, transparent)",
            }}
          />
        </div>

        {/* evidence panel: revealed by the scrub */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-0 z-[1] grid place-items-center p-4 sm:p-6">
            <div className="hero-panel pointer-events-auto w-[min(860px,94%)] rounded-3xl border border-white/10 bg-[#050505] opacity-0 will-change-transform">
              <HeroEvidencePanel onSeeMethodology={scrollToEvidence} strategyName={strategy.name} view={view} instrument={strategy.instrument} period={strategy.period} trades={strategy.trades} />
            </div>
          </div>
        )}

        {/* copy */}
        <div className="hero-copy pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-5 px-6 text-center will-change-transform">
          <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 sm:text-[11px]">
            TradeXLabs · Automated execution for funded traders
          </p>
          <h1
            ref={headlineRef}
            className="max-w-4xl text-balance font-semibold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(34px, 6.2vw, 72px)" }}
          >
            Your prop accounts, run like a trading desk.
          </h1>
          <p className="hero-sub max-w-xl text-balance text-sm leading-relaxed text-zinc-400 sm:text-base">
            An automated algorithmic suite for funded futures traders. Rules-based strategy logic, executed from a
            dedicated server — no hesitation, no revenge trades, no rule drift.
          </p>
          <div className="hero-ctas pointer-events-auto mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <ApplyButton section="hero" eventName="hero_primary_cta_click">
              Apply for founding access
            </ApplyButton>
            <button
              type="button"
              onClick={() => {
                trackEvent("hero_secondary_cta_click", { section: "hero", label: "See the verified data" })
                scrollToEvidence()
              }}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-8 py-3 text-sm font-semibold tracking-tight text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5"
            >
              See the verified data
            </button>
          </div>
          <p className="hero-trust mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            NinjaTrader backtest data · Published gross &amp; net of commissions · No martingale, no grid
          </p>
        </div>

        {/* scroll cue */}
        <button
          type="button"
          onClick={scrollToEvidence}
          className="hero-cue absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-colors hover:text-white"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">See the data behind the algos</span>
          <ChevronDown className="size-4 animate-bounce" />
        </button>
      </div>

      {/* reduced motion: evidence panel stacks below instead of scrub-revealing */}
      {reduce && (
        <div className="grid place-items-center px-6 pb-24">
          <div className="w-[min(860px,94%)] rounded-3xl border border-white/10 bg-[#050505]">
            <HeroEvidencePanel onSeeMethodology={scrollToEvidence} strategyName={strategy.name} view={view} instrument={strategy.instrument} period={strategy.period} trades={strategy.trades} />
          </div>
        </div>
      )}
    </section>
  )
}

function HeroEvidencePanel({
  strategyName,
  view,
  instrument,
  period,
  trades,
  onSeeMethodology,
}: {
  strategyName: string
  view: (typeof BACKTESTS)[0]["net"]
  instrument: string
  period: string
  trades: number
  onSeeMethodology: () => void
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 sm:px-5">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate font-mono text-[11px] text-zinc-500">
          tradexlabs: {strategyName.toLowerCase().replace(/\s+/g, "-")} · backtest
        </span>
      </div>
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{strategyName} — net of commissions</p>
          <p className="font-mono text-[10px] text-zinc-600">
            {instrument} · {period} · {trades.toLocaleString()} trades
          </p>
        </div>
        <EquityChart points={view.equity} id="hero-eq" />
        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          <HeroStat label="Net profit" value={`$${Math.round(view.netProfit).toLocaleString()}`} />
          <HeroStat label="Profit factor" value={view.profitFactor.toFixed(2)} />
          <HeroStat label="Max drawdown" value={`-$${Math.round(view.maxDrawdown).toLocaleString()}`} />
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-600">
          NinjaTrader backtest — not live results, and not a promise of future returns.{" "}
          <button type="button" onClick={onSeeMethodology} className="underline underline-offset-2 transition-colors hover:text-zinc-400">
            Full data &amp; methodology below
          </button>
          .
        </p>
      </div>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">{label}</span>
      <span className="font-mono text-base text-white sm:text-lg">{value}</span>
    </div>
  )
}
