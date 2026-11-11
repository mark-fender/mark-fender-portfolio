# Portfolio v4: review, design changes and code architecture

Date: 2026-11-11 · Branch base: `design/redesign-v2-tokens` (v3 implemented, Gate C pending)
Designs: canvas "Portfolio Redesign v1", page **"v4 — proposal"** (`V4Home`, `V4Untangle`, `V4Travel`).
Status: **proposal**. Section 2 records the owner's decisions from 2026-11-11; section 2.3 lists what is still open.

---

## 1. Review of what is running on localhost:3000

Checked: the running app at 1024px, the v3 canvas, `src/`, `CLAUDE.md`, `design-system/`.

### 1.1 What is good and stays

- Token system (`tokens.css`), shadcn mapping, contrast documented per token.
- Motion presets in one file, reduced-motion handled, hover gated on `(hover: hover)`.
- Server components by default; 20 client files, all small.
- `npm run check` (lint, format, typecheck, unit, build, e2e) and screenshot comparison.
- Height-aware sticky deck, scroll rail, text reveal: solid engineering.

### 1.2 What makes it read as a generic online CV

| #   | Finding                                      | Evidence                                                                                  | Fix in v4                                                                     |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Hero does not say what kind of work you do   | "Hi, my name is Marek. I am a frontend developer with 8 years…" + rotating framework name | Headline names the work; intro lists the real domains and the current project |
| 2   | Section titles are the template              | "About me / My skills / My experience / My projects"                                      | Projects, Experience, Skills, Game, Travel                                    |
| 3   | Skills take ~980px of logo tiles             | 22 tiles in 5 bento cards, equal weight for HTML5 and Docker                              | Five rows of text                                                             |
| 4   | Projects have no visuals                     | Four `[Project screenshot]` boxes; the section is 2,553px tall                            | Drawn schematic cover per project (products sit behind logins)                |
| 5   | Order buries the proof                       | Work starts at ~4,000px, after About and Skills                                           | Work is section 01, directly under the hero                                   |
| 6   | Contact copy is boilerplate                  | "Ready to bring your ideas to life? I'm here to help create amazing digital experiences." | One plain sentence                                                            |
| 7   | Tech marquee repeats the skills list         | Same 22 names, 60s loop                                                                   | Kept (owner decision); reads from the same list as Skills                     |
| 8   | The one personal section is all placeholders | `[Off the clock]`, 3 photo boxes                                                          | Left as is (TBD)                                                              |

### 1.3 Content that is stale or contradicts itself (owner must resolve)

- `siteMeta.currentRole` = "Front-End Developer @ Indra Avitech" and Experience shows "May 2023 — present". Resolved for the design: Cat AI Assistant Jul 2025 to Mar 2026, ArkMap Mar 2026 to present, Indra Avitech ends Jul 2025.
- Hero spec panel says focus "ReactJS · NextJS · Angular" ; the current stack is React, TypeScript and MobX-State-Tree.
- `metadata.description` is "Marek Lipčák's personal web developer portfolio." OG image is the raw portrait declared as 1200×630 (it is not).
- `linkedin.com/in/marek-lipčák` contains a non-ASCII character; use the percent-encoded or canonical slug.
- Typos carried in data: "shortend", "able to built", "Lead the development" (past tense: "Led").

### 1.4 Code findings

- `src/lib/data.tsx` (≈230 lines) mixes copy, navigation, scroll-spy derivation and react-icons imports. Content cannot be imported without pulling icon components; it is `.tsx` only because of that.
- Empty route folders: `app/about`, `app/contact`, `app/experience`, `app/work`, `app/writing/[slug]`, `app/projects/[slug]`, `app/api/revalidate`; `src/lib/content/` is empty. Delete or implement.
- `components/` is half flat, half grouped (`About.tsx`, `Skills.tsx`, `OffTheClock.tsx` at root; `intro/`, `projects/` in folders). No rule says where a new file goes.
- Five react-icons packs (`fa`, `si`, `bs`, `gi`, `tb`) for 25 glyphs; v4 Skills uses no logos, so `react-icons` can leave with the bento.
- `ProjectDeck` reads `document.querySelector('header')` and observes `document.body`: works, but couples a feature to global layout. v4's card grid does not need the deck.
- 12 files have uncommitted changes on the branch. Commit or stash before starting v4.

---

## 2. Design changes (decided 2026-11-11)

### 2.1 Owner decisions

