'use client';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import NowDot from '@/components/NowDot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { duration, ease, inView as inViewOptions, spring } from '@/design-system/motion';
import { lightStyle } from '@/lib/utils';

type TimelineRole = {
  company: string;
  year: number;
  months: number;
  current: boolean;
  range: string;
};

type Props = { label: string; roles: readonly TimelineRole[]; panels: readonly ReactNode[] };

// Linear rail timing lets each tile arrive when the line reaches its measured position.
const DRAW_DELAY_S = 0.1;
const DRAW_S = 1.2;
const PANEL_DELAY_S = 0.75;
const PANEL_SHIFT_PX = 28;
// Keep focus outlines clear of the panel's clip.
const CLIP_PAD_PX = 4;

const tile: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: duration.item, ease: ease.out },
  }),
};

const node: Variants = {
  hidden: { scale: 0 },
  show: (delay: number) => ({
    scale: 1,
    transition: { delay, duration: duration.slow, ease: ease.out },
  }),
};

// Keyframes let returning panels enter from the current direction.
const panel: Variants = {
  hidden: { opacity: 0 },
  show: ({ dir, delay }: { dir: number; delay: number }) => ({
    opacity: [0, 1],
    x: [dir * PANEL_SHIFT_PX, 0],
    transition: {
      delay,
      duration: duration.slow,
      ease: ease.out,
      staggerChildren: 0.045,
      delayChildren: delay + 0.05,
    },
  }),
};

