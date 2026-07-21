"use client"

/**
 * Conversion analytics — thin wrapper over Vercel Analytics custom events.
 * (This project ships @vercel/analytics only; there is no GA4 property.)
 *
 * - `trackEvent` fires every call.
 * - `trackOnce` dedupes by event name + params for the page lifetime, for
 *   view/milestone events that must never double-fire (scroll depth,
 *   section views, proof interactions per control).
 */
import { track } from "@vercel/analytics"

type Params = Record<string, string | number | boolean>

const fired = new Set<string>()

export function trackEvent(name: string, params?: Params) {
  try {
    track(name, params)
  } catch {
    // analytics must never break the page
  }
}

export function trackOnce(name: string, params?: Params) {
  const key = name + JSON.stringify(params ?? {})
  if (fired.has(key)) return
  fired.add(key)
  trackEvent(name, params)
}

/** Standard scroll-depth milestones, deduped per page load. */
export function trackScrollDepth(progress: number) {
  for (const m of [25, 50, 75, 90]) {
    if (progress * 100 >= m) trackOnce(`scroll_${m}`)
  }
}
