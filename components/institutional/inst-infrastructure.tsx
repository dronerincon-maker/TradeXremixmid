import { Reveal } from "@/components/funnel/motion"
import { INFRASTRUCTURE } from "@/lib/institutional-config"
import { StatusBadge } from "./status-badge"

export function InstInfrastructure() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">04 · DONE-FOR-YOU INFRASTRUCTURE</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-2xl text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              We build the machine. You operate it.
            </h2>
          </Reveal>
        </div>

        <ul className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10">
          {INFRASTRUCTURE.map((item, i) => (
            <Reveal key={item.name} delay={i * 70} as="li">
              <div className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <span className="text-xs leading-relaxed text-zinc-500">{item.detail}</span>
                </div>
                <StatusBadge status={item.status} className="shrink-0" />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
