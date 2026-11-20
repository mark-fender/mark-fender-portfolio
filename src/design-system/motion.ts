// Durations are seconds; CSS tokens use milliseconds.

export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
} as const;

// Keep fast/base/slow/enter in sync with --transition-duration-* in tokens.css.
export const duration = {
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  item: 0.45,
  enter: 0.7,
  reveal: 0.8,
} as const;

export const spring = {
  navPill: { type: 'spring', duration: 0.35, bounce: 0 },
  tilt: { stiffness: 100, damping: 30, mass: 2 },
} as const;

export const TILT_MAX_DEG = 8;

export const DECK_SCALE_STEP = 0.05;

export const CONTOUR_DRAW_STAGGER = 0.12;

export const RULE_DRAW_S = 1.2;

export const GLOBE_RISE_S = 1.1;
// Exponential time constants, not animation durations.
export const GLOBE_TURN_TAU_MS = 300;
export const GLOBE_ZOOM_TAU_MS = 70;
export const GLOBE_LIGHT_DELAY_MS = 350;
export const GLOBE_LIGHT_STEP_MS = 95;
export const GLOBE_LIGHT_MS = 520;

export const CLOCK_TICK_MS = 15_000;

// The bottom margin keeps entrances from finishing at the viewport edge.
export const inView = { once: true, amount: 0.3, margin: '0px 0px -8% 0px' } as const;

export const variants = {
  word: {
    hidden: { y: '105%' },
    show: { y: '0%', transition: { duration: duration.reveal, ease: ease.out } },
  },
  rise: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: duration.enter, ease: ease.out } },
  },
  item: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: duration.item, ease: ease.out } },
  },
  fromLeft: {
    hidden: { opacity: 0, x: -36 },
    show: { opacity: 1, x: 0, transition: { duration: duration.enter, ease: ease.out } },
  },
  fromRight: {
    hidden: { opacity: 0, x: 48 },
    show: { opacity: 1, x: 0, transition: { duration: duration.reveal, ease: ease.out } },
  },
} as const;

export const stagger = (each: number, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

export const delayed = <V extends { hidden: object; show: { transition: object } }>(
  v: V,
  delay: number,
) => ({ ...v, show: { ...v.show, transition: { ...v.show.transition, delay } } });
