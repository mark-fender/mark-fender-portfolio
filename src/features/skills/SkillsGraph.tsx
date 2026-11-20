'use client';
import { motion, useInView, type TargetAndTransition, type Variants } from 'motion/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { SkillGroupId } from '@/content/skills';
import { duration, ease } from '@/design-system/motion';
import { cn } from '@/lib/utils';

type SkillGroupView = { id: SkillGroupId; name: string; chips: ReactNode };

// Wide layouts share one sequence; stacked cards start independently as they scroll into view.
const SEQUENCE: Record<SkillGroupId, { card: number; down?: number; rail?: number }> = {
  state: { card: 0, down: 0.5 },
  styling: { card: 0.14, down: 0.58, rail: 1.8 },
  frameworks: { card: 0.8, down: 1.28, rail: 1.88 },
  languages: { card: 1.42, rail: 1.96 },
  tooling: { card: 1.95 },
};
const NARROW_DOWN_S = 0.45;
const BORDER_DRAW_S = 1;
const WIDE_PX = 860;

const card = (hidden: TargetAndTransition, shown: TargetAndTransition): Variants => ({
  hidden,
  show: (delay: number) => ({
    ...shown,
    transition: {
      delay,
      duration: duration.enter,
      ease: ease.out,
      delayChildren: delay + 0.18,
      staggerChildren: 0.035,
    },
  }),
});

const entrances: Record<SkillGroupId, Variants> = {
  state: card({ opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1 }),
  styling: card({ opacity: 0, x: 40 }, { opacity: 1, x: 0 }),
  frameworks: card(
    { clipPath: 'inset(0% 0% 100% 0% round 14px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 14px)' },
  ),
  languages: card(
    { clipPath: 'inset(0% 100% 0% 0% round 14px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 14px)' },
  ),
  tooling: card({ opacity: 0, y: 10 }, { opacity: 1, y: 0 }),
};

// Leave room around the clip for connector end nodes.
const grow = (axis: 'down' | 'right'): Variants => ({
  hidden: {
    clipPath: axis === 'down' ? 'inset(-5px -5px 40px -5px)' : 'inset(-5px 40px -5px -5px)',
  },
  show: (delay: number) => ({
    clipPath: 'inset(-5px -5px -5px -5px)',
    transition: { delay, duration: duration.slow, ease: ease.out },
  }),
});

// The isolated grid keeps connectors behind cards without dropping them below the page.
const nodeEnds =
  'before:absolute before:size-[7px] before:rounded-full before:border before:border-input before:bg-background after:absolute after:size-[7px] after:rounded-full after:border after:border-input after:bg-background';

type Timing = { play: boolean; delay: number | undefined };

const Down = ({ play, delay, className }: Timing & { className?: string }) =>
  delay === undefined ? null : (
    <motion.span
      aria-hidden
      custom={delay}
      variants={grow('down')}
      initial='hidden'
      animate={play ? 'show' : 'hidden'}
      className={cn(
        'absolute top-full left-1/2 -z-10 h-(--skills-gap) w-px bg-input',
        nodeEnds,
        'before:-top-[3.5px] before:-left-[3px] after:-bottom-[3.5px] after:-left-[3px]',
        className,
      )}
    />
  );

const ToRail = ({ play, delay }: Timing) =>
  delay === undefined ? null : (
    <motion.span
      aria-hidden
      custom={delay}
      variants={grow('right')}
      initial='hidden'
      animate={play ? 'show' : 'hidden'}
      className={cn(
        'absolute top-1/2 left-full -z-10 hidden w-(--skills-gap) border-t border-dashed border-input @min-[860px]:block',
        nodeEnds,
        'before:-top-[4px] before:-left-[3.5px] after:-top-[4px] after:-right-[3.5px]',
      )}
    />
  );

