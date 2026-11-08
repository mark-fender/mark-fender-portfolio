# Design system — portfolio v2

Source of truth for the redesign. Designs: canvas page "v3 — new baseline" (v2 kept as "v2 — saved"), Figma file "Portfolio Redesign v2" (still shows v2).
Content stays as in `src/lib/data.tsx`; anything in `[brackets]` in the designs is a placeholder.

| File                                                               | What it is                                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `tokens.css`                                                       | Colour, type, radius, layout and motion tokens for Tailwind v4 + shadcn/ui                 |
| `motion.ts`                                                        | Framer Motion easings, durations, springs and variants                                     |
| `../../design/reference/`                                          | Static renders of v3 (dark 1440, light 1440, mobile 390) as HTML + JPG — the visual target |
| `../../docs/superpowers/plans/2026-11-08-portfolio-redesign-v3.md` | Step-by-step implementation plan                                                           |

## Stack

- **Tailwind v4** (already installed) with `tokens.css`.
- **shadcn/ui** (Radix + Tailwind) for primitives. It reads the semantic variables in `tokens.css` as-is.
  Components to add: `button`, `input`, `textarea`, `label`, `accordion`, `sheet` (mobile menu), `sonner` (replaces react-hot-toast), `tooltip`.
- **motion** (installed, imported from `motion/react`) with `motion.ts`.
- **next-themes** for the theme toggle: `attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem={false}`.
- **Fonts** via `next/font/google`: Inter (400/500/600) as `--font-inter`, JetBrains Mono (400/500) as `--font-jetbrains-mono`. Replaces Satoshi.
- **Icons**: tech logos from `react-icons` (`si`, `fa`, as today), drawn in `currentColor`, never brand colours. UI icons: `lucide-react` (comes with shadcn), 1.75 stroke.
- Remove: `Aurora.tsx` / `ogl`, `react-type-animation` (replaced by `wordSwap`), the `aurora-*` utilities in `globals.css`.

## Setup

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '../design-system/tokens.css';
```

```tsx
// src/app/layout.tsx
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-jetbrains-mono' });
<html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
```

`latin-ext` is required for "č".

## Colour

Dark is the default and the preferred theme. Light swaps the same names.

| Token (Tailwind class)                   | Dark                          | Light                         | Use                                                       |
| ---------------------------------------- | ----------------------------- | ----------------------------- | --------------------------------------------------------- |
| `background`                             | `#262A30`                     | `#F2F1EC`                     | Page                                                      |
| `card`                                   | `#2E333A`                     | `#FBFAF6`                     | Cards, form panel, nav pill track                         |
| `surface-raised` / `muted` / `secondary` | `#373D45`                     | `#E8E7E0`                     | Tiles inside cards, chips, active nav pill, card hover    |
| `foreground`                             | `#ECEDE8`                     | `#1F2328`                     | Headings, body                                            |
| `muted-foreground`                       | `#A7ADB5`                     | `#555B63`                     | Secondary text, labels, dates, scroll-progress rail       |
| `subtle-foreground`                      | `#5A616C`                     | `#BEC1BC`                     | Decorative only: unrevealed About text, footer wordmark   |
| `primary`                                | `#A3AE6A`                     | `#5F683A`                     | Actions and the "now" state (see rule)                    |
| `primary-foreground`                     | `#1E2126`                     | `#F2F1EC`                     | Label on `primary`                                        |
| `accent-decorative`                      | `#8A9652`                     | `#8A9652`                     | Marquee separators only                                   |
| `border`                                 | `#3E444D`                     | `#DAD9D0`                     | Dividers, card outlines (decorative)                      |
| `input`                                  | `#7B8390`                     | `#7E8689`                     | Form fields, outline buttons: meets 3:1 non-text contrast |
| `ring`                                   | `#A3AE6A`                     | `#5F683A`                     | Focus: 2px outline, 2–3px offset                          |
| `syntax-keyword / string / number`       | `#88A9B5 / #A3AE6A / #D6C08E` | `#3F6B7A / #5F683A / #8A6A2A` | Hero spec panel keys and values                           |

**Accent rule.** Olive means one of two things: _you can act here_ (primary button, link, focus ring) or _this is happening now_ (current role marker and date chip, availability pulse, active nav pill). It never decorates; section index numbers are `muted-foreground`. If something is olive and neither is true, it's a bug.

**Contrast (dark).** foreground 12.3:1 · muted-foreground 6.4:1 · primary text 6.1:1 · label on primary 6.8:1 · input edge 3.3:1.
`border` and `subtle-foreground` fail text contrast on purpose; never put content that must be read in them.

