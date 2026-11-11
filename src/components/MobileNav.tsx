'use client';
import { Equal } from 'lucide-react';
import { useRef, useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Props = {
  links: readonly { name: string; hash: string }[];
  active: string | undefined;
  onNavigate: (id: string) => void;
};

const MobileNav = ({ links, active, onNavigate }: Props) => {
  const [open, setOpen] = useState(false);
  // The sheet locks page scroll while open, so the jump waits until it has closed.
  const target = useRef<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type='button'
          aria-label='Open menu'
          className='inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground min-[680px]:hidden'>
          <Equal className='size-4.5' strokeWidth={1.75} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side='right'
        aria-describedby={undefined}
        className='bg-background'
        onCloseAutoFocus={() => {
          const hash = target.current;
          target.current = null;
          if (!hash) return;
          requestAnimationFrame(() => {
            history.pushState(null, '', hash);
            document.querySelector(hash)?.scrollIntoView();
          });
        }}>
        <SheetTitle className='px-6 pt-6 font-mono text-label font-normal text-muted-foreground'>
          Menu
        </SheetTitle>
        <nav aria-label='Primary'>
          <ul className='flex flex-col gap-1 px-3'>
            {links.map(({ name, hash }) => {
              const id = hash.slice(1);
              return (
                <li key={hash}>
                  <a
                    href={hash}
                    aria-current={active === id ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      target.current = hash;
                      onNavigate(id);
                      setOpen(false);
                    }}
                    className={cn(
                      'block rounded-md px-3 py-3 text-title',
                      active === id ? 'bg-surface-raised text-foreground' : 'text-muted-foreground',
                    )}>
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
