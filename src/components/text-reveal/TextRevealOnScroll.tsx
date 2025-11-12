'use client';

import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import AnimatedWord from '@/components/text-reveal/AnimatedWord';

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

  const wordsByParagraph = paragraphs.map((paragraph) => paragraph.split(' '));
  const totalWords = wordsByParagraph.reduce((sum, words) => sum + words.length, 0);
  const totalGroups = Math.ceil(totalWords / 2);
  const paragraphOffsets = wordsByParagraph.reduce<number[]>((offsets, _, index) => {
    if (index === 0) {
      offsets.push(0);
    } else {
      offsets.push(offsets[index - 1] + wordsByParagraph[index - 1].length);
    }
    return offsets;
  }, []);

  return (
    <div ref={ref} className={className}>
      {wordsByParagraph.map((words, pIndex) => {
        const wordOffset = paragraphOffsets[pIndex];
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
