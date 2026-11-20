'use client';
import { Equal } from 'lucide-react';
import { useRef, useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn, lightStyle } from '@/lib/utils';

type Props = {
  links: readonly { name: string; hash: string }[];
  active: string | undefined;
  onNavigate: (id: string) => void;
  copy: { nav: string; openMenu: string; menu: string; closeMenu: string };
};

const MobileNav = ({ links, active, onNavigate, copy }: Props) => {
  const [open, setOpen] = useState(false);
  // The sheet locks page scroll while open, so the jump waits until it has closed.
  const target = useRef<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type='button'
          aria-label={copy.openMenu}
          style={lightStyle('menu')}
          className='glass relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-card/60 text-foreground min-[1000px]:hidden'>
          <Equal className='size-4.5' strokeWidth={1.75} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side='right'
        closeLabel={copy.closeMenu}
        aria-describedby={undefined}
        className='bg-background'
        onCloseAutoFocus={(e) => {
          const hash = target.current;
          target.current = null;
          if (!hash) return;
          // Move focus to the destination so the next Tab continues there.
          e.preventDefault();
          requestAnimationFrame(() => {
            history.pushState(null, '', hash);
            const section = document.querySelector<HTMLElement>(hash);
            if (!section) return;
            section.scrollIntoView();
            if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1');
            section.focus({ preventScroll: true });
          });
        }}>
        <SheetTitle className='px-6 pt-6 font-mono text-label font-normal text-muted-foreground'>
          {copy.menu}
        </SheetTitle>
        <nav aria-label={copy.nav}>
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
