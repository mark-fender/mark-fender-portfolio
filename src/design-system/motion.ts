// Motion presets. Durations are seconds (Framer Motion units).
// Rule of thumb: UI feedback ≤ 0.24s, entrances ≤ 0.7s, no bounce anywhere.

export const ease = {
  out: [0.23, 1, 0.32, 1],
} as const;

export const spring = {
  navPill: { type: 'spring', duration: 0.35, bounce: 0 },
  tilt: { stiffness: 100, damping: 30, mass: 2 },
} as const;

export const TILT_MAX_DEG = 8;

export const DECK_SCALE_STEP = 0.05;

export const CONTOUR_DRAW_STAGGER = 0.12;

// Travel globe: the view follows its target exponentially (fast, then settling, no overshoot).
// These are time constants, not durations: the 80° turn on load is within a pixel of rest after about 1.8s.
export const GLOBE_TURN_TAU_MS = 300;
export const GLOBE_ZOOM_TAU_MS = 70;

export const CLOCK_TICK_MS = 15_000;
