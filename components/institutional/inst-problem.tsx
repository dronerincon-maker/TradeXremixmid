import { Reveal } from "@/components/funnel/motion"

const CONFLICTS = [
  { firm: "Firm A", rule: "Trailing drawdown against equity peak" },
  { firm: "Firm B", rule: "End-of-day drawdown only" },
  { firm: "Firm C", rule: "30% consistency rule per payout window" },
  { firm: "Firm D", rule: "Daily loss limit resets at 5PM CT" },
]

export function InstProblem() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">01 · THE PROBLEM</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-2xl text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              Running many accounts across firms with conflicting rules: without breaching.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-xl text-pretty leading-relaxed text-zinc-400">
              Every prop firm publishes a different ruleset. Trailing versus end-of-day drawdown. Consistency
              percentages. Daily loss limits. Scaling plans. Run five accounts by hand and one distracted session
              breaches an account you spent weeks qualifying. The bottleneck was never the strategy: it&apos;s the
              operations.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-2">
          {CONFLICTS.map((c, i) => (
            <Reveal key={c.firm} delay={i * 80} className="flex flex-col gap-2 bg-black p-6">
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">{c.firm.toUpperCase()}</span>
              <span className="text-sm leading-relaxed text-zinc-300">{c.rule}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
