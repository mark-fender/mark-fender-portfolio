'use client';
import { useEffect, useReducer, useRef, type PointerEvent } from 'react';
import type { UiCopy } from '@/content/ui';
import { fill, plural, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import BoardFrame from './BoardFrame';
import Confetti from './Confetti';
import { crossingSet, type Point } from './geometry';
import { LEVELS, levelAt } from './levels';
import { reducer, start } from './untangle.reducer';

const ARROWS: Record<string, Point> = {
  ArrowLeft: [-2, 0],
  ArrowRight: [2, 0],
  ArrowUp: [0, -2],
  ArrowDown: [0, 2],
};

const pill =
  'inline-flex min-h-11 items-center rounded-full text-[15px] font-medium transition-[scale,border-color] duration-160 ease-out-strong active:scale-[.97]';
const primaryButton = cn(pill, 'bg-primary px-5.5 text-primary-foreground');
const ghostButton = cn(pill, 'border border-border px-4.5 hover:border-muted-foreground');
const left = 'min-[920px]:col-start-1';
const stat = 'flex flex-col gap-1.5 rounded-xl border border-border p-3.5';
const figure = 'text-2xl/tight text-foreground tabular-nums';

const toBoard = (e: PointerEvent<SVGSVGElement>): Point => {
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
    e.currentTarget.getScreenCTM()!.inverse(),
  );
  return [p.x, p.y];
};

type Props = { locale: Locale; copy: UiCopy['game']['board'] };

