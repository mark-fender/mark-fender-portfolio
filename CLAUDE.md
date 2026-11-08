# Portfolio — working notes for Claude

Personal portfolio of Marek Lipčák (markfender.dev). Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, motion 14 (`motion/react`). Single page: `src/app/page.tsx` composes the sections in `src/components/`.

## Redesign in progress (v3)

The site is being redesigned. Design is approved direction, not yet implemented.

- **Spec (source of truth):** `src/design-system/README.md`. Tokens: `src/design-system/tokens.css`. Motion presets: `src/design-system/motion.ts`. Read the README before touching UI.
- **Designs:** claude.ai canvas "Portfolio Redesign v1" (https://claude.ai/artifact/BcLq4qiR6WAUc5DvQ9VCd8), page "v3 — new baseline" is current; "v2 — saved" is the previous approved version. Figma file "Portfolio Redesign v2" (https://www.figma.com/design/Ff9ADInh4UyLs4Kr7o9vo2) still shows v2. The canvas is the newest.
- **Rejected ideas (don't reintroduce):** a serif italic accent on the hero name; a fixed waypoint/trail nav on the left edge.
- **Implementation plan:** `docs/superpowers/plans/2026-11-08-portfolio-redesign-v3.md` — implement only what plan §5 "Cleared to implement" names, and stop at the gate it names.
- **Visual reference (in repo):** `design/reference/home-{dark,light}-1440.{html,jpg}` and `home-mobile-390.*`. Static renders of the v3 canvas; compare against them, never ship their markup.
- **Branch:** `design/redesign-v2-tokens`.
- `src/design-system/` is not imported anywhere yet; the live site still runs the old styles until implementation starts.

## Rules decided with the owner

- **Content stays as is.** Text comes from `src/lib/data.tsx` and the existing components. New sections use visible `[placeholder]` text until the owner writes copy. Don't invent facts, stats or quotes.
- **Dark is the default and preferred theme**; light is supported via `data-theme="light"` (next-themes).
- **Olive (`primary`) means an action or the "now" state** (current role, availability). Never decoration.
- **Palette feel:** Nord-inspired graphite greys + faded olive. No neon, no gradient washes, no glassmorphism.
- **Fonts:** Inter for everything people read, JetBrains Mono for labels, dates, indices and the spec panel. Never paragraphs in mono.
- **Header never wraps:** name hides below 800px (initials stay), pill nav becomes a menu button below 680px.
- **Hover lives on cards, not on rows inside cards.**
- **Keep:** hero portrait tilt, About scroll text reveal, experience scroll rail, sticky stacking project cards, the contour-line hero background.
- **Remove when implementing:** `Aurora.tsx` + `ogl`, `react-type-animation`, Satoshi font files, `aurora-*` utilities in `globals.css`.
- **Library:** shadcn/ui on Tailwind v4 for primitives. Not Aceternity / Magic UI (too flashy for this direction).
- **Tech icons:** from `react-icons` (as today), rendered in `currentColor`, never brand colours.

## Known issues

- **Version ceilings (don't "fix" these):**
  - `typescript` stays on 6.0.x: Next and typescript-eslint need its compiler API, which the TS 7 package lacks. TS 7 is installed as `typescript-7` and runs `npm run typecheck`. Lift when typescript-eslint and Next support TS 7.
  - `eslint` stays on 9.x: `eslint-plugin-react` (via `eslint-config-next`) peers end at ESLint 9.7. Lift when `eslint-config-next` supports ESLint 10.
  - `@types/node` matches the Node major in `engines` (24.x).
- `vite` is a declared devDependency on purpose (Vitest's peer). Without it npm treats vite/rolldown as peer-only and drops the `@rolldown/binding-*` packages on the next install, and Vitest can't start (npm/cli#4828).
- `tsconfig.json` sets `"allowJs": false` on purpose: `next build` re-adds `allowJs: true` when the key is missing.
- Contact: server caps messages at 750 chars, the current textarea allows 1000 (plan Task 12 fixes it).
- City and time zone (`[City]`, `Europe/Bratislava`) are placeholders until the owner confirms.
- Figma: mobile frame's projects section may have an empty gap above the card (unverified). Starter plan allows one variable mode per collection, so themes are two collections, "Theme / Dark" and "Theme / Light".

## Scripts

- `npm run check`: lint, format:check, typecheck (TS 7), unit tests (Vitest), build, e2e (Playwright). Must pass before every commit that closes a task.
- `npm run screenshots`: full-page captures (1440 dark/light, 390 dark) into `test-results/screens/`, to compare with `design/reference/*.jpg`.
- Pre-commit hook (husky): lint, format:check, typecheck.
- Node 24 (`nvm use 24`).

## Workflow

- After non-trivial code changes, run a Codex review (see the user's global instructions) and report what it raised.
- Commit only when asked.
