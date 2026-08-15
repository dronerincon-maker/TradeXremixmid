# TradeXLabs Funnel — Session Handoff

A portable summary of everything done in this sandbox so the work can be
continued in another chat, editor, or machine.

## TL;DR — how to pick this up elsewhere

Everything is committed and pushed. In any new environment:

```bash
git clone https://github.com/dronerincon-maker/TradeXremixmid.git
cd TradeXremixmid
git checkout claude/funnel-work-3bdl54
pnpm install            # see "Build gotcha" below if this errors
pnpm dev                # http://localhost:3000
```

- **Repo:** `dronerincon-maker/TradeXremixmid`
- **Working branch:** `claude/funnel-work-3bdl54` (branched from `main`)
- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · GSAP + framer-motion · Drizzle/Postgres

To hand context to a fresh AI chat: paste this file, plus the "What changed"
and "Design system" sections below.

## Routes

| Route | File | Backend needs |
|---|---|---|
| `/` (the funnel) | `app/page.tsx` | None. Seat count is static in `components/funnel/funnel-context.tsx`. Form POSTs to `/api/apply`, which only validates + `console.log`s (no DB yet). |
| `/institutional` | `app/institutional/page.tsx` | **Needs `DATABASE_URL`** — uses Drizzle server actions in `app/actions/founding.ts` (`foundingConfig`, `foundingMembers` tables). |
| `POST /api/apply` | `app/api/apply/route.ts` | Stub — logs the application. Wire to CRM/DB before launch. |

## Environment variables

Create `.env.local` (gitignored):

```bash
# Required only for the /institutional page (Drizzle + node-postgres)
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Optional. Absolute base for OG/Twitter image URLs.
# On Vercel this auto-falls back to VERCEL_PROJECT_PRODUCTION_URL.
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The funnel (`/`) runs with no env vars at all.

## What changed in this session (branch `claude/funnel-work-3bdl54`)

Three commits on top of the v0 initial commit:

### 1. Framer-motion interactions + Higgsfield assets
- Global `MotionConfig reducedMotion="user"` in `funnel-context.tsx` — every
  framer-motion transform/opacity auto-degrades under `prefers-reduced-motion`.
- Application modal (`application-form.tsx`): `AnimatePresence` backdrop fade +
  dialog spring + success checkmark pop. **Note:** the component no longer
  early-returns `null`; it renders `<AnimatePresence>{applyOpen && …}` so exit
  animations run.
- Apply buttons (`apply-button.tsx`): `whileHover`/`whileTap` spring.
- Suite cards (`suite-section.tsx`): hover lift, border glow, pulsing LIVE dot,
  hover-revealed `suite-texture.webp`.
- Playbook cards (`playbook-section.tsx`): hover tint + icon spring.
- Sticky CTA (`sticky-cta.tsx`): `AnimatePresence` slide; now shows live
  "N of 50 seats left" from `funnel-context` constants.
- Hero VSL frame (`hero-section.tsx`): `VslFrame` component shows
  `hero-vsl-poster.webp` behind a framer-motion play control (still a
  placeholder — **no real video wired up yet**).

### 2. Metadata / OG
- `app/layout.tsx`: added `openGraph` + `twitter` cards using `og-image.webp`,
  and a `metadataBase` derived from `NEXT_PUBLIC_SITE_URL` →
  `VERCEL_PROJECT_PRODUCTION_URL` → `localhost`.

### 3. Copy pass (all funnel sections)
Sharpened every section in the existing institutional voice while preserving
compliance guardrails (tools-not-earnings, no profit promises, honest
track-record language). Files: `layout.tsx`, `hero-`, `taas-intro-`,
`problem-`, `suite-`, `infrastructure-`, `playbook-`, `guarantee-`,
`entry-section.tsx`, `sticky-cta.tsx`, `application-form.tsx`.

## Generated assets (in `public/`)

All produced with **Higgsfield → Recraft V4.1**, monochrome palette
`#000000 #FFFFFF #E4E4E7 #A1A1AA #71717A #3F3F46`, then converted PNG→WebP.

| File | Ratio | Used by | Prompt intent |
|---|---|---|---|
| `hero-vsl-poster.webp` | 16:9 | Hero play frame | Cinematic monochrome orderflow: 3D hairline grid, candlesticks, data streaks on pure black. No text. |
| `og-image.webp` | 16:9 | `layout.tsx` metadata | Wordmark "TradeXLabs" + "SIGNAL THROUGH THE NOISE" over a faint perspective grid. |
| `suite-texture.webp` | 4:3 | Suite card hover | Subtle low-contrast waveform/lattice for low-opacity overlay. |

To regenerate/extend: Higgsfield MCP `generate_image` with `model:"recraft_v4_1"`,
`background_color:"#000000"`, and the palette above. Keep everything monochrome.

## Design system / voice (for consistency in future edits)

- **Palette:** pure black (`#000`, `#050505`, `#0a0a0a`) grounds; white text;
  zinc grays for secondary; borders `white/10`. No accent color — monochrome is
  the brand.
- **Type:** Geist Sans + Geist Mono (mono for eyebrows/labels/terminal).
- **Motion:** GSAP + ScrollTrigger owns scroll-driven scenes (hero pin, suite
  horizontal scroll, reveals in `components/funnel/motion.tsx`); framer-motion
  owns interactive/stateful micro-interactions (hover, tap, modal). Don't put
  framer-motion scroll animations on elements GSAP already pins.
- **Voice:** institutional, terse, confident, honest. Never promise profits.
  "Signal through the noise" is the brand line.
- **Section rhythm:** mono uppercase eyebrow (via `DecodeText`) → large
  `tracking-[-0.03em]` headline → supporting copy.

## Build gotcha (pnpm 11 in this sandbox)

`pnpm build` failed here for two environment reasons unrelated to the code:
1. The repo pins `pnpm.overrides` in `package.json` (older pnpm style); pnpm 11
   ignores it, causing a frozen-lockfile mismatch.
2. `sharp`/`msw` have unapproved build scripts → pnpm's pre-run deps check exits
   non-zero.

**Workarounds (pick one):**
- Simplest: build the binary directly, bypassing `pnpm run`:
  `pnpm install --no-frozen-lockfile && ./node_modules/.bin/next build`
- Or add a `pnpm-workspace.yaml` with
  `onlyBuiltDependencies: [sharp, msw]` and `pnpm approve-builds`.

These workarounds were **intentionally not committed** to avoid changing your
dependency resolution (the `hono` override in the lockfile). `tsc --noEmit` and
`next build` both pass cleanly.

## Suggested next steps

- Wire `POST /api/apply` to a real store (DB/CRM/email).
- Replace the hero play-button placeholder with a real VSL video.
- Connect the repo to Vercel (auto-deploys this branch as a Preview).
- Optional: copy pass on `/institutional` (separate register from the funnel).
