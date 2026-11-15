'use client';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { DECK_SCALE_STEP } from '@/design-system/motion';

const DECK_OFFSET_PX = 25;

type DeckCardProps = {
  index: number;
  total: number;
  progress: MotionValue<number>;
  cardRef: (el: HTMLDivElement | null) => void;
  children: ReactNode;
};

const DeckCard = ({ index, total, progress, cardRef, children }: DeckCardProps) => {
  const scale = useTransform(
    progress,
    [index / total, 1],
    [1, 1 - (total - index) * DECK_SCALE_STEP],
  );

  return (
    // Covered links must rise on keyboard focus; tapped toggles must not pin a card.
    <motion.div
      style={{ scale }}
      className='sticky top-24 has-focus-visible:z-10 motion-reduce:transform-none! sm:top-40'>
      <div
        ref={cardRef}
        style={{ top: index * DECK_OFFSET_PX }}
        className='relative flex flex-col *:flex-1'>
        {children}
      </div>
    </motion.div>
  );
};

// Cards come in as children, so they stay server components.
const ProjectDeck = ({ children }: { children: ReactNode }) => {
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: deck, offset: ['start end', 'end end'] });
  const items = Children.toArray(children);

  useEffect(() => {
    // Equal heights prevent taller cards from peeking out below the stack.
    const els = cards.current.filter((el) => el !== null);
    const equalize = () => {
      els.forEach((el) => (el.style.minHeight = ''));
      const tallest = Math.max(...els.map((el) => el.offsetHeight));
      els.forEach((el) => (el.style.minHeight = `${tallest}px`));
    };
    equalize();
    // Observe text so min-height does not prevent cards shrinking when a summary closes.
    const observer = new ResizeObserver(equalize);
    els.forEach((el) => el.querySelectorAll('h3, p, ul').forEach((text) => observer.observe(text)));
    return () => observer.disconnect();
  }, [items.length]);

  return (
    // Reserve overhang with margin: padding would change where sticky cards release.
    <div
      ref={deck}
      style={{ '--deck-overhang': `${(items.length - 1) * DECK_OFFSET_PX}px` } as CSSProperties}
      className='flex flex-col gap-8 max-[920px]:mb-(--deck-overhang)'>
      {items.map((card, i) => (
        <DeckCard
          key={(card as { key?: string }).key ?? i}
          index={i}
          total={items.length}
          progress={scrollYProgress}
          cardRef={(el) => {
            cards.current[i] = el;
          }}>
          {card}
        </DeckCard>
      ))}
    </div>
  );
};

export default ProjectDeck;
