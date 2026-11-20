'use client';
import { useInView } from 'motion/react';
import dynamic from 'next/dynamic';
import { useRef, type ReactNode } from 'react';
import type { UiCopy } from '@/content/ui';
import { inView } from '@/design-system/motion';
import useNearViewport from '@/hooks/useNearViewport';
import type { Locale } from '@/lib/i18n';
import BoardFrame from './BoardFrame';

const Board = dynamic(() => import('./UntangleBoard'), {
  ssr: false,
  loading: () => <BoardFrame />,
});

type Props = { locale: Locale; copy: UiCopy['game']['board']; children: ReactNode };

const Game = ({ locale, copy, children }: Props) => {
  const grid = useRef<HTMLDivElement>(null);
  const near = useNearViewport(grid);
  const shown = useInView(grid, inView);

  return (
    <div
      ref={grid}
      className='grid gap-4 min-[920px]:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] min-[920px]:grid-rows-[repeat(4,auto)_1fr_auto] min-[920px]:gap-x-14 min-[920px]:gap-y-5'>
      {children}
      {near ? <Board locale={locale} copy={copy} shown={shown} /> : <BoardFrame shown={shown} />}
    </div>
  );
};

export default Game;
