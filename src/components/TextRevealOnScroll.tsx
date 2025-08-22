'use client';

import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import AnimatedWord from '@/components/AnimatedWord';

type TextRevealOnScrollProps = {
  paragraphs: string[];
  className?: string;
};

const TextRevealOnScroll = ({ paragraphs, className }: TextRevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const allWords = paragraphs.flatMap((p) => p.split(' '));
  const totalGroups = Math.ceil(allWords.length / 2);
  let wordOffset = 0;

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((paragraph, pIndex) => {
        const words = paragraph.split(' ');
        const content = words.map((word, index) => {
          const globalIndex = wordOffset + index;
          return (
            <AnimatedWord
              key={`${word}-${globalIndex}`}
              word={word}
              groupIndex={Math.floor(globalIndex / 2)}
              totalGroups={totalGroups}
              isLast={globalIndex === allWords.length - 1}
              scrollYProgress={scrollYProgress}
            />
          );
        });
        wordOffset += words.length;
        return <p key={pIndex}>{content}</p>;
      })}
    </div>
  );
};

export default TextRevealOnScroll;
