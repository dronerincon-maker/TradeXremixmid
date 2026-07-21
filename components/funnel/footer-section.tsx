export const DISCLAIMER =
  "Backtested performance is not indicative of future results. The systems and server are tools, not earnings. TradeXLabs is not a prop firm. Trading futures involves substantial risk of loss. Not financial advice."

export function FooterSection() {
  return (
    <footer className="relative w-full border-t border-white/10 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">TradeXLabs</p>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-600">Signal through the noise</p>
        </div>
        <nav className="flex gap-8 text-sm text-zinc-500">
          <a href="/institutional" className="transition-colors hover:text-white">
            Institutional
          </a>
          <a href="/#proof" className="transition-colors hover:text-white">
            Verified data
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs leading-relaxed text-zinc-600">{DISCLAIMER}</p>
      <div className="mx-auto mt-10 flex max-w-6xl items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">Animated with</span>
        <a
          href="https://gsap.com"
          target="_blank"
          rel="noreferrer"
          className="opacity-40 transition-opacity hover:opacity-80"
        >
          <img src="/gsap-white.svg" alt="GSAP" className="h-3 w-auto" />
        </a>
      </div>
    </footer>
  )
}
