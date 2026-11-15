// Orthographic globe maths. Pure (no DOM), so the canvas and the unit tests share it.
// Points are unit vectors [x, y, z, …]; after rotation x is right, y is up and z is towards the viewer.

const RAD = Math.PI / 180;
const TAU = Math.PI * 2;

// Where the globe comes to rest: the middle of the visited countries, so they stay in the frame at
// every zoom step. Move it when the list grows beyond Europe.
export const HOME = { lon: 10, lat: 47 };
// The sphere's share of the canvas width at zoom 1, leaving room for the rim stroke.
export const GLOBE_FILL = 272 / 300;

/** 3×3 rotation, row by row. */
export type Matrix = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
export type View = { m: Matrix; cx: number; cy: number; r: number };
/** The path calls the tracers make. A canvas context and a Path2D both fit. */
export type PathSink = Pick<CanvasPath, 'moveTo' | 'lineTo' | 'arc'>;

/** Rotation that puts (lon, lat) in the middle of the view. */
export const rotation = (lon: number, lat: number): Matrix => {
  const l = lon * RAD;
  const p = lat * RAD;
  const sl = Math.sin(l);
  const cl = Math.cos(l);
  const sp = Math.sin(p);
  const cp = Math.cos(p);
  return [-sl, cl, 0, -sp * cl, -sp * sl, cp, cp * cl, cp * sl, sp];
};

/** Decodes [lon, lat, dlon, dlat, …] (integers, `scale` per degree) into unit vectors. */
export const toVectors = (line: readonly number[], scale: number) => {
  const out = new Float32Array((line.length / 2) * 3);
  let lon = 0;
  let lat = 0;
  for (let i = 0, o = 0; i < line.length; i += 2, o += 3) {
    lon += line[i]!;
    lat += line[i + 1]!;
    const l = (lon / scale) * RAD;
    const p = (lat / scale) * RAD;
    out[o] = Math.cos(p) * Math.cos(l);
    out[o + 1] = Math.cos(p) * Math.sin(l);
    out[o + 2] = Math.sin(p);
  }
  return out;
};

const line = (lon: number, lat: number, dlon: number, dlat: number, steps: number) =>
  toVectors([lon, lat, ...Array.from({ length: steps }, () => [dlon, dlat]).flat()], 1);

/** Meridians and parallels every 30°, sampled every 5°. Meridians stop short of the poles. */
export const graticule = () => [
  ...Array.from({ length: 12 }, (_, i) => line(i * 30 - 180, -80, 0, 5, 32)),
  ...Array.from({ length: 5 }, (_, i) => line(-180, i * 30 - 60, 5, 0, 72)),
];

// The signed angle from one direction to another, the short way round.
const shortest = (angle: number) => angle - TAU * Math.round(angle / TAU);

/**
 * Adds one ring to `path` as a subpath for filling, clipped to the visible half of the globe.
 * It is left open on purpose: a fill closes subpaths itself, and `closePath` on a Path2D that
 * already holds hundreds of rings costs Chrome more than the rest of the frame put together.
 *
 * Where the ring goes behind the globe, the path follows the rim instead. How far round the rim,
 * and which way, is the sum of the turns the hidden points make around the view axis. That sum is
 * what keeps the fill on the correct side for a ring of any size, Antarctica included.
 * Returns false, adding nothing, when the whole ring is hidden.
 */
export const traceRing = (path: PathSink, v: Float32Array, { m, cx, cy, r }: View) => {
  const [a, b, c, d, e, f, g, h, k] = m;
  // Depth only first: most rings are entirely in front or entirely behind.
  let front = 0;
  let start = -1;
  for (let i = 0; i < v.length; i += 3) {
    if (g * v[i]! + h * v[i + 1]! + k * v[i + 2]! > 0) front++;
    else if (start < 0) start = i;
  }
  if (front === 0) return false;

  if (start < 0) {
    for (let i = 0; i < v.length; i += 3) {
      const x = cx + r * (a * v[i]! + b * v[i + 1]! + c * v[i + 2]!);
      const y = cy - r * (d * v[i]! + e * v[i + 1]! + f * v[i + 2]!);
      if (i) path.lineTo(x, y);
      else path.moveTo(x, y);
    }
    return true;
  }

  // Start on a hidden point and walk the ring once, back to that point.
  let px = 0;
  let py = 0;
  let pz = 0;
  let angle = 0; // where on the rim the walk is while hidden
  let turn = 0; // rim travel since the ring last went behind
  let exit = 0; // rim angle where it went behind
  let lead = NaN; // rim travel before the first visible stretch; closes the path at the end
  const rimArc = (sweep: number) => path.arc(cx, cy, r, -exit, -(exit + sweep), sweep > 0);

  for (let step = 0; step <= v.length; step += 3) {
    const i = (start + step) % v.length;
    const x = a * v[i]! + b * v[i + 1]! + c * v[i + 2]!;
    const y = d * v[i]! + e * v[i + 1]! + f * v[i + 2]!;
    const z = g * v[i]! + h * v[i + 1]! + k * v[i + 2]!;
    if (step === 0) {
      angle = Math.atan2(y, x);
    } else if (z > 0 !== pz > 0) {
      // The edge crosses the rim: find where.
      const t = pz / (pz - z);
      const cross = Math.atan2(py + t * (y - py), px + t * (x - px));
      if (z > 0) {
        turn += shortest(cross - angle);
        if (Number.isNaN(lead)) {
          lead = turn;
          path.moveTo(cx + r * Math.cos(cross), cy - r * Math.sin(cross));
        } else rimArc(turn);
      } else {
        path.lineTo(cx + r * Math.cos(cross), cy - r * Math.sin(cross));
        exit = cross;
        turn = 0;
      }
      angle = cross;
    }
    if (z > 0) path.lineTo(cx + r * x, cy - r * y);
    else if (step > 0) {
      const next = Math.atan2(y, x);
      turn += shortest(next - angle);
      angle = next;
    }
    px = x;
    py = y;
    pz = z;
  }
  rimArc(turn + lead);
  return true;
};

/** Adds the visible parts of an open line (a border, a graticule line) to `path`. */
export const traceLine = (path: PathSink, v: Float32Array, { m, cx, cy, r }: View) => {
  const [a, b, c, d, e, f, g, h, k] = m;
  let px = 0;
  let py = 0;
  let pz = 0;
  for (let i = 0; i < v.length; i += 3) {
    const x = a * v[i]! + b * v[i + 1]! + c * v[i + 2]!;
    const y = d * v[i]! + e * v[i + 1]! + f * v[i + 2]!;
    const z = g * v[i]! + h * v[i + 1]! + k * v[i + 2]!;
    if (i > 0 && z > 0 !== pz > 0) {
      // Start or end exactly on the rim.
      const t = pz / (pz - z);
      const ex = px + t * (x - px);
      const ey = py + t * (y - py);
      const s = r / (Math.hypot(ex, ey) || 1);
      if (z > 0) path.moveTo(cx + ex * s, cy - ey * s);
      else path.lineTo(cx + ex * s, cy - ey * s);
    }
    if (z > 0) {
      if (i > 0) path.lineTo(cx + r * x, cy - r * y);
      else path.moveTo(cx + r * x, cy - r * y);
    }
    px = x;
    py = y;
    pz = z;
  }
};