| Topic                       | Decision                                                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display font                | **No.** Inter and JetBrains Mono only, as in v3                                                                                                     |
| Marquee                     | **Stays**                                                                                                                                           |
| Trail markers, signpost row | **Removed**                                                                                                                                         |
| Travel                      | One card with an interactive globe. Only the countries listed in content are highlighted. No statistics, no add-a-country UI                        |
| Copy                        | Plain language. No taglines, no metaphors in section names                                                                                          |
| Timeline                    | Indra Avitech ends Jul 2025. Cat AI Assistant (Caterpillar, through the Hotovo agency): Jul 2025 to Mar 2026. ArkMap (NetCore): Mar 2026 to present |
| Off the clock               | "Now" card keeps Reading and Listening from v3                                                                                                      |
| Footer                      | No link to "Match the curve" (owner removed it)                                                                                                     |

Section names are now Projects, Experience, Skills, Game, Travel, [Off the clock], Contact.

### 2.2 What v4 changes compared with v3

1. **Hero.** Headline and intro rewritten: "Hi, I'm Marek. I build frontends for data-heavy web apps." The background has two versions, contour lines and a small network, switched with two buttons. CSS opacity crossfade, 900ms.
2. **Projects** move up to section 01. ArkMap is a full-width card on top; the other four sit in a 2×2 grid. Each card has an inline SVG sketch of the interface, because the products are behind logins. The sticky deck is replaced by this grid.
3. **Experience** is a single bar of six blocks; block width is months in the role. Selecting a block shows that role. The About section is removed; its content moves into the hero intro.
4. **Skills** are five rows of text. The marquee stays and reads from the same list.
5. **Game.** "Untangle the network": drag nodes until no lines cross, three levels.
6. **Travel.** One card with a draggable globe.

Unchanged from v3: tokens, fonts, portrait tilt, contours, nav pill, theme toggle, section rule, contact form, footer wordmark. One token is added: `--marker-red` (`#E0705A`, light `#B4472F`) for crossed lines in the game and the closed-runway mark in a project sketch. It is not an error colour.

### 2.3 Still needed from the owner

- The real list of visited countries (the design has Slovakia and Portugal).
- Whether "Available" in the hero is still true.

---

## 3. Target architecture

### 3.1 Principles

1. **Routes compose, features own.** `app/` contains routing, metadata and section order. Nothing else.
2. **Content is data.** No JSX, no icon imports, no derived navigation in content files.
3. **Server by default.** A client boundary needs a reason written next to `'use client'`.
4. **Logic is pure and tested; views are thin.** Geometry, scoring, date maths and the globe projection live in `*.ts` with unit tests.
5. **Heavy and optional things load late.** The game and the globe are lazy islands.
6. **One way in.** Each feature exports through `index.ts`; deep imports across features fail lint.

### 3.2 Folder structure

```
src/
  app/
    layout.tsx                 fonts, providers, Header, Footer
    page.tsx                   section order only
    opengraph-image.tsx        generated OG card (replaces portrait jpeg)
    robots.ts  sitemap.ts
    globals.css
  content/                     plain typed data, importable from anywhere
    site.ts                    name, city, timeZone, availability, socials
    nav.ts                     sections + derived navLinks/spySections (moved from data.tsx)
    projects.ts                Project[] with `cover: CoverId`, `featured?: true`
    experience.ts              Role[] (YearMonth from/to, optional points and stack)
    skills.ts                  skill groups, strings only (also feeds the marquee)
    travel.ts                  visited country codes
    now.ts                     Off the clock placeholders
    content.test.ts            shape + invariants (see 3.4)
  features/
    hero/
      Hero.tsx                 server
      HeroField.tsx            client: contours/network toggle (state only)
      Contours.tsx  Network.tsx    server SVG, CSS animation
      PortraitCard.tsx         client: tilt
      Marquee.tsx              server (moved as is)
      index.ts
    projects/
      ProjectsSection.tsx  ProjectCard.tsx  FeaturedProjectCard.tsx   server
      covers/{ArkMap,CatAi,Aixm,SampleX,Pos}Cover.tsx                 server SVG
      covers/index.ts          Record<CoverId, ComponentType>
      index.ts
    experience/
      ExperienceSection.tsx    server: computes durations
      RoleTabs.tsx             client: Radix Tabs
      duration.ts  duration.test.ts   (from lib/time.ts)
      index.ts
    skills/
      SkillsSection.tsx        server
      index.ts
    untangle/
      UntangleSection.tsx      server shell: heading, copy, lazy island
      UntangleBoard.tsx        client: SVG, pointer + keyboard
      useUntangle.ts           useReducer wrapper
      untangle.reducer.ts  untangle.reducer.test.ts
      geometry.ts  geometry.test.ts      segment intersection, crossing set
      levels.ts  levels.test.ts          every level: solved = 0 crossings, start > 0
      index.ts
    travel/
      TravelSection.tsx        server: card, heading, static poster, lazy island
      Globe.tsx                client: drag, zoom, hover
      GlobePoster.tsx          server: the first frame as static SVG
      projection.ts  projection.test.ts  rotation, horizon clipping, path building
      data/world-110m.json     generated, committed
      data/countries.ts        generated: `type CountryCode = 'SK' | 'PT' | …`
      index.ts
    off-the-clock/             moved as is
    contact/                   moved as is (ContactForm, SubmitButton, action)
      actions/sendEmail.ts  sendEmail.test.ts
      email/ContactFormEmail.tsx
  components/
    layout/   Header.tsx MobileNav.tsx Footer.tsx ThemeToggle.tsx
    section/  SectionHeader.tsx (was SectionRule)
    ui/       shadcn primitives (unchanged) + tabs.tsx
    LazyIsland.tsx             mounts children when near the viewport
    SurfaceCard.tsx  HoverUnderline.tsx  LocalTime.tsx
  design-system/
    tokens.css  motion.ts  README.md
  hooks/      useActiveSection.ts  useInView.ts
  lib/        utils.ts  rateLimit.ts  validation.ts
scripts/
  build-world.mjs              topojson → compact lon/lat rings + CountryCode union
```

