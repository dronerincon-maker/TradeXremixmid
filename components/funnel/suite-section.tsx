"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { DecodeText, Reveal } from "./motion"

type Algo = {
  name: string
  fn: string
  tag: string
  roadmap?: boolean
}

const ALGOS: Algo[] = [
  { name: "ORB V1–V4", fn: "Opening-range breakout across four regimes.", tag: "LIVE" },
  { name: "Quant Pivots", fn: "Pivot-anchored mean-reversion on index futures.", tag: "LIVE" },
  { name: "Trend Engine", fn: "Multi-asset trend-following with regime filters.", tag: "LIVE" },
  { name: "Session Fade", fn: "Liquidity-sweep reversals at session extremes.", tag: "LIVE" },
  { name: "Volatility Grid", fn: "Adaptive sizing keyed to realized volatility.", tag: "LIVE" },
  { name: "+ four more as they ship", fn: "Founding members inherit every release.", tag: "ROADMAP", roadmap: true },
]

export function SuiteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions ?? {}
          if (!isDesktop || reduce) return

          const section = sectionRef.current
          const track = trackRef.current
          if (!section || !track) return

          // ScrollTrigger pin + scrub: vertical scroll drives the track horizontally.
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48)

          gsap.to(track, {
            x: () => -distance(),
            ease: "none", // required for 1:1 scroll-to-position mapping
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          })
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      <div className="flex min-h-[100svh] flex-col justify-center py-24 md:h-screen md:py-0">
        <div className="mx-auto w-full max-w-6xl px-6">
          <DecodeText text="THE SUITE" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
          <DecodeText
            as="h2"
            text="Six institutional algorithms. One standard."
            className="mt-6 block max-w-3xl text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
            duration={700}
          />
        </div>

        {/* Desktop: GSAP-driven horizontal track. Mobile: vertical stack. */}
        <div className="mt-12 hidden md:block">
          <div ref={trackRef} className="flex gap-6 px-6 will-change-transform">
            {ALGOS.map((a) => (
              <AlgoCard key={a.name} algo={a} />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:hidden">
          {ALGOS.map((a, i) => (
            <Reveal key={a.name} delay={i * 60}>
              <AlgoCard algo={a} mobile />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AlgoCard({ algo, mobile }: { algo: Algo; mobile?: boolean }) {
  return (
    <article
      className={`flex flex-col justify-between border border-white/10 bg-white/[0.02] p-8 ${
        mobile ? "h-48 w-full" : "h-72 w-80 shrink-0"
      } ${algo.roadmap ? "border-dashed" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Algorithm</span>
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.2em] ${
            algo.tag === "LIVE" ? "text-white" : "text-zinc-500"
          }`}
        >
          {algo.tag === "LIVE" && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-white align-middle" />}
          {algo.tag}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-white text-pretty">{algo.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{algo.fn}</p>
      </div>
    </article>
  )
}
