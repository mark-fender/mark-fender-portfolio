'use client';
import type { ComponentProps, PointerEvent } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<'div'> & { interactive?: boolean };

// Moves the card-light spot with the pointer; a style write, not state, so no re-render.
const setLight = (e: PointerEvent<HTMLDivElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

// The only card hover implementation. Children react via group-hover/card:, never their own hover:.
const SurfaceCard = ({ interactive, className, ...props }: Props) => (
  <div
    onPointerMove={interactive ? setLight : undefined}
    className={cn(
      'group/card relative rounded-xl border border-border bg-card',
      interactive &&
        'card-light transition-[translate,background-color,border-color] duration-240 ease-out-strong hover:-translate-y-0.75 hover:border-input hover:bg-surface-raised',
      className,
    )}
    {...props}
  />
);

export default SurfaceCard;
