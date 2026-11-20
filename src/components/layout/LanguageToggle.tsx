'use client';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import { LOCALE_COOKIE, localePath, otherLocale, type Locale } from '@/lib/i18n';
import { lightStyle } from '@/lib/utils';

const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365;
// Release the view transition if navigation stalls.
const SWITCH_TIMEOUT_MS = 3000;
// Where the reader is reading: just under the sticky header (scroll-pt-24 on <html>).
const READ_LINE_PX = 96;

// Preserve progress within a section because translations have different heights.
type Place = { id: string; at: number };

const findPlace = (): Place | null => {
  let found: HTMLElement | null = null;
  for (const el of document.querySelectorAll<HTMLElement>('main section[id]'))
    if (el.getBoundingClientRect().top <= READ_LINE_PX) found = el;
  if (!found) return null;
  const { top, height } = found.getBoundingClientRect();
  return { id: found.id, at: (READ_LINE_PX - top) / height };
};

const restore = ({ id, at }: Place) => {
  const el = document.getElementById(id);
  if (!el) return;
  const { top, height } = el.getBoundingClientRect();
  // Instant: <html> scrolls smoothly, which would animate the jump.
  window.scrollBy({ top: top + at * height - READ_LINE_PX, behavior: 'instant' });
};

// Hold the reading position while the project deck settles, until the visitor scrolls.
const SETTLE_MS = 1000;
const hold = (place: Place) => {
  restore(place);
  let y = scrollY;
  const observer = new ResizeObserver(() => {
    if (Math.abs(scrollY - y) > 1) return observer.disconnect();
    restore(place);
    y = scrollY;
  });
  observer.observe(document.body);
  setTimeout(() => observer.disconnect(), SETTLE_MS);
};

// Kept in the module: the header may remount with the new page, the module stays loaded.
let pending: { to: Locale; place: Place | null; refocus: boolean; done: () => void } | null = null;

type Props = {
  locale: Locale;
  label: string;
};

const LanguageToggle = ({ locale, label }: Props) => {
  const router = useRouter();
  const self = useRef<HTMLAnchorElement>(null);
  const to = otherLocale(locale);
  // /en clears a saved Slovak cookie for new tabs and navigation without JavaScript.
  const href = localePath(to);
  const linkHref = `/${to}`;

  useLayoutEffect(() => {
    if (pending?.to !== locale) return;
    const { place, refocus, done } = pending;
    pending = null;
    if (place) hold(place);
    if (refocus) self.current?.focus({ preventScroll: true });
    done();
  }, [locale]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    document.cookie = `${LOCALE_COOKIE}=${to}; path=/; max-age=${COOKIE_MAX_AGE_S}; samesite=lax`;
    const place = findPlace();
    const refocus = document.activeElement === e.currentTarget;
    const go = () =>
      new Promise<void>((resolve) => {
        pending = { to, place, refocus, done: resolve };
        router.push(href, { scroll: false });
        setTimeout(resolve, SWITCH_TIMEOUT_MS);
      });
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return void go();
    document.startViewTransition(go);
  };

  const prefetch = () => router.prefetch(href);

  return (
    <a
      ref={self}
      href={linkHref}
      hrefLang={to}
      onClick={onClick}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      style={lightStyle('language-toggle')}
      className='glass relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-card/60 font-mono text-label font-medium text-foreground'>
      <span className='language-icon'>{locale.toUpperCase()}</span>
      <span className='sr-only'>, {label}</span>
    </a>
  );
};

export default LanguageToggle;
