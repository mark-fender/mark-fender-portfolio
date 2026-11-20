'use client';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import Image from 'next/image';
import type { PointerEvent, ReactNode } from 'react';
import { duration, ease, spring, TILT_MAX_DEG } from '@/design-system/motion';
import { cn, lightStyle } from '@/lib/utils';

const HOVER_SCALE = 1.02;
const PORTRAIT_LIGHT = lightStyle('portrait');

// Tilt follows a mouse pointer only; touch and reduced motion get a still card.
type Props = { alt: string; children: ReactNode; className?: string };

const PortraitCard = ({ alt, children, className }: Props) => {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(0, spring.tilt);
  const rotateY = useSpring(0, spring.tilt);
  const scale = useSpring(1, spring.tilt);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -2 * TILT_MAX_DEG);
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * TILT_MAX_DEG);
    scale.set(HOVER_SCALE);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    // Enters with y only: the portrait is the LCP element, so it never fades in from opacity 0.
    <motion.div
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: duration.enter, ease: ease.out, delay: 0.08 }}
      className={cn('perspective-midrange', className)}
      onPointerMove={onMove}
      onPointerLeave={reset}>
      <motion.figure
        style={{ rotateX, rotateY, scale, ...PORTRAIT_LIGHT }}
        className='glass relative m-0 rounded-2xl bg-surface-raised p-2.5 shadow-card'>
        {/* Keep the mobile LCP image visible throughout its entrance. */}
        <div className='overflow-hidden rounded-lg'>
          <Image
            src='/assets/photo.jpeg'
            alt={alt}
            width={800}
            height={800}
            preload
            sizes='(max-width: 452px) 100vw, 420px'
            className='aspect-4/5 w-full animate-develop object-cover object-[50%_28%] saturate-[.7] contrast-[1.04] [animation-delay:0.1s] motion-reduce:animate-none'
          />
        </div>
        <figcaption className='px-2 pt-3.5 pb-1'>{children}</figcaption>
      </motion.figure>
    </motion.div>
  );
};

export default PortraitCard;
