"use client"

import { useEffect, useState } from "react"
import { DecodeText, Reveal, SlideIn, useInView, usePrefersReducedMotion } from "./motion"

const LINES = [
  "> provisioning dedicated server ............ ok",
  "> loading algorithm suite (5 live) ......... ok",
  "> handing control to operator .............. ok",
]

export function InfrastructureSection() {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const [typed, setTyped] = useState<string[]>(reduce ? LINES : [])

  useEffect(() => {
    if (reduce || !inView) return
    let cancelled = false
    const out: string[] = []
    let line = 0

    const typeLine = () => {
      if (cancelled || line >= LINES.length) return
      const full = LINES[line]
      let ch = 0
      out[line] = ""
      const step = () => {
        if (cancelled) return
        ch++
        out[line] = full.slice(0, ch)
        setTyped([...out])
        if (ch < full.length) {
          setTimeout(step, 18)
        } else {
          line++
          setTimeout(typeLine, 260)
        }
      }
      step()
    }
    typeLine()
    return () => {
      cancelled = true
    }
  }, [inView, reduce])

  return (
    <section className="relative w-full py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <DecodeText text="THE INFRASTRUCTURE" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
        <DecodeText
          as="h2"
          text="Preloaded. Exchange-proximate. Yours."
          className="mt-6 block max-w-3xl text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
          duration={700}
        />

        <SlideIn from="right" className="mt-12">
          <div ref={ref} className="border border-white/10 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="ml-3 font-mono text-xs text-zinc-500">tradexlabs: deploy</span>
            </div>
            <div className="p-6 font-mono text-sm leading-loose text-zinc-300 sm:text-base">
              {LINES.map((full, i) => (
                <div key={full} className="whitespace-pre-wrap">
                  <span>{typed[i] ?? ""}</span>
                  {typed[i] !== undefined && typed[i].length < full.length && (
                    <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-white" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </SlideIn>

        <Reveal delay={200} as="p" className="mt-8 max-w-2xl text-lg text-zinc-400">
          Racked, configured, and deployed before you log in. You keep every decision — we never touch your capital,
          your keys, or your fills.
        </Reveal>
      </div>
    </section>
  )
}
