import { Reveal } from "@/components/funnel/motion"
import { VALUE_STACK } from "@/lib/institutional-config"
import { Check } from "lucide-react"

export function InstValueStack() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">05 · EVERYTHING INCLUDED</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              The full stack, one license.
            </h2>
          </Reveal>
        </div>

        <ul className="flex flex-col gap-4">
          {VALUE_STACK.map((item, i) => (
            <Reveal key={item} delay={i * 60} as="li">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                <span className="text-sm leading-relaxed text-zinc-300">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
