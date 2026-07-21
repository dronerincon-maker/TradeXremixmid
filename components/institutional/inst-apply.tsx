"use client"

import { useActionState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { Reveal } from "@/components/funnel/motion"
import { GlitterWarp } from "@/components/funnel/glitter-warp"
import { submitFoundingApplication, type FoundingApplicationState } from "@/app/actions/founding"
import { TIER, PRICING } from "@/lib/institutional-config"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none"

const labelClass = "font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase"

export function InstApply({ seatsRemaining }: { seatsRemaining: number }) {
  const [state, formAction, pending] = useActionState<FoundingApplicationState, FormData>(
    submitFoundingApplication,
    null,
  )
  const pricing = PRICING[TIER]
  const soldOut = seatsRemaining <= 0

  useEffect(() => {
    if (!state) return
    if (state.ok) trackEvent("form_submit", { form: "founding_application", waitlisted: !!state.waitlisted })
    else trackEvent("form_error", { form: "founding_application" })
  }, [state])

  return (
    <section id="apply" className="relative w-full scroll-mt-8 overflow-hidden bg-black py-28 md:py-40">
      <GlitterWarp className="opacity-30" reverse particleCount={220} brightness={60} speed={3} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 65% at 50% 45%, rgba(0,0,0,0.88), rgba(0,0,0,0.5) 72%, rgba(0,0,0,0.9))",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-12 px-6">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-zinc-500">07 · APPLY</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-3xl font-light tracking-tight text-white md:text-5xl">
              {soldOut ? "Founding seats are full." : "Apply for a founding seat."}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-pretty text-sm leading-relaxed text-zinc-400">
              {soldOut
                ? "Join the waitlist below. If a seat opens or the next tier goes live, you hear first."
                : "A short qualification form. If you're a fit, we schedule a call: payment only happens after acceptance and a signed founding agreement."}
            </p>
          </Reveal>
        </div>

        {state?.ok ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-black">
              <Check className="size-5" aria-hidden />
            </span>
            <p className="text-lg font-light text-white">
              {state.waitlisted ? "You're on the waitlist" : "Application received"}
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">{state.message}</p>
          </div>
        ) : (
          <Reveal>
            <form action={formAction} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className={labelClass}>
                    Full name
                  </label>
                  <input id="fullName" name="fullName" required maxLength={200} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input id="email" name="email" type="email" required maxLength={320} className={inputClass} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className={labelClass}>
                    Phone (optional)
                  </label>
                  <input id="phone" name="phone" type="tel" maxLength={50} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="propFirms" className={labelClass}>
                    Prop firms traded
                  </label>
                  <input
                    id="propFirms"
                    name="propFirms"
                    maxLength={500}
                    placeholder="Tradeify, MFF, Lucid…"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fundedAccounts" className={labelClass}>
                    Funded accounts
                  </label>
                  <select id="fundedAccounts" name="fundedAccounts" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="0">None yet</option>
                    <option value="1">1</option>
                    <option value="2-3">2–3</option>
                    <option value="4-9">4–9</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="capitalType" className={labelClass}>
                    Cash or prop
                  </label>
                  <select id="capitalType" name="capitalType" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="prop">Prop accounts</option>
                    <option value="cash">Cash account</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="whyNow" className={labelClass}>
                  Why now?
                </label>
                <textarea
                  id="whyNow"
                  name="whyNow"
                  rows={4}
                  maxLength={2000}
                  placeholder="What are you running today, and what breaks without infrastructure?"
                  className={cn(inputClass, "resize-none")}
                />
              </div>

              {state && !state.ok ? (
                <p role="alert" className="text-sm text-zinc-300">
                  {state.message}
                </p>
              ) : null}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-zinc-200 disabled:opacity-50"
                >
                  {pending ? "Submitting…" : soldOut ? pricing.waitlistLabel : pricing.ctaLabel}
                </button>
                <p className="text-xs leading-relaxed text-zinc-600">
                  Founding access is a pre-launch commitment. See what&apos;s live today vs. on the roadmap above.
                  Applying does not guarantee a seat. Acceptance includes the founding agreement and full
                  disclosures.
                </p>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  )
}