Delete: empty route folders listed in 1.4, `lib/content/`, `text-reveal/`, `About.tsx`, `Skills.tsx` (bento), `experience/ExperienceRail.tsx`, `experience/ExperienceAccordion.tsx`, `projects/ProjectDeck.tsx`, `intro/RotatingWord.tsx`, `intro/StatusLine.tsx`, and `react-icons` once nothing imports it (social icons move to `lucide-react` or three inline SVGs).

### 3.3 Dependency rules (enforced)

```
app  →  features, components, content, design-system
features/x  →  components, content, design-system, hooks, lib      (never features/y internals)
components  →  design-system, hooks, lib                            (never features, never content)
content     →  nothing (types only)
```

`eslint.config.mjs` addition:

```js
{
  files: ['src/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', { patterns: [
      { group: ['@/features/*/*'], message: 'Import a feature through its index.ts.' },
    ]}],
  },
},
{ files: ['src/components/**'], rules: { 'no-restricted-imports': ['error', { patterns: ['@/features/*', '@/content/*'] }] } },
{ files: ['src/content/**'],    rules: { 'no-restricted-imports': ['error', { patterns: ['react', 'react-icons/*', '@/features/*', '@/components/*'] }] } },
```

Inside a feature, files import each other relatively (`./geometry`), so the rule only bites across features.

### 3.4 Content layer

```ts
// content/projects.ts
export type CoverId = 'arkmap' | 'cat-ai' | 'aixm' | 'samplex' | 'pos';
export type Project = {
  slug: string; title: string; domain: string; client: string;
  summary: string; tags: readonly string[]; cover: CoverId; href?: string;
};
export const projects = [ … ] as const satisfies readonly Project[];
```

- `as const satisfies` everywhere: literal types kept, shape checked, no runtime schema library needed.
- `content.test.ts` asserts invariants that types cannot: stages sorted and non-overlapping, exactly one stage with `to: null`, every `cover` has a component, every nav hash has a section id, no string contains `[` when `process.env.CONTENT_STRICT` is set (run in CI before a production deploy so placeholders cannot ship).
- Derived values (tenure, years of experience, role count) are computed from content in server components. `siteMeta.experienceYears` is deleted and derived from the first stage.

### 3.5 Client boundaries

| Island                               | Why client                                                                                  | Loaded                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------- |
| `Header`, `MobileNav`, `ThemeToggle` | scroll spy, sheet, theme                                                                    | eager                         |
| `HeroField`                          | one `useState` for the toggle; both SVG layers are server-rendered children passed as props | eager, tiny                   |
| `PortraitCard`                       | pointer tilt                                                                                | eager                         |
| `LocalTime`                          | clock                                                                                       | eager                         |
| `RoleTabs`                           | Radix Tabs; panels rendered on the server and passed in                                     | eager                         |
| `UntangleBoard`                      | pointer + keyboard game                                                                     | `LazyIsland` + `next/dynamic` |
| `Globe`                              | drag, zoom, hover                                                                           | `LazyIsland` + `next/dynamic` |
| `ContactForm`                        | form state, server action                                                                   | eager                         |

