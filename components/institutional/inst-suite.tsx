import { Reveal } from "@/components/funnel/motion"
import { ALGORITHMS } from "@/lib/institutional-config"
import { StatusBadge } from "./status-badge"
import { cn } from "@/lib/utils"

function PortfolioColumn({ portfolio }: { portfolio: "A" | "B" }) {
  const algos = ALGORITHMS.filter((a) => a.portfolio === portfolio)
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs tracking-[0.25em] text-zinc-500">PORTFOLIO {portfolio}</p>
      <ul className="flex flex-col gap-3">
        {algos.map((a, i) => (
          <Reveal key={a.id} delay={i * 70} as="li">
            <div
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-5",
                a.status === "live" ? "border-white/15 bg-white/[0.03]" : "border-dashed border-white/10",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={cn("text-sm font-medium", a.status === "live" ? "text-white" : "text-zinc-400")}>
                  {a.name}
                  <span className="ml-2 font-mono text-[10px] tracking-[0.15em] text-zinc-500">{a.market}</span>
                </span>
                <StatusBadge
                  status={a.status}
                  note={a.status !== "live" ? "quarterly drop schedule" : undefined}
                />
              </div>
              <p className="text-xs leading-relaxed text-zinc-500">{a.logic}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

export function InstSuite() {
  const liveCount = ALGORITHMS.filter((a) => a.status === "live").length
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">02 · THE ALGORITHM SUITE</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-2xl text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              Ten algorithms. Two portfolios. {liveCount} live today: the rest ship on the quarterly drop
              schedule.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-xl text-pretty leading-relaxed text-zinc-400">
              You own the licenses forever, as they ship. Every algorithm below carries an honest status: nothing
              on this page is presented as live unless it runs today.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <PortfolioColumn portfolio="A" />
          <PortfolioColumn portfolio="B" />
        </div>
      </div>
    </section>
  )
}
