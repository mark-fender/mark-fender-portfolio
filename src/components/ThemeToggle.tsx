'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

// Icons are CSS-switched (light:/dark: variants) so server and client markup match.
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next); // paint the new theme inside the transition
      setTheme(next); // persist; next-themes re-applies the same value
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return apply();
    document.startViewTransition(apply);
  };

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      onClick={toggle}
      className='inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground'>
      <span className='theme-icon'>
        <Sun className='size-4.5 light:hidden' strokeWidth={1.75} aria-hidden />
        <Moon className='hidden size-4.5 light:block' strokeWidth={1.75} aria-hidden />
      </span>
    </button>
  );
};

export default ThemeToggle;
