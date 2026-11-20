'use client';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import LanguageToggle from '@/components/layout/LanguageToggle';
import MobileNav from '@/components/layout/MobileNav';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { spring } from '@/design-system/motion';
import useActiveSection from '@/hooks/useActiveSection';
import type { Locale } from '@/lib/i18n';
import { cn, lightStyle } from '@/lib/utils';

export type HeaderCopy = {
  home: string;
  nav: string;
  openMenu: string;
  menu: string;
  closeMenu: string;
  theme: string;
  language: string;
};

type Props = {
  name: string;
  initials: string;
  links: readonly { name: string; hash: string }[];
  spy: readonly { id: string; nav: string }[];
  locale: Locale;
  copy: HeaderCopy;
};

const Header = ({ name, initials, links, spy, locale, copy }: Props) => {
  const [active, setActive] = useActiveSection(spy);
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    // Let the initial navbar layout settle before mounting the shared pill.
    const timeout = window.setTimeout(() => setShowHighlight(true), 400);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <header className='sticky top-0 z-40 bg-background/75 backdrop-blur-xl backdrop-saturate-150'>
      <div className='page-container flex flex-nowrap items-center justify-between gap-4 py-5 whitespace-nowrap'>
        <a
          href='#home'
          onClick={() => setActive('home')}
          className='flex shrink-0 items-center gap-3'>
          <span
            aria-hidden
            className='inline-flex size-9 items-center justify-center rounded-sm border border-primary font-mono text-label font-medium text-primary'>
            {initials}
          </span>
          <span aria-hidden className='text-ui font-medium max-[840px]:hidden'>
            {name}
          </span>
          <span className='sr-only'>{copy.home}</span>
        </a>

        <div className='flex shrink-0 flex-nowrap items-center gap-2'>
          <nav aria-label={copy.nav} className='max-[1000px]:hidden'>
            <ul
              style={lightStyle('nav')}
              className='glass relative flex flex-nowrap gap-0.5 rounded-full bg-card/60 p-1 text-ui'>
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
                        'relative block rounded-full px-3.5 py-2 transition-colors duration-fast',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}>
                      {isActive && showHighlight && (
                        <motion.span
                          initial={false}
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
          <LanguageToggle locale={locale} label={copy.language} />
          <ThemeToggle label={copy.theme} />
          <MobileNav links={links} active={active} onNavigate={setActive} copy={copy} />
        </div>
      </div>
    </header>
  );
};

export default Header;
