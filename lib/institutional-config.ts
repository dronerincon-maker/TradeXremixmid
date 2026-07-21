/**
 * TradeX Institutional — single source of truth for the page.
 * Flip TIER to "full" at launch: pricing, seat language, and founding
 * modules all switch automatically. Never mark an item "live" unless it
 * actually ships today — the roadmap table and suite tags read from here.
 */

export type Tier = "founding" | "full"

export const TIER: Tier = "founding"

export const PRICING = {
  founding: {
    price: "$3,997",
    priceNote: "One-time founding license + server setup + onboarding",
    planNote: "+ $297/mo operating — locked at the founding rate permanently",
    subNote:
      "At full Institutional launch ($8,000), founders are upgraded automatically at no additional license cost.",
    ctaLabel: "Apply for a founding seat",
    waitlistLabel: "Join the waitlist",
  },
  full: {
    price: "$8,000",
    priceNote: "One-time license + setup",
    planNote: "+ $297/mo operating subscription",
    subNote: "Limited to 100 lifetime Institutional spots.",
    ctaLabel: "Apply for access",
    waitlistLabel: "Join the waitlist",
  },
} as const

export type DeliverableStatus = "live" | "building" | "roadmap"

export const STATUS_LABEL: Record<DeliverableStatus, string> = {
  live: "LIVE NOW",
  building: "IN BUILD",
  roadmap: "ROADMAP",
}

/* ------------------------------------------------------------------ */
/* Algorithm suite — only the five that exist today are "live".        */
/* ------------------------------------------------------------------ */
export type Algorithm = {
  id: string
  name: string
  market: string
  logic: string
  portfolio: "A" | "B"
  status: DeliverableStatus
}

export const ALGORITHMS: Algorithm[] = [
  {
    id: "orb-31",
    name: "ORB 3.1 Institutional",
    market: "NQ",
    logic: "Opening-range breakout, institutional build",
    portfolio: "A",
    status: "live",
  },
  {
    id: "orb-41",
    name: "ORB 4.1 Institutional",
    market: "NQ",
    logic: "Opening-range breakout, next-generation build",
    portfolio: "A",
    status: "live",
  },
  {
    id: "pivots-1",
    name: "Quant PIVOTS Institutional I",
    market: "NQ",
    logic: "Session-pivot mean reversion",
    portfolio: "A",
    status: "live",
  },
  {
    id: "pivots-2",
    name: "Quant PIVOTS Institutional II",
    market: "NQ",
    logic: "Second-generation session-pivot system",
    portfolio: "A",
    status: "live",
  },
  {
    id: "orb-multi",
    name: "ORB Multi-Asset",
    market: "Multi",
    logic: "Opening-range breakout across correlated futures",
    portfolio: "B",
    status: "roadmap",
  },
  {
    id: "trend-scalp-1",
    name: "Trend Engine Scalper I",
    market: "NQ",
    logic: "Short-horizon trend capture",
    portfolio: "B",
    status: "roadmap",
  },
  {
    id: "trend-scalp-2",
    name: "Trend Engine Scalper II",
    market: "ES",
    logic: "Short-horizon trend capture, second build",
    portfolio: "B",
    status: "roadmap",
  },
  {
    id: "trend-intra-1",
    name: "Trend Engine Intraday I",
    market: "NQ",
    logic: "Intraday trend continuation",
    portfolio: "B",
    status: "roadmap",
  },
  {
    id: "trend-intra-2",
    name: "Trend Engine Intraday II",
    market: "ES",
    logic: "Intraday trend continuation, second build",
    portfolio: "B",
    status: "roadmap",
  },
  {
    id: "momentum-edge",
    name: "Momentum Edge",
    market: "NQ",
    logic: "Momentum burst capture",
    portfolio: "B",
    status: "roadmap",
  },
]

