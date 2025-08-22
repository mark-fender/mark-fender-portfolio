'use client';

import type { MotionValue } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';

export type AnimatedWordProps = {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
};

const AnimatedWord = ({ word, index, totalWords, scrollYProgress }: AnimatedWordProps) => {
  const start = index / totalWords;
  const end = (index + 0.3) / totalWords;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className='inline-block text-white'>
      {word}
      {index < totalWords - 1 && '\u00A0'}
    </motion.span>
  );
};

export default AnimatedWord;
