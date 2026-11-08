'use client';

import { useScroll } from 'motion/react';
import { useRef } from 'react';
import AnimatedWord from '@/components/text-reveal/AnimatedWord';

type TextRevealOnScrollProps = {
  paragraphs: string[];
  className?: string;
};

const countWords = (paragraphs: string[][]) =>
  paragraphs.reduce((sum, words) => sum + words.length, 0);

const TextRevealOnScroll = ({ paragraphs, className }: TextRevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const wordsByParagraph = paragraphs.map((paragraph) => paragraph.split(' '));
  const totalWords = countWords(wordsByParagraph);
  const totalGroups = Math.ceil(totalWords / 2);

  return (
    <div ref={ref} className={className}>
      {wordsByParagraph.map((words, pIndex) => {
        const wordOffset = countWords(wordsByParagraph.slice(0, pIndex));
        const content = words.map((word, index) => {
          const globalIndex = wordOffset + index;
          return (
            <AnimatedWord
              key={`${word}-${globalIndex}`}
              word={word}
              groupIndex={Math.floor(globalIndex / 2)}
              totalGroups={totalGroups}
              isLast={globalIndex === totalWords - 1}
              scrollYProgress={scrollYProgress}
            />
          );
        });
        return <p key={pIndex}>{content}</p>;
      })}
    </div>
  );
};

export default TextRevealOnScroll;
