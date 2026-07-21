"use client"

/**
 * ProofSection: the verified-data layer. Real NinjaTrader backtest exports
 * (lib/backtest-data.ts) rendered as an interactive evidence console —
 * strategy selector, gross/net-of-commissions toggle, equity curve, and the
 * full metric table with methodology. Nothing here is fabricated: every
 * number comes from the committed trade-list exports.
 */

import { useState } from "react"
import { BACKTESTS, type BacktestStrategy } from "@/lib/backtest-data"
import { trackEvent } from "@/lib/analytics"
import { DecodeText, Reveal } from "./motion"
import { EquityChart } from "./equity-chart"
import { cn } from "@/lib/utils"

type ViewKey = "net" | "gross"

export function ProofSection() {
  const [strategyId, setStrategyId] = useState(BACKTESTS[0].id)
  const [viewKey, setViewKey] = useState<ViewKey>("net")

  const strategy = BACKTESTS.find((s) => s.id === strategyId) ?? BACKTESTS[0]
  const view = strategy[viewKey]

  const selectStrategy = (s: BacktestStrategy) => {
    setStrategyId(s.id)
    trackEvent("proof_interaction", { control: "strategy", strategy: s.name })
  }
  const selectView = (v: ViewKey) => {
    setViewKey(v)
    trackEvent("proof_interaction", { control: "view", value: v, strategy: strategy.name })
  }

  return (
    <section id="proof" className="relative w-full scroll-mt-8 py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <DecodeText text="THE EVIDENCE" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
        <DecodeText
          as="h2"
          text="Inspect the data. Gross and net."
          className="mt-6 block max-w-3xl text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
          duration={700}
        />
        <Reveal delay={100} as="p" className="mt-6 max-w-2xl text-lg text-zinc-400">
          Most vendors show one flattering curve. We publish the NinjaTrader backtest exports for each algorithm —
          with commissions and without — so you can see exactly what execution costs do to an edge.
        </Reveal>

        <Reveal delay={160} className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm">
            {/* console header: selectors */}
            <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Strategy">
                {BACKTESTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={s.id === strategy.id}
                    onClick={() => selectStrategy(s)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
                      s.id === strategy.id
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 rounded-full border border-white/10 p-1" role="tablist" aria-label="Commission view">
                {(["net", "gross"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={viewKey === v}
                    onClick={() => selectView(v)}
                    className={cn(
                      "rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                      viewKey === v ? "bg-white text-black" : "text-zinc-400 hover:text-white",
                    )}
                  >
                    {v === "net" ? "Net" : "Gross"}
                  </button>
                ))}
              </div>
            </div>

            {/* chart + context */}
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
                  {strategy.name} · {view.label}
                </p>
                <p className="font-mono text-[10px] text-zinc-600">
                  {strategy.instrument} · {strategy.period} · {strategy.trades.toLocaleString()} trades ·{" "}
                  {strategy.engine}
                </p>
              </div>

              <EquityChart key={`${strategy.id}-${viewKey}`} points={view.equity} id={`proof-${strategy.id}-${viewKey}`} />

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-8">
                <Metric label="Net profit" value={`$${Math.round(view.netProfit).toLocaleString()}`} />
                <Metric label="Profit factor" value={view.profitFactor.toFixed(2)} />
                <Metric label="Max drawdown" value={`-$${Math.round(view.maxDrawdown).toLocaleString()}`} />
                <Metric label="Win rate" value={`${view.winRate.toFixed(1)}%`} />
                <Metric label="Sharpe" value={view.sharpe.toFixed(2)} />
                <Metric label="Avg trade" value={`$${view.avgTrade.toFixed(2)}`} />
                <Metric label="Profit / month" value={`$${Math.round(view.profitPerMonth).toLocaleString()}`} />
                <Metric label="Commissions" value={view.commission > 0 ? `$${Math.round(view.commission).toLocaleString()}` : "—"} />
              </dl>
            </div>

            {/* methodology */}
            <div className="border-t border-white/10 p-4 sm:px-6">
              <p className="text-xs leading-relaxed text-zinc-500">
                <span className="font-medium text-zinc-300">Methodology:</span> figures are NinjaTrader strategy
                backtests over the stated period, downsampled from the full trade-by-trade record; totals match the
                performance summaries. “Net” includes commissions as shown. Backtested performance is hypothetical,
                does not reflect live execution slippage, and is not indicative of future results. The same trade
                lists are reviewed with founding members during onboarding.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-black p-4">
      <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">{label}</dt>
      <dd className="font-mono text-sm text-white">{value}</dd>
    </div>
  )
}
