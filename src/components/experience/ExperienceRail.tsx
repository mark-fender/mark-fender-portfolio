'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = { current: boolean; last: boolean };

// Marker + segment for one timeline row. Scroll progress over the row (its top to its bottom
// crossing the viewport middle) fills the segment and marks the marker as passed.
// All motion values, so scrolling never re-renders.
const ExperienceRail = ({ current, last }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  // trackContentSize: opening or closing a row changes its height without a scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
    trackContentSize: true,
  });
  // Intended: the marker turns "passed" the moment its row's top crosses the middle.
  const passed = useTransform(scrollYProgress, (v) => (v > 0 ? 1 : 0));

  return (
    <span ref={ref} aria-hidden className='absolute inset-y-0 left-0 w-3.5 min-[920px]:w-[18px]'>
      {!last && (
        <span className='absolute top-9 left-1.5 h-[calc(100%-4px)] w-0.5 overflow-hidden rounded-full bg-border min-[920px]:top-11 min-[920px]:left-2'>
          {/* Reduced motion via CSS (beats the inline style), so server and client markup match. */}
          <motion.span
            style={{ scaleY: scrollYProgress }}
            className='absolute inset-0 origin-top bg-muted-foreground motion-reduce:transform-none!'
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
            className='absolute -inset-0.5 rounded-full bg-muted-foreground motion-reduce:opacity-100!'
          />
        )}
      </span>
    </span>
  );
};

export default ExperienceRail;
