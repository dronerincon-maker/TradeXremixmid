# Welcome to TradeXLabs

## How We Use Claude

Based on Claude's usage over the last 30 days:

Work Type Breakdown:
  Improve Quality   ████████████████████  100%

_(Single session so far — a full funnel audit, refactor, and visual overhaul. The breakdown will fill out as the team runs more sessions.)_

Top Skills & Commands:
  /algorithmic-art       █████░░░░░░░░░░░░░░░░  1x/month
  /web-artifacts-builder █████░░░░░░░░░░░░░░░░  1x/month
  /theme-factory         █████░░░░░░░░░░░░░░░░  1x/month
  /model                 █████░░░░░░░░░░░░░░░░  1x/month

Top MCP Servers:
  GitHub  ████████████████████  2 calls

## Your Setup Checklist

### Codebases
- [ ] tradexremixmid — https://github.com/dronerincon-maker/tradexremixmid

### MCP Servers to Activate
- [ ] GitHub — read/write repos, PRs, issues, CI status from inside Claude Code. Ask a repo admin to enable the Claude GitHub app for the org (Claude settings → GitHub), then authenticate when prompted.

### Skills to Know About
- [ ] /algorithmic-art — generates a generative-art "philosophy" plus an interactive p5.js artifact. The team used it to prototype a seeded generative piece (a stochastic-drift equity-cone visualizer).
- [ ] /web-artifacts-builder — scaffolds a React + TypeScript + Tailwind + shadcn/ui app and bundles it into a single self-contained HTML artifact.
- [ ] /theme-factory — applies a cohesive color + font theme (preset or custom) to an artifact or site. The team used it to define the custom "Signal Terminal" brand theme.
- [ ] /model — switches the active Claude model for the session.

## Team Tips

- Develop on a feature branch (e.g. `claude/<short-topic>`), never straight on `main`. Commit with clear messages and push the branch.
- Before pushing UI work, run the local production build (`pnpm build`) and the browser interaction check — the funnel relies on GSAP ScrollTrigger pinning, so verify hero/pin behavior and no horizontal overflow from 320px→1920px.
- Every visual change gets eyeballed in a real browser at mobile and desktop widths, plus a reduced-motion pass. Screenshots before/after help.
- Opening a PR triggers a Vercel **preview** deploy automatically; production (`tradexlabs-remix.vercel.app`) only updates when the PR merges to `main`.
- Keep claims factual: performance figures come from the committed backtest data (`lib/backtest-data.ts`) and the source-of-truth config (`lib/institutional-config.ts`) — never invent results, reviews, or scarcity.
- The brand accent (cyan → indigo → magenta) is reserved for load-bearing signals only; the base UI stays monochrome.

## Get Started

1. Clone the repo and install: `pnpm install`.
2. Run it locally: `pnpm dev`, then open the funnel and click through the hero, proof console, FAQ, and application modal.
3. Make a small, safe first change (e.g. a copy tweak in a `components/funnel/*` section), run `pnpm build`, and open a PR to see your Vercel preview.
4. Paste this guide into Claude Code for a guided tour of the setup checklist above.

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