const ExperienceTimeline = ({ label, roles, panels }: Props) => {
  const current = roles.find((r) => r.current) ?? roles.at(-1)!;
  const [value, setValue] = useState(current.company);
  const [dir, setDir] = useState(0);
  const reduce = useReducedMotion();

  const root = useRef<HTMLDivElement>(null);
  const seen = useInView(root, inViewOptions);
  // Measure rendered starts because minimum tile widths and gaps distort date proportions.
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const [starts, setStarts] = useState<number[] | null>(null);
  useEffect(() => {
    if (!seen || starts) return;
    const width = cells.current.at(-1)?.parentElement?.clientWidth || 1;
    setStarts(cells.current.map((cell) => (cell?.offsetLeft ?? 0) / width));
  }, [seen, starts]);
  const play = starts !== null;
  const reach = (fraction: number) => DRAW_DELAY_S + fraction * DRAW_S;
  const [opened, setOpened] = useState(false);

  // Animate height on selection; jump immediately when text reflows.
  const inner = useRef<HTMLDivElement>(null);
  const height = useMotionValue<number | 'auto'>('auto');
  const switching = useRef(false);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const next = el.offsetHeight + CLIP_PAD_PX * 2;
      if (switching.current && !reduce && typeof height.get() === 'number') {
        animate(height, next, { duration: duration.slow, ease: ease.out });
      } else {
        // jump, not set: it also stops a tween still heading for the old height.
        height.jump(next);
      }
      switching.current = false;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [height, reduce]);

  const select = (next: string) => {
    const from = roles.findIndex((r) => r.company === value);
    const to = roles.findIndex((r) => r.company === next);
    setDir(Math.sign(to - from));
    switching.current = true;
    setOpened(true);
    setValue(next);
  };

  const flex = (r: TimelineRole) => `${r.months} 1 44px`;

  return (
    <Tabs value={value} onValueChange={select}>
      <div ref={root}>
        {/* Radix focuses clicked tabs; track input so only keyboard selection shows a ring. */}
        <TabsList
          aria-label={label}
          data-input='keyboard'
          onPointerDown={(e) => (e.currentTarget.dataset.input = 'pointer')}
          onKeyDown={(e) => (e.currentTarget.dataset.input = 'keyboard')}
          className='group/tabs flex items-stretch gap-1.5'>
          {roles.map((role, i) => (
            <TabsTrigger key={role.company} value={role.company} asChild>
              <motion.button
                custom={reach(starts?.[i] ?? 0)}
                variants={tile}
                initial='hidden'
                animate={play ? 'show' : 'hidden'}
                style={{ flex: flex(role) }}
                className='flex min-h-13 min-w-11 flex-col justify-between gap-2 overflow-hidden rounded-tile border border-border bg-card px-1.5 py-2 text-left text-muted-foreground transition-[background-color,color] duration-fast hover:bg-surface-raised/60 hover:text-foreground focus-visible:outline-muted-foreground group-data-[input=pointer]/tabs:outline-none data-[state=active]:bg-surface-raised data-[state=active]:text-foreground min-[820px]:min-h-21 min-[820px]:p-3'>
                <span
                  aria-hidden
                  className='flex flex-col items-start gap-1.5 font-mono text-caption whitespace-nowrap text-muted-foreground min-[820px]:flex-row min-[820px]:items-center min-[820px]:gap-2'>
                  {role.year}
                  {role.current && (
                    <NowDot className='shrink-0 max-[820px]:mr-0.5 max-[820px]:self-end' />
                  )}
                </span>
                <span
                  aria-hidden
                  className='truncate text-label font-medium max-[820px]:hidden min-[1024px]:text-ui'>
                  {role.company}
                </span>
                {/* Starts with the visible text (year, company), so voice control can name the tab. */}
                <span className='sr-only'>
                  {role.year} {role.company}, {role.range}
                </span>
              </motion.button>
            </TabsTrigger>
          ))}
        </TabsList>

        <div aria-hidden className='relative mt-3.5 flex h-2 gap-1.5'>
          <motion.span
            className='absolute inset-x-0 top-[3.5px] h-px origin-left bg-input'
            initial={{ scaleX: 0 }}
            animate={{ scaleX: play ? 1 : 0 }}
            transition={{ delay: DRAW_DELAY_S, duration: DRAW_S, ease: 'linear' }}
          />
          {roles.map((role, i) => (
            <div
              key={role.company}
              ref={(el) => {
                cells.current[i] = el;
              }}
              style={{ flex: flex(role) }}
              className='relative'>
              {play && role.company === value && (
                <motion.span
                  layoutId='experience-role'
                  initial={opened ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    ...spring.navPill,
                    opacity: { delay: reach(1), duration: duration.slow },
                  }}
                  className='absolute inset-x-0 top-0.5 h-1 rounded-full bg-foreground'
                />
              )}
              <motion.span
                custom={reach(starts?.[i] ?? 0)}
                variants={node}
                initial='hidden'
                animate={play ? 'show' : 'hidden'}
                className='absolute top-0 -left-0.75 size-1.75 rounded-full border border-input bg-background'
              />
            </div>
          ))}
          <motion.span
            custom={reach(1)}
            variants={node}
            initial='hidden'
            animate={play ? 'show' : 'hidden'}
            className='absolute top-0 -right-0.75 size-1.75 rounded-full bg-primary'
          />
        </div>
      </div>

      <div
        style={lightStyle(value)}
        className='glass relative mt-6 rounded-2xl bg-card p-4 min-[920px]:p-7'>
        <motion.div style={{ height, padding: CLIP_PAD_PX }} className='overflow-hidden'>
          <div ref={inner}>
            {roles.map((role, i) => (
              <TabsContent
                key={role.company}
                value={role.company}
                forceMount
                className='rounded-lg focus-visible:outline-muted-foreground data-[state=inactive]:hidden'>
                <motion.div
                  custom={{ dir, delay: opened ? 0 : PANEL_DELAY_S }}
                  variants={panel}
                  initial='hidden'
                  animate={play && role.company === value ? 'show' : 'hidden'}
                  className='flex flex-wrap gap-x-14 gap-y-6'>
                  {panels[i]}
                </motion.div>
              </TabsContent>
            ))}
          </div>
        </motion.div>
      </div>
    </Tabs>
  );
};

export default ExperienceTimeline;