/* ------------------------------------------------------------------ */
/* Prop Oracle — the agentic Allocation Engine. Six functions, two modes. */
/* ------------------------------------------------------------------ */
export const ENGINE_FUNCTIONS = [
  {
    name: "Firm rule mapping",
    detail: "Every account mapped to its firm's ruleset — trailing vs EOD drawdown, daily loss, consistency.",
  },
  {
    name: "Drawdown guardrails",
    detail: "Warns how close each account sits to a breach against its equity peak.",
  },
  {
    name: "Consistency checks",
    detail: "Flags days that would violate a firm's consistency rules before payout eligibility.",
  },
  {
    name: "Allocation recommendations",
    detail: "Which algorithm runs on which account, sized to each account's remaining room.",
  },
  {
    name: "What-if projections",
    detail: "Add N evals and see projected exposure across the whole account set.",
  },
  {
    name: "Payout cadence tracking",
    detail: "Each firm's payout eligibility windows tracked per account.",
  },
] as const

export const ENGINE_MODES = [
  {
    name: "Advisory Mode",
    status: "building" as DeliverableStatus,
    statusNote: "At launch",
    detail:
      "The engine computes and recommends. You execute. Every allocation decision stays human-authorized.",
  },
  {
    name: "Live-Connected Mode",
    status: "roadmap" as DeliverableStatus,
    statusNote: "Coming soon — Tradovate API",
    detail:
      "Broker-connected execution is a separate, risk-controlled, human-authorized project on the roadmap.",
  },
] as const

/* ------------------------------------------------------------------ */
/* Infrastructure + value stack                                        */
/* ------------------------------------------------------------------ */
export const INFRASTRUCTURE = [
  {
    name: "Preloaded trading server",
    status: "live" as DeliverableStatus,
    detail:
      "Exchange-proximate server with NinjaTrader installed, your 4 core algorithms loaded and licensed, data feed connected. Delivered day one.",
  },
  {
    name: "Custom backtesting engine",
    status: "roadmap" as DeliverableStatus,
    detail: "Blended equity-curve simulation, per-algorithm toggles, drawdown visualisation. Member Backtest Lab.",
  },
  {
    name: "Account-health monitor",
    status: "roadmap" as DeliverableStatus,
    detail: "Continuous per-account rule and drawdown monitoring across every firm.",
  },
  {
    name: "SOPs, playbooks & knowledge base",
    status: "live" as DeliverableStatus,
    detail: "The operating manual: setup, allocation, payout, and scaling procedures.",
  },
  {
    name: "White-glove onboarding + mastermind",
    status: "live" as DeliverableStatus,
    detail: "1:1 onboarding, then the founding cohort mastermind.",
  },
] as const

export const VALUE_STACK = [
  "The 4 institutional core algorithms — owned for life, delivered day one",
  "Preloaded, exchange-proximate trading server — done-for-you, day one",
  "SOPs, prop-firm knowledge base, and firm-specific playbooks",
  "White-glove onboarding — guided setup, start to live",
  "Mastermind channel + monthly member call",
  "Prop Oracle — the agentic Allocation Engine, Advisory Mode first (roadmap)",
  "The remaining 6 algorithms via quarterly drops (roadmap)",
  "Custom backtesting engine + account-health monitor (roadmap)",
  "Grandfather guarantee — automatic upgrade to the full $8,000 tier, $297/mo locked forever",
] as const

/* ------------------------------------------------------------------ */
/* Now-vs-roadmap table (pricing section) — the compliance module.     */
/* ------------------------------------------------------------------ */
export const ROADMAP_TABLE: { deliverable: string; status: DeliverableStatus; note: string }[] = [
  {
    deliverable: "Algorithms — 4 of 10",
    status: "live",
    note: "Remaining six ship on the quarterly drop schedule",
  },
  { deliverable: "Preloaded server / DFY infrastructure", status: "live", note: "Delivered day one" },
  { deliverable: "SOPs, playbooks, onboarding, mastermind", status: "live", note: "Available today" },
  { deliverable: "Prop Oracle — Advisory Mode", status: "building", note: "Ships first; you execute" },
  {
    deliverable: "Prop Oracle — Live-Connected",
    status: "roadmap",
    note: "Tradovate API. Coming soon",
  },
  { deliverable: "Custom backtesting engine", status: "roadmap", note: "Member Backtest Lab" },
  { deliverable: "AI features + account-health monitor", status: "roadmap", note: "Support & intelligence layer" },
]

export const STATS = [
  { value: "10", label: "Algorithms" },
  { value: "2", label: "Portfolios" },
  { value: "4", label: "Prop firms mapped" },
] as const
