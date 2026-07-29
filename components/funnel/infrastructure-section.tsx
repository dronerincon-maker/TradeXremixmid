"use client"

/**
 * InfrastructureSection: the server environment, presented as a spec panel
 * driven by lib/institutional-config (single source of truth for what ships
 * day one vs what's on the roadmap). Replaces the previous decorative
 * typing-terminal animation with real deliverables.
 */

import { DecodeText, Reveal, SlideIn } from "./motion"
import { INFRASTRUCTURE } from "@/lib/institutional-config"
import { STATUS_LABEL } from "@/lib/institutional-config"

export function InfrastructureSection() {
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
        <Reveal delay={100} as="p" className="mt-6 max-w-2xl text-lg text-zinc-400">
          No local installs, no code, no configuration maze. Your server arrives with NinjaTrader installed, your
          algorithm licenses loaded, and the data feed connected.
        </Reveal>

        <SlideIn from="right" className="mt-12">
          <div className="border border-white/10 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="ml-3 font-mono text-xs text-zinc-500">tradexlabs: server environment</span>
            </div>
            <ul className="divide-y divide-white/10">
              {INFRASTRUCTURE.map((item) => (
                <li key={item.name} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="text-xs leading-relaxed text-zinc-500">{item.detail}</span>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] ${
                      item.status === "live" ? "text-white" : "text-zinc-600"
                    }`}
                  >
                    {item.status === "live" && (
                      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#2fc6f6] align-middle shadow-[0_0_6px_#2fc6f6]" />
                    )}
                    {STATUS_LABEL[item.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SlideIn>

        <Reveal delay={200} as="p" className="mt-8 max-w-2xl text-lg text-zinc-400">
          You keep every decision. We never touch your capital.
        </Reveal>
      </div>
    </section>
  )
}
