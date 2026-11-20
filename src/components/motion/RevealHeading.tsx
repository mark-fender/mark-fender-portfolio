import * as m from 'motion/react-client';
import { Fragment } from 'react';
import { inView, stagger, variants } from '@/design-system/motion';

type Props = { text: string; className?: string };

// Padding protects descenders; the negative margin preserves line height.
const RevealHeading = ({ text, className }: Props) => {
  const words = text.split(' ');
  return (
    <m.h2
      className={className}
      initial='hidden'
      whileInView='show'
      viewport={inView}
      variants={stagger(0.06)}>
      {words.map((word, i) => (
        // The space sits between the masks: inside one it would be trimmed at the line end.
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className='-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top'>
            <m.span className='inline-block' variants={variants.word}>
              {word}
            </m.span>
          </span>
        </Fragment>
      ))}
    </m.h2>
  );
};

export default RevealHeading;
