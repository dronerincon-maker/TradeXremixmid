# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

**TradeXLabs** marketing/funnel site — a single Next.js App Router application
that sells a charter-tier automated trading algo suite ("TradeX Institutional /
Founder Pro") to funded prop traders. It is a high-motion landing site with an
application/lead-capture flow, not a trading system: there is no live order
execution here. Backtest numbers, algorithm lists, and pricing are static
content that drives the sales pages.

The project originated in **v0.app** (`generator: 'v0.app'`, v0 sandbox files in
`.gitignore`). It deploys on **Vercel** (`@vercel/analytics`).

## Stack

- **Next.js 16** (App Router, React Server Components), **React 19**
- **TypeScript 5.7** — `strict: true`, but build errors are ignored
  (`next.config.mjs` sets `typescript.ignoreBuildErrors: true`). Type-check
  manually; the build will not catch type errors for you.
- **Tailwind CSS v4** (CSS-first config via `@import 'tailwindcss'` in
  `app/globals.css`; no `tailwind.config.*` file) + **shadcn** (style
  `base-nova`, RSC, base color `neutral`)
- **@base-ui/react** — the primitive layer under the UI components (not Radix)
- **GSAP 3** (+ `@gsap/react`, `ScrollTrigger`, `SplitText`) and
  **framer-motion** for animation
- **Drizzle ORM** over **node-postgres** (`pg`) for the founding-application DB
- **lucide-react** icons; **Geist** / **Geist Mono** fonts
- **pnpm** package manager (`pnpm-lock.yaml`); `hono` pinned to `4.12.25` via
  `pnpm.overrides`

## Commands

```bash
pnpm install       # install deps
pnpm dev           # next dev — local dev server
pnpm build         # next build (type errors ignored; see above)
pnpm start         # next start — serve the production build
pnpm lint          # eslint .
```

There is **no test suite** and no CI config in the repo. Verify changes by
running `pnpm dev` / `pnpm build` and checking the pages manually.

## Directory map

```
app/
  layout.tsx            Root layout — dark theme forced, fonts, Analytics (prod only)
  page.tsx              "/" — the Founder Pro funnel (composes components/funnel/*)
  institutional/page.tsx  "/institutional" — force-dynamic; reads live seat count
  globals.css           Tailwind v4 + shadcn theme tokens (oklch), light+dark vars
  actions/founding.ts   Server actions: getFoundingSeats, submitFoundingApplication
  api/apply/route.ts    POST endpoint for the funnel form (logs only — no DB)
components/
  ui/                   shadcn primitives (button.tsx). Add new ones here.
  funnel/               "/" sections + shared animation/visual primitives
  institutional/        "/institutional" sections
lib/
  utils.ts              cn() — clsx + tailwind-merge
  gsap.ts               Central GSAP plugin registration (import GSAP from here)
  db/                   Drizzle client (index.ts) + schema (schema.ts)
  institutional-config.ts  Single source of truth for the institutional page content
  backtest-data.ts      Static backtest equity curves / stats (from NinjaTrader exports)
public/                 Static assets, icons, placeholders
```

## The two pages and their two application flows

There are **two independent landing pages with two separate, non-shared
lead-capture paths** — do not merge them:

1. **`/` (Founder Pro funnel)** — `app/page.tsx` wraps everything in
   `FunnelProvider` (`components/funnel/funnel-context.tsx`), which owns a single
   modal open/close state. `ApplyButton` / `StickyCta` call `openApply()`;
   `ApplicationForm` is a modal that `POST`s to **`/api/apply`**
   (`app/api/apply/route.ts`). That route only validates and `console.log`s the
   lead — **it does not persist to the database.** Seat counts here are static
   constants (`TOTAL_SEATS`, `CLAIMED_SEATS` in `funnel-context.tsx`).

2. **`/institutional`** — `export const dynamic = "force-dynamic"`. It reads
   live seat availability with `getFoundingSeats()` and submits via the
   `submitFoundingApplication` **server action** (`app/actions/founding.ts`),
   which **writes to Postgres via Drizzle** and `revalidatePath("/institutional")`.
   `InstApply` drives the form with `useActionState`.

When touching lead capture, know which flow you're in: `/api/apply` = funnel,
log-only; server action = institutional, real DB writes with validation +
waitlist logic (`status` becomes `waitlisted` when `seatsRemaining <= 0`).

## Database

- Client: `lib/db/index.ts` — `pg` `Pool` from `process.env.DATABASE_URL`, wrapped
  by Drizzle. Requires `DATABASE_URL` in the environment (`.env*.local`, gitignored).
- Schema: `lib/db/schema.ts` — two tables:
  - `founding_config` (key/valueInt) — holds `founding_seat_cap` (default `25`
    if the row is missing).
  - `founding_members` — application submissions with a `status`
    (`applied` / `waitlisted` / `confirmed` / …). `getFoundingSeats()` computes
    remaining seats as `cap − count(status = "confirmed")`.
- No migration tooling is wired up in `package.json`. The schema is the source of
  truth; provision/migrate the DB out of band (Drizzle Kit is not configured here).

## Content is data — edit config, not JSX

The institutional page reads almost all of its copy from
`lib/institutional-config.ts`. Change content there, not in the section
components:

- `TIER` (`"founding" | "full"`) — flip to `"full"` at launch and pricing, seat
  language, and founding modules switch automatically.
- `PRICING`, `ALGORITHMS`, `ENGINE_FUNCTIONS`, `ENGINE_MODES`, `INFRASTRUCTURE`,
  `VALUE_STACK`, `ROADMAP_TABLE`, `STATS`.
- **Status honesty rule (from the file's own header): never mark a deliverable
  `"live"` unless it actually ships today.** `STATUS_LABEL` maps
  `live | building | roadmap`; `StatusBadge` renders it. Only a subset of
  `ALGORITHMS` and `INFRASTRUCTURE` items are `live` — keep it that way unless
  the feature is real.

Backtest figures live in `lib/backtest-data.ts` (typed `BacktestStrategy[]`,
auto-generated from NinjaTrader trade-list exports). Both gross ("No
commissions") and net ("With commissions") views are provided per strategy;
totals are meant to match the underlying performance summaries — treat the
numbers as real data, don't invent or round them.

## Conventions

- **Imports use the `@/*` alias** (maps to repo root, `tsconfig.json`), e.g.
  `@/components/funnel/...`, `@/lib/utils`, `@/lib/db`.
- **`"use client"`** at the top of any component using hooks, browser APIs,
  GSAP, or event handlers. Pages and section shells stay Server Components where
  possible; `app/actions/founding.ts` is `"use server"`.
- **GSAP: always import from `@/lib/gsap`, never from `"gsap"` directly.** That
  module registers `useGSAP`, `ScrollTrigger`, and `SplitText` exactly once and
  sets defaults. Importing GSAP elsewhere risks unregistered plugins.
- **Animation primitives live in `components/funnel/motion.tsx`** — reuse
  `Reveal`, `Parallax`, `SlideIn`, `DecodeText`, `useInView`,
  `usePrefersReducedMotion` instead of re-writing scroll/entrance effects.
- **Respect reduced motion.** Every motion helper already branches on
  `prefers-reduced-motion`; new animations must too (use `gsap.matchMedia()` or
  `usePrefersReducedMotion()`).
- **Styling:** Tailwind utility classes; compose conditional classes with
  `cn()` from `@/lib/utils`. Buttons use `class-variance-authority` variants
  (`components/ui/button.tsx`) — extend variants there, don't hand-roll button
  styles.
- **Dark theme is the product.** `<html>` is hard-set to `dark bg-black` and
  `viewport.colorScheme = "dark"`. The `body` intentionally has **no** background
  so the fixed `-z-10` `GridBackdrop` shows through — don't add a body bg. Design
  in dark; the light-mode CSS vars exist but the site is dark-only.
- **shadcn:** add UI primitives under `components/ui/` (config in
  `components.json`, aliases: `ui → @/components/ui`, `utils → @/lib/utils`).
- Naming: files are kebab-case; React components are PascalCase; section
  components are named for their slot (`HeroSection`, `InstPricing`, …).

## Environment & gotchas

- `DATABASE_URL` is required for `/institutional` and the founding server actions
  to work; without it those pages will error at request time.
- `images.unoptimized: true` — the Next Image optimizer is off; images serve as-is.
- Analytics only mounts in production (`process.env.NODE_ENV === 'production'`).
- `.gitignore` excludes v0 sandbox internals, `.vercel/`, `.env*.local`,
  `node_modules`, and `.next/`.
- Type errors do not fail the build — run `pnpm lint` and a manual TS check when
  correctness matters.

## Git workflow

Feature work happens on a dedicated branch (currently
`claude/claude-md-docs-573iwz`); `main` is the default branch. Commit with clear
messages and push with `git push -u origin <branch>`. Do not open a pull request
unless explicitly asked.
