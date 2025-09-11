'use client';

import type { MotionValue } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';

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
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className='inline-block text-white'>
      {word}
      {!isLast && '\u00A0'}
    </motion.span>
  );
};

export default AnimatedWord;
