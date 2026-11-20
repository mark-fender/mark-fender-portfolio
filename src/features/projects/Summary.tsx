'use client';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = { id: string; readMore: string; showLess: string; children: ReactNode };

const Summary = ({ id, readMore, showLess, children }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p
        id={id}
        className={cn(
          'max-w-measure text-body/[1.65] text-muted-foreground',
          !open && 'max-[920px]:line-clamp-2',
        )}>
        {children}
      </p>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className='-my-2.5 inline-flex min-h-11 items-center self-start text-ui font-medium text-primary underline underline-offset-4 min-[920px]:hidden'>
        {open ? showLess : readMore}
      </button>
    </>
  );
};

export default Summary;
