import { describe, expect, it } from 'vitest';
import { crossingSet, type Edge, type Point } from './geometry';

describe('crossingSet', () => {
  const square: Point[] = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];

  it('counts two diagonals as one crossing and marks both', () => {
    const { hit, count } = crossingSet(square, [
      [0, 2],
      [1, 3],
    ]);
    expect(count).toBe(1);
    expect([...hit]).toEqual([0, 1]);
  });

  it('does not count lines that only meet at a shared node, or lines apart', () => {
    expect(
      crossingSet(square, [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ]).count,
    ).toBe(0);
  });

  it('counts a line that runs along another, and a node resting on a line', () => {
    const line: Point[] = [
      [0, 0],
      [10, 0],
      [5, 0],
      [5, 10],
    ];
    // 0-1 and 0-2 leave node 0 in the same direction.
    expect(
      crossingSet(line, [
        [0, 1],
        [0, 2],
      ]).count,
    ).toBe(1);
    // Node 2 sits on the line 0-1.
    expect(
      crossingSet(line, [
        [0, 1],
        [2, 3],
      ]).count,
    ).toBe(1);
  });

  it.each<{ name: string; pos: Point[]; count: number }>([
    {
      name: 'separate collinear lines',
      pos: [
        [0, 0],
        [2, 0],
        [3, 0],
        [5, 0],
      ],
      count: 0,
    },
    {
      name: 'collinear endpoint contact',
      pos: [
        [0, 0],
        [2, 0],
        [2, 0],
        [5, 0],
      ],
      count: 1,
    },
    {
      name: 'one line inside another',
      pos: [
        [0, 0],
        [10, 0],
        [2, 0],
        [5, 0],
      ],
      count: 1,
    },
    {
      name: 'vertical endpoint contact',
      pos: [
        [0, 0],
        [0, 4],
        [0, 4],
        [0, 8],
      ],
      count: 1,
    },
    {
      name: 'parallel vertical lines',
      pos: [
        [0, 0],
        [0, 4],
        [2, 0],
        [2, 4],
      ],
      count: 0,
    },
    {
      name: 'a collapsed line on another',
      pos: [
        [0, 0],
        [10, 0],
        [5, 0],
        [5, 0],
      ],
      count: 1,
    },
  ])('recognizes $name regardless of edge ordering', ({ pos, count }) => {
    for (const first of [
      [0, 1],
      [1, 0],
    ] as const)
      for (const second of [
        [2, 3],
        [3, 2],
      ] as const)
        for (const edges of [
          [first, second],
          [second, first],
        ]) {
          const result = crossingSet(pos, edges);
          expect(result.count).toBe(count);
          expect([...result.hit]).toEqual(count ? [0, 1] : []);
        }
  });

  it('does not count shared collinear edges going in opposite directions', () => {
    const pos: Point[] = [
      [5, 0],
      [0, 0],
      [10, 0],
    ];
    const orientations: Edge[][] = [
      [
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [0, 2],
      ],
      [
        [0, 1],
        [2, 0],
      ],
      [
        [1, 0],
        [2, 0],
      ],
    ];
    for (const edges of orientations) expect(crossingSet(pos, edges).count).toBe(0);
  });

  it('counts crossing pairs separately while marking each affected edge once', () => {
    const pos: Point[] = [
      [0, 0],
      [10, 10],
      [0, 10],
      [10, 0],
      [5, 0],
      [5, 10],
      [20, 20],
      [25, 20],
    ];
    expect(
      crossingSet(pos, [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
      ]),
    ).toEqual({
      count: 3,
      hit: new Set([0, 1, 2]),
    });
    expect(crossingSet([], [])).toEqual({ count: 0, hit: new Set() });
  });
});
