import { describe, expect, it } from 'vitest';
import { crossingSet, type Point } from './geometry';
import { levelAt } from './levels';
import { reducer, start, type Action } from './untangle.reducer';

const first = levelAt(0);

describe('reducer', () => {
  it('drags a node, keeps it on the board and counts the move on drop', () => {
    let s = reducer(start(0), { type: 'grab', node: 0, at: 1000 });
    s = reducer(s, { type: 'move', to: [200, -50] });
    expect(s.pos[0]).toEqual([96, 4]);
    expect(s.moves).toBe(0);
    s = reducer(s, { type: 'drop', at: 2000 });
    expect(s).toMatchObject({ drag: null, moves: 1, startedAt: 1000, solved: false });
  });

  it('ignores a move or a drop when no node is held', () => {
    const s = start(0);
    expect(reducer(s, { type: 'move', to: [50, 30] })).toBe(s);
    expect(reducer(s, { type: 'drop', at: 1 })).toBe(s);
  });

  it('nudges by keyboard, one move per press', () => {
    const s = reducer(start(0), { type: 'nudge', node: 1, by: [2, 0], at: 5 });
    expect(s.pos[1]![0]).toBeCloseTo(start(0).pos[1]![0] + 2);
    expect(s.moves).toBe(1);
  });

  it('is solved when the last crossing goes, with the time it took', () => {
    // Everything in place except node 0, which starts below the ring and is dragged home.
    const almost = first.solved.map((p, i): Point => (i === 0 ? [50, 54] : p));
    let s = start(0, almost);
    expect(crossingSet(s.pos, first.edges).count).toBeGreaterThan(0);
    s = reducer(s, { type: 'grab', node: 0, at: 10_000 });
    s = reducer(s, { type: 'move', to: first.solved[0]! });
    s = reducer(s, { type: 'drop', at: 14_400 });
    expect(s).toMatchObject({ solved: true, helped: false, moves: 1, seconds: 4 });
    // Finished: the board no longer reacts.
    expect(reducer(s, { type: 'nudge', node: 0, by: [2, 0], at: 20_000 })).toBe(s);
  });

  it('does not accept every node pushed onto one border as solved', () => {
    let s = start(0);
    for (let node = 0; node < s.pos.length; node++) {
      s = reducer(s, { type: 'grab', node, at: 0 });
      s = reducer(s, { type: 'move', to: [s.pos[node]![0], -10] });
      s = reducer(s, { type: 'drop', at: 0 });
    }
    expect(s.pos.every(([, y]) => y === 4)).toBe(true);
    expect(s.solved).toBe(false);
  });

  it('does not accept overlapping lines whose points are only collinear up to rounding', () => {
    // Four nodes dropped on y = 0.1x + 5: lines r1–r2 and r1–r3 then lie on top of each other.
    let s = start(0);
    const drops: Point[] = [
      [10, 6],
      [43, 9.3],
      [54, 10.4],
      [65, 11.5],
    ];
    for (const [node, to] of drops.entries()) {
      s = reducer(s, { type: 'grab', node, at: 0 });
      s = reducer(s, { type: 'move', to });
      s = reducer(s, { type: 'drop', at: 0 });
    }
    expect(s.solved).toBe(false);
  });

  it('shows the solution as helped, and loads a level fresh', () => {
    const s = reducer(start(2), { type: 'solve' });
    expect(s).toMatchObject({ solved: true, helped: true, pos: levelAt(2).solved });
    expect(reducer(s, { type: 'load', level: 3 })).toEqual(start(3));
  });

  it('preserves the first interaction time across later grabs and keyboard nudges', () => {
    let s = reducer(start(0), { type: 'grab', node: 0, at: 0 });
    s = reducer(s, { type: 'drop', at: 1000 });
    s = reducer(s, { type: 'grab', node: 1, at: 2000 });
    s = reducer(s, { type: 'drop', at: 3000 });
    s = reducer(s, { type: 'nudge', node: 1, by: [1, 0], at: 4000 });
    expect(s).toMatchObject({ startedAt: 0, moves: 3, seconds: 0, solved: false, drag: null });
  });

  it('clamps keyboard moves and leaves the previous state and other nodes intact', () => {
    const previous = start(0);
    const positions = previous.pos.map((point) => [...point]);
    const low = reducer(previous, { type: 'nudge', node: 0, by: [-1000, 1000], at: 20 });
    expect(low.pos[0]).toEqual([4, 54]);
    expect(previous.pos).toEqual(positions);
    expect(low.pos[1]).toBe(previous.pos[1]);
    const high = reducer(previous, { type: 'nudge', node: 0, by: [1000, -1000], at: 20 });
    expect(high.pos[0]).toEqual([96, 4]);
  });

  it.each([
    [0, 1],
    [1499, 1],
    [1500, 2],
  ])('records a solved duration of %s ms as %s seconds', (elapsed, seconds) => {
    let s = start(0, first.solved);
    s = reducer(s, { type: 'grab', node: 0, at: 1000 });
    s = reducer(s, { type: 'drop', at: 1000 + elapsed });
    expect(s).toMatchObject({ solved: true, helped: false, seconds, moves: 1 });
  });

  it('can solve through a keyboard move and starts its clock on that interaction', () => {
    const s = reducer(start(0, first.solved), { type: 'nudge', node: 0, by: [0, 0], at: 5000 });
    expect(s).toMatchObject({ solved: true, helped: false, seconds: 1, startedAt: 5000, moves: 1 });
  });

  it('clears an active drag when showing the solution and freezes every interaction', () => {
    const held = reducer(start(0), { type: 'grab', node: 0, at: 1000 });
    const solved = reducer(held, { type: 'solve' });
    expect(solved).toMatchObject({ drag: null, helped: true, solved: true, moves: 0 });
    const actions: Action[] = [
      { type: 'grab', node: 1, at: 2000 },
      { type: 'move', to: [0, 0] },
      { type: 'drop', at: 2000 },
      { type: 'nudge', node: 0, by: [1, 0], at: 2000 },
      { type: 'solve' },
    ];
    for (const action of actions) expect(reducer(solved, action)).toBe(solved);
  });

  it('resets an unfinished board when loading the same level', () => {
    const playing = reducer(start(0), { type: 'nudge', node: 0, by: [2, 0], at: 1000 });
    expect(reducer(playing, { type: 'load', level: 0 })).toEqual(start(0));
  });
});
