"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { ALGORITHMS } from "@/lib/institutional-config"
import { DecodeText, Reveal } from "./motion"

/**
 * Cards read from lib/institutional-config — the single source of truth for
 * what is live vs on the roadmap. Nothing is tagged LIVE unless it runs today.
 */
type Card = {
  name: string
  market: string
  fn: string
  tag: "LIVE" | "ROADMAP"
  note?: string
}

const LIVE_CARDS: Card[] = ALGORITHMS.filter((a) => a.status === "live").map((a) => ({
  name: a.name,
  market: a.market,
  fn: a.logic,
  tag: "LIVE" as const,
}))

const ROADMAP_COUNT = ALGORITHMS.filter((a) => a.status !== "live").length

const CARDS: Card[] = [
  ...LIVE_CARDS,
  {
    name: `+ ${ROADMAP_COUNT} more on the quarterly drop schedule`,
    market: "NQ · ES · Multi",
    fn: "Trend Engine, Momentum Edge, and ORB Multi-Asset builds. Founding members inherit every release.",
    tag: "ROADMAP",
  },
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
          const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-algo-card]"))

          // Depth pass: cards nearest the viewport centre sit forward (scale 1,
          // full opacity); those toward the edges recede — so moving sideways
          // reads as moving *through* a layered corridor rather than a flat belt.
          const applyDepth = () => {
            const mid = window.innerWidth / 2
            for (const c of cards) {
              const r = c.getBoundingClientRect()
              const d = Math.abs(r.left + r.width / 2 - mid) / mid // 0 centre → ~1 edge
              const k = Math.min(1, d)
              gsap.set(c, {
                scale: 1 - k * 0.14,
                y: k * 26,
                opacity: 1 - k * 0.45,
                filter: `blur(${(k * 1.4).toFixed(2)}px)`,
              })
            }
          }

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
              onRefresh: applyDepth,
              onUpdate: applyDepth,
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
            text={`${LIVE_CARDS.length} algorithms live today. Ten by design.`}
            className="mt-6 block max-w-3xl text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
            duration={700}
          />
          <Reveal delay={100} as="p" className="mt-5 max-w-2xl text-base text-zinc-400">
            Every status below is honest: nothing is tagged live unless it runs today. The ORB builds are the
            strategies whose backtests you just inspected.
          </Reveal>
        </div>

        {/* Desktop: GSAP-driven horizontal track. Mobile: vertical stack. */}
        <div className="mt-12 hidden md:block">
          <div ref={trackRef} className="flex gap-6 px-6 will-change-transform">
            {CARDS.map((a) => (
              <AlgoCard key={a.name} algo={a} />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:hidden">
          {CARDS.map((a, i) => (
            <Reveal key={a.name} delay={i * 60}>
              <AlgoCard algo={a} mobile />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AlgoCard({ algo, mobile }: { algo: Card; mobile?: boolean }) {
  return (
    <article
      data-algo-card={mobile ? undefined : ""}
      className={`flex flex-col justify-between border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm ${
        mobile ? "min-h-48 w-full" : "h-72 w-80 shrink-0 will-change-transform"
      } ${algo.tag === "ROADMAP" ? "border-dashed" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">{algo.market}</span>
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.2em] ${
            algo.tag === "LIVE" ? "text-white" : "text-zinc-500"
          }`}
        >
          {algo.tag === "LIVE" && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#2fc6f6] align-middle shadow-[0_0_6px_#2fc6f6]" />}
          {algo.tag}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-white text-pretty sm:text-2xl">{algo.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{algo.fn}</p>
      </div>
    </article>
  )
}
