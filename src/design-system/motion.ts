import type { Variants } from 'motion/react';

// Motion presets for the v3 redesign. Durations are seconds (Framer Motion units).
// Rule of thumb: UI feedback ≤ 0.24s, entrances ≤ 0.7s, no bounce anywhere.

export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
} as const;

export const duration = {
  press: 0.16,
  hover: 0.24,
  toggle: 0.22,
  enter: 0.7,
} as const;

export const spring = {
  // Active nav pill sliding between links (layoutId="nav-pill").
  navPill: { type: 'spring', duration: 0.35, bounce: 0 },
  // Hero portrait tilt following the pointer (useSpring on rotateX/rotateY).
  tilt: { stiffness: 100, damping: 30, mass: 2 },
} as const;

export const TILT_MAX_DEG = 8;

// Hero load: text block rises, portrait follows 80ms later.
export const enterRise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.enter, ease: ease.out, delay },
  }),
};

// Accordion body (experience cards).
export const expand: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: duration.toggle, ease: ease.out } },
  open: { height: 'auto', opacity: 1, transition: { duration: duration.toggle, ease: ease.out } },
};

// Rotating hero word: ReactJS → NextJS → Angular.
export const wordSwap: Variants = {
  initial: { opacity: 0, y: '40%', filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, ease: ease.out } },
  exit: {
    opacity: 0,
    y: '-40%',
    filter: 'blur(2px)',
    transition: { duration: 0.2, ease: ease.out },
  },
};
export const WORD_HOLD_MS = 2500;

// Card hover lift and press feedback (whileHover / whileTap).
export const lift = { y: -3, transition: { duration: duration.hover, ease: ease.out } };
export const press = { scale: 0.97, transition: { duration: duration.press, ease: ease.out } };

// Project deck: each sticky card scales from 1 to this as the next one rises over it.
export const DECK_MIN_SCALE = 0.94;

// Bento hover light: radial highlight centred on the pointer (set --mx/--my from onPointerMove), fades in on hover.
export const CARD_LIGHT_RADIUS_PX = 420;

// Contours: draw-in on load, staggered per ring; afterwards drift toward the pointer by at most this many px.
export const CONTOUR_DRAW_STAGGER = 0.12;
export const CONTOUR_POINTER_DRIFT_PX = 12;

// Hero status line and footer clock refresh interval.
export const CLOCK_TICK_MS = 15_000;

// Experience rail: scroll progress fills the neutral rail (muted-foreground), never the accent.
// The accent marker belongs to the current role only.
