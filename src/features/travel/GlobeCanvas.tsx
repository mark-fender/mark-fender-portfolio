'use client';
import { useEffect, useRef } from 'react';
import {
  GLOBE_LIGHT_DELAY_MS,
  GLOBE_LIGHT_MS,
  GLOBE_LIGHT_STEP_MS,
  GLOBE_TURN_TAU_MS,
  GLOBE_ZOOM_TAU_MS,
} from '@/design-system/motion';
import type { CountryCode } from './data/countries';
import type { Locale } from '@/lib/i18n';
import { clamp } from '@/lib/utils';
import { placeName } from './names';
import {
  GLOBE_FILL,
  graticule,
  HOME,
  rotation,
  toVectors,
  traceLine,
  traceRing,
  type View,
} from './projection';
import world from './data/world.json';

export type Place = { name: string; visited: boolean };
type Props = {
  visited: readonly CountryCode[];
  locale: Locale;
  label: string;
  zoom: number;
  play: boolean;
  zoomRange: readonly [number, number];
  onHover: (place: Place | null) => void;
  // A pinch changed the zoom; the buttons need to know.
  onZoom: (zoom: number) => void;
};

const countries = (Object.entries(world.countries) as [CountryCode, number[][]][]).map(
  ([code, rings]) => ({ code, rings: rings.map((ring) => toVectors(ring, world.scale)) }),
);
const borders = world.borders.map((border) => toVectors(border, world.scale));
const grid = graticule();

// A country's rough middle longitude: the direction of the sum of its points.
const middleLon = (rings: Float32Array[]) => {
  let x = 0;
  let y = 0;
  for (const ring of rings)
    for (let i = 0; i < ring.length; i += 3) {
      x += ring[i]!;
      y += ring[i + 1]!;
    }
  return Math.atan2(y, x);
};
const easeOut = (t: number) => 1 - (1 - t) ** 3;

// On load the globe turns into place from this far west of home.
const INTRO_TURN_DEG = 80;
const MAX_LAT = 75;
const KEY_STEP_DEG = 10;
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-KEY_STEP_DEG, 0],
  ArrowRight: [KEY_STEP_DEG, 0],
  ArrowUp: [0, KEY_STEP_DEG],
  ArrowDown: [0, -KEY_STEP_DEG],
};
// A press that moves less than this is a tap, not a drag.
const TAP_SLOP_PX = 4;
// A release this long after the last move is a stop, not a throw.
const THROW_WINDOW_MS = 80;
// Phones report up to 3; the globe has no detail that needs more than 2.
const MAX_PIXEL_RATIO = 2;

const clampLat = (lat: number) => clamp(lat, -MAX_LAT, MAX_LAT);

