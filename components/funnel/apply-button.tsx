"use client"

import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import { useFunnel } from "./funnel-context"

export function ApplyButton({
  children = "Apply",
  variant = "solid",
  className,
  section = "unknown",
  eventName = "apply_cta_click",
}: {
  children?: React.ReactNode
  variant?: "solid" | "ghost"
  className?: string
  /** where in the funnel this CTA lives — sent as an event param */
  section?: string
  /** override for named CTAs, e.g. hero_primary_cta_click */
  eventName?: string
}) {
  const { openApply } = useFunnel()
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent(eventName, { section, label: typeof children === "string" ? children : "apply" })
        openApply()
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-tight transition-colors duration-200",
        variant === "solid"
          ? "bg-white text-black hover:bg-zinc-200"
          : "border border-white/15 bg-transparent text-white hover:border-white/40 hover:bg-white/5",
        className,
      )}
    >
      {children}
    </button>
  )
}
