'use client';
import { animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useReducer, useRef, useState, type PointerEvent } from 'react';
import type { UiCopy } from '@/content/ui';
import { delayed, duration, ease, stagger, variants } from '@/design-system/motion';
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
  'inline-flex min-h-11 items-center rounded-full text-ui font-medium transition-[scale,border-color,opacity] duration-fast ease-out-strong active:scale-[.97] aria-disabled:pointer-events-none aria-disabled:opacity-45';
const primaryButton = cn(pill, 'bg-primary px-5.5 text-primary-foreground');
const ghostButton = cn(pill, 'border border-border px-4.5 hover:border-muted-foreground');
const left = 'min-[920px]:col-start-1';
const stat = 'flex flex-col gap-1.5 rounded-xl border border-border p-3.5';
const figure = 'text-2xl/tight text-foreground tabular-nums';

const NODE_S = 0.32;
const NODES_S = 0.7;
const LINES_S = 0.95;
// The first round waits for the board's frame to arrive.
const FIRST_LEAD_S = 0.5;

type Intro = { phase: 'nodes' | 'lines' | 'done'; reach: number };

const toBoard = (e: PointerEvent<SVGSVGElement>): Point => {
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
    e.currentTarget.getScreenCTM()!.inverse(),
  );
  return [p.x, p.y];
};

type Props = { locale: Locale; copy: UiCopy['game']['board']; shown: boolean };