Pattern for `HeroField` and `RoleTabs`: the client component receives server-rendered nodes (`contours`, `network`, `panels`) as props, so no content or SVG ships as JS.

```tsx
// components/LazyIsland.tsx  ('use client': needs IntersectionObserver)
export function LazyIsland({ children, fallback, rootMargin = '600px' }: Props) {
  const [ref, near] = useInView({ rootMargin, once: true });
  return <div ref={ref}>{near ? children : fallback}</div>;
}
// features/untangle/UntangleSection.tsx (server)
const Board = dynamic(() => import('./UntangleBoard'));
<LazyIsland fallback={<BoardPoster />}>
  <Board levels={levels} />
</LazyIsland>;
```

`BoardPoster` is the first level drawn statically (server SVG), so the section has content with JS off and no layout shift when the board mounts. Reserve height with `aspect-[100/60]`.

### 3.6 Travel globe

One card: heading, one sentence, the globe, two zoom buttons. No statistics, no lists, no editing UI.

**Which countries are highlighted** is one typed list:

```ts
// content/travel.ts
import type { CountryCode } from '@/features/travel/data/countries'; // type-only import, allowed
export const visited = ['SK', 'PT'] as const satisfies readonly CountryCode[];
```

Adding a country is adding its code. A typo (`'SVK'`) fails `npm run typecheck`.

**Data, built once.** `npm run build:world` runs `scripts/build-world.mjs` (devDependencies: `world-atlas`, `topojson-client`):

1. reads `world-atlas/countries-110m.json`;
2. writes `data/world-110m.json` as `{ code, name, rings }[]`, rings as delta-encoded lon/lat in tenths of a degree (about 58 kB raw, about 20 kB gzip; this is the format the design artboard uses);
3. writes `data/countries.ts` with the `CountryCode` union and a `countryNames` record.

Generated files are committed. 110m has no microstates (Malta, Singapore, Andorra…); switch the script to 50m if you need one, and check the size.

**Projection without a library.** `projection.ts` is about 80 lines and pure:

- `toVector(lon, lat)`: unit vector per point, computed once after load;
- `rotation(lon, lat)`: 3×3 matrix for the current view;
- `ringPath(ring, matrix, radius)`: orthographic projection, clipped at the horizon and closed along the rim with an SVG arc;
- `graticulePath(matrix, radius)`.

Tests: a ring fully on the near side returns a closed path with no arc; a ring on the far side returns `''`; a ring crossing the horizon returns exactly one arc per crossing pair; no output ever contains `NaN`. This replaces `d3-geo` (about 15 kB gzip with `topojson-client`) at the cost of owning the clipping code. If you would rather not own it, `geoOrthographic` + `geoPath` is a drop-in for `ringPath`.

**Rendering.** `Globe.tsx` keeps `lon`, `lat`, `zoom` in a ref and writes path `d` attributes directly inside `requestAnimationFrame` while dragging, so React does not re-render 177 paths per frame. If dragging is not smooth on a mid-range phone, switch the same component to a `<canvas>` with `Path2D` (hover then uses a point-in-polygon test on the nearest ring).

- Drag: pointer events with `setPointerCapture`; `touch-action: pan-y`, so a vertical swipe still scrolls the page and a horizontal one turns the globe.
- Zoom: two buttons, three steps. No wheel zoom, because it hijacks page scroll.
- Load: one turn into place (1.8 s, ease-out), skipped under reduced motion. After that the globe moves only when the visitor moves it.
- Keyboard: the globe is focusable; arrow keys turn it by 10°.
- A11y: a visually hidden sentence lists the visited countries.

**Before JS loads.** `GlobePoster` renders the first frame on the server with the same `projection.ts`, so the card is never empty and there is no layout shift. `Globe` replaces it when it mounts.

### 3.7 Untangle

```ts
// geometry.ts
export type Point = readonly [number, number];
export type Edge = readonly [number, number];
export function crossingSet(
  pos: readonly Point[],
  edges: readonly Edge[],
): { hit: ReadonlySet<number>; count: number };

// untangle.reducer.ts
type State = {
  level: number;
  pos: Point[];
  drag: number | null;
  moves: number;
  startedAt: number | null;
  solved: boolean;
  helped: boolean;
};
type Action =
  | { type: 'grab'; node: number; at: number }
  | { type: 'move'; to: Point }
  | { type: 'drop'; at: number }
  | { type: 'nudge'; node: number; by: Point; at: number }
  | { type: 'load'; level: number }
  | { type: 'solve' };
```

