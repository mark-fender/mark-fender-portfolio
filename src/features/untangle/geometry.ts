export type Point = readonly [number, number];
export type Edge = readonly [number, number];

// Which side of the line a→b the point c is on: -1, 0 (on the line) or 1. Board coordinates
// stay under 100, so rounding error is around 1e-12; anything that small is "on the line".
const side = (a: Point, b: Point, c: Point) => {
  const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  return Math.abs(cross) < 1e-9 ? 0 : Math.sign(cross);
};

// For a point already known to be on the line through a and b.
const between = (a: Point, b: Point, c: Point) =>
  Math.min(a[0], b[0]) <= c[0] &&
  c[0] <= Math.max(a[0], b[0]) &&
  Math.min(a[1], b[1]) <= c[1] &&
  c[1] <= Math.max(a[1], b[1]);

// Touching counts as crossing. Otherwise pushing every node onto one border of the board, or
// into one corner, would leave no line "crossing" another and count as solved.
const crosses = (pos: readonly Point[], e: Edge, f: Edge) => {
  const shared = e.find((n) => f.includes(n));
  if (shared !== undefined) {
    // Two lines out of the same node cross only when one runs along the other.
    const s = pos[shared]!;
    const p = pos[e[0] === shared ? e[1] : e[0]]!;
    const q = pos[f[0] === shared ? f[1] : f[0]]!;
    return side(s, p, q) === 0 && (p[0] - s[0]) * (q[0] - s[0]) + (p[1] - s[1]) * (q[1] - s[1]) > 0;
  }
  const [a, b, c, d] = [pos[e[0]]!, pos[e[1]]!, pos[f[0]]!, pos[f[1]]!];
  const [ac, ad, ca, cb] = [side(a, b, c), side(a, b, d), side(c, d, a), side(c, d, b)];
  return (
    (ac !== ad && ca !== cb) ||
    (ac === 0 && between(a, b, c)) ||
    (ad === 0 && between(a, b, d)) ||
    (ca === 0 && between(c, d, a)) ||
    (cb === 0 && between(c, d, b))
  );
};

// `hit` holds the indices of the edges that cross another one; `count` is the number of crossings.
export const crossingSet = (pos: readonly Point[], edges: readonly Edge[]) => {
  const hit = new Set<number>();
  let count = 0;
  for (let i = 0; i < edges.length; i++)
    for (let j = i + 1; j < edges.length; j++)
      if (crosses(pos, edges[i]!, edges[j]!)) {
        hit.add(i).add(j);
        count++;
      }
  return { hit, count };
};
