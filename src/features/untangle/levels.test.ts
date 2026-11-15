import { describe, expect, it } from 'vitest';
import { crossingSet } from './geometry';
import { levelAt, LEVELS, tangled } from './levels';

describe('levels', () => {
  it('has five, each one well-formed', () => {
    expect(LEVELS).toHaveLength(5);
    for (const { labels, edges, solved, perm } of LEVELS) {
      const n = labels.length;
      expect(new Set(labels).size).toBe(n);
      expect(solved).toHaveLength(n);
      expect([...perm].sort((a, b) => a - b)).toEqual([...Array(n).keys()]);
      for (const [a, b] of edges) {
        expect(a).not.toBe(b);
        expect(Math.max(a, b)).toBeLessThan(n);
      }
      expect(new Set(edges.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`)).size).toBe(
        edges.length,
      );
    }
  });

  it('can be solved, and does not start solved', () => {
    for (const [i, { edges, solved }] of LEVELS.entries()) {
      expect(crossingSet(solved, edges).count, `level ${i + 1} solved`).toBe(0);
      expect(crossingSet(tangled(i), edges).count, `level ${i + 1} start`).toBeGreaterThan(0);
    }
  });

  it('keeps the solution inside the board, with nodes far enough apart to grab on a phone', () => {
    for (const { solved } of LEVELS)
      for (const [i, [x, y]] of solved.entries()) {
        expect(x >= 4 && x <= 96 && y >= 4 && y <= 54).toBe(true);
        for (const [x2, y2] of solved.slice(i + 1))
          expect(Math.hypot(x - x2, y - y2)).toBeGreaterThanOrEqual(13);
      }
  });

  it('gets harder: every level opens with more crossings than the one before', () => {
    const counts = LEVELS.map(({ edges }, i) => crossingSet(tangled(i), edges).count);
    expect(counts).toEqual([...counts].sort((a, b) => a - b));
    expect(new Set(counts).size).toBe(counts.length);
  });

  it.each([-1, LEVELS.length, 0.5, NaN])('rejects the nonexistent level %s', (index) => {
    expect(() => levelAt(index)).toThrow(`untangle: no level ${index}`);
    expect(() => tangled(index)).toThrow(`untangle: no level ${index}`);
  });
});