**No red.** There's no approved error colour. Errors show as foreground text, an alert icon and a 2px foreground border.

## Typography

Inter carries everything people read; JetBrains Mono is the developer voice for section indices, dates, counts, chips and the spec panel. Never set paragraphs in mono.

| Class                    | Size      | Line height | Tracking | Weight | Used for                                                         |
| ------------------------ | --------- | ----------- | -------- | ------ | ---------------------------------------------------------------- |
| `text-display`           | 52 → 96px | 0.98        | −4.5%    | 600    | Hero name                                                        |
| `text-statement`         | 44 → 84px | 1           | −4.5%    | 600    | Contact headline                                                 |
| `text-section`           | 36 → 52px | 1.05        | −3.5%    | 600    | Section h2                                                       |
| `text-feature`           | 32 → 44px | 1.05        | −3.5%    | 600    | Project title                                                    |
| `text-reveal`            | 24 → 32px | 1.42        | −1.5%    | 500    | About paragraphs                                                 |
| `text-title`             | 21px      | 1.25        | −1.5%    | 600    | Role title, card heading (18px variant: `text-lg font-semibold`) |
| `text-lead`              | 18 → 21px | 1.6         | —        | 400    | Hero intro, contact intro                                        |
| `text-body`              | 16px      | 1.7         | —        | 400    | Descriptions                                                     |
| `font-mono text-label`   | 13px      | 1.5         | —        | 400    | `01 / About`, chips, counts                                      |
| `font-mono text-caption` | 12px      | 1.5         | —        | 400    | Dates (`tabular-nums`), captions                                 |

Inline emphasis in the hero intro: `font-medium text-foreground` inside `text-muted-foreground`.

## Layout

- Container: `max-w-content mx-auto px-6` (1200px + 24px gutters).
- Section rhythm: `py-34` (136px) between sections; section header block `mb-10`.
- Two-column sections (About, Experience): heading column `max-w-[320px]` with `flex-[1_1_260px]` (About) / `flex-[1_1_300px]` (Experience), content `flex-[999_1_560px]`, `gap-14`. They stack below ~920px.
- Bento: `flex flex-wrap gap-4`; cards `flex-[1_1_300px]`, wide card `flex-[2_1_620px]`. Tiles: `grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2`.
- Footer sits at the very bottom: the page wrapper is `min-h-dvh flex flex-col`, footer `mt-auto`. Footer meta row: © year · `[City] · HH:MM CET` (same clock as the hero) · Back to top. The wordmark wrapper is `h-[0.78em] overflow-hidden leading-none`, which crops the bottom ~12% of the capitals (descenders go entirely) and stays readable.

## Radius & elevation

`rounded-md` (12) fields · `rounded-xl` (20) cards and tiles' parent · `rounded-xl`/`rounded-lg` tiles (12) · `rounded-2xl` (24) project and form cards · `rounded-full` buttons, chips, nav.
Depth comes from surface steps (background → card → surface-raised). `shadow-card` only on the hero portrait card and the front project card.

## Components

