import { describe, expect, it } from 'vitest';
import {
  graticule,
  rotation,
  toVectors,
  traceLine,
  traceRing,
  type PathSink,
  type View,
} from './projection';

type Op = { op: string; args: number[] };

const record = () => {
  const ops: Op[] = [];
  const add =
    (op: string) =>
    (...args: (number | boolean | undefined)[]) =>
      void ops.push({ op, args: args.map(Number) });
  const sink: PathSink = {
    moveTo: add('moveTo'),
    lineTo: add('lineTo'),
    arc: add('arc'),
  };
  return { ops, sink, count: (op: string) => ops.filter((o) => o.op === op).length };
};

const view = (lon: number, lat: number): View => ({ m: rotation(lon, lat), cx: 0, cy: 0, r: 100 });

// How far round the rim an arc goes; positive is anticlockwise on screen.
const sweep = ({ args: [, , , from = 0, to = 0, anticlockwise] }: Op) =>
  anticlockwise ? from - to : to - from;

// Absolute [lon, lat] pairs in degrees to unit vectors.
const vectors = (points: [number, number][]) =>
  toVectors(
    points.flatMap(([lon, lat], i) => [
      lon - (points[i - 1]?.[0] ?? 0),
      lat - (points[i - 1]?.[1] ?? 0),
    ]),
    1,
  );

// A 20° box around (0, 0), a point every 5°.
const edge = [-10, -5, 0, 5];
const box = vectors([
  ...edge.map((lon): [number, number] => [lon, -10]),
  ...edge.map((lat): [number, number] => [10, lat]),
  ...edge.map((lon): [number, number] => [-lon, 10]),
  ...edge.map((lat): [number, number] => [-10, -lat]),
]);
// The 70°S parallel all the way round: a ring that contains a pole, like Antarctica.
const cap = vectors(Array.from({ length: 72 }, (_, i): [number, number] => [i * 5 - 180, -70]));

describe('toVectors', () => {
  it('decodes delta-encoded degrees into unit vectors', () => {
    const [x0, y0, z0, x1, y1, z1] = toVectors([0, 0, 1800, 0], 20);
    expect([x0, y0, z0]).toEqual([1, 0, 0]);
    expect(x1).toBeCloseTo(0);
    expect([y1, z1]).toEqual([1, 0]);
  });

  it('accumulates positive and negative deltas in both coordinates', () => {
    const values = toVectors([900, 450, -1800, -900, 900, 450], 10);
    expect(values).toHaveLength(9);
    expect(values[0]).toBeCloseTo(0);
    expect(values[1]).toBeCloseTo(Math.SQRT1_2);
    expect(values[2]).toBeCloseTo(Math.SQRT1_2);
    expect(values[4]).toBeCloseTo(-Math.SQRT1_2);
    expect(values[5]).toBeCloseTo(-Math.SQRT1_2);
    expect([...values.slice(6)]).toEqual([1, 0, 0]);
    for (let i = 0; i < values.length; i += 3)
      expect(Math.hypot(...values.slice(i, i + 3))).toBeCloseTo(1);
    expect(toVectors([], 1)).toHaveLength(0);
  });
});

describe('rotation', () => {
  it.each([
    [0, 0],
    [180, 0],
    [-90, 45],
    [10, 47],
    [0, 90],
    [0, -90],
  ])('places the chosen longitude %s and latitude %s at the front centre', (lon, lat) => {
    const m = rotation(lon, lat);
    const v = toVectors([lon, lat], 1);
    const transformed = [0, 3, 6].map(
      (row) => m[row]! * v[0]! + m[row + 1]! * v[1]! + m[row + 2]! * v[2]!,
    );
    expect(transformed[0]).toBeCloseTo(0);
    expect(transformed[1]).toBeCloseTo(0);
    expect(transformed[2]).toBeCloseTo(1);
  });
});