// A growing solid stroke masks the dashed border; pixel sizing keeps dash lengths consistent.
const DrawnBorder = ({ play, delay }: { play: boolean; delay: number }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const mask = useId();
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const observer = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const rect = size && {
    x: 0.5,
    y: 0.5,
    width: size.w - 1,
    height: size.h - 1,
    rx: 13.5,
    fill: 'none',
  };
  return (
    <svg
      ref={ref}
      aria-hidden
      className='pointer-events-none absolute inset-0 size-full overflow-visible'>
      {rect && (
        <>
          <mask
            id={mask}
            maskUnits='userSpaceOnUse'
            x={-2}
            y={-2}
            width={size.w + 4}
            height={size.h + 4}>
            <motion.rect
              {...rect}
              stroke='#fff'
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: play ? 1 : 0 }}
              transition={{ delay, duration: BORDER_DRAW_S, ease: ease.inOut }}
            />
          </mask>
          <rect {...rect} mask={`url(#${mask})`} strokeDasharray='4 3' className='stroke-input' />
        </>
      )}
    </svg>
  );
};

const place: Record<SkillGroupId, string> = {
  state: 'order-1 @min-[860px]:col-start-1 @min-[860px]:row-start-1',
  styling: 'order-2 @min-[860px]:col-start-2 @min-[860px]:row-start-1',
  frameworks: 'order-3 @min-[860px]:col-span-2 @min-[860px]:col-start-1 @min-[860px]:row-start-2',
  languages: 'order-4 @min-[860px]:col-span-2 @min-[860px]:col-start-1 @min-[860px]:row-start-3',
  tooling: 'order-5 @min-[860px]:col-start-3 @min-[860px]:row-span-3 @min-[860px]:row-start-1',
};

const SkillCard = ({
  group,
  wide,
  stagePlay,
}: {
  group: SkillGroupView;
  wide: boolean;
  stagePlay: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const play = wide ? stagePlay : seen;
  const at = SEQUENCE[group.id];
  const delay = wide ? at.card : 0;
  const down = at.down === undefined ? undefined : wide ? at.down : NARROW_DOWN_S;
  const rail = wide ? at.rail : undefined;
  const tooling = group.id === 'tooling';

  return (
    <div ref={ref} className={cn('relative flex', place[group.id])}>
      <motion.div
        custom={tooling ? delay + 0.4 : delay}
        variants={entrances[group.id]}
        initial='hidden'
        animate={play ? 'show' : 'hidden'}
        className={cn(
          'relative flex flex-1 flex-col gap-4 rounded-tile border px-5 pt-4.5 pb-5.5 @min-[860px]:px-7 @min-[860px]:pt-5.5 @min-[860px]:pb-7',
          tooling ? 'border-transparent bg-background' : 'border-border bg-card',
        )}>
        <h3
          id={`skills-${group.id}`}
          className='font-mono text-caption font-normal text-muted-foreground'>
          {group.name}
        </h3>
        {group.chips}
      </motion.div>
      {tooling && <DrawnBorder play={play} delay={delay} />}
      <Down
        play={play}
        delay={down}
        className={group.id === 'languages' ? '@min-[860px]:hidden' : undefined}
      />
      <ToRail play={play} delay={rail} />
    </div>
  );
};

const SkillsGraph = ({ groups }: { groups: readonly SkillGroupView[] }) => {
  const container = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWide(el.clientWidth >= WIDE_PX));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const stagePlay = useInView(container, { once: true, amount: 0.35 });

  return (
    <div ref={container} className='@container'>
      <div className='isolate grid grid-cols-1 gap-(--skills-gap) [--skills-gap:--spacing(8)] @min-[860px]:grid-cols-[1.5fr_1fr_minmax(13rem,0.6fr)]'>
        {groups.map((group) => (
          <SkillCard key={group.id} group={group} wide={wide} stagePlay={stagePlay} />
        ))}
      </div>
    </div>
  );
};

export default SkillsGraph;
