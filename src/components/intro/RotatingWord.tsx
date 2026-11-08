'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { WORD_HOLD_MS, wordSwap } from '@/design-system/motion';

// The server renders the first word; the swap starts after hydration.
const RotatingWord = ({ words }: { words: readonly string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), WORD_HOLD_MS);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className='inline-flex font-mono font-medium whitespace-nowrap text-primary'>
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={words[index]}
          data-rotating-word
          variants={wordSwap}
          initial='initial'
          animate='animate'
          exit='exit'
          className='inline-block'>
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span
        aria-hidden
        className='ml-0.5 inline-block h-[1.1em] w-[0.55em] animate-caret self-center bg-primary opacity-85'
      />
    </span>
  );
};

export default RotatingWord;
