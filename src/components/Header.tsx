'use client';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useMemo, useState } from 'react';
import MobileNav from '@/components/MobileNav';
import ThemeToggle from '@/components/ThemeToggle';
import { spring } from '@/design-system/motion';
import useActiveSection from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

type Props = { links: readonly { name: string; hash: string }[] };

const Header = ({ links }: Props) => {
  const ids = useMemo(() => links.map((l) => l.hash.slice(1)), [links]);
  const [active, setActive] = useActiveSection(ids);

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  // Flips only when crossing the threshold, so scrolling doesn't re-render every frame.
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (y > 4 !== scrolled) setScrolled(y > 4);
  });

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-background transition-[border-color] duration-240',
        scrolled ? 'border-border' : 'border-transparent',
      )}>
      <div className='page-container flex flex-nowrap items-center justify-between gap-4 py-5 whitespace-nowrap'>
        <a
          href='#home'
          aria-label='Marek Lipčák — home'
          onClick={() => setActive('home')}
          className='flex shrink-0 items-center gap-3'>
          <span className='inline-flex size-9 items-center justify-center rounded-[10px] border border-primary font-mono text-label font-medium text-primary'>
            ML
          </span>
          <span className='text-[15px] font-medium max-[800px]:hidden'>Marek Lipčák</span>
        </a>

        <div className='flex shrink-0 flex-nowrap items-center gap-2'>
          <nav aria-label='Primary' className='max-[680px]:hidden'>
            <ul className='flex flex-nowrap gap-0.5 rounded-full border border-border bg-card p-1 text-sm'>
              {links.map(({ name, hash }) => {
                const id = hash.slice(1);
                const isActive = active === id;
                return (
                  <li key={hash}>
                    <a
                      href={hash}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => setActive(id)}
                      className={cn(
                        'relative block rounded-full px-3.5 py-2 transition-colors duration-160',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}>
                      {isActive && (
                        <motion.span
                          layoutId='nav-pill'
                          transition={spring.navPill}
                          className='absolute inset-0 rounded-full bg-surface-raised'
                        />
                      )}
                      <span className='relative'>{name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNav links={links} active={active} onNavigate={setActive} />
        </div>
      </div>
    </header>
  );
};

export default Header;