describe('traceRing', () => {
  it('draws a ring that faces the viewer as a plain polygon', () => {
    const path = record();
    expect(traceRing(path.sink, box, view(0, 0))).toBe(true);
    expect(path.ops.map((o) => o.op)).toEqual([
      'moveTo',
      ...Array.from({ length: 15 }, () => 'lineTo'),
    ]);
    // 10° east and north of the centre is right and up; canvas y points down.
    expect(Math.max(...path.ops.map((o) => o.args[0] ?? 0))).toBeCloseTo(
      100 * Math.sin(Math.PI / 18),
    );
    expect(Math.min(...path.ops.map((o) => o.args[1] ?? 0))).toBeLessThan(-17);
  });

  it('adds nothing for a ring on the far side', () => {
    const path = record();
    expect(traceRing(path.sink, box, view(180, 0))).toBe(false);
    expect(path.ops).toEqual([]);
  });

  it('closes a ring that crosses the horizon along the rim, the short way', () => {
    const path = record();
    traceRing(path.sink, box, view(90, 0));
    expect(path.count('moveTo')).toBe(1);
    expect(path.count('arc')).toBe(1);
    // The rim arc ends where the visible stretch began, so the fill closes on a zero-length edge.
    const [startX = 0, startY = 0] = path.ops[0]!.args;
    const [, , , , end = 0] = path.ops.at(-1)!.args;
    expect(100 * Math.cos(end)).toBeCloseTo(startX, 3);
    expect(100 * Math.sin(end)).toBeCloseTo(startY, 3);
    // The box spans 20° of latitude where it meets the rim.
    expect(Math.abs(sweep(path.ops.find((o) => o.op === 'arc')!))).toBeCloseTo(Math.PI / 9, 3);
  });

  it('keeps the fill on the pole side for a ring around a hidden pole', () => {
    const path = record();
    traceRing(path.sink, cap, view(0, 0));
    expect(path.count('arc')).toBe(1);
    // Seen from the equator, 70°S meets the rim 20° either side of the bottom.
    expect(Math.abs(sweep(path.ops.find((o) => o.op === 'arc')!))).toBeCloseTo(
      (Math.PI * 2) / 9,
      2,
    );
  });

  it('draws a ring around a visible pole without touching the rim', () => {
    const path = record();
    traceRing(path.sink, cap, view(0, -30));
    expect(path.count('arc')).toBe(0);
    expect(path.count('lineTo')).toBe(71);
  });

  it('never leaves the globe or emits NaN, whatever the view', () => {
    for (let lon = -180; lon < 180; lon += 15)
      for (let lat = -75; lat <= 75; lat += 15)
        for (const ring of [box, cap]) {
          const path = record();
          traceRing(path.sink, ring, view(lon, lat));
          for (const { op, args } of path.ops) {
            expect(args.every(Number.isFinite)).toBe(true);
            if (op !== 'arc') expect(Math.hypot(args[0] ?? 0, args[1] ?? 0)).toBeLessThan(100.001);
          }
        }
  });

  it('joins multiple visible stretches along the rim as one filled subpath', () => {
    const path = record();
    const zigzag = vectors([
      [60, -30],
      [120, -20],
      [60, 0],
      [120, 20],
      [60, 30],
    ]);
    expect(traceRing(path.sink, zigzag, view(0, 0))).toBe(true);
    expect(path.count('moveTo')).toBe(1);
    expect(path.count('arc')).toBe(2);
    expect(path.ops.every(({ args }) => args.every(Number.isFinite))).toBe(true);
  });

  it('does not draw an empty ring', () => {
    const path = record();
    expect(traceRing(path.sink, new Float32Array(), view(0, 0))).toBe(false);
    expect(path.ops).toEqual([]);
  });
});

describe('traceLine', () => {
  const equator = vectors(Array.from({ length: 13 }, (_, i): [number, number] => [i * 5 - 30, 0]));

  it('draws a visible line as one stroke', () => {
    const path = record();
    traceLine(path.sink, equator, view(0, 0));
    expect(path.ops.map((o) => o.op)).toEqual([
      'moveTo',
      ...Array.from({ length: 12 }, () => 'lineTo'),
    ]);
  });

  it('starts a half-hidden line on the rim', () => {
    const path = record();
    traceLine(path.sink, equator, view(90, 0));
    expect(path.count('moveTo')).toBe(1);
    const [x = 0, y = 0] = path.ops[0]!.args;
    expect(Math.hypot(x, y)).toBeCloseTo(100);
    expect(x).toBeLessThan(0);
  });

  it('skips a hidden line', () => {
    const path = record();
    traceLine(path.sink, equator, view(180, 0));
    expect(path.ops).toEqual([]);
  });

  it('ends a line at the rim when it disappears behind the globe', () => {
    const path = record();
    const shifted = { ...view(-90, 0), cx: 30, cy: 40, r: 25 };
    traceLine(path.sink, equator, shifted);
    expect(path.count('moveTo')).toBe(1);
    const {
      op,
      args: [x = 0, y = 0],
    } = path.ops.at(-1)!;
    expect(op).toBe('lineTo');
    expect(Math.hypot(x - shifted.cx, y - shifted.cy)).toBeCloseTo(shifted.r);
    expect(x).toBeGreaterThan(shifted.cx);
  });

  it('starts a new subpath for every visible stretch of an open line', () => {
    const path = record();
    traceLine(
      path.sink,
      vectors([
        [120, -30],
        [60, -20],
        [120, 0],
        [60, 20],
        [120, 30],
      ]),
      view(0, 0),
    );
    expect(path.count('moveTo')).toBe(2);
    expect(path.count('arc')).toBe(0);
    expect(path.ops.every(({ args }) => args.every(Number.isFinite))).toBe(true);
  });

  it('does not draw an empty line', () => {
    const path = record();
    traceLine(path.sink, new Float32Array(), view(0, 0));
    expect(path.ops).toEqual([]);
  });

  it('keeps coordinates finite when an antipodal edge passes through the globe centre', () => {
    const path = record();
    traceLine(path.sink, new Float32Array([1, 0, 0, -1, 0, 0]), view(0, 0));
    expect(path.ops).toHaveLength(2);
    expect(path.ops.every(({ args }) => args.every(Number.isFinite))).toBe(true);
  });
});

describe('graticule', () => {
  it('has 12 meridians and 5 parallels', () => {
    expect(graticule().map((l) => l.length / 3)).toEqual([
      ...Array.from({ length: 12 }, () => 33),
      ...Array.from({ length: 5 }, () => 73),
    ]);
  });
});
