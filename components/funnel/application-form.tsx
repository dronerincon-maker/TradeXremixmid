"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Check } from "lucide-react"
import { useFunnel } from "./funnel-context"

const FUNDED_OPTIONS = [
  { value: "funded", label: "Funded now" },
  { value: "evals", label: "In evaluations" },
  { value: "own", label: "Own capital" },
]

const FIRMS = ["Tradeify", "MyFundedFutures", "Lucid", "Take Profit Trader", "Other"]

type Status = "idle" | "submitting" | "success" | "error"

export function ApplicationForm() {
  const { applyOpen, closeApply } = useFunnel()
  const [status, setStatus] = useState<Status>("idle")
  const [firms, setFirms] = useState<string[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!applyOpen) return
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeApply()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
      clearTimeout(t)
    }
  }, [applyOpen, closeApply])

  useEffect(() => {
    if (!applyOpen) {
      // reset after close animation
      const t = setTimeout(() => {
        setStatus("idle")
        setFirms([])
      }, 300)
      return () => clearTimeout(t)
    }
  }, [applyOpen])

  const toggleFirm = (firm: string) => {
    setFirms((prev) => (prev.includes(firm) ? prev.filter((f) => f !== firm) : [...prev, firm]))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("submitting")
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      fundedStatus: String(data.get("fundedStatus") || ""),
      firms,
      accountsRun: String(data.get("accountsRun") || ""),
      capitalAvailable: String(data.get("capitalAvailable") || ""),
    }
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <AnimatePresence>
      {applyOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Apply for a founding seat"
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeApply()
          }}
        >
          <motion.div
            ref={dialogRef}
            className="relative my-8 w-full max-w-lg border border-white/10 bg-[#0a0a0a] p-6 sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              type="button"
              onClick={closeApply}
              aria-label="Close"
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="size-5" />
            </button>

            {status === "success" ? (
              <motion.div
                key="success"
                className="py-8 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/20"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
                >
                  <Check className="size-6 text-white" />
                </motion.div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">Application received</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
                  We read every application by hand. If it&apos;s a fit, we&apos;ll reach out with next steps within a
                  few business days. Not everyone is accepted — and that&apos;s the point.
                </p>
                <button
                  type="button"
                  onClick={closeApply}
                  className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">Founding Charter</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">Apply for a seat</h3>
            <p className="mt-2 text-sm text-zinc-500">No card, no checkout — this is an application. A few details so we can see if it&apos;s a fit.</p>

            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <Field label="Full name" htmlFor="name">
                <input ref={firstFieldRef} id="name" name="name" required autoComplete="name" className={inputCls} />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Email" htmlFor="email">
                  <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputCls} />
                </Field>
              </div>

              <fieldset>
                <legend className={labelCls}>Funded status</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {FUNDED_OPTIONS.map((opt, i) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center justify-center border border-white/10 px-2 py-3 text-center text-xs text-zinc-300 transition-colors hover:border-white/30 has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-black"
                    >
                      <input
                        type="radio"
                        name="fundedStatus"
                        value={opt.value}
                        defaultChecked={i === 0}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={labelCls}>Firms you trade</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FIRMS.map((firm) => {
                    const active = firms.includes(firm)
                    return (
                      <button
                        type="button"
                        key={firm}
                        onClick={() => toggleFirm(firm)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                          active
                            ? "border-white bg-white text-black"
                            : "border-white/10 text-zinc-300 hover:border-white/30"
                        }`}
                      >
                        {firm}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Accounts run" htmlFor="accountsRun">
                  <select id="accountsRun" name="accountsRun" required className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="1">1</option>
                    <option value="2-3">2–3</option>
                    <option value="4-9">4–9</option>
                    <option value="10+">10+</option>
                  </select>
                </Field>
                <Field label="Capital available" htmlFor="capitalAvailable">
                  <select id="capitalAvailable" name="capitalAvailable" required className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="under-5k">Under $5k</option>
                    <option value="5-15k">$5k–$15k</option>
                    <option value="15-50k">$15k–$50k</option>
                    <option value="50k+">$50k+</option>
                  </select>
                </Field>
              </div>

              {status === "error" && (
                <p className="text-sm text-zinc-300">That didn&apos;t go through. Check your connection and try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting…" : "Submit application"}
              </button>
              <p className="text-center text-xs text-zinc-600">
                Capital beyond your funded accounts is optional context — never a requirement.
              </p>
            </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const inputCls =
  "w-full border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-white/40"
const labelCls = "text-xs font-medium uppercase tracking-[0.15em] text-zinc-500"

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  )
}