const Board = ({ locale, copy }: Props) => {
  const [s, dispatch] = useReducer(reducer, 0, start);
  const { name, labels, edges } = levelAt(s.level);
  const { hit, count } = crossingSet(s.pos, edges);
  const clean = count === 0;
  const last = s.level === LEVELS.length - 1;
  const won = s.solved && !s.helped;
  // The pointer that holds a node. A second finger on the board must not move or drop it.
  const held = useRef<number | null>(null);
  // touch-action on SVG shapes is not honoured everywhere, and the board lets vertical swipes
  // scroll the page (pan-y). So a touch that starts on a node is cancelled here, before the
  // browser can turn it into a scroll. React's touch listeners are passive and cannot do this.
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as Element).closest('[data-node]')) e.preventDefault();
    };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    return () => el.removeEventListener('touchstart', onTouchStart);
  }, []);
  const drop = (e: PointerEvent) => {
    if (e.pointerId !== held.current) return;
    held.current = null;
    dispatch({ type: 'drop', at: Date.now() });
  };

  return (
    <>
      <p className={cn(left, 'font-mono text-caption text-muted-foreground')}>
        {fill(copy.level, { level: s.level + 1, total: LEVELS.length, name: name[locale] })}
      </p>

      <BoardFrame solved={won}>
        <svg
          ref={svg}
          role='group'
          aria-label={copy.network}
          viewBox='0 0 100 60'
          className='block w-full touch-pan-y rounded-[14px] bg-background select-none'
          onPointerMove={(e) =>
            e.pointerId === held.current && dispatch({ type: 'move', to: toBoard(e) })
          }
          onPointerUp={drop}
          onPointerCancel={drop}>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={s.pos[a]![0]}
              y1={s.pos[a]![1]}
              x2={s.pos[b]![0]}
              y2={s.pos[b]![1]}
              strokeWidth={hit.has(i) ? 2.5 : 1.75}
              strokeLinecap='round'
              vectorEffect='non-scaling-stroke'
              className={cn(
                'transition-[stroke] duration-200',
                hit.has(i) ? 'stroke-marker-red' : clean ? 'stroke-primary' : 'stroke-input',
              )}
            />
          ))}
          {s.pos.map(([x, y], i) => (
            <g
              key={labels[i]}
              data-node
              tabIndex={0}
              role='button'
              aria-label={fill(copy.node, { label: labels[i]! })}
              // The focus mark is the dot's own outline, not a box around the group.
              className='group cursor-grab touch-none outline-none'
              onPointerDown={(e) => {
                if (held.current !== null) return;
                held.current = e.pointerId;
                e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
                dispatch({ type: 'grab', node: i, at: Date.now() });
              }}
              onKeyDown={(e) => {
                const by = ARROWS[e.key];
                if (!by) return;
                e.preventDefault();
                dispatch({ type: 'nudge', node: i, by, at: Date.now() });
              }}>
              {/* Grab area: 44px across on a phone. */}
              <circle cx={x} cy={y} className='fill-transparent [r:6.5px] min-[920px]:[r:4.5px]' />
              <circle
                cx={x}
                cy={y}
                strokeWidth={2}
                vectorEffect='non-scaling-stroke'
                className={cn(
                  s.drag === i
                    ? 'fill-primary [r:3.6px] min-[920px]:[r:2.4px]'
                    : 'fill-background [r:2.85px] min-[920px]:[r:1.9px]',
                  clean
                    ? 'stroke-primary'
                    : 'stroke-muted-foreground group-hover:stroke-foreground',
                  'group-focus-visible:stroke-primary group-focus-visible:stroke-3',
                )}
              />
              <text
                x={x}
                y={y + 4.6}
                textAnchor='middle'
                className='pointer-events-none fill-muted-foreground font-mono text-[1.9px] max-[920px]:hidden'>
                {labels[i]}
              </text>
            </g>
          ))}
        </svg>
        {won && <Confetti />}
      </BoardFrame>

      <dl
        className={cn(left, 'grid grid-cols-3 gap-2 font-mono text-caption text-muted-foreground')}>
        <div className={stat}>
          <dt>{copy.crossings}</dt>
          <dd aria-live='polite' className={cn(figure, clean ? 'text-primary' : 'text-marker-red')}>
            {count}
          </dd>
        </div>
        <div className={stat}>
          <dt>{copy.movesLabel}</dt>
          <dd className={figure}>{s.moves}</dd>
        </div>
        <div className={stat}>
          <dt>{copy.lines}</dt>
          <dd className={figure}>{edges.length}</dd>
        </div>
      </dl>

      <div role='status' className={cn(left, 'min-[920px]:min-h-13')}>
        {won ? (
          <p className='text-lg/[1.4] font-medium'>
            {last ? copy.solvedAll : copy.solved}{' '}
            <span className='font-mono text-label font-normal text-muted-foreground'>
              {plural(locale, s.moves, copy.moves)}, {plural(locale, s.seconds, copy.seconds)}
            </span>
          </p>
        ) : s.solved ? (
          <p className='text-lg/[1.4] font-medium'>
            {copy.solutionShown}{' '}
            <span className='font-mono text-label font-normal text-muted-foreground'>
              {copy.tryYourself}
            </span>
          </p>
        ) : (
          <p className='font-mono text-caption/[1.6] text-muted-foreground pointer-coarse:hidden'>
            {copy.keyboard}
          </p>
        )}
      </div>

      <div className={cn(left, 'flex flex-wrap gap-2.5')}>
        {s.helped && (
          <button
            type='button'
            className={primaryButton}
            onClick={() => dispatch({ type: 'load', level: s.level })}>
            {copy.tryAgain}
          </button>
        )}
        {s.solved && (
          <button
            type='button'
            className={s.helped ? ghostButton : primaryButton}
            onClick={() => dispatch({ type: 'load', level: last ? 0 : s.level + 1 })}>
            {last ? copy.playAgain : copy.nextLevel}
          </button>
        )}
        {!s.helped && (
          <button
            type='button'
            className={ghostButton}
            onClick={() => dispatch({ type: 'load', level: s.level })}>
            {copy.reset}
          </button>
        )}
        {!s.solved && (
          <button
            type='button'
            className={cn(ghostButton, 'text-muted-foreground')}
            onClick={() => dispatch({ type: 'solve' })}>
            {copy.showSolution}
          </button>
        )}
      </div>
    </>
  );
};

export default Board;
