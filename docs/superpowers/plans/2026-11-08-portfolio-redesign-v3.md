# Portfolio Redesign v3: Implementation Plan (final)

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Work task by task, tick the `- [ ]` boxes, and stop at every **Review gate**. **Before starting any task, read §5 "Cleared to implement" and follow §3.1. Only cleared tasks may be implemented.**

**Goal:** rebuild the single-page portfolio to the approved v3 design (Nord graphite + olive, dark by default, light supported) without changing its content.

**Spec, in priority order:** `CLAUDE.md` (owner rules) → `src/design-system/README.md` → `tokens.css` / `motion.ts` → `design/reference/*.jpg` (visual target) → canvas page "v3 — new baseline" (https://claude.ai/artifact/BcLq4qiR6WAUc5DvQ9VCd8). When this plan and the spec disagree, the plan wins on **engineering** (architecture, security, a11y, perf) and the spec wins on **look**. Raise any other conflict with the reviewer instead of guessing.

**Stack:** Next.js 16 App Router, React 19, TypeScript 7 for type-checking (with TypeScript 6 kept as the compiler API for Next and typescript-eslint, see T0b), Tailwind v4, shadcn/ui (Radix), `motion` 14 (formerly framer-motion), next-themes, lucide-react, react-icons, sonner, Vitest, Playwright. Node 24 LTS.

**Phases:** Phase 0 (T0a–T0d) upgrades every package and the toolchain **before** any redesign work. It has its own review gate. The redesign (T1–T13) starts only after Gate 0 passes.

---

## 0. Decisions

| #   | Question                                                                                                                      | Decision                                                                                                                                                                                                                                                                                                    | Affects          |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| D1  | Header position                                                                                                               | **Decided: sticky.** Active-section tracking stays. Solid `bg-background`, bottom border once scrolled, no blur.                                                                                                                                                                                            | T4, T10          |
| D2  | Theme toggle animation                                                                                                        | **Decided: colours cross-fade** (200 ms, View Transitions API) and the icon rotates in.                                                                                                                                                                                                                     | T4               |
| D3  | Footer wordmark colour: README/tokens say `subtle-foreground`, the old plan said `surface-raised`.                            | Default **`subtle-foreground`** (tokens comment)                                                                                                                                                                                                                                                            | T13              |
| D4  | Projects                                                                                                                      | **Decided: Imaginify is removed.** New recent projects replace it. "Cat AI Assistant" is added first (draft copy); more follow as the owner writes them.                                                                                                                                                    | T2, T10          |
| D5  | Portrait spec panel (`role / years / focus`)                                                                                  | **Corrected at Gate B1:** values from copy already on the page, as in the reference: `Frontend developer` / `siteMeta.experienceYears` (7) / the rotating words joined with `·`.                                                                                                                            | T5               |
| D6  | Screen-reader work                                                                                                            | **Decided: out of scope.** No sr-only copies, live regions, VoiceOver pass or a11y score target. What stays costs one attribute and also serves keyboard and sighted users: `alt`, `aria-label` on icon-only buttons, `aria-current` (the e2e tests use it), visible focus, keyboard operability, contrast. | T4, T5, T12, T13 |
| D7  | The README has the skill-card count turning `primary` on hover, but the card isn't an action, so that breaks the accent rule. | Default **`foreground`** on hover. Owner may override.                                                                                                                                                                                                                                                      | T8               |
| D8  | Node runtime: `engines` says 22.x, local is 24, `@types/node` is on 25.                                                       | Default **24.x** (LTS) for `engines` and `@types/node`. Use 26 only if the Vercel project settings offer it.                                                                                                                                                                                                | T0a              |
| D9  | More new projects?                                                                                                            | Each one is a single data entry, appended in order of recency.                                                                                                                                                                                                                                              | T2               |
| D10 | Rate limiting                                                                                                                 | **Decided: in code.** Honeypot + in-memory per-IP limiter on the server + cooldown after a send on the client. A Vercel WAF rule stays an optional extra.                                                                                                                                                   | T12              |
| D11 | Rotating hero word colour                                                                                                     | **Decided at Gate B1: `text-primary`**, as in the approved design. It's the current ("now") focus.                                                                                                                                                                                                          | T5               |
| D12 | Film grain                                                                                                                    | **Decided by the owner: removed.** It cost 6,000 ms of mobile TBT.                                                                                                                                                                                                                                          | T3, T5           |
| D13 | Project index colour                                                                                                          | **Decided at Gate B2: `text-primary`**, as in the approved design (`var(--acc)`). It marks the card on top.                                                                                                                                                                                                 | T10              |
| D14 | Static project index row under the deck (reference: "01 Imaginify · 02 …")                                                    | **Owner question.** Default: not built. If wanted: a progress index that highlights the card on top.                                                                                                                                                                                                        | T10              |

---

## 1. Ground rules (every task, checked at every review gate)

### 1.1 Definition of done for a task

1. `npm run check` passes (`lint`, `format:check`, `typecheck`, `test`, `build`, `test:e2e`; defined in T0c/T0d). Paste the tail of the output in the task report.
2. No hex colours in `src/components` or `src/app` (`grep -rnE "#[0-9a-fA-F]{3,8}\b" src/components src/app` is empty, except `ContactFormEmail.tsx`).
3. No new `'use client'` on a component that doesn't need it (§2.1).
4. Screenshots at 1440 and 390 for any visual task, dark and light, next to the reference. Take them with `npm run screenshots` (T0d).
   4a. Any task that adds behaviour adds its e2e case to `e2e/` in the same commit. The tasks below name the cases.
5. One commit per task, Conventional Commits message, ending with the attribution line from the session.
6. **Every commit leaves a usable page.** Legacy `@utility` rules, the fixed-header body padding and react-hot-toast stay until the task that rebuilds their consumer removes them (header T4, skills T8, projects T10, contact T12, the rest T13).

### 1.2 Things the reviewer rejects on sight

- `'use client'` on a section root when only one leaf is interactive.
- Reading `window`, `Date.now()`, `new Date()`, `Math.random()` or `matchMedia` during render. That code belongs in effects, handlers or `useSyncExternalStore`.
- `useReducedMotion()` (or any client-only value) used to change **markup**. It may only change motion values or handlers; otherwise the server and client HTML differ.
- `setState` inside `pointermove` / `scroll` handlers. Use motion values or `style.setProperty`.
- Hover styles on rows/tiles inside a card.
- `primary` on anything that isn't an action or the "now" state.
- Paragraph text in `font-mono`.
- `target="_blank"` without `rel="noopener noreferrer"`.
- Hard-coded counts or indices that the data can provide (`22 technologies`, `index={3}`, `total={6}`, `4 companies`).
- New dependencies not listed in this plan.

---

## 2. Architecture

### 2.1 Server and client boundary

`page.tsx` and every section root are **Server Components**. Interactivity lives in small client leaves that receive plain props. Client components **never import `@/lib/data`**; their server parent passes in what they need. That keeps `react-icons` and the copy out of the JS bundle.

| Server (no `'use client'`)                                                                                                                                                 | Client leaf (`'use client'`)                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `page.tsx`, `layout.tsx`, `Footer`, `Intro`, `StatusLine`, `About`, `Skills`, `Marquee`, `Experience`, `ProjectsSection`, `OffTheClock`, `Contact`, `SectionRule`, `Grain` | `Providers`, `Header` (+`MobileNav`, `ThemeToggle`), `LocalTime`, `RotatingWord`, `Contours`, `PortraitCard`, `TextRevealOnScroll`/`AnimatedWord`, `SurfaceCard`, `ExperienceRail`, `ProjectDeck`/`ProjectCard`, `ContactForm` |

- Props from a Server Component to a motion component must be serialisable. Variants with function values (e.g. `enterRise.visible`) break the build, so server components use plain-object animations or a CSS entrance (tw-animate-css `animate-in`) (Gate B1).
- Client components import from `motion/react`. Simple entrance or in-view animations inside a server component use `import * as m from 'motion/react-client'` (`<m.div whileInView …>`). You don't need a client wrapper for that. Nothing imports `framer-motion` after T0a.
- shadcn `ui/*` components are client components already. Server components can render them directly with server children (e.g. `Accordion` in `Experience`).

### 2.2 Single sources of truth (`src/lib/data.tsx`)

- `sections`: an ordered list `{ id, label, nav }` for About, Skills, Experience, Projects, Off the clock (`nav: false`, label `[Off the clock]`), Contact. `navBarLinks` is **derived**: Home + `sections.filter(s => s.nav)`. `SectionRule` takes only `id` and computes `index` / `total` from `sections`.
- `socialLinks`: LinkedIn, Instagram, GitHub (the URLs in `Intro.tsx` today). Used by both the hero and Contact.
- `experiencesData[i]`: `from: YearMonth`, `to: YearMonth | null`. The display string comes from `formatRange(from, to)` and **must reproduce today's strings exactly** (tested). Delete the `date` field so the two can't drift.
- `skillGroups` replaces `skillsData` as the public data. In T8 `skillsData` stops being exported and stays as the private icon registry. The marquee uses `skillGroups.flatMap(g => g.items)`. The header count is `"${items.length} technologies · ${groups.length} groups"`.
- `siteMeta`, `nowItems`: as in T2.

### 2.3 Styling

- Colours, type, radius and animation come **only** from tokens (`bg-card`, `text-section`, `rounded-xl`, `animate-marquee`). Tailwind's built-in neutrals (`gray-*`, `slate-*`, `white/…`) are banned in new code.
- Final `globals.css` = `@import 'tailwindcss'; @import 'tw-animate-css'; @import '../design-system/tokens.css';` plus the two utilities this plan introduces (`page-container`, `card-light`). Nothing else.
- **Section rhythm** (from the references, Gate B1). Desktop: hero `pt-22 pb-14`, About `py-34`, every later section `pt-10 pb-34`. Mobile: hero `pt-10 pb-12`, every section `pt-18 pb-0`, the last section `pb-18`. Container: `page-container` = 1200px of content + 24px gutters (16px on mobile).
- **`cn()` must know the custom font sizes.** Out of the box, tailwind-merge treats `text-section` as a colour and drops it when it sees `text-muted-foreground`. `src/lib/utils.ts`:

  ```ts
  import { clsx, type ClassValue } from 'clsx';
  import { extendTailwindMerge } from 'tailwind-merge';

  const twMerge = extendTailwindMerge({
    extend: {
      classGroups: {
        'font-size': [
          {
            text: [
              'display',
              'statement',
              'section',
              'feature',
              'reveal',
              'title',
              'lead',
              'body',
              'label',
              'caption',
            ],
          },
        ],
        shadow: [{ shadow: ['card'] }],
      },
    },
  });
  export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
  ```

  Covered by one test in `src/lib/utils.test.ts`: `cn('text-section', 'text-muted-foreground')` keeps both.

- Hover: Tailwind v4's `hover:` and `group-hover:` already apply only under `@media (hover: hover)`. Use them as they are and don't add a custom variant.
- **Hover and press are CSS. Framer is for scroll-linked, layout and presence animation.** So `lift` / `press` / `expand` in `motion.ts` go unused (removed in T13).
- Focus: one global `:focus-visible` outline from `tokens.css`. Strip `outline-none focus-visible:ring-*` / `focus-visible:border-ring` from the generated `ui/*` files so all controls share the same ring. Also strip `dark:` overrides in `ui/*` that fight the tokens (e.g. `dark:bg-input/30`). Note each such edit in the commit message.
- Theme-dependent markup is CSS-only via the `light:` / `dark:` variants in `tokens.css`. Never branch markup on `useTheme()`.

### 2.4 Active section (scroll-spy)

Delete `ActiveSectionContext`, `useSectionInView`, `useActiveSection`, `useIsMobile`, `types.ts` and the per-section threshold hacks. Replace them with one hook used only by `Header`:

```ts
// src/hooks/useActiveSection.ts
'use client';
import { useEffect, useState } from 'react';

// A section is active while it crosses the vertical middle of the viewport.
export default function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return [active, setActive] as const;
}
```

`ids` is a module-level constant (`navBarLinks.map(l => l.hash.slice(1))`) so the effect runs once. Clicking a link sets the active section straight away. `nav: false` sections aren't observed, so the pill stays on Projects while "Off the clock" is in view.

### 2.5 Time-dependent rendering (static page)

The page is statically generated, so anything computed from "now" during render is frozen at build time.

- **Tenure** ("present" role) and **© year**: computed in Server Components and passed down as strings. `page.tsx` exports `export const revalidate = 86400;` so the values are at most a day stale, and there's no hydration mismatch because the client never recomputes them.
- **Clock**: client-only through `useSyncExternalStore`. The server snapshot is `'--:--'`:

  ```tsx
  // src/components/LocalTime.tsx
  'use client';
  import { useSyncExternalStore } from 'react';
  import { CLOCK_TICK_MS } from '@/design-system/motion';
  import { formatClock } from '@/lib/time';

  const subscribe = (onChange: () => void) => {
    const id = setInterval(onChange, CLOCK_TICK_MS);
    return () => clearInterval(id);
  };

  const LocalTime = ({ timeZone }: { timeZone: string }) => {
    const time = useSyncExternalStore(
      subscribe,
      () => formatClock(new Date(), timeZone),
      () => '--:--',
    );
    return <time className='tabular-nums'>{time}</time>;
  };
  export default LocalTime;
  ```

  The snapshot is a string, so it stays equal within a minute and doesn't loop. React uses the server snapshot while hydrating, so the HTML matches. There's no `setState` in an effect either (the Next preset enables `react-hooks/set-state-in-effect`).

### 2.6 Motion and reduced motion

- `Providers` wraps everything in `<MotionConfig reducedMotion='user'>`. That turns off framer transform and layout animation (enterRise `y`, nav pill, wordSwap `y`) for reduced-motion users without any per-component code.
- CSS animations are already stopped by the `tokens.css` media block.
- Scroll-linked values (About colour, deck scale, rail fill) aren't covered by MotionConfig. Handle them in CSS where possible (`motion-reduce:` variants with `!`, see T7). Otherwise use `useReducedMotion()` **only to choose a motion value**, never markup.
- `<html className='motion-safe:scroll-smooth'>` replaces `scroll-smooth!`.

### 2.7 Security

- `sendEmail` is a public POST endpoint. T12 hardens it:
  - type-guarded validation and an email format check
  - a honeypot field
  - a per-IP rate limit (in memory) and a client cooldown after a successful send (D10)
  - env checked **before** constructing `Resend`. Today `new Resend(undefined)` throws at module load, so the "not configured" branch can never run.
  - `replyTo` instead of `reply_to`. The SDK ignores `reply_to`, so replies currently go to `noreply@`.
  - generic errors to the client, with details logged on the server.
- `next.config.js`: `poweredByHeader: false` and baseline security headers (T1).
  `shortcut: no CSP; next-themes' inline script and framer inline styles need a nonce, which forces dynamic rendering. Revisit if the site gains third-party scripts.`
- Rate limiting is in code (T12). The limiter is per server instance, so it slows a spammer down but doesn't stop a distributed one. Optional owner extra: a Vercel WAF rate-limit rule for `POST /` requests carrying the `Next-Action` header.
- External links: `rel="noopener noreferrer"` everywhere.
- **E2E never sends real email.** The Playwright web server runs with the Resend env vars set to empty strings (T0d). Next doesn't override variables that are already set, so `.env.local` can't leak in.

### 2.8 Performance budget

- Baseline recorded at Gate 0 (Next 16 no longer prints First Load JS): `/` loads 10 scripts, **840.0 kB raw / 270.3 kB gzip** (old site, `478f76f`). T13 measures the same way (sum of JS responses for `/` on the production build) and must not be bigger. Removing Aurora/ogl, react-type-animation and react-hot-toast should pay for shadcn.
- The portrait uses `next/image` with `preload` (Next 16 renamed `priority`; check against the installed version), explicit `sizes`, and no fade from `opacity: 0` (it's the likely LCP element).
- Lighthouse mobile on the production build: LCP ≤ 2.5 s, CLS ≤ 0.05. **Gate C blocker** (Gate B2: 3.9–4.1 s simulated; LCP element = the portrait `<img>` on mobile, which shares throttled bandwidth with about 172 kB of preloaded Inter and about 240 kB of JS). Levers, in order; measure after each and keep only what helps:
  1. **Font preload:** `subsets` in `next/font/google` only decides what's **preloaded** (Next docs, `node_modules/next/dist/docs/.../font.md`). Try Inter `subsets: ['latin']`. Keep it only if the built CSS still has the latin-ext `@font-face` (unicode-range including U+010D) and "Lipčák" renders in Inter (e2e: `document.fonts` has a loaded Inter face covering U+010D after load).
  2. **Portrait bytes:** check what `/_next/image` serves at Lighthouse mobile (390 CSS px, DPR 1.75). `sizes` must not over-ask, and AVIF should be enabled (`images.formats: ['image/avif', 'image/webp']`). Consider `quality` 70–75.
  3. **JS:** T12 removes react-hot-toast and makes Contact a server section with a client form; T13 removes the leftovers. Re-measure after them.
  4. Only if still over: `fetchpriority` and the preload link are present (the e2e checks this); look at what else is render-blocking in the Lighthouse trace.
- Grain: removed (D12).

### 2.9 Target tree (new and changed files only)

```
next.config.js                    headers
eslint.config.mjs                 ESLint 9, no FlatCompat
tsconfig.json                     TS 7 compatible
vitest.config.ts, playwright.config.ts, e2e/*.spec.ts, .prettierignore, .husky/pre-commit
components.json                   shadcn
src/types/global.d.ts             `declare module '*.css';`
src/lib/rateLimit.ts (+ .test.ts)
src/app/{layout,page,providers}.tsx, globals.css
src/actions/sendEmail.ts (+ .test.ts)
src/lib/{data.tsx,time.ts,time.test.ts,utils.ts,utils.test.ts}
src/utils/validation.ts (+ .test.ts)
src/hooks/useActiveSection.ts     rewritten
src/components/ui/*               shadcn generated
src/components/{Header,MobileNav,ThemeToggle,Footer,Grain,SectionRule,SurfaceCard,LocalTime}.tsx
src/components/intro/{Intro,Contours,RotatingWord,PortraitCard,StatusLine}.tsx
src/components/{About,Skills,Marquee,OffTheClock}.tsx
src/components/text-reveal/{TextRevealOnScroll,AnimatedWord}.tsx
src/components/experience/{Experience,ExperienceRail}.tsx
src/components/projects/{ProjectsSection,ProjectDeck,ProjectCard}.tsx
src/components/contact/{Contact,ContactForm,SubmitButton}.tsx
```

Files keep their current folders. Don't reorganise beyond this.

---

## 3. Review gates

| Gate                | After   | Reviewer checks                                                                                                                                                                                                   |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0: Upgrades**     | T0a–T0d | every package on latest or on a documented ceiling, TS 7 typecheck + TS 6 for tools both clean, lint/format/hooks work, the old site renders unchanged (Playwright smoke + screenshots), bundle baseline recorded |
| **A: Foundation**   | T1–T3   | tooling green, token wiring (computed styles in both themes), `cn` merge test, no theme flash, no hydration warning, old site still usable                                                                        |
| **B1: Top of page** | T4–T7   | header at 320/680/800/1440, scroll-spy, hero LCP, reduced motion, server/client split                                                                                                                             |
| **B2: Middle**      | T8–T11  | one shared `SurfaceCard` for all card hovers, tenure strings, accordion content in the HTML, deck scroll                                                                                                          |
| **C: Ship**         | T12–T13 | security of the contact flow, full QA list, bundle vs baseline, deletions                                                                                                                                         |

At each gate:

1. The implementer runs `node "$CODEX" review --wait --base main --scope branch` and attaches the result.
2. The reviewer runs `npm run check` and `npm run screenshots` themselves and compares the screenshots with `design/reference/*.jpg`.

The reviewer decides what to act on.

### 3.1 Review protocol (binding)

1. **Gates are hard stops.** Implement only the tasks named on the **Cleared to implement** line at the top of §5. Owner decision (2026-11-08): this overrides any ledger ruling, including "Gate 0 not a hard stop". Phase 0 lands and is approved before T1 starts.
2. **Asking for review:** when every cleared task is committed and its task report is written, add `READY FOR REVIEW: gate <X> @ <short sha>` under that gate in §5, then **stop editing the repo**. The reviewer starts once the working tree has been quiet for a few minutes.
3. **Findings:** the reviewer writes them in §5 as `R<gate>.<n>`, each with a severity, a `file:line` and what to do:
   - `blocker`: must be fixed before approval
   - `should-fix`: fix now unless you reply under the item with a reason the reviewer accepts
   - `nit`: optional
4. **Fixing:** fix each item in its own commit, tick it `- [x]` with the fix sha, then write a new `READY FOR REVIEW` line. Repeat until approved.
5. **Approval:**
   - The reviewer marks the gate `APPROVED <date> @ <sha>` in §5 and on its gate line in §4.
   - The reviewer appends `(approved)` to each approved task heading.
   - The reviewer rewrites the **Cleared to implement** line to name exactly the tasks allowed next and the gate to stop at.
   - Nothing outside that line is cleared.
6. **Who edits what in §5:** the implementer writes only `READY` lines, ticks and replies under items. The reviewer doesn't edit source code, only this plan.

---

## 4. Tasks

## Phase 0: upgrades and toolchain (before any redesign work)

Facts checked on 2026-11-08 that this phase depends on:

- `node_modules` doesn't match the lockfile (TS 5.9.3 installed vs 6.0.3 locked, resend 6.6.0 vs 6.12.4, framer-motion 12.38 vs 12.42).
- **TypeScript 7.0.2** is `latest`. It's the native (Go) compiler, and its package exports only `lib/version.cjs`, with no classic compiler API. Next's build and typescript-eslint `require('typescript')` for that API, and typescript-eslint 8.72.1 (latest) declares `typescript <6.1`. So TS 7 can't be the only TypeScript yet. Tested: TS 7 type-checks this repo in about 0.5 s once the tsconfig is migrated.
- **ESLint 10.14** is `latest`, but `eslint-config-next` 16.4.5 depends on `eslint-plugin-react` 7.37.5, whose peer range ends at ESLint 9.7. Lint can't run on ESLint 10 until that changes.
- **framer-motion 14** is `latest` and is the same release as `motion` 14, the package upstream now recommends (`motion/react`, `motion/react-client`).

Rule for this phase: a package goes to its `latest` unless it's on the ceiling list below. A package that a later task deletes (`ogl`, `react-type-animation`, `react-hot-toast`, `react-intersection-observer`) gets only an in-range `npm update`, no major bump. Each ceiling is written into `CLAUDE.md` → Known issues with the reason, so nobody "fixes" it later.

| Ceiling                                                                                                                                                       | Why                                          | Lift when                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `typescript` stays on **6.0.x** (compiler API for Next and typescript-eslint); TS **7** is installed alongside as `typescript-7` and runs `npm run typecheck` | the TS 7 package has no compiler API         | typescript-eslint and Next support TS 7                     |
| `eslint` / `@eslint/js` stay on **9.x**                                                                                                                       | `eslint-plugin-react` peer range ends at 9.7 | `eslint-config-next` ships a plugin that supports ESLint 10 |
| `@types/node` matches the Node major in `engines` (D8)                                                                                                        | types must describe the runtime              | Node major changes                                          |

### T0a: Upgrade dependencies (approved)

**Files:** `package.json`, `package-lock.json`, any source the upgrades force to change

- [x] **1.** `nvm use 24` (D8). Set `"engines": { "node": "24.x" }`, then `npm ci` so you start from the lockfile.
- [x] **2.** Runtime packages to latest:
  ```sh
  npm i next@latest react@latest react-dom@latest motion@latest resend@latest \
    @vercel/analytics@latest @vercel/speed-insights@latest react-icons@latest \
    @react-email/components@latest @react-email/tailwind@latest \
    tailwindcss@latest @tailwindcss/postcss@latest postcss@latest
  npm i -D @types/react@latest @types/react-dom@latest @types/node@^24
  npm uninstall framer-motion
  npm update ogl react-type-animation react-hot-toast react-intersection-observer clsx
  ```
  `postcss` loses its exact pin. `@types/*` move from `dependencies` to `devDependencies`.
- [x] **3.** framer-motion 12 → motion 14 crosses two majors. Read the 13.0 and 14.0 breaking changes (the `CHANGELOG.md` in `node_modules/motion`, or the GitHub releases) and list in the task report each API this repo uses and whether it changed. The APIs: `motion.*`, `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `useInView`/`whileInView`, `AnimatePresence`, `layoutId`, `MotionConfig`, `useReducedMotion`, `useMotionTemplate`, `useMotionValueEvent`, `Variants`, `SpringOptions`. Rewrite every import from `'framer-motion'` to `'motion/react'`, including `src/design-system/motion.ts`.
- [x] **4.** `@vercel/analytics` 1→2 and `@vercel/speed-insights` 1→2: check their READMEs for changed import paths (e.g. `@vercel/analytics/next`) and update `layout.tsx`.
- [x] **5.** Resend 6.37: confirm the send options still use `replyTo` (T12 depends on it).
- [x] **6.** `npm run build` passes and `npm run dev` renders the **current** site unchanged: hero tilt, About reveal, experience rail, project deck and contact form all work. `npm ls` shows no peer-dependency errors except the documented ceilings.
- [x] **7.** Commit `chore(deps): upgrade to latest (motion 14, next 16.4, react 19.3, node 24)`.

### T0b: TypeScript 7 (approved)

**Files:** `package.json`, `tsconfig.json`, `src/types/global.d.ts`, source where the new checks flag real errors

- [x] **1.** `npm i -D typescript@~6.0.3 typescript-7@npm:typescript@^7.0.2`. Tested: `node_modules/.bin/tsc` and `require('typescript')` both resolve to 6.0.3, and TS 7 runs from `node_modules/typescript-7/bin/tsc`. Scripts must call TS 7 by that path.
- [x] **2.** `tsconfig.json` for TS 7 (both versions accept it): `"target": "ES2022"`, `"module": "esnext"`, `"moduleResolution": "bundler"`, `"lib": ["dom", "dom.iterable", "es2022"]`. Remove `allowJs` (no JS sources). Keep `strict`, `paths`, `plugins: [{ "name": "next" }]` and the `.next/types` includes. Add `"noUncheckedIndexedAccess": true`, then fix what it flags, which is mostly the `data.tsx` index access.
- [x] **3.** TS 6+ checks side-effect imports, and Next doesn't declare `*.css`, so `import '@/app/globals.css'` errors. Add `src/types/global.d.ts`: `declare module '*.css';`.
- [x] **4.** Scripts: `"typecheck": "node node_modules/typescript-7/bin/tsc --noEmit"`. `rm -rf .next && npm run typecheck` and `npm run build` (which type-checks with TS 6) must both be clean.
- [x] **5.** VS Code: add `.vscode/settings.json` with `"typescript.tsdk": "node_modules/typescript/lib"` so the editor uses the project's TS 6 language service. (A TS 7 editor extension is optional and personal.)
- [x] **6.** Commit `chore: typescript 7 typecheck, typescript 6 for tooling`.

### T0c: Lint, format, hooks (approved)

**Files:** `eslint.config.mjs`, `package.json`, `.prettierignore`, `.husky/pre-commit`

- [x] **1.** `npm i -D eslint@^9 @eslint/js@^9 eslint-config-next@latest eslint-config-prettier@latest eslint-plugin-unused-imports@latest prettier@latest husky@latest`, then `npm uninstall @typescript-eslint/eslint-plugin @typescript-eslint/parser`. `eslint-config-next/typescript` brings typescript-eslint itself, and nothing imports either package directly any more.
- [x] **2.** Rewrite `eslint.config.mjs` as flat config without `FlatCompat` (so `@eslint/eslintrc` isn't needed):

  ```js
  import { defineConfig, globalIgnores } from 'eslint/config';
  import nextVitals from 'eslint-config-next/core-web-vitals';
  import nextTs from 'eslint-config-next/typescript';
  import prettier from 'eslint-config-prettier/flat';
  import unusedImports from 'eslint-plugin-unused-imports';

  export default defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    globalIgnores(['.next/**', 'design/**', 'playwright-report/**', 'test-results/**']),
    {
      plugins: { 'unused-imports': unusedImports },
      rules: {
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': ['warn', { allow: ['error'] }],
        eqeqeq: ['error', 'always'],
      },
    },
  ]);
  ```

  `"lint": "eslint ."`, `"lint:fix": "eslint . --fix"`. Lint covers `src`, `e2e` and the config files.

- [x] **3.** `.prettierignore`: `design/reference/`, `package-lock.json`, `.next/`, `playwright-report/`, `test-results/`. Scripts `"format": "prettier --write ."` and `"format:check": "prettier --check ."`. Run `npm run format` once and commit **that alone** (`style: prettier pass`), so later diffs stay readable.
- [x] **4.** Husky is installed but has no hook. `npx husky init` (adds `"prepare": "husky"`), then set `.husky/pre-commit` to `npm run lint && npm run format:check && npm run typecheck`. That's fast enough on this repo, and there's no lint-staged dependency.
- [x] **5.** `npm run lint` must finish with **0 errors**. Fix the existing code; don't disable rules to get there. Warnings are listed in the task report.
- [x] **6.** Commit `chore: eslint 9 flat config, prettier check, pre-commit hook`.

### T0d: Test harness (unit + e2e) and baseline (approved)

**Files:** `vitest.config.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`, `e2e/screenshots.spec.ts`, `package.json`, `.gitignore`, `CLAUDE.md`

- [x] **1.** `npm i -D vitest@latest`, `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config';
  import { fileURLToPath } from 'node:url';
  export default defineConfig({
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    test: { include: ['src/**/*.test.ts'], environment: 'node' },
  });
  ```
  Script `"test": "vitest run"`.
- [x] **2.** `npm i -D @playwright/test@latest && npx playwright install chromium`. `playwright.config.ts`:
  ```ts
  import { defineConfig, devices } from '@playwright/test';
  export default defineConfig({
    testDir: 'e2e',
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
    projects: [
      {
        name: 'desktop',
        use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      },
      { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    ],
    webServer: {
      command: 'npm run build && npm run start -- -p 3100',
      url: 'http://localhost:3100',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      // Never send real email from tests: these override .env.local.
      env: { RESEND_API_KEY: '', MY_EMAIL: '', RESEND_EMAIL_DOMAIN: '' },
    },
  });
  ```
  Add `playwright-report/` and `test-results/` to `.gitignore`.
- [x] **3.** `e2e/smoke.spec.ts` (the shared fixture other specs reuse): load `/`, fail the test on any `console.error` / `pageerror` (catches hydration mismatches), and assert `document.documentElement.scrollWidth <= window.innerWidth`.
- [x] **4.** `e2e/screenshots.spec.ts`, tagged `@screenshots` and excluded from the default run (`grepInvert`). Full-page screenshots at 1440 dark, 1440 light and 390 dark, with `reducedMotion: 'reduce'`, the clock masked, written to `test-results/screens/`. Script `"screenshots": "playwright test --grep @screenshots"`. These are what the reviewer compares with `design/reference/*.jpg`.
- [x] **5.** Scripts `"test:e2e": "playwright test"` and `"check": "npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e"`.
- [x] **6.** Run `npm run check` (green), then `npm run screenshots` of the **old** site, and write the `/` First Load JS from the build output in the task report (baseline for §2.8).
- [x] **7.** `CLAUDE.md`: change the canvas page name to "v3 — new baseline", replace the lint/tsc known issues with the ceiling list above, and add the scripts. Update the "v2" headers in `tokens.css` / `motion.ts` to v3. Commit the spec files (`src/design-system/`, `design/`, `docs/`, `CLAUDE.md`) plus the harness: `chore: vitest, playwright e2e harness, design spec`.

> **Review gate 0**: APPROVED 2026-11-08 @ `478f76f` (see §5).

### T1: Foundation (tokens, fonts, theme, shadcn, headers) (approved)

**Files:** `globals.css`, `layout.tsx`, `providers.tsx`, `next.config.js`, `components.json`, `src/lib/utils.ts` (+test), `src/components/ui/*`
**Delete:** `Aurora.tsx`, `src/app/fonts/Satoshi-*.ttf`

- [x] **1.** `npm i next-themes sonner && npm uninstall ogl`. (react-hot-toast stays until T12.)
- [x] **2.** `npx shadcn@latest init` (new-york, neutral, CSS variables), then `npx shadcn@latest add button input textarea label accordion sheet sonner`. Don't add `tooltip`; nothing in the design uses it.
- [x] **3.** `globals.css`: keep `@import 'tailwindcss'`, add `@import '../design-system/tokens.css';` right after it, and keep `@import 'tw-animate-css'` if init added it. Delete **only**:
  - the aurora rules (`@property --aurora-angle`, `aurora-rotate`, `aurora-outline`, and its use inside `submit-button` / `contact-button`)
  - the `--breakpoint-*` overrides (they're Tailwind's defaults)
  - the legacy `@layer base` border and body colour rules
  - everything shadcn generated that `tokens.css` owns: the `:root`/`.dark` colour blocks, `@custom-variant dark (&:is(.dark *))`, the `@theme inline` colour/radius block and `--radius`

  Keep every other legacy `@utility` and `.main`. Add:

  ```css
  @utility page-container {
    @apply mx-auto w-full max-w-content px-6;
  }
  ```

- [x] **4.** Replace `src/lib/utils.ts` with the §2.3 `cn` and add its test.
- [x] **5.** `layout.tsx`: use `Inter` / `JetBrains_Mono` from `next/font/google` (`subsets: ['latin','latin-ext']`, variable fonts, `display: 'swap'`), with both `.variable` classes plus `motion-safe:scroll-smooth` on `<html>` and keep `suppressHydrationWarning`. Body: `min-h-dvh flex flex-col overscroll-none` plus the existing `pt-28 sm:pt-36` (until T4). Remove Satoshi, Aurora, `auroraColors` and the gradient classes. Keep metadata, Analytics, SpeedInsights and the react-hot-toast `<Toaster>`.
- [x] **6.** `providers.tsx`:
  ```tsx
  <ThemeProvider
    attribute='data-theme'
    defaultTheme='dark'
    enableSystem={false}
    disableTransitionOnChange>
    <MotionConfig reducedMotion='user'>
      <ActiveSectionContextProvider>{children}</ActiveSectionContextProvider>
    </MotionConfig>
  </ThemeProvider>
  ```
  (The context provider is removed in T4.)
- [x] **7.** `next.config.js`:
  ```js
  const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ];
  module.exports = {
    poweredByHeader: false,
    headers: async () => [{ source: '/:path*', headers: securityHeaders }],
  };
  ```
  Add the CSP `shortcut:` comment from §2.7 above it.
- [x] **8.** Verify:
  - The build passes.
  - In dev, `/` has background `#262A30` and Inter text, and the old sections still work.
  - DevTools: computed `--shadow-card` on `:root` resolves to the shadow. `tokens.css` maps `--shadow-card` to itself in `@theme inline`; if it computes as invalid, rename the `:root` variable to `--elevation-card` and map that instead.
  - The response headers are present.
- [x] **9.** Commit `feat: tokens, fonts, theme provider, shadcn primitives, security headers`.

### T2: Data and pure helpers (TDD) (approved)

**Files:** `src/lib/data.tsx`, `src/lib/time.ts` (+test), `src/utils/validation.ts` (+test)

**Interfaces**

```ts
export type YearMonth = { year: number; month: number }; // month 1–12
export function formatTenure(from: YearMonth, to: YearMonth | null, now?: Date): string; // inclusive months
export function formatRange(from: YearMonth, to: YearMonth | null): string; // 'May 2023 - present'
export function formatClock(date: Date, timeZone: string): string; // en-GB 'HH:MM' + short zone: '14:05 CET'

export const NAME_MAX_LENGTH = 100, EMAIL_MAX_LENGTH = 150, MESSAGE_MAX_LENGTH = 750;
export const validateString = (value: unknown, maxLength: number): value is string => …; // whitespace-only is invalid
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
```

**`data.tsx` additions**

- `sections`, derived `navBarLinks`, `socialLinks`
- `experiencesData[].from/to` (no `date`); `PositionDetail` switches to `formatRange` in the same commit
- `skillGroups`, with icons from today's `skillsData` (keep `skillsData` until T8):
  - Languages: HTML5, CSS3, JavaScript, TypeScript
  - Frameworks: ReactJS, NextJS, Angular
  - Styling & motion: Tailwind, Styled Components, Framer Motion
  - State & data (`wide`): Redux, Zustand, Tanstack Query, RxJs, Zod, REST, WebSocket
  - Tooling & testing: Jest, Git, Vite, Webpack, Docker
- `siteMeta = { city: '[City]', country: 'SK', timeZone: 'Europe/Bratislava', currentRole: 'Front-End Developer @ Indra Avitech', availability: '[Availability status]' }`
- `nowItems`: Building / Learning / Reading / Listening / Last hike, all `[placeholder]` values

`projectsData` (D4): **delete Imaginify.** "Cat AI Assistant" is already first in the list (added 2026-11-08; the owner will revise its copy, so keep the text exactly as it is). Every project gets an optional `url?: string` that drives the "Live preview ↗" button. Set Cat AI Assistant's to `'https://cat.ai'` only after the owner confirms that's a public link. With Imaginify gone no description contains JSX, so descriptions become plain strings.

- [x] **1. Failing tests first.** `time.test.ts`:
  ```ts
  const now = new Date('2026-11-08T12:00:00Z');
  expect(formatTenure({ year: 2023, month: 5 }, null, now)).toBe('3 yrs 7 mos');
  expect(formatTenure({ year: 2022, month: 11 }, { year: 2023, month: 4 })).toBe('6 mos');
  expect(formatTenure({ year: 2018, month: 9 }, { year: 2022, month: 10 })).toBe('4 yrs 2 mos');
  expect(formatTenure({ year: 2017, month: 9 }, { year: 2018, month: 9 })).toBe('1 yr 1 mo');
  expect(formatTenure({ year: 2024, month: 3 }, { year: 2024, month: 3 })).toBe('1 mo');
  expect(formatTenure({ year: 2024, month: 1 }, { year: 2024, month: 12 })).toBe('1 yr');
  expect(formatClock(new Date('2026-11-08T13:05:00Z'), 'Europe/Bratislava')).toBe('14:05 CET');
  expect(formatClock(new Date('2026-07-01T13:05:00Z'), 'Europe/Bratislava')).toBe('15:05 CEST');
  // formatRange reproduces today's copy exactly
  expect(experiencesData.map((e) => formatRange(e.from, e.to))).toEqual([
    'May 2023 - present',
    'November 2022 - April 2023',
    'September 2018 - October 2022',
    'September 2017 - September 2018',
  ]);
  ```
  `validation.test.ts`: 750 chars valid, 751 invalid, `''`, `'   '`, `null` and `42` invalid; `isEmail('a@b.co')` true, `isEmail('a@b')` and `isEmail('a b@c.d')` false.
- [x] **2.** `npm test` fails. Implement. `npm test` passes and `npm run typecheck` is clean.
- [x] **3.** `formatTenure` takes the current month from `now` in UTC (one-line comment; a day's difference doesn't matter here).
- [x] **4.** Commit `feat: structured data, time and validation helpers`.

### T3: Shared building blocks (approved)

**Files:** `SectionRule.tsx`, `SurfaceCard.tsx`, `LocalTime.tsx`, `Grain.tsx`, `globals.css`

- [x] **1.** `LocalTime` exactly as in §2.5.
- [x] **2.** `SectionRule({ id })` (server): looks up `index`/`total` in `sections` and renders mono `text-caption text-muted-foreground` `01 · About ─── 01 / 06`, with the index from `String(index).padStart(2, '0')`. The line is `<m.span className='h-px flex-1 origin-left bg-border' initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: ease.out }} />` using `motion/react-client`, which lets T13 drop `react-intersection-observer`. It throws if `id` isn't in `sections`, so a typo fails the build.
- [x] **3.** `SurfaceCard` (client): the **only** card hover implementation, used by skill cards, the Now card, experience cards, gallery slots and project cards.
  ```tsx
  'use client';
  type Props = ComponentProps<'div'> & { interactive?: boolean };
  const setLight = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const SurfaceCard = ({ interactive, className, ...props }: Props) => (
    <div
      onPointerMove={interactive ? setLight : undefined}
      className={cn(
        'group/card relative rounded-xl border border-border bg-card',
        interactive &&
          'card-light transition-[translate,background-color,border-color] duration-240 ease-out-strong hover:-translate-y-[3px] hover:border-input hover:bg-surface-raised',
        className,
      )}
      {...props}
    />
  );
  ```
  `globals.css`:
  ```css
  @utility card-light {
    --card-light: color-mix(in srgb, var(--foreground) 7%, transparent);
    [data-theme='light'] & {
      --card-light: color-mix(in srgb, var(--foreground) 5%, transparent);
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      background: radial-gradient(
        420px circle at var(--mx, 50%) var(--my, 50%),
        var(--card-light),
        transparent 60%
      );
      transition: opacity 240ms var(--ease-out-strong);
    }
    @media (hover: hover) {
      &:hover::after {
        opacity: 1;
      }
    }
  }
  ```
  Children react through `group-hover/card:` (tiles → `bg-card`). Children never get their own `hover:`.
- [x] **4.** `Grain` (server): inline SVG per README, `aria-hidden`, rendered once in `layout.tsx`.
- [x] **5.** Verify: `npm run lint && npm run build && npm run start`. View Source shows `--:--`; the console shows no hydration warning.
- [x] **6.** Commit `feat: section rule, surface card, local time, grain`.

> **Review gate A**: APPROVED 2026-11-08 @ `cacf53f` (see §5).

### T4: Header, scroll-spy, theme toggle, mobile nav (approved)

**Files:** `Header.tsx`, `ThemeToggle.tsx`, `MobileNav.tsx`, `hooks/useActiveSection.ts`, `providers.tsx`, `layout.tsx`, `globals.css`, all section hooks
**Delete:** `context/activeSectionContext.tsx`, `hooks/useSectionInView.ts`, `types.ts`, `intro/hooks/useIntro.ts`. Inline what's left of `experience/hooks` and `projects/hooks` into their components.

- [x] **1.** `useActiveSection` as in §2.4. Remove the context provider and every `useSectionInView` call. Sections keep their `id`s, and Intro keeps `id='home'`.
- [x] **2.** Header per README:
  - D1 default: `sticky top-0 z-40 bg-background`, with `border-b border-transparent` turning `border-border` once scrolled. Use `useScroll` → `useMotionValueEvent`, with a boolean state that flips only at the threshold (not every frame).
  - `flex-nowrap whitespace-nowrap`.
  - Name `max-[799px]:hidden`; pill nav `max-[679px]:hidden`; active pill `<motion.span layoutId='nav-pill' transition={spring.navPill} />`.
  - Links get `aria-current={active === id ? 'true' : undefined}`.
  - Remove the `fixed-header` utility from `globals.css` and the body `pt-28 sm:pt-36` from `layout.tsx`.
- [x] **3.** `ThemeToggle` (D2): a 44px button with the constant `aria-label='Toggle theme'`. The server can't know the saved theme, so the icons are CSS-switched and the markup is the same on server and client: `<Sun className='light:hidden' /><Moon className='hidden light:block' />`.

  Colours cross-fade through the View Transitions API. It's one snapshot cross-fade on the compositor, cheaper and cleaner than transitioning `color` on every element. Keep `disableTransitionOnChange` in `Providers` so CSS transitions don't fight it.

  ```tsx
  const { resolvedTheme, setTheme } = useTheme();
  const toggle = () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next); // paint the new theme inside the transition
      setTheme(next); // persist; next-themes re-applies the same value
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return apply();
    document.startViewTransition(apply);
  };
  ```

  `globals.css`:

  ```css
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 200ms;
    animation-timing-function: var(--ease-out-strong);
  }
  .theme-icon {
    view-transition-name: theme-icon;
  }
  ::view-transition-new(theme-icon) {
    animation: theme-icon-in 200ms var(--ease-out-strong);
  }
  @keyframes theme-icon-in {
    from {
      opacity: 0;
      rotate: -90deg;
    }
  }
  ```

  The icon wrapper gets `className='theme-icon'`. Browsers without the API switch instantly, and that's fine.

- [x] **4.** `MobileNav`: shadcn `Sheet` (right side), 44px trigger with `aria-label='Open menu'`, visible below 680px. Same links; the sheet closes on link click (controlled `open`). Check that focus goes back to the trigger (the Radix default).
- [x] **5.** E2E `e2e/header.spec.ts`:
  - At 320, 375, 600, 760, 800 and 1440: header height ≤ 72px (one line), no horizontal overflow, name hidden below 800, pill nav hidden and menu button visible below 680.
  - The header is still in the viewport after scrolling to `#contact`.
  - Scroll-spy: scroll `#experience` into the middle and its link has `aria-current='true'`; click "Projects" and the active link becomes Projects.
  - Mobile: open the menu, click "Contact", the sheet closes and the URL hash is `#contact`.
  - Theme: the default is `data-theme='dark'`; click the toggle → `light`; reload → `light` at `domcontentloaded` (no flash); no console errors throughout.
  - Keyboard: Tab from the top reaches every nav link and the toggle in order; Esc closes the sheet.
- [x] **6.** Commit `feat: header, scroll-spy, theme toggle, mobile sheet`.

### T5: Hero (approved)

**Files:** `intro/Intro.tsx` (server), `Contours.tsx`, `RotatingWord.tsx`, `PortraitCard.tsx` (replaces `TiltedCard.tsx`; delete the old file), `StatusLine.tsx` (server). Remove the `contact-button` / `intro-image` utilities once unused.

- [x] **1.** `Contours` (client):
  - Copy the 8 `<path d>` from `design/reference/home-dark-1440.html` (`svg.topo`) and add `pathLength='1'` and `strokeDasharray='1'`.
  - Wrapper per README, `aria-hidden`, `pointer-events-none`.
  - Draw and breathe delays go in inline `style={{ animationDelay }}`, computed from `CONTOUR_DRAW_STAGGER` (no magic numbers).
  - Pointer drift: add one `window` `pointermove` listener (`{ passive: true }`) in `useEffect`, and only if `matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches`. It writes to `useMotionValue` → `useSpring`, clamped to ±`CONTOUR_POINTER_DRIFT_PX`.
  - The hero section gets `relative overflow-hidden`.
- [x] **2.** Left column (server):
  - Availability chip: an `animate-now-ring` dot plus `siteMeta.availability`.
  - h1 `text-display` with the existing copy.
  - Intro `text-lead text-muted-foreground`, with today's bold phrases as `font-medium text-foreground`.
  - Entrance: `<m.div variants={enterRise} initial='hidden' animate='visible'>` from `motion/react-client`.
- [x] **3.** `RotatingWord` (client):
  - Animation: `AnimatePresence mode='wait'` + `wordSwap`, `setInterval(WORD_HOLD_MS)` in an effect, caret `animate-caret`.
  - Words arrive as a prop (`['ReactJS.', 'NextJS.', 'Angular.']`), and the server render shows the first word.
  - This replaces `react-type-animation`.
- [x] **4.** CTAs:
  - Primary: `Button` `asChild` wrapping `<Link href='#contact'>`.
  - Social icon buttons come from `socialLinks`: `variant='outline'`, `size-[50px] rounded-full`, `aria-label` = the network name, `rel='noopener noreferrer'`.
- [x] **5.** `PortraitCard` (client):
  - Keep the tilt logic, with `TILT_MAX_DEG`, scale 1.02 and `spring.tilt`.
  - Drop the figcaption velocity code: it calls `setState` on every mousemove and is never rendered.
  - Use pointer events. The handler skips tilt when `e.pointerType !== 'mouse'` or reduced motion is on.
  - Image: `next/image` (`/assets/photo.jpeg`, `alt='Portrait of Marek Lipčák'`, `preload`, `sizes`).
  - The card enters with `y` only, never from `opacity: 0`.
  - Below the image: a `dl` spec panel per D5.
- [x] **6.** `StatusLine` (server) with a `<LocalTime timeZone={siteMeta.timeZone} />` leaf.
- [x] **7.** E2E `e2e/hero.spec.ts`:
  - The rotating word changes within 3 s.
  - The status-line clock matches `/^\d{2}:\d{2} CES?T$/` after load, and the server HTML (`request.get('/')`) contains `--:--`.
  - With `reducedMotion: 'reduce'`, the contour group's `getAnimations()` is empty or finished.
  - The portrait is fetched with high priority: `fetchpriority='high'` on the `img`, or a `<link rel='preload' as='image'>` for it in the head.

  Then compare `npm run screenshots` with the reference at 1440 and 390, and check Lighthouse LCP on the production build.

- [x] **8.** Commit `feat: hero with contours, portrait card, status line`.

### T6: Skills marquee (approved)

**Files:** `Marquee.tsx` (server), `page.tsx`

- [x] **1.** Two copies of `skillGroups.flatMap(g => g.items)` in one `flex w-max animate-marquee hover:[animation-play-state:paused]` strip, separators `bg-accent-decorative`, wrapper `overflow-hidden`.
- [x] **2.** No horizontal page scroll at 320px. Commit `feat: skills marquee`.

### T7: About (approved)

**Files:** `About.tsx` (server), `text-reveal/TextRevealOnScroll.tsx`, `AnimatedWord.tsx`. Remove the `about-text` utility.

- [x] **1.** `SectionRule id='about'` above a two-column layout per README. Paragraphs are passed as props (unchanged text).
- [x] **2.** `AnimatedWord`: framer can't interpolate between `var(--…)` strings (it jumps), so animate a number and let CSS mix the colours. That stays correct across theme toggles:
  ```tsx
  const mix = useTransform(scrollYProgress, [start, end], [0, 100]);
  const color = useMotionTemplate`color-mix(in srgb, var(--foreground) ${mix}%, var(--subtle-foreground))`;
  return (
    <motion.span style={{ color }} className='inline-block motion-reduce:text-foreground!'>
      …
    </motion.span>
  );
  ```
  The `!important` class beats the inline style under reduced motion, so the markup doesn't change and nothing mismatches. Drop the old opacity transform and `text-white`.
- [x] **3.** E2E `e2e/about.spec.ts`:
  - Scroll the About section halfway: the first word's computed colour equals `--foreground`, and the last word's doesn't. Check this in both themes.
  - With `reducedMotion: 'reduce'`, every word's colour equals `--foreground`.

  Commit `feat: about section`.

> **Review gate B1**: APPROVED 2026-11-08 @ `bcf18c3` after one round of changes (see §5).

### T8: Skills bento

**Files:** `Skills.tsx` (server), `src/lib/data.tsx`, `src/lib/data.test.ts`. Delete the `skills-list` / `skill-item` utilities.

`skillsData` stays as the **private** icon registry that `skillGroups` picks from (Gate A amendment). Remove its `export` and every outside import. Change `data.test.ts` to assert 22 unique skill names across the groups instead of comparing with `skillsData`.

- [x] **1.** `SectionRule id='skills'`, then a header row with the derived count.
- [x] **2.** Cards are `SurfaceCard interactive`: `flex-[1_1_300px]`, with `wide` cards `flex-[2_1_620px]`.
- [x] **3.** Tile grid per README. Icons are 22px `text-muted-foreground` with `aria-hidden` (the name is the label). Tiles get `group-hover/card:bg-card`.
- [x] **4.** Verify against the reference. Commit `feat: skills bento`.

### T9: Experience

**Files:** `experience/Experience.tsx` (server), `ExperienceRail.tsx` (client). Delete `PositionDetail.tsx` and `hooks/`.

- [x] **1.** The server computes `range = formatRange(...)` and `tenure = formatTenure(from, to)` per item. Left column: heading, derived meta (`${firstYear} → today · ${count} companies`), legend.
- [x] **2.** shadcn `Accordion type='single' collapsible defaultValue='item-0'`.
  - Each item is a `SurfaceCard interactive` with the title (`text-title`), company, date chip (current role: `border-primary text-primary`), tenure (mono caption) and a ± trigger with an `aria-label`.
  - **Descriptions must stay in the HTML when collapsed** (SEO and find-in-page). Use `hiddenUntilFound` on `AccordionContent` if the installed Radix supports it; otherwise `forceMount` + `data-[state=closed]:hidden`.
  - Animate with shadcn's own `animate-accordion-*` at 220ms, not `expand`.
- [x] **3.** `ExperienceRail` (client) wraps the list.
  - `useScroll({ target })` drives a `scaleY` per segment over `bg-border`.
  - Markers follow the README states.
  - Reduced motion: segments fully filled (choose the motion value, not markup).
- [x] **4.** E2E `e2e/experience.spec.ts`:
  - The server HTML (`request.get('/')`) contains all four descriptions.
  - The first item is open; opening the second closes the first.
  - Each card shows the tenure `/\d+ (yrs?|mos?)/`.

  Commit `feat: experience timeline`.

### T10: Projects deck

**Files:** `projects/ProjectsSection.tsx` (server, new), `ProjectDeck.tsx` (client, from `ProjectList.tsx`), `ProjectCard.tsx`. Delete the `project-card` utility.

- [x] **1.** The server section renders `SectionRule` + header and passes `projectsData` to `ProjectDeck` as a prop (the JSX descriptions serialise fine).
- [x] **2.** Keep the sticky stacking and `useTransform` scale, with the floor at `DECK_MIN_SCALE`.
  - Fix the existing bug: the per-card `top` offset sits on the inner `section`, which isn't sticky. Move it to the sticky wrapper and account for the sticky header height (D1).
  - Reduced motion: scale stays 1.
  - **Tall cards must never hide content** (added at Gate 0, reviewer + Codex). At 390 × 844 the Cat AI Assistant card is about 900–1,050px, more than the ~780px below the header. Use **height-aware sticky offsets**:
    - The sticky element is an untransformed wrapper; scale only the inner card.
    - Each wrapper sets `top: var(--sticky-top)`.
    - A `ResizeObserver` (`borderBoxSize`, so the animated scale isn't measured) plus a viewport resize listener sets `--sticky-top = min(headerHeight + index * stackGap, innerHeight - cardHeight - 16)px`. A tall card scrolls until its bottom is visible and only then pins.
    - Scaling starts only after a card reaches its sticky position.
    - No fixed card heights, no negative margins.
    - E2E (mobile project): for every card, while the next card starts covering it, the covered card's bottom edge is already inside the viewport.
- [x] **3.** Card per README:
  - `rounded-2xl`, with `shadow-card` on the front card only.
  - Index derived from position (`01 / 04`).
  - Mono outline tags.
  - Browser frame with a `[Project screenshot]` slot, `aspect-[16/10]`.
  - "Live preview ↗" only when the project has a `url`: `Button variant='outline' asChild` with `target='_blank' rel='noopener noreferrer'`.
- [x] **4.** E2E `e2e/projects.spec.ts`:
  - The page doesn't contain "Imaginify".
  - The card count equals `projectsData.length`.
  - After scrolling to the end of the deck, the first card's computed `transform` scale is < 1; with reduced motion it's 1.

  Commit `feat: project deck`.

### T11: Off the clock

**Files:** `OffTheClock.tsx` (server), `page.tsx`

- [x] **1.** `SectionRule id='off-the-clock'` and placeholders per README.
  - The Now card is a `SurfaceCard interactive` built from `nowItems`.
  - Equaliser bars are `aria-hidden`, using `animate-eq` with staggered delays.
  - 3 photo slots, each a `SurfaceCard interactive`.
- [x] **2.** Commit `feat: off-the-clock placeholder section`.

> **Review gate B2**: CHANGES REQUESTED 2026-11-08 @ `e2741c1` (see §5).

### T12: Contact (security-critical)

**Files:** `contact/Contact.tsx` (server), `ContactForm.tsx` (client), `SubmitButton.tsx`, `src/actions/sendEmail.ts` (+test), `src/lib/rateLimit.ts` (+test), `layout.tsx`, `globals.css`, `e2e/contact.spec.ts`. Delete `contact/hooks/`, `CustomToast.tsx`, and `utils/errorHandling.ts` if unused.

- [x] **1. Failing tests first.**

  `rateLimit.test.ts`:
  - 3 hits from one key are allowed and the 4th is blocked.
  - A different key is not affected.
  - After the window passes (inject `now`), the key is allowed again.

  `sendEmail.test.ts` (`vi.mock('resend')`, `vi.mock('next/headers')`, `vi.stubEnv`):
  - honeypot filled → `{ error: null }`, no send, and the limiter isn't counted
  - 4th valid submit from one IP → `'Too many messages. Please try again later.'`
  - bad email → `'Invalid email'`
  - 751-char message → `'Invalid message'`
  - `RESEND_API_KEY=''` → `'Email service not configured'` (today this **throws**)
  - success → `send` called with `replyTo: senderEmail`

- [x] **2. Rate limiter** (D10), `src/lib/rateLimit.ts`:

  ```ts
  // shortcut: in-memory and per server instance, so a distributed spammer gets more tries. Upgrade to Upstash/Vercel KV if spam gets through.
  const hits = new Map<string, number[]>();

  export const isRateLimited = (
    key: string,
    limit = 3,
    windowMs = 10 * 60_000,
    now = Date.now(),
  ) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const limited = recent.length >= limit;
    if (!limited) recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) hits.clear(); // bound memory on a long-lived instance
    return limited;
  };
  ```

  Export a `resetRateLimit()` for tests only if the tests need it.

- [x] **3. Server action:**

  ```ts
  'use server';
  type Result = { error: string | null };

  export const sendEmail = async (formData: FormData): Promise<Result> => {
    if (formData.get('website')) return { error: null }; // honeypot: bots get a silent success
    const h = await headers();
    // Vercel sets x-real-ip / x-forwarded-for itself, so clients can't spoof them there.
    const ip = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) return { error: 'Too many messages. Please try again later.' };

    const senderName = formData.get('senderName');
    const senderEmail = formData.get('senderEmail');
    const message = formData.get('message');

    if (!validateString(senderName, NAME_MAX_LENGTH)) return { error: 'Invalid name' };
    if (!validateString(senderEmail, EMAIL_MAX_LENGTH) || !isEmail(senderEmail.trim()))
      return { error: 'Invalid email' };
    if (!validateString(message, MESSAGE_MAX_LENGTH)) return { error: 'Invalid message' };

    const { RESEND_API_KEY, MY_EMAIL, RESEND_EMAIL_DOMAIN } = process.env;
    if (!RESEND_API_KEY || !MY_EMAIL || !RESEND_EMAIL_DOMAIN) {
      console.error('sendEmail: missing RESEND_API_KEY, MY_EMAIL or RESEND_EMAIL_DOMAIN');
      return { error: 'Email service not configured' };
    }

    try {
      const { error } = await new Resend(RESEND_API_KEY).emails.send({
        from: `noreply@${RESEND_EMAIL_DOMAIN}`,
        to: MY_EMAIL,
        replyTo: senderEmail.trim(),
        subject: 'New portfolio message!',
        react: createElement(ContactFormEmail, { message, senderEmail, senderName }),
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('sendEmail failed', error); // details stay in server logs
      return { error: 'Failed to send email. Please try again later.' };
    }
  };
  ```

- [x] **4. Form** (`ContactForm`, client):
  - Fields per README, with `maxLength` from the constants.
  - A live counter `{message.length} / {MESSAGE_MAX_LENGTH}`.
  - A hidden honeypot: `<input name='website' tabIndex={-1} autoComplete='off' className='hidden' />`.
  - Errors per README "No red": text + alert icon + 2px foreground border.
  - **Client cooldown** (D10): after a successful send, keep the submit button disabled for 60 s with the label "Sent" (a `cooldownUntil` state cleared by a `setTimeout` in the success branch). It isn't persisted; the server limit is the real guard.
- [x] **5. Don't lose the message on failure.** React 19 resets uncontrolled forms after an `action` completes, whatever the result, so a failed send would wipe the user's text. Use `onSubmit`:
  ```tsx
  const [pending, startTransition] = useTransition();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      const { error } = await sendEmail(new FormData(form));
      if (error) return void toast.error(error);
      toast.success('E-mail sent successfully!');
      form.reset();
      setMessage('');
    });
  };
  ```
  `SubmitButton` takes `pending` and `disabled` as props (no `useFormStatus`) and shows a spinner while pending.
- [x] **6. Toast swap, in this same commit:**
  - `toast` from `sonner`.
  - `layout.tsx` swaps react-hot-toast's `<Toaster>` for `@/components/ui/sonner`, rendered inside `Providers` so it follows the theme.
  - `npm uninstall react-hot-toast`.
  - Delete the `custom-toast`, `contact-*`, `submit-button` and `collaboration-*` utilities.
  - `ui/sonner.tsx` sets `'--border-radius': 'var(--radius)'`, but `tokens.css` defines no `--radius`. Use `var(--radius-md)` (added at Gate A).
- [x] **7. Section** (server):
  - Headline `text-statement`, with "collaboration" in `text-primary` (it's the call to action).
  - Left column: intro + `socialLinks` (`justify-between`).
  - No email address shown.
- [ ] **8. E2E** `e2e/contact.spec.ts`, `test.describe.configure({ mode: 'serial' })`. The limiter is shared server state, so the limit test goes last.
  - **Skipped by owner (2026-11-09):** no new Playwright e2e tests. Covered instead by `sendEmail.test.ts` (Vitest) and a one-off browser check: 800 chars → 750 and `750 / 750`, field errors in the page, "Email service not configured" keeps the message, the 4th send is rate-limited.
  - Typing 800 chars leaves 750 in the field, and the counter reads `750 / 750`.
  - A bad email shows "Invalid email" (fill `a@b` and remove the `type=email` constraint in the test, or check the server message through the toast).
  - A valid submit (the env is empty in e2e) → toast "Email service not configured", and **the message is still in the field**.
  - Submitting until limited → toast "Too many messages. Please try again later."
  - No console errors.
- [ ] **9. Manual test on a Vercel preview** (real env): the email arrives, and **Reply in the mail client goes to the sender** (this is broken in production today). This is the only step e2e can't cover.
- [ ] **10.** Commit `feat(contact): hardened server action, sonner toasts, form keeps input on failure`.

### T13: Footer, assembly, cleanup, QA

**Files:** `Footer.tsx` (server), `page.tsx`, `layout.tsx`, `globals.css`, `package.json`, `motion.ts`

- [x] **1.** Footer:
  - Meta row: `© {new Date().getFullYear()}` (server, safe under `revalidate`), `[City] · <LocalTime/>`, "Back to top ↑" (`href='#home'`).
  - Wordmark per README in `subtle-foreground` (D3), `aria-hidden`.
  - The footer sits at the bottom via `mt-auto`.
- [x] **2.** `page.tsx`: sections in order, with `export const revalidate = 86400`. Every section uses `page-container` and the §2.3 section rhythm (no `scroll-mt-*` needed; `html` has `scroll-pt-24`).
- [x] **3.** Remove these, checking each with `grep -rn <name> src` first:
  - Dependencies: `react-type-animation`, `react-intersection-observer`.
  - Components and hooks: `SectionHeading`, `SectionDivider`, `useIsMobile`.
  - CSS: the remaining legacy utilities, `.main`, and the `@layer base { body { @apply text-lg sm:text-xl } }` kept since T1. `globals.css` should end as in §2.3.
  - `motion.ts`: the unused `lift`, `press`, `expand`. The `--animate-rule-draw` token can stay.
- [ ] **4. E2E** `e2e/page.spec.ts`:
  - **Skipped by owner (2026-11-09):** no new Playwright e2e tests. The existing suite (header, hero, experience, projects, about, smoke) still passes.
  - Reduced motion: every element's `getAnimations()` is finished or empty.
  - Widths 320, 375, 680, 800, 1024, 1440: no horizontal overflow (contours, marquee, wordmark).
  - Response headers include the four security headers and no `x-powered-by`.
  - Each section's `SectionRule` reads `0n / 06` in order.
  - "Back to top" returns `scrollY` to 0.
- [ ] **5. QA.** All of these must hold; put the results in the PR description.
  - `npm run check` green; First Load JS ≤ the T0d baseline.
  - `npm run screenshots` side by side with `design/reference/*.jpg` at 1440 (dark, light) and 390, with every visible difference listed and either fixed or accepted by the reviewer.
  - Keyboard only: header → toggle → mobile sheet → hero CTAs → accordion → form → footer, with a visible ring everywhere and logical order.
  - Lighthouse mobile (prod): LCP ≤ 2.5 s, CLS ≤ 0.05. Grain scroll check on 4× CPU throttle (§2.8).
- [ ] **6.** Update the `CLAUDE.md` "Redesign in progress" section to say `src/design-system/` is now live. Commit `feat: footer, cleanup, QA`.

> **Review gate C** (final): status NOT STARTED (see §5). The reviewer:
>
> 1. runs `npm run check` and `npm run screenshots` on a clean checkout
> 2. compares every screenshot with `design/reference/*.jpg` and the canvas
> 3. drives the production build in a real browser end to end: scroll the whole page in both themes at 1440 and 390, use the nav, the mobile sheet, the accordion and the deck, and submit the form
> 4. runs the Codex branch review
>
> Then the PR `design/redesign-v2-tokens` → `main` opens.

---

## 5. Review log

**Cleared to implement:** **only the Gate B2 findings RB2.1–RB2.8** (RB2.9–RB2.11 are optional nits), each with its e2e/test update; one commit per finding or a few grouped `fix:` commits. Then add a new `READY FOR REVIEW: gate B2 @ <sha>` line and stop. **T12 and T13 are not cleared.**

### Gate 0: Upgrades (T0a–T0d)

Status: **APPROVED 2026-11-08 @ `478f76f`**, with follow-ups R0.1–R0.6, which must land before T1 and are checked at Gate A.

READY FOR REVIEW: gate 0 @ 478f76f

**Reviewer verified** (clean `.next`, Node 24.4.1):

- `npm run check` passes: lint has 0 errors and 0 warnings, Prettier is clean, the TS 7 typecheck is clean, `next build` (TS 6) succeeds with `/` static, and e2e smoke passes on desktop and mobile.
- `npm ls` shows no peer or missing errors.
- The lockfile contains the Linux optional binaries (`@next/swc-linux-x64-gnu`, Tailwind oxide, lightningcss, rolldown, TS 7, sharp), so a Vercel `npm ci` will work.
- `npm run screenshots` captures the full old site in all three shots.
- motion 13/14 breaking changes don't touch any API used here.
- The ceilings are documented in `CLAUDE.md`.
- The implementer's Codex P2 on the screenshot fixture was fixed in `478f76f`. Its other P2 (a long description overflowing the old mobile card) is handled by the new T10 requirement, not by patching the old card.

**Follow-ups.** These aren't blockers; they land before T1 and are checked at Gate A.

- [x] **R0.1** (ab3df70) should-fix, `vitest.config.ts:1`: Vitest warns "ESM syntax in a file loaded as CommonJS" on every run, and a future Vite major will reject it. Rename to `vitest.config.mts`. Don't add `"type": "module"`, because `next.config.js` is CommonJS.
- [x] **R0.2** (ab3df70) should-fix, `e2e/screenshots.spec.ts`: give screenshot runs `deviceScaleFactor: 1`. The mobile capture is currently 1024 × 29193 px (10 MB) at the Pixel 7 DPR. The references are 390 / 1440 px wide at 1×, so 1× captures compare directly and are 7× smaller.
- [x] **R0.3** (ab3df70) should-fix, plan §4: tick the completed `- [ ]` steps of T0a–T0d. All 26 are still unticked, and the plan is the progress record.
- [x] **R0.4** (ab3df70) nit, `package.json`: remove the unused `@eslint/js` devDependency (nothing imports it; `eslint` ships its own), and drop it from the ceiling line in `CLAUDE.md`.
- [x] **R0.5** (ab3df70) nit, `CLAUDE.md`: the intro still says "framer-motion 12" (it's now `motion` 14) and the heading says "Redesign in progress (v2)". Make the "follow in order" line point to plan §5 "Cleared to implement".
- [x] **R0.6** (7dbe25e) `src/lib/data.tsx` holds the owner-requested "Cat AI Assistant" project (draft copy, added 2026-11-08), which is still uncommitted. Commit it on its own as `content: add Cat AI Assistant project (draft copy)`, with the text unchanged.

**Plan amendments from this review:**

- T10 now requires height-aware sticky offsets, so tall cards never hide content (second opinion: Codex agreed on option (d)).
- §2.8 now records the bundle baseline and how it was measured.

### Gate A: Foundation (T1–T3)

Status: **APPROVED 2026-11-08 @ `cacf53f`**, with follow-ups RA.1–RA.4, which land before T4 and are checked at Gate B1.

READY FOR REVIEW: gate A @ cacf53f

**Reviewer verified** (clean `.next`, Node 24.4.1):

- Gate 0 follow-ups R0.1–R0.6 are done and confirmed. Vitest runs from `vitest.config.mts` without the warning, the screenshots are 1440 / 390 px wide, `@eslint/js` is gone, `CLAUDE.md` is updated, and Cat AI Assistant is committed (`7dbe25e`).
- `npm run check` passes: lint has no output, Prettier is clean, TS 7 is clean, Vitest is 13/13 across 5 files, the build succeeds, and e2e is 2/2. `npm run screenshots` gives 3/3 at 1×.
- Production build probe:
  - All four security headers are sent, and there's no `X-Powered-By`.
  - With the theme stored as `light`, `data-theme` is already `light` at DOMContentLoaded (no flash). Same for `dark`.
  - Body is `#262A30` / `#ECEDE8` in dark and `#F2F1EC` / `#1F2328` in light. `--primary` is per theme, and `--shadow-card` resolves in both themes.
  - Inter and JetBrains Mono both load; `font-mono` resolves to JetBrains Mono.
  - Grain is 0.07 overlay in dark and 0.05 multiply in light.
  - No console errors.
- The old site renders and works in dark on the new tokens (checked in the screenshots).
- Code read:
  - `cn` has its regression test.
  - The shadcn files have no `dark:` overrides and no competing focus rings.
  - The time and validation helpers match the specified tests, with `formatRange` reproducing today's strings.
  - `SectionRule` / `LocalTime` are covered by server-render tests.
  - `SurfaceCard` writes `--mx` / `--my` without re-rendering.
- The implementer's rulings 1–6 are **accepted**: `vite` as a declared devDependency, the hand-written `components.json` with our `cn`, the body type size kept until T13, render tests in place of the page check, the typed `SectionRule` id, and `data.test.ts`.
- No Codex second opinion this round. The implementer's branch review found nothing, and nothing here is a design or architecture choice that another model would weigh differently.

**Follow-ups.** These aren't blockers; they land before T4 as one commit, `chore: gate A follow-ups`.

- [x] **RA.1** (183eac0) should-fix, `src/components/ui/{input,textarea,button}.tsx`: remove `shadow-xs`. In the spec, depth comes from surface steps, and only the portrait card and the front project card get a shadow (`shadow-card`). While there, tidy what the earlier strip left behind: the empty `''` argument and trailing spaces in the class strings.
- [x] **RA.2** (183eac0) nit, `src/components/ui/button.tsx`: delete the `destructive` variant. There's no approved error colour, it uses `text-white`, and nothing should reach for it.
- [x] **RA.3** (183eac0) should-fix, `CLAUDE.md` → Known issues: record the shadcn CLI gotchas (they're only in a commit message right now). After any `shadcn add`:
  - point the `cn` import from the npm package `cn` to `@/lib/utils` and uninstall that package
  - strip `dark:` overrides, `outline-none` / `focus-visible:ring-*` and `shadow-xs` (plan §2.3)
- [x] **RA.4** (183eac0) nit, `src/lib/data.tsx`: `company: ' Global Logic'` has a leading space (pre-existing). Trim it. Whitespace isn't content, and the new layout puts the company on its own line.

**Accepted interim state (T4–T12):** from T4 the theme toggle makes light mode reachable. Sections that haven't been rebuilt yet hard-code white text, so they're unreadable in light. That's accepted on this branch: don't patch legacy sections for light. Dark (the default) must stay usable at every commit, and each section must work in both themes from the task that rebuilds it. Gate C checks the whole page in both themes.

**Plan amendments from this review:**

- T8: keep the `skillsData` icon registry but stop exporting it, instead of deleting it.
- T12: fix the sonner `--border-radius`.
- T13: remove the legacy body type size.

### Gate B1: Top of page (T4–T7)

Status: **APPROVED 2026-11-08 @ `bcf18c3`** (round 1 @ `062ff1b`: changes requested; round 2: approved), with follow-ups RB.9–RB.11, which land before T8 and are checked at Gate B2.

READY FOR REVIEW: gate B1 @ 062ff1b

READY FOR REVIEW: gate B1 @ bcf18c3

**Reviewer verified** (clean `.next`):

- `npm run check` passes: lint clean, TS 7 clean, Vitest 13/13, build ok, e2e 29 passed (11 project-specific skips). Screenshots 3/3.
- Code read for T4–T7:
  - The server/client split matches §2.1. Header takes its links as a prop.
  - No `setState` per frame (the scroll border flips at the threshold; drift and tilt use motion values).
  - The theme toggle is CSS-switched, with the View Transition cross-fade.
  - The sheet jumps to the section only after it has closed, and focus returns to the trigger.
  - Reduced-motion paths don't change markup.
  - The e2e specs cover the behaviour T4–T7 asked for.
- Gate A follow-ups RA.1–RA.4 are done and confirmed.
- **Design comparison** (`npm run screenshots` vs `design/reference/*.jpg`):
  - At 1440, dark and light, the header, hero, portrait card, contours, status line, marquee, section rule and About typography match the reference closely.
  - The differences are RB.1 and RB.4, plus several mobile layout differences (RB.2, RB.3).

**Owner and implementer decisions recorded:**

- Rulings 1–9 are accepted:
  - header height ≤ 88px
  - links passed as a prop
  - jump after the sheet closes
  - `scroll-pt-24`
  - CSS rise instead of a server-side `enterRise`
  - no fade on the hero text
  - JetBrains Mono `preload: false`
  - `motion-reduce:animate-none` on the contours
  - `socialLinks.icon`
- **D11 (ruling 10): the rotating word stays `text-primary`.** The approved design shows it olive, and "my main focus is on …" reads as the current ("now") state.
- **D12: grain removed** (owner decision, relayed by the implementer). Lighthouse mobile TBT was 6,000 ms with it and 150 ms without. Recorded in `CLAUDE.md` under rejected ideas.
- **Mobile LCP is 3.3–3.7 s simulated, against the 2.5 s budget.** It's tracked, not blocking: the legacy client sections are still on the page. Re-measure at B2 and name the LCP element. It must be ≤ 2.5 s at Gate C.

**Findings.** RB.1–RB.3 are blockers, because T8–T11 build on the container and the section rhythm.

- [x] **RB.1** (5f43576) blocker, `src/app/globals.css` `page-container`: content is 1152px wide, but the spec and the reference have **1200px of content** plus gutters. That's my plan's mistake: `max-w-content` included the padding. The reference also uses **16px gutters on mobile**. Change to `@apply mx-auto w-full max-w-[calc(var(--container-content)+3rem)] px-4 sm:px-6;`. Afterwards, header and hero content start at x = 120 at 1440, matching the reference.
- [x] **RB.2** (cd351ef) blocker, hero on mobile (`design/reference/home-mobile-390.*`). The stacked order must be **chip → h1 → portrait card → intro → CTAs → status line**; today the portrait comes after the CTAs. The desktop two-column layout stays as it is.
  - Use one set of markup, with CSS grid areas on the hero wrapper; don't duplicate markup or use JS. Where the columns stop fitting (≈ 920px, the README's stack point), the text column's children become grid items in that order. Move the CSS rise onto the text items.
  - Also below that width:
    - The `<br>` in the h1 is hidden, so it reads "Hi, my name is / Marek." like the reference.
    - The portrait image is `aspect-square`; it stays `4/5` above.
    - Hero padding is `pt-10 pb-12` (40/48px) with a 22px gap between stacked items.
    - The status line is a `grid-cols-[84px_1fr]` label/value list.
    - "Contact me" is `flex-1`.
  - Keep all three social icons. The mobile reference drops Instagram, but that's a content change nobody asked for.
- [x] **RB.3** (91e32b1) blocker, section rhythm (reference values):
  - Desktop: hero `88 / 56`, About `pt-34 pb-34`, every later section `pt-10 pb-34`.
  - Mobile: every section `pt-18 pb-0`, the last section `pb-18`, hero as in RB.2.
  - Apply it to About now. §2.3 and T13 step 2 now say this for T8–T13.
- [x] **RB.4** (96fd2f8) should-fix, the portrait spec panel (corrects D5). The reference shows values that already exist in the copy, so no placeholders are needed: `role: Frontend developer`, `years: 7`, `focus: ReactJS · NextJS · Angular`.
  - One source each: add `siteMeta.experienceYears = 7` and use it for both the intro's "7 years" and the panel.
  - Derive `focus` from the rotating words (strip the trailing dots).
  - `role` comes from the intro's "frontend developer", capitalised.
- [x] **RB.5** (0ceae35) nit: the "Contact me" icon is `ArrowRight` in the reference, not a chevron.
- [x] **RB.6** (0ceae35) nit, `AnimatedWord.tsx`: write the separator as `' '`. The literal NBSP is invisible in review, and someone will "fix" it into a normal space, which collapses inside `inline-block`.
- [x] **RB.7** (0ceae35) nit, `Contours.tsx`: give the breathe animation `[animation-fill-mode:backwards]`, so each ring doesn't snap from opacity 1 to 0.55 when its breathe starts. The reference has the same snap, so this is optional polish.
- [x] **RB.8** (0ceae35) nit, `Marquee.tsx`: `aria-label` on a plain `div` does nothing (an element without a role can't be named). Drop it.

**Round 2 @ `bcf18c3`: APPROVED 2026-11-08.**

- `npm run check` passes: Vitest 13/13, e2e 34 passed (14 project-specific skips), build ok. Screenshots 3/3.
- Design comparison:
  - Mobile 390 now matches the reference structure: chip → h1 ("Hi, my name is / Marek.") → square portrait with the right panel values → intro → wide Contact button + socials → stacked status grid, with 16px gutters and the reference section spacing.
  - Desktop 1440 content starts at x = 120, as in the reference.
  - The About paragraph is fully revealed in the screenshots only because they run with reduced motion.
- Accepted:
  - the 920px stack point for the section rhythm
  - the 420px cap on the stacked portrait (the reference uses `max-width: 420px` too)
  - the `display: contents` + `order` reorder
  - `bcf18c3`'s breakpoint fix. In Tailwind v4, `max-[N]` is `width < N`, so the hero and header ranges now meet exactly. Good catch from the Codex review.
- RB.6 isn't really done. Prettier with this repo's config **keeps** `' '` (verified), so the escape was turned into a literal character by the editing tool, not by Prettier. The same thing happened to this plan's RB.6 text. See RB.10.

**Follow-ups.** These aren't blockers; they land before T8 as one commit, `chore: gate B1 follow-ups`, and are checked at B2.

- [x] **RB.9** (fceb7d8) should-fix, About heading column: the reference is `flex: 1 1 260px; max-width: 320px`. The README says `basis-[300px]`, and the code followed the README, so the paragraph starts about 40px further right than in the reference and wraps differently. Use `flex-[1_1_260px] max-w-[320px]` in About, and correct the README "Layout → Two-column sections" line to match the reference. Experience (T9) uses the same columns.
- [x] **RB.10** (fceb7d8) nit, `AnimatedWord.tsx`: use the JSX entity `{!isLast && <>&nbsp;</>}`. It's ASCII, so no editor or tool can silently turn it into an invisible character.
- [x] **RB.11** (fceb7d8) nit, `src/design-system/README.md`: remove `aria-label="Technologies"` from the Skills marquee row (D6, RB.8).

### Gate B2: Middle (T8–T11)

Status: **CHANGES REQUESTED 2026-11-08 @ `e2741c1`**. Fix RB2.1–RB2.8 (RB2.9–RB2.11 are optional nits), then add a new `READY FOR REVIEW: gate B2 @ <sha>` line below and stop.

READY FOR REVIEW: gate B2 @ e2741c1

READY FOR REVIEW: gate B2 @ dd7c9b5

**Reviewer verified** (clean `.next`):

- `npm run check` passes: Vitest 13/13, e2e 51 passed (15 project-specific skips), build ok. Screenshots 3/3.
- Gate B1 follow-ups RB.9–RB.11 are done and confirmed.
- Code read:
  - T8–T11 follow the server/client split.
  - Experience is a server component (tenure on the server, `revalidate` in `page.tsx`). The accordion keeps every description in the HTML.
  - The deck pins live in a ref and a CSS variable, with no React state per frame. The wrapper isn't transformed; only the inner card scales.
  - The deck's tall-card e2e is real: it fails without the `min()`.
  - The Codex fix in `e2741c1` (observe `document.body`) comes with a test that was red before the fix.
- Design comparison:
  - Desktop 1440: Skills matches the reference almost exactly. Projects matches the reference card. Off the clock matches.
  - Mobile 390: Skills matches.
  - The differences are RB2.1–RB2.3.
- Second opinion (Codex, read-only, on `ProjectDeck`, `ProjectCard`, `ExperienceRail`, `Experience`): five findings. I checked all five against the code and agree; they're RB2.4–RB2.8.

**Decisions:**

- Rulings 1–10 are accepted:
  - count line hidden on mobile
  - whole header as the trigger
  - `forceMount` + hidden in `ui/accordion` (collapse is instant)
  - a rail leaf per row
  - `revalidate` moved into `page.tsx`
  - `shadow-card` on every deck card
  - the static project list not built (see D14)
  - deletions
  - a snap strip on mobile
- Ruling 5 (date format) is superseded by RB2.1. The long format only existed to keep the legacy display unchanged, and that display is gone.
- **D13: the project index `01` stays `text-primary`.** The reference colours it `var(--acc)`, so it's the approved design (same reasoning as D11). It marks the card currently on top.
- **D14 (owner question):** under the deck, the reference shows a mono index row: "01 Imaginify · 02 AIXM … · 03 … · 04 …", with the first item highlighted. The implementer read it as a placeholder for scrolling in a static render and didn't build it. **Default: not built.** If the owner wants it, it's a progress index that highlights the card currently on top.
- The mobile ± button stays, although the mobile reference has none. Without it, nothing shows that a card expands.
- **Mobile LCP got worse:** 3.9–4.1 s simulated, LCP element = the portrait `<img>` (on mobile it's the largest thing above the fold since RB.2). It's tracked and becomes a **Gate C blocker** at ≤ 2.5 s. §2.8 now lists the levers in order.

**Findings:**

- [x] **RB2.1** (e56f748) should-fix, date chip format. Both references show **short months with an em dash**: `May 2023 — present`, `Nov 2022 — Apr 2023`, `Sep 2018 — Oct 2022`, `Sep 2017 — Sep 2018`. Change `formatRange` to that format (month `'short'`, `' — '`) and update its test to those four strings. On mobile this also keeps the chip and the tenure on one row.
- [x] **RB2.2** (e56f748) should-fix, Experience heading column: the reference is `flex: 1 1 300px; max-width: 320px`. About is 260, and my RB.9 note wrongly applied that to both. Use `flex-[1_1_300px]` in Experience, and make the README's two-column line give both values: About 260, Experience 300.
- [x] **RB2.3** (e56f748) should-fix, mobile Experience starts **collapsed**. In the 390 reference every row is closed, so the section is 655px tall against 1,438px now; desktop opens the current role. Do it without a hydration mismatch:
  - Add a tiny client wrapper (`ExperienceAccordion`) that controls `value`. It starts at `'item-0'`, so the server HTML is unchanged, and in an effect sets it to `''` when `!matchMedia('(min-width: 920px)').matches`.
  - The section is far below the fold, so no visible shift.
  - Descriptions stay in the HTML (`forceMount`).
  - E2E: at 390 every row is closed after load; at 1440 the first row is open.
- [x] **RB2.4** (eecbb27) should-fix (Codex 1), `ProjectDeck.tsx:76`: `scrollY.set(window.scrollY)` doesn't notify when the value is unchanged. After a stationary resize or rotation, the cards keep their old scale until the next scroll. Force the transforms to re-run (Codex suggests `scrollY.dirty()`; check it exists in the installed `motion`, otherwise use another way that always notifies). E2E: resize while stationary, and the scales follow the new pins.
- [x] **RB2.5** (eecbb27) should-fix (Codex 2), `ExperienceRail.tsx`: `useScroll({ target })` doesn't re-measure when a row's height changes, so the fills and passed markers are stale after opening or closing an item until the next scroll. Add `trackContentSize: true` (check the option in the installed `motion`).
- [x] **RB2.6** (eecbb27) should-fix (Codex 3 + 4), reduced motion through CSS, not `useReducedMotion`. Today the rail's server HTML has `scaleY(0)` / `opacity: 0` while a reduced-motion client renders 1, which is a hydration style mismatch. And `useReducedMotion` snapshots once, so turning on reduced motion mid-session is ignored (deck and rail).
  - Drop `useReducedMotion` from `ExperienceRail` and `ProjectDeck`.
  - Rail: add `motion-reduce:transform-none!` on the fill and `motion-reduce:opacity-100!` on the passed dot.
  - Deck: add `motion-reduce:transform-none!` on the scaled card.
  - This is the same pattern as `AnimatedWord`. The existing reduced-motion e2e must still pass.
- [x] **RB2.7** (eecbb27) nit (Codex 5), `ProjectDeck.tsx` `measure()`: it reads `offsetHeight` and then writes `--sticky-top` per card, which forces a layout on every iteration. During the accordion animation that runs every frame through the body observer. Read all heights first, then write all the tops.
- [x] **RB2.8** (f677819) should-fix, known edge from the implementer: after a reload or jump that lands in Off the clock, the pill reads "Home". Observe the non-nav sections too, and map each to the nav section before it (`off-the-clock` → `projects`). Use `sections` from the data, not a hard-coded id. E2E: load `/#off-the-clock`, and the pill is Projects.
- [x] **RB2.9** (e56f748) nit: hide `2017 → today · 4 companies` below 920px (the mobile reference doesn't show it; same as ruling 1 for the skills count).
- [x] **RB2.10** (6e93a9d) nit, `nowItems`: use the reference's descriptive placeholders: `[Side project placeholder]`, `[Topic placeholder]`, `[Book placeholder]`, `[Now playing — artist · track]`, `[Trail placeholder]`. They tell the owner what to write.
- [x] **RB2.11** (eecbb27) nit, ExperienceRail: the passed-marker threshold (`v > 0`) flips the moment a row's top crosses the middle. That's fine; just add a one-line comment saying it's intended.

### Gate C: Ship (T12–T13)

Status: NOT STARTED
