'use client';

import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import AnimatedWord from '@/components/AnimatedWord';

type TextRevealOnScrollProps = {
  text: string;
  className?: string;
};

const TextRevealOnScroll = ({ text, className }: TextRevealOnScrollProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <AnimatedWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          totalWords={words.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

export default TextRevealOnScroll;
