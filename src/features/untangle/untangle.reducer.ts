import { crossingSet, type Point } from './geometry';
import { levelAt, tangled } from './levels';
import { clamp } from '@/lib/utils';

export type State = {
  level: number;
  pos: readonly Point[];
  drag: number | null;
  moves: number;
  startedAt: number | null;
  seconds: number;
  solved: boolean;
  // The visitor pressed "Show solution": solved, but not by them.
  helped: boolean;
};

// Time comes in through `at` (ms), so the reducer stays pure.
export type Action =
  | { type: 'grab'; node: number; at: number }
  | { type: 'move'; to: Point }
  | { type: 'drop'; at: number }
  | { type: 'nudge'; node: number; by: Point; at: number }
  | { type: 'load'; level: number }
  | { type: 'solve' };

export const start = (level: number, pos: readonly Point[] = tangled(level)): State => ({
  level,
  pos,
  drag: null,
  moves: 0,
  startedAt: null,
  seconds: 0,
  solved: false,
  helped: false,
});

// Nodes stay inside the board, with room for the label under them.
const place = (pos: readonly Point[], node: number, [x, y]: Point): Point[] =>
  pos.map((p, i) => (i === node ? [clamp(x, 4, 96), clamp(y, 4, 54)] : p));

const settle = (s: State, pos: readonly Point[], at: number): State => {
  const solved = crossingSet(pos, levelAt(s.level).edges).count === 0;
  const startedAt = s.startedAt ?? at;
  return {
    ...s,
    pos,
    drag: null,
    moves: s.moves + 1,
    startedAt,
    solved,
    seconds: solved ? Math.max(1, Math.round((at - startedAt) / 1000)) : 0,
  };
};

export const reducer = (s: State, a: Action): State => {
  if (a.type === 'load') return start(a.level);
  // A solved board is finished: only loading a level moves on.
  if (s.solved) return s;
  switch (a.type) {
    case 'grab':
      return { ...s, drag: a.node, startedAt: s.startedAt ?? a.at };
    case 'move':
      return s.drag === null ? s : { ...s, pos: place(s.pos, s.drag, a.to) };
    case 'drop':
      return s.drag === null ? s : settle(s, s.pos, a.at);
    case 'nudge': {
      const [x, y] = s.pos[a.node]!;
      return settle(s, place(s.pos, a.node, [x + a.by[0], y + a.by[1]]), a.at);
    }
    case 'solve':
      return { ...s, pos: levelAt(s.level).solved, drag: null, solved: true, helped: true };
  }
};