- Reducer is pure (time passed in through `at`), so every rule is unit-testable: clamp to board, move counting, solved detection, "helped" flag.
- `levels.test.ts`: for every level, `crossingSet(solved).count === 0` and `crossingSet(start).count > 0`. Guards against shipping an unsolvable or pre-solved level.
- View: one `<svg viewBox="0 0 100 60">`, `setPointerCapture` on grab, `getScreenCTM().inverse()` for coordinates, `touch-action: none`. Nodes are focusable; arrow keys nudge by 2 units. Crossing count in an `aria-live="polite"` region.
- No animation library in the board. `motion` is not imported in this chunk.

### 3.8 Design-system changes

- Fonts unchanged: Inter and JetBrains Mono.
- `tokens.css`: add `--marker-red: #e0705a` (light `#b4472f`) and map it as `--color-marker-red`. README rule: "marks a problem inside an illustration or the game (crossed lines). Never text, never a form error."
- `README.md`: add two motion rows (hero background crossfade 900ms, globe load turn 1.8s, both `ease.out`) and the Experience bar pattern (selected block = `surface-raised` + `muted-foreground` border; the current role carries the olive "now" dot).
- `SectionHeader` takes `index`, `label`, `total`.

### 3.9 State, routing, SEO

- No global store. State is local to islands; theme is `next-themes`; the only cross-island state is the active nav section (existing hook).
- Single page stays.
- `metadata.description`: one sentence from the hero lead. `opengraph-image.tsx`: name, headline and contour lines via `next/og`. Add JSON-LD `Person` in `layout.tsx`.

### 3.10 Testing and budgets

| Layer  | Tool                                      | Covers                                                                                                                                                                                             |
| ------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit   | Vitest                                    | `geometry`, reducer, `levels`, `projection`, `duration`, `content` invariants, `sendEmail`, `rateLimit`                                                                                            |
| E2E    | Playwright                                | nav links scroll to sections; role tabs by keyboard; Untangle solvable by keyboard on level 1; globe turns with arrow keys and highlights the countries from content; contact happy path + failure |
| A11y   | `@axe-core/playwright` in `smoke.spec.ts` | zero serious violations, dark and light                                                                                                                                                            |
| Visual | existing `@screenshots`                   | new references from the v4 artboards                                                                                                                                                               |

Budgets (fail the PR if exceeded, measured on the production build): first-load JS for `/` not above the v3 baseline (record it before phase 1); LCP ≤ 2.0 s on a mid-range phone profile; CLS < 0.02; no long task > 200 ms on load. The game and globe chunks must not appear in the initial network waterfall.

---

## 4. Implementation phases

Each phase is one PR-sized commit set, ends with `npm run check`, and leaves the site shippable.

| Phase | Scope                                                                                                                                                                                              | Done when                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 0     | **Content.** Add the Hotovo/Caterpillar and NetCore roles, set the Indra Avitech end date to Jul 2025, fix the LinkedIn URL and typos                                                              | No stale facts; `[brackets]` only in Off the clock                           |
| 1     | **Restructure, zero visual change.** Split `data.tsx` into `content/`, move files to `features/` and `components/{layout,section}`, add `index.ts` files and lint boundaries, delete empty folders | Screenshots identical to before the phase; lint rules active                 |
| 2     | Hero: new copy, `HeroField` with the network layer, remove rotating word                                                                                                                           | Hero e2e updated; LCP measured against baseline                              |
| 3     | Projects: featured ArkMap card, 2×2 grid, five cover components; remove deck                                                                                                                       | Projects e2e updated; no `[Project screenshot]` left                         |
| 4     | Experience bar (Radix Tabs), remove rail/accordion and About; Skills rows, remove bento and `react-icons`; marquee reads `content/skills.ts`                                                       | Keyboard e2e for tabs; bundle shrinks                                        |
| 5     | Untangle: geometry, reducer, levels with tests first; then board, lazy island, poster                                                                                                              | Level tests green; keyboard e2e solves level 1                               |
| 6     | Travel: `build-world` script, `projection.ts` with tests, poster, `Globe`                                                                                                                          | Card shows the poster with JS disabled; adding a code highlights the country |
| 7     | Contact copy, OG image, JSON-LD, description                                                                                                                                                       | Share preview checked                                                        |

Phase 1 goes first on purpose: moving files and changing design in the same commits makes both hard to review.

## 5. Open questions for the owner

See 2.3.
