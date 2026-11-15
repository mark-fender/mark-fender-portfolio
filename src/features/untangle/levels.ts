import type { Localized } from '@/lib/i18n';
import type { Edge, Point } from './geometry';

// The board is 100 × 60 (the SVG viewBox). `solved` is one layout with no crossings; `perm` is
// the slot on the starting ellipse each node sits in.
// Node labels are network names (core-1, acc-2), the same in every language.
type Level = {
  name: Localized;
  labels: readonly string[];
  edges: readonly Edge[];
  solved: readonly Point[];
  perm: readonly number[];
};

// Ordered by difficulty: more lines per node each time. Levels 1–3 are the v4 artboard's three
// (its second and third swapped: the tree is easier than the two rings).
export const LEVELS: readonly Level[] = [
  {
    name: { en: 'Ring with two shortcuts', sk: 'Kruh s dvoma skratkami' },
    labels: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 2],
      [3, 5],
    ],
    solved: [
      [30, 10],
      [70, 10],
      [90, 30],
      [70, 50],
      [30, 50],
      [10, 30],
    ],
    perm: [0, 3, 1, 4, 2, 5],
  },
  {
    name: { en: 'Core / distribution / access', sk: 'Jadro / distribúcia / prístup' },
    labels: [
      'core-1',
      'core-2',
      'dist-1',
      'dist-2',
      'dist-3',
      'acc-1',
      'acc-2',
      'acc-3',
      'acc-4',
      'acc-5',
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
      [3, 6],
      [3, 7],
      [3, 8],
      [4, 8],
      [4, 9],
    ],
    solved: [
      [35, 10],
      [65, 10],
      [20, 30],
      [50, 30],
      [80, 30],
      [10, 50],
      [30, 50],
      [50, 50],
      [70, 50],
      [90, 50],
    ],
    perm: [0, 5, 2, 7, 4, 9, 6, 1, 8, 3],
  },
  {
    name: { en: 'Two rings, four uplinks', sk: 'Dva kruhy, štyri uplinky' },
    labels: ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4'],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ],
    solved: [
      [15, 8],
      [85, 8],
      [85, 52],
      [15, 52],
      [38, 22],
      [62, 22],
      [62, 38],
      [38, 38],
    ],
    perm: [0, 5, 2, 7, 4, 1, 6, 3],
  },
  {
    name: { en: 'Ring of six around a meshed core', sk: 'Kruh šiestich okolo prepojeného jadra' },
    labels: ['core-1', 'core-2', 'core-3', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
    edges: [
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 3],
      [0, 1],
      [1, 2],
      [2, 0],
      [0, 3],
      [0, 4],
      [1, 5],
      [1, 6],
      [2, 7],
      [2, 8],
    ],
    solved: [
      [50, 20],
      [62, 38],
      [38, 38],
      [30, 8],
      [70, 8],
      [92, 30],
      [70, 52],
      [30, 52],
      [8, 30],
    ],
    perm: [0, 4, 8, 3, 7, 2, 6, 1, 5],
  },
  {
    name: { en: 'Four sites on a backbone', sk: 'Štyri pobočky na chrbticovej sieti' },
    labels: ['bb-1', 'bb-2', 'bb-3', 'bb-4', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'],
    edges: [
      // backbone ring and one diagonal
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
      // each site: two nodes, linked to each other and to their backbone node
      [0, 4],
      [0, 5],
      [4, 5],
      [1, 6],
      [1, 7],
      [6, 7],
      [2, 8],
      [2, 9],
      [8, 9],
      [3, 10],
      [3, 11],
      [10, 11],
      // a spare link from each site to the next
      [5, 6],
      [7, 8],
      [9, 10],
      [11, 4],
    ],
    solved: [
      [38, 20],
      [62, 20],
      [62, 40],
      [38, 40],
      [10, 22],
      [34, 7],
      [66, 7],
      [90, 22],
      [90, 38],
      [66, 53],
      [34, 53],
      [10, 38],
    ],
    // Tangled, but short of the worst case: 48 crossings to start with, not 69.
    perm: [0, 6, 10, 9, 5, 2, 4, 8, 3, 1, 11, 7],
  },
];

export const levelAt = (level: number) => {
  const found = LEVELS[level];
  if (!found) throw new Error(`untangle: no level ${level}`);
  return found;
};

const onEllipse = (slots: readonly number[]): Point[] =>
  slots.map((slot) => {
    const a = (slot / slots.length) * Math.PI * 2 - Math.PI / 2;
    return [
      Math.round((50 + 38 * Math.cos(a)) * 10) / 10,
      Math.round((30 + 22 * Math.sin(a)) * 10) / 10,
    ];
  });

export const tangled = (level: number) => onEllipse(levelAt(level).perm);