| Component             | Base                                | Notes / states                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                | custom + `motion`                   | One line at every width, never wraps (`flex-nowrap whitespace-nowrap`). Left: `ML` initials tile + name; the name hides below 800px (`max-[800px]:hidden`), leaving the initials. Right: pill nav track (`bg-card border`), active pill `bg-surface-raised` animated with `layoutId="nav-pill"` + `spring.navPill`, then the theme toggle (sun/moon, 44px). Below 680px the pill nav hides and a 44px menu button opens shadcn `Sheet`.                                                                          |
| Button primary        | shadcn `button`                     | `rounded-full h-[50px] px-6 bg-primary text-primary-foreground`; press `scale(.97)`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Button icon / outline | shadcn `button` variant outline     | `size-[50px] rounded-full border-input`; hover border `muted-foreground`.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Availability chip     | custom                              | Mono caption, pulsing `primary` dot. Placeholder text.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Portrait card         | existing `TiltedCard`               | Card padding 10, image `rounded-lg`, spec panel `dl` beneath (keys `text-syntax-keyword`, number `text-syntax-number`). Tilt ±8°, `spring.tilt`, scale 1.02.                                                                                                                                                                                                                                                                                                                                                     |
| Contour lines         | inline SVG                          | 8 paths with `pathLength="1"`, stroke `border`. On load each path draws in (`animate-contour-draw`, 0.12s stagger), then breathes (`animate-contour-breathe`, −1.5s stagger); the group sways (`animate-contour-sway`) and drifts up to 12px toward the pointer (spring). Wrapper `absolute inset-y-0 -right-[260px] flex items-center` so the rings sit vertically centred between the header and the marquee line. `aria-hidden`.                                                                              |
| Hero status line      | custom                              | Mono `text-caption` row under the hero: Local time (live, `Intl.DateTimeFormat`, refresh 15s; time zone Europe/Bratislava until confirmed), Based in `[City], SK`, Currently `Front-End Developer @ Indra Avitech`. Labels `muted-foreground`, values `foreground`, `tabular-nums`.                                                                                                                                                                                                                              |
| Section header        | custom                              | Full-width rule above every section: `01 · About ——— 01 / 06` in mono `text-caption muted-foreground`; the line is `border` and draws in once (`animate-rule-draw`) when the section enters view. Sits above both columns in two-column sections.                                                                                                                                                                                                                                                                |
| Skills marquee        | custom                              | `animate-marquee`, duplicated list, pauses on hover.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| About reveal          | existing `TextRevealOnScroll`       | Words go `subtle-foreground` → `muted-foreground` → `foreground` as they pass the viewport middle.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Skill bento card      | custom                              | Header: `text-lg` name + mono count. Hover is on the card only: lift 3px, `border-input`, background `surface-raised`, tiles to `card`, count to `primary`, plus a soft radial light (foreground at 7% dark / 5% light, 420px) that follows the pointer. Tech rows inside have no hover of their own. Same card hover for the "Now" card, experience cards, gallery slots and the front project card.                                                                                                            |
| Experience item       | shadcn `accordion`                  | Card with title, company, mono date chip, ± button. Rail: per-item segment from marker to the next marker only (none after the last). Each card shows the role length computed from its dates (`3 yrs 7 mos`, mono `text-caption`, right of the date chip; "present" counts to the current month). Markers: current = `primary` + `animate-now-ring`; passed = `muted-foreground` fill; upcoming = hollow `input` edge. Rail fills with `muted-foreground` on scroll. Legend "● Current role" under the heading. |
| Project deck          | existing sticky cards               | Front card `shadow-card`; cards behind scale to `DECK_MIN_SCALE`. Browser-frame screenshot slot. Tags as mono outline chips.                                                                                                                                                                                                                                                                                                                                                                                     |
| New section (05)      | custom                              | Working title `[Off the clock]`. "Now" card (Building / Learning / Reading / Listening / Last hike) + 3 photo slots. Listening shows a 3-bar equaliser (`animate-eq`, staggered −0.4s) before `[Now playing]` — later a Spotify now-playing feed. All copy placeholder.                                                                                                                                                                                                                                          |
| Contact form          | shadcn `input`, `textarea`, `label` | Fields `h-[50px] rounded-md bg-background border-input`; focus `ring`. Social list left column bottom-aligned with the form (`justify-between`). No email shown.                                                                                                                                                                                                                                                                                                                                                 |
| Toast                 | shadcn `sonner`                     | `bg-popover`, mono caption for status.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Motion

Presets live in `motion.ts`. Under `prefers-reduced-motion`, `tokens.css` stops all CSS animation; in Framer Motion use `useReducedMotion()` to drop `y`/`scale`/tilt and show the About text fully revealed.

| Element             | Trigger        | Motion                                          | Timing           |
| ------------------- | -------------- | ----------------------------------------------- | ---------------- |
| Contours            | load           | draw in per ring, 0.12s stagger                 | 2.8s `ease.out`  |
| Section rule        | in view (once) | line scales in from left                        | 1.2s `ease.out`  |
| Hero text, portrait | load           | `enterRise`, portrait delay 0.08                | 0.7s `ease.out`  |
| Portrait            | pointer        | tilt follows pointer                            | `spring.tilt`    |
| Rotating word       | loop           | `wordSwap` + blinking caret                     | hold 2.5s        |
| Contours            | ambient        | sway + staggered breathe                        | 46s / 12s        |
| Marquee             | ambient        | linear strip, pause on hover                    | 60s              |
| About text          | scroll         | dim → full colour                               | scroll-linked    |
| Experience rail     | scroll         | neutral fill grows; markers fill when passed    | scroll-linked    |
| Experience card     | click          | `expand`                                        | 0.22s            |
| Project deck        | scroll         | front card scales to 0.94                       | scroll-linked    |
| Nav pill            | section change | shared layout                                   | `spring.navPill` |
| Cards / buttons     | hover / press  | `lift` / `press`                                | 0.24s / 0.16s    |
| Theme toggle        | click          | icon rotate 90° + crossfade; colours transition | 0.2s             |

Hover effects only under `@media (hover: hover) and (pointer: fine)`.
