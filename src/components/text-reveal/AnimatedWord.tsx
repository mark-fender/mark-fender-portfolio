'use client';

import type { MotionValue } from 'motion/react';
import { motion, useMotionTemplate, useTransform } from 'motion/react';

export type AnimatedWordProps = {
  word: string;
  groupIndex: number;
  totalGroups: number;
  isLast: boolean;
  scrollYProgress: MotionValue<number>;
};

const AnimatedWord = ({
  word,
  groupIndex,
  totalGroups,
  isLast,
  scrollYProgress,
}: AnimatedWordProps) => {
  const maxProgress = 0.75;
  const step = maxProgress / totalGroups;
  const start = groupIndex * step;
  const end = start + step;
  // Motion can't interpolate between var() colours, so animate a number and let CSS mix them;
  // that also stays right when the theme changes.
  const mix = useTransform(scrollYProgress, [start, end], [0, 100]);
  const color = useMotionTemplate`color-mix(in srgb, var(--foreground) ${mix}%, var(--subtle-foreground))`;

  return (
    // Under reduced motion the !important class beats the inline colour, so markup stays the same.
    <motion.span style={{ color }} className='inline-block motion-reduce:text-foreground!'>
      {word}
      {!isLast && '\u00A0'}
    </motion.span>
  );
};

export default AnimatedWord;
