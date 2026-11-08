'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = { current: boolean; last: boolean };

// Marker + segment for one timeline row. Scroll progress over the row (its top to its bottom
// crossing the viewport middle) fills the segment and marks the marker as passed.
// All motion values, so scrolling never re-renders.
const ExperienceRail = ({ current, last }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  // Reduced motion: everything shows as passed and filled.
  const fill = useTransform(scrollYProgress, (v) => (reduceMotion ? 1 : v));
  const passed = useTransform(scrollYProgress, (v) => (reduceMotion || v > 0 ? 1 : 0));

  return (
    <span ref={ref} aria-hidden className='absolute inset-y-0 left-0 w-3.5 min-[920px]:w-[18px]'>
      {!last && (
        <span className='absolute top-9 left-1.5 h-[calc(100%-4px)] w-0.5 overflow-hidden rounded-full bg-border min-[920px]:top-11 min-[920px]:left-2'>
          <motion.span
            style={{ scaleY: fill }}
            className='absolute inset-0 origin-top bg-muted-foreground'
          />
        </span>
      )}
      <span
        className={cn(
          'absolute top-5 left-0 size-3.5 rounded-full border-2 min-[920px]:top-[26px] min-[920px]:size-[18px]',
          current ? 'animate-now-ring border-primary bg-primary' : 'border-input bg-background',
        )}>
        {!current && (
          <motion.span
            style={{ opacity: passed }}
            className='absolute -inset-0.5 rounded-full bg-muted-foreground'
          />
        )}
      </span>
    </span>
  );
};

export default ExperienceRail;