const Board = ({ locale, copy, shown }: Props) => {
  const [s, dispatch] = useReducer(reducer, 0, start);
  const { name, labels, edges } = levelAt(s.level);
  const { hit, count } = crossingSet(s.pos, edges);
  const clean = count === 0;
  const last = s.level === LEVELS.length - 1;
  const won = s.solved && !s.helped;

  const [round, setRound] = useState(0);
  const [intro, setIntro] = useState<Intro>({ phase: 'nodes', reach: 0 });
  const reduce = useReducedMotion();
  const phase = reduce ? 'done' : shown ? intro.phase : 'waiting';
  const reach = reduce ? 1 : intro.reach;
  const playable = phase === 'done';
  const lead = round === 0 ? FIRST_LEAD_S : 0;
  const step = NODES_S / Math.max(labels.length - 1, 1);

  useEffect(() => {
    if (!shown || reduce) return;
    let lines: ReturnType<typeof animate> | undefined;
    const timer = setTimeout(
      () => {
        setIntro({ phase: 'lines', reach: 0 });
        lines = animate(0, 1, {
          duration: LINES_S,
          ease: ease.inOut,
          onUpdate: (value) => setIntro({ phase: 'lines', reach: value }),
          onComplete: () => setIntro({ phase: 'done', reach: 1 }),
        });
      },
      (lead + NODES_S + NODE_S * 0.5) * 1000,
    );
    return () => {
      clearTimeout(timer);
      lines?.stop();
    };
  }, [shown, reduce, round, lead]);

  const load = (level: number) => {
    if (!playable) return;
    dispatch({ type: 'load', level });
    setIntro({ phase: 'nodes', reach: 0 });
    setRound((r) => r + 1);
  };

  // The pointer that holds a node. A second finger on the board must not move or drop it.
  const held = useRef<number | null>(null);
  // React's passive touch listeners cannot stop node drags from scrolling on some browsers.
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

  const neighbours = labels.map((_, i) =>
    edges.flatMap(([a, b]) => (a === i ? [labels[b]] : b === i ? [labels[a]] : [])).join(', '),
  );

  // Keep focus in the controls when the pressed button disappears after a round changes.
  const controls = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const press = (action: () => void) => () => {
    if (!playable) return;
    refocus.current = true;
    action();
  };
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    const box = controls.current;
    if (box && !box.contains(document.activeElement)) box.querySelector('button')?.focus();
  }, [s.helped, s.solved, round]);

  // The column's entrance plays once, with the board's. A board that loads after that is already in.
  const enter = shown ? 'show' : 'hidden';
  const [from] = useState(() => (shown ? false : ('hidden' as const)));

  return (
    <>
      <motion.p
        initial={from}
        animate={enter}
        variants={delayed(variants.fromLeft, 0.25)}
        className={cn(left, 'font-mono text-caption text-muted-foreground')}>
        {fill(copy.level, { level: s.level + 1, total: LEVELS.length, name: name[locale] })}
      </motion.p>

      <BoardFrame solved={won} shown={shown}>
        <svg
          ref={svg}
          role='group'
          aria-label={copy.network}
          aria-busy={!playable}
          viewBox='0 0 100 60'
          className={cn(
            'block w-full touch-pan-y rounded-tile bg-background select-none',
            !playable && 'pointer-events-none',
          )}
          onPointerMove={(e) =>
            e.pointerId === held.current && dispatch({ type: 'move', to: toBoard(e) })
          }
          onPointerUp={drop}
          onPointerCancel={drop}>
          {(phase === 'lines' || phase === 'done') &&
            edges.map(([a, b], i) => {
              const [x1, y1] = s.pos[a]!;
              const [x2, y2] = s.pos[b]!;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x1 + (x2 - x1) * reach}
                  y2={y1 + (y2 - y1) * reach}
                  strokeWidth={playable && hit.has(i) ? 2.5 : 1.75}
                  strokeLinecap='round'
                  vectorEffect='non-scaling-stroke'
                  className={cn(
                    'transition-[stroke] duration-fast',
                    !playable
                      ? 'stroke-input'
                      : hit.has(i)
                        ? 'stroke-marker-red'
                        : clean
                          ? 'stroke-primary'
                          : 'stroke-input',
                  )}
                />
              );
            })}
          {s.pos.map(([x, y], i) => (
            <g
              // A new round mounts fresh nodes, so they pop in again.
              key={`${round}-${labels[i]}`}
              data-node
              // Keep the board in the tab order while its intro plays.
              tabIndex={0}
              role='button'
              aria-disabled={!playable || undefined}
              aria-label={`${fill(copy.node, { label: labels[i]! })} ${fill(copy.connects, { list: neighbours[i]! })}`}
              className='group cursor-grab touch-none outline-none'
              onPointerDown={(e) => {
                if (!playable || held.current !== null) return;
                held.current = e.pointerId;
                e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
                dispatch({ type: 'grab', node: i, at: Date.now() });
              }}
              onKeyDown={(e) => {
                const by = ARROWS[e.key];
                if (!by || !playable) return;
                e.preventDefault();
                dispatch({ type: 'nudge', node: i, by, at: Date.now() });
              }}>
              <motion.g
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={phase === 'waiting' ? undefined : { scale: 1, opacity: 1 }}
                transition={{ delay: lead + i * step, duration: NODE_S, ease: ease.out }}>
                {/* Grab area: 44px across on a phone. */}
                <circle
                  cx={x}
                  cy={y}
                  className='fill-transparent [r:6.5px] min-[920px]:[r:4.5px]'
                />
                {/* A separate ring stays visible when solved nodes turn primary. */}
                <circle
                  cx={x}
                  cy={y}
                  strokeWidth={2}
                  vectorEffect='non-scaling-stroke'
                  className='fill-none stroke-foreground opacity-0 group-focus-visible:opacity-100 [r:5px] min-[920px]:[r:3.4px]'
                />
                <circle
                  cx={x}
                  cy={y}
                  strokeWidth={2}
                  vectorEffect='non-scaling-stroke'
                  className={cn(
                    s.drag === i
                      ? 'fill-primary [r:3.6px] min-[920px]:[r:2.4px]'
                      : 'fill-background [r:2.85px] min-[920px]:[r:1.9px]',
                    playable && clean
                      ? 'stroke-primary'
                      : 'stroke-muted-foreground group-hover:stroke-foreground',
                    'group-focus-visible:stroke-primary group-focus-visible:stroke-3',
                  )}
                />
              </motion.g>
              <motion.text
                x={x}
                y={y + 4.6}
                textAnchor='middle'
                initial={reduce ? false : { opacity: 0 }}
                animate={phase === 'waiting' ? undefined : { opacity: 1 }}
                transition={{ delay: lead + i * step + 0.12, duration: duration.base }}
                className='pointer-events-none fill-muted-foreground font-mono text-[1.9px] max-[920px]:hidden'>
                {labels[i]}
              </motion.text>
            </g>
          ))}
        </svg>
        {won && <Confetti />}
      </BoardFrame>
      <p aria-live='polite' className='sr-only'>
        {s.moves > 0 && !s.solved ? plural(locale, count, copy.crossingsLeft) : ''}
      </p>

      <motion.dl
        initial={from}
        animate={enter}
        variants={stagger(0.07, 0.32)}
        className={cn(left, 'grid grid-cols-3 gap-2 font-mono text-caption text-muted-foreground')}>
        <motion.div variants={variants.fromLeft} className={stat}>
          <dt>{copy.crossings}</dt>
          <dd className={cn(figure, clean ? 'text-primary' : 'text-marker-red')}>{count}</dd>
        </motion.div>
        <motion.div variants={variants.fromLeft} className={stat}>
          <dt>{copy.movesLabel}</dt>
          <dd className={figure}>{s.moves}</dd>
        </motion.div>
        <motion.div variants={variants.fromLeft} className={stat}>
          <dt>{copy.lines}</dt>
          <dd className={figure}>{edges.length}</dd>
        </motion.div>
      </motion.dl>

      <motion.div
        role='status'
        initial={from}
        animate={enter}
        variants={delayed(variants.fromLeft, 0.5)}
        className={cn(left, 'min-[920px]:min-h-13')}>
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
      </motion.div>

      {/* aria-disabled keeps focus on the pressed button while the next round opens. */}
      <motion.div
        ref={controls}
        initial={from}
        animate={enter}
        variants={delayed(variants.fromLeft, 0.58)}
        className={cn(left, 'flex flex-wrap gap-2.5')}>
        {s.helped && (
          <button
            type='button'
            aria-disabled={!playable || undefined}
            className={primaryButton}
            onClick={press(() => load(s.level))}>
            {copy.tryAgain}
          </button>
        )}
        {s.solved && (
          <button
            type='button'
            aria-disabled={!playable || undefined}
            className={s.helped ? ghostButton : primaryButton}
            onClick={press(() => load(last ? 0 : s.level + 1))}>
            {last ? copy.playAgain : copy.nextLevel}
          </button>
        )}
        {!s.helped && (
          <button
            type='button'
            aria-disabled={!playable || undefined}
            className={ghostButton}
            onClick={press(() => load(s.level))}>
            {copy.reset}
          </button>
        )}
        {!s.solved && (
          <button
            type='button'
            aria-disabled={!playable || undefined}
            className={cn(ghostButton, 'text-muted-foreground')}
            onClick={press(() => dispatch({ type: 'solve' }))}>
            {copy.showSolution}
          </button>
        )}
      </motion.div>
    </>
  );
};

export default Board;
