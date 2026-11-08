'use client';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, type RefObject } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import { DECK_MIN_SCALE } from '@/design-system/motion';
import type { Project } from '@/lib/data';

const STACK_GAP_PX = 24; // each pinned card sits this much lower than the one before
const EDGE_PX = 16; // breathing room below the header and above the viewport bottom
const CARD_GAP_PX = 32; // flow gap between cards (matches gap-8)

type Pins = { start: number; end: number }[];

const DeckCard = ({
  project,
  index,
  total,
  scrollY,
  pins,
  wrapperRef,
  cardRef,
}: {
  project: Project;
  index: number;
  total: number;
  scrollY: MotionValue<number>;
  pins: RefObject<Pins>;
  wrapperRef: (el: HTMLDivElement | null) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const reduceMotion = useReducedMotion();
  // Scales only between this card pinning and the next card pinning over it.
  const scale = useTransform(scrollY, (y) => {
    const pin = pins.current[index];
    if (reduceMotion || !pin || pin.end <= pin.start) return 1;
    const t = Math.min(1, Math.max(0, (y - pin.start) / (pin.end - pin.start)));
    return 1 - t * (1 - DECK_MIN_SCALE);
  });

  return (
    <div ref={wrapperRef} data-deck-card className='sticky top-(--sticky-top)'>
      <motion.div ref={cardRef} style={{ scale }} className='origin-top'>
        <ProjectCard {...project} index={index} total={total} />
      </motion.div>
    </div>
  );
};

const ProjectDeck = ({ projects }: { projects: readonly Project[] }) => {
  const wrappers = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const pins = useRef<Pins>([]);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Height-aware sticky offsets: a card taller than the space below the header pins only once
    // its bottom is EDGE_PX above the viewport bottom, so no content is ever covered.
    const measure = () => {
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      const first = wrappers.current[0];
      if (!first) return;
      // Flow positions are summed from heights; sticky wrappers can't be measured in place.
      let flowTop = first.parentElement!.getBoundingClientRect().top + window.scrollY;
      const starts = cards.current.map((card, i) => {
        const height = card?.offsetHeight ?? 0; // offsetHeight ignores the scale transform
        const top = Math.min(
          header + EDGE_PX + i * STACK_GAP_PX,
          window.innerHeight - height - EDGE_PX,
        );
        wrappers.current[i]?.style.setProperty('--sticky-top', `${top}px`);
        const start = flowTop - top;
        flowTop += height + CARD_GAP_PX;
        return start;
      });
      pins.current = starts.map((start, i) => ({ start, end: starts[i + 1] ?? start }));
      scrollY.set(window.scrollY); // re-run the scale transforms with the new pins
    };
    measure();
    const observer = new ResizeObserver(measure);
    cards.current.forEach((card) => card && observer.observe(card));
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [scrollY]);

  return (
    <div className='flex flex-col gap-8'>
      {projects.map((project, i) => (
        <DeckCard
          key={project.title}
          project={project}
          index={i}
          total={projects.length}
          scrollY={scrollY}
          pins={pins}
          wrapperRef={(el) => {
            wrappers.current[i] = el;
          }}
          cardRef={(el) => {
            cards.current[i] = el;
          }}
        />
      ))}
    </div>
  );
};

export default ProjectDeck;