const createGlobe = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  visited: ReadonlySet<CountryCode>,
  locale: Locale,
  {
    zoomRange: [minZoom, maxZoom],
    onHover,
    onZoom,
  }: Pick<Props, 'zoomRange' | 'onHover' | 'onZoom'>,
) => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // `at` is what is drawn; it follows `to`. Drag moves both, everything else moves only `to`.
  const at = { ...HOME, zoom: 1, lon: still ? HOME.lon : HOME.lon - INTRO_TURN_DEG };
  const to = { ...at };
  let turned = still;
  // Light visited countries west to east; infinities represent not started / already lit.
  const order = new Map(
    countries
      .filter(({ code }) => visited.has(code))
      .sort((a, b) => middleLon(a.rings) - middleLon(b.rings))
      .map(({ code }, i) => [code, i]),
  );
  let litAt = still ? -Infinity : Infinity;
  const lighting = (now: number) =>
    Number.isFinite(litAt) && now < litAt + (order.size - 1) * GLOBE_LIGHT_STEP_MS + GLOBE_LIGHT_MS;
  const light = (code: CountryCode, now: number) =>
    easeOut(clamp((now - litAt - order.get(code)! * GLOBE_LIGHT_STEP_MS) / GLOBE_LIGHT_MS, 0, 1));
  let hover: CountryCode | null = null;
  // Where the mouse rests on the canvas, so the hover can follow the map when it turns under it.
  let mouse: { x: number; y: number } | null = null;
  let drag: {
    x: number;
    y: number;
    time: number;
    vLon: number;
    vLat: number;
    moved: boolean;
  } | null = null;
  let frameId = 0;
  let lastFrame = 0;
  let pixelRatio = 1;
  let colors = { sphere: '', line: '', land: '', hover: '', visited: '' };

  const view = (): View => {
    const half = canvas.width / 2;
    return { m: rotation(at.lon, at.lat), cx: half, cy: half, r: half * GLOBE_FILL * at.zoom };
  };
  const traceCountry = (path: Path2D, rings: Float32Array[], v: View) => {
    let seen = false;
    for (const ring of rings) seen = traceRing(path, ring, v) || seen;
    return seen;
  };

  const draw = () => {
    const v = view();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(v.cx, v.cy, v.r, 0, Math.PI * 2);
    ctx.fillStyle = colors.sphere;
    ctx.fill();

    ctx.beginPath();
    for (const gridLine of grid) traceLine(ctx, gridLine, v);
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 0.6 * pixelRatio;
    ctx.stroke();

    // One path per colour: neighbours in the same fill then leave no antialiasing seams.
    const now = performance.now();
    const land = new Path2D();
    const hovered = new Path2D();
    const been = new Path2D();
    const rising: { path: Path2D; alpha: number }[] = [];
    for (const { code, rings } of countries) {
      const lit = visited.has(code) ? light(code, now) : 0;
      if (lit === 1) traceCountry(been, rings, v);
      else traceCountry(code === hover ? hovered : land, rings, v);
      if (lit > 0 && lit < 1) {
        const path = new Path2D();
        if (traceCountry(path, rings, v)) rising.push({ path, alpha: lit });
      }
    }
    ctx.fillStyle = colors.land;
    ctx.fill(land, 'evenodd');
    ctx.fillStyle = colors.hover;
    ctx.fill(hovered, 'evenodd');
    ctx.fillStyle = colors.visited;
    ctx.fill(been, 'evenodd');
    for (const { path, alpha } of rising) {
      ctx.globalAlpha = alpha;
      ctx.fill(path, 'evenodd');
    }
    ctx.globalAlpha = 1;

    ctx.beginPath();
    for (const border of borders) traceLine(ctx, border, v);
    ctx.strokeStyle = colors.sphere;
    ctx.lineJoin = 'round';
    ctx.lineWidth = pixelRatio;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(v.cx, v.cy, v.r, 0, Math.PI * 2);
    ctx.strokeStyle = colors.line;
    ctx.stroke();
  };

  // Exponential follow: quick at first, then settling, never overshooting. It is the same motion
  // for the load turn, a throw, an arrow key and a zoom step, and any of them can interrupt another.
  const frame = (now: number) => {
    const dt = Math.min(now - lastFrame, 50);
    lastFrame = now;
    const turn = still ? 1 : 1 - Math.exp(-dt / GLOBE_TURN_TAU_MS);
    const zoom = still ? 1 : 1 - Math.exp(-dt / GLOBE_ZOOM_TAU_MS);
    at.lon += (to.lon - at.lon) * turn;
    at.lat += (to.lat - at.lat) * turn;
    at.zoom += (to.zoom - at.zoom) * zoom;
    const moving =
      lighting(now) ||
      Math.abs(to.lon - at.lon) > 0.02 ||
      Math.abs(to.lat - at.lat) > 0.02 ||
      Math.abs(to.zoom - at.zoom) > 0.002;
    if (!moving) Object.assign(at, to);
    if (mouse && !drag) pick(mouse);
    draw();
    frameId = moving ? requestAnimationFrame(frame) : 0;
  };
  // Draws on the next frame, and keeps drawing only while something is moving.
  const invalidate = () => {
    if (frameId) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  };

  const setHover = (code: CountryCode | null) => {
    if (code === hover) return;
    hover = code;
    onHover(code && { name: placeName(code, locale), visited: visited.has(code) });
    invalidate();
  };
  // Takes a point in CSS pixels from the canvas corner (a pointer event's offsetX/offsetY).
  function pick({ x, y }: { x: number; y: number }) {
    const scale = canvas.width / canvas.clientWidth;
    const v = view();
    const hit = countries.find(({ rings }) => {
      const path = new Path2D();
      return (
        traceCountry(path, rings, v) && ctx.isPointInPath(path, x * scale, y * scale, 'evenodd')
      );
    });
    setHover(hit?.code ?? null);
  }

  // Pinch zoom tracks the fingers directly; the buttons go through `zoomTo` and ease.
  const setZoom = (zoom: number) => {
    const next = clamp(zoom, minZoom, maxZoom);
    if (next === to.zoom) return;
    to.zoom = at.zoom = next;
    onZoom(next);
    invalidate();
  };
  const touches = new Map<number, { x: number; y: number }>();
  let pinch: { span: number; zoom: number } | null = null;
  const span = () => {
    const [a, b] = [...touches.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };
  const lift = (e: PointerEvent) => {
    touches.delete(e.pointerId);
    if (touches.size < 2) pinch = null;
  };

  const listeners = new AbortController();
  const on = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (e: HTMLElementEventMap[K]) => void,
    // Not passive: the zoom gestures must be able to stop the browser zooming the whole page.
  ) => canvas.addEventListener(type, listener, { signal: listeners.signal, passive: false });

  on('pointerdown', (e) => {
    if (e.button !== 0) return;
    canvas.setPointerCapture(e.pointerId);
    if (e.pointerType === 'touch') touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size >= 2) {
      // A second finger turns the drag into a pinch.
      drag = null;
      pinch ??= { span: span(), zoom: at.zoom };
      return;
    }
    drag = { x: e.clientX, y: e.clientY, time: e.timeStamp, vLon: 0, vLat: 0, moved: false };
    turned = true;
    // Catch the globe: whatever it was doing stops here.
    to.lon = at.lon;
    to.lat = at.lat;
  });
  on('pointermove', (e) => {
    const point = { x: e.offsetX, y: e.offsetY };
    if (e.pointerType === 'mouse') mouse = point;
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch) {
      if (pinch.span) setZoom((pinch.zoom * span()) / pinch.span);
      return;
    }
    if (!drag) {
      if (mouse) pick(mouse);
      return;
    }
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < TAP_SLOP_PX) return;
    if (!drag.moved) setHover(null);
    // The point under the pointer stays under it: one radius of travel is one radian.
    const degPerPx = 180 / Math.PI / ((canvas.clientWidth / 2) * GLOBE_FILL * at.zoom);
    const dLon = -dx * degPerPx;
    const dLat = clampLat(at.lat + dy * degPerPx) - at.lat;
    const dt = Math.max(e.timeStamp - drag.time, 1);
    drag = {
      x: e.clientX,
      y: e.clientY,
      time: e.timeStamp,
      vLon: 0.6 * (dLon / dt) + 0.4 * drag.vLon,
      vLat: 0.6 * (dLat / dt) + 0.4 * drag.vLat,
      moved: true,
    };
    to.lon = at.lon += dLon;
    to.lat = at.lat += dLat;
    invalidate();
  });
  on('pointerup', (e) => {
    lift(e);
    if (!drag) return;
    const { moved, time, vLon, vLat } = drag;
    drag = null;
    if (moved && !still && e.timeStamp - time < THROW_WINDOW_MS) {
      // Thrown: an exponential follow from speed v covers v × the time constant.
      to.lon = at.lon + vLon * GLOBE_TURN_TAU_MS;
      to.lat = clampLat(at.lat + vLat * GLOBE_TURN_TAU_MS);
      invalidate();
    }
    // A tap names a place on any device; after a drag only a mouse is still pointing at one.
    if (!moved || mouse) pick({ x: e.offsetX, y: e.offsetY });
  });
  // The browser took the gesture over (a vertical swipe scrolls the page).
  on('pointercancel', (e) => {
    lift(e);
    drag = null;
  });
  // A touchpad pinch arrives as a wheel event with ctrlKey set (Chrome, Firefox, Edge). A plain
  // two-finger scroll has no ctrlKey and is left alone, so the page still scrolls over the globe.
  on('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setZoom(at.zoom * Math.exp(-e.deltaY * 0.01));
  });
  // Safari reports a touchpad pinch as its own gesture events instead.
  let gestureZoom = 1;
  const onGesture = (type: string, listener: (scale: number) => void) =>
    canvas.addEventListener(
      type,
      (e) => {
        e.preventDefault();
        // On iOS the same pinch also arrives as two touch pointers, handled above.
        if (touches.size < 2) listener((e as Event & { scale: number }).scale);
      },
      { signal: listeners.signal },
    );
  onGesture('gesturestart', () => (gestureZoom = at.zoom));
  onGesture('gesturechange', (scale) => setZoom(gestureZoom * scale));
  // A tapped name stays up on touch; a mouse takes it away when it leaves.
  on('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || drag) return;
    mouse = null;
    setHover(null);
  });
  on('keydown', (e) => {
    const step = KEYS[e.key];
    if (!step) return;
    e.preventDefault();
    turned = true;
    to.lon += step[0];
    to.lat = clampLat(to.lat + step[1]);
    invalidate();
  });

  // Colours come from the design tokens, so the canvas follows the theme.
  const readColors = () => {
    const css = getComputedStyle(canvas);
    const token = (name: string) => css.getPropertyValue(name).trim();
    colors = {
      sphere: token('--globe-sea'),
      line: token('--border'),
      land: token('--globe-land'),
      hover: token('--globe-land-hover'),
      visited: token('--primary'),
    };
    draw();
  };
  // Observed on the attribute, not through next-themes, so the redraw lands inside the theme
  // toggle's view transition and not a frame after it.
  const theme = new MutationObserver(readColors);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Also draws the first frame: an observer reports once when it starts.
  const size = new ResizeObserver(() => {
    pixelRatio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO);
    canvas.width = canvas.height = Math.round(canvas.clientWidth * pixelRatio);
    readColors();
    invalidate();
  });
  size.observe(canvas);

  return {
    start: () => {
      if (litAt !== Infinity) return;
      litAt = performance.now() + GLOBE_LIGHT_DELAY_MS;
      if (!turned) to.lon = HOME.lon;
      turned = true;
      invalidate();
    },
    zoomTo: (zoom: number) => {
      to.zoom = zoom;
      invalidate();
    },
    destroy: () => {
      listeners.abort();
      theme.disconnect();
      size.disconnect();
      cancelAnimationFrame(frameId);
    },
  };
};

const GlobeCanvas = ({ visited, locale, label, zoom, play, zoomRange, onHover, onZoom }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const globe = useRef<ReturnType<typeof createGlobe>>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!canvas.current || !ctx) return;
    const created = createGlobe(canvas.current, ctx, new Set(visited), locale, {
      zoomRange,
      onHover,
      onZoom,
    });
    globe.current = created;
    return created.destroy;
  }, [visited, locale, zoomRange, onHover, onZoom]);

  useEffect(() => globe.current?.zoomTo(zoom), [zoom]);
  useEffect(() => {
    if (play) globe.current?.start();
  }, [play, visited, locale, zoomRange, onHover, onZoom]);

  return (
    <canvas
      ref={canvas}
      tabIndex={0}
      role='application'
      aria-label={label}
      className='absolute inset-0 size-full cursor-grab touch-pan-y rounded-lg select-none active:cursor-grabbing'
    />
  );
};

export default GlobeCanvas;
