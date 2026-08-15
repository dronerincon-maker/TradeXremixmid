"use client"

/**
 * HeroSection: scroll-into-VSL scene, ported from the provided
 * tradexlabs_hero_scroll_into_vsl asset onto GSAP ScrollTrigger.
 *
 * A shimmering dot field (PixelCard engine) sits behind the TradeXLabs copy.
 * Scrolling pins the stage and scrubs a timeline: the dots zoom toward the
 * viewer and dissolve (power2.in), the copy lifts away, and a 16:9 VSL frame
 * clip-path-reveals into place (power2.out). The cue scrolls you through it.
 *
 * Reduced motion → no pin: static copy hero with the VSL frame stacked below.
 */

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Play } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger } from "@/lib/gsap"
import { PixelCard } from "./pixel-card"
import { ApplyButton } from "./apply-button"
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

        // Intro: masked per-character reveal + staggered tagline/CTA/cue.
        SplitText.create(headlineRef.current, {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.04,
              delay: 0.15,
            })
          },
        })
        gsap
          .timeline({ delay: 0.55, defaults: { ease: "power3.out" } })
          .from(".hero-tagline", { autoAlpha: 0, y: 14, duration: 0.7 })
          .from(".hero-cta", { autoAlpha: 0, y: 14, duration: 0.7 }, "<0.15")
          .from(".hero-cue", { autoAlpha: 0, duration: 0.8 }, "+=0.5")

        // Scrubbed scene: dots zoom through, copy lifts, VSL frame reveals.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: "+=180%",
            invalidateOnRefresh: true,
          },
        })
        tl.to(".hero-dots", { scale: 2.6, autoAlpha: 0, ease: "power2.in", duration: 1 }, 0)
          .to(".hero-copy", { y: -140, autoAlpha: 0, ease: "none", duration: 0.65 }, 0)
          .to(".hero-cue", { autoAlpha: 0, ease: "none", duration: 0.3 }, 0)
          .fromTo(
            ".hero-vsl",
            { autoAlpha: 0, scale: 0.82, clipPath: "inset(18% 12% 18% 12% round 24px)" },
            {
              autoAlpha: 1,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 24px)",
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

  const scrollToVsl = () => {
    const st = stRef.current
    if (st) {
      window.scrollTo({ top: st.end, behavior: "smooth" })
    } else {
      sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" })
    }
  }

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
              background: "radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 70%, transparent)",
            }}
          />
        </div>

        {/* VSL frame: revealed by the scrub */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-0 z-[1] grid place-items-center p-6">
            <div className="hero-vsl pointer-events-auto aspect-video w-[min(920px,92%)] overflow-hidden rounded-3xl border border-white/10 bg-[#050505] opacity-0 will-change-transform">
              <VslFrame />
            </div>
          </div>
        )}

        {/* copy */}
        <div className="hero-copy pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-6 px-6 text-center will-change-transform">
          <h1
            ref={headlineRef}
            className="font-semibold tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(38px, 8vw, 92px)" }}
          >
            TradeXLabs
          </h1>
          <p className="hero-tagline text-xs uppercase text-zinc-400 sm:text-sm" style={{ letterSpacing: "0.28em" }}>
            Signal through the noise
          </p>
          <ApplyButton className="hero-cta pointer-events-auto mt-2" />
        </div>

        {/* scroll cue */}
        <button
          type="button"
          onClick={scrollToVsl}
          className="hero-cue absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-colors hover:text-white"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">Watch the suite execute</span>
          <ChevronDown className="size-4 animate-bounce" />
        </button>
      </div>

      {/* reduced motion: VSL stacks below instead of scrub-revealing */}
      {reduce && (
        <div className="grid place-items-center px-6 pb-24">
          <div className="aspect-video w-[min(920px,92%)] overflow-hidden rounded-3xl border border-white/10 bg-[#050505]">
            <VslFrame />
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * VSL frame: Higgsfield-generated monochrome orderflow poster with a
 * darkening overlay so the play control reads. The play button pulses and
 * scales on hover via framer-motion.
 */
function VslFrame() {
  return (
    <div className="group relative grid h-full w-full place-items-center">
      <img
        src="/hero-vsl-poster.webp"
        alt="TradeXLabs automated algorithms — live market data visualization"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
      />
      <motion.button
        type="button"
        aria-label="Play video"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="relative flex flex-col items-center gap-5"
      >
        <span className="relative grid size-16 place-items-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <Play className="ml-0.5 size-6 text-white" strokeWidth={1.5} />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">
          See the algorithms run
        </span>
      </motion.button>
    </div>
  )
}
