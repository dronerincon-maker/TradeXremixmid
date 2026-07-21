import { Reveal } from "@/components/funnel/motion"
import { ENGINE_FUNCTIONS, ENGINE_MODES } from "@/lib/institutional-config"
import { StatusBadge } from "./status-badge"

export function InstEngine() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">03 · PROP ORACLE: THE ALLOCATION ENGINE</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-2xl text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              One engine that knows every firm&apos;s rules: so you never breach by accident.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-xl text-pretty leading-relaxed text-zinc-400">
              Tradeify, MyFundedFutures, Lucid, Take Profit Trader: each firm&apos;s ruleset mapped and enforced
              as guardrails across your entire account set.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINE_FUNCTIONS.map((f, i) => (
            <Reveal key={f.name} delay={i * 70} className="flex flex-col gap-2 bg-black p-6">
              <span className="text-sm font-medium text-white">{f.name}</span>
              <span className="text-xs leading-relaxed text-zinc-500">{f.detail}</span>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ENGINE_MODES.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-white/10 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{m.name}</span>
                  <StatusBadge status={m.status} note={m.statusNote} />
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">{m.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-600">
            THE ENGINE ADVISES. IT DOES NOT CONNECT TO A BROKER OR PLACE TRADES AT LAUNCH.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
