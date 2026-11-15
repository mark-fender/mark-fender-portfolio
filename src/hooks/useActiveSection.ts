'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Spy = readonly { id: string; nav: string }[];

// Scrolling past several sections quickly lights up only the one it stops on.
const SETTLE_MS = 100;
// Keep the clicked item active until scrolling settles.
const SCROLL_IDLE_MS = 150;
// Release even if no scroll starts or the mobile sheet is still closing.
const SCROLL_START_MS = 1000;

// Pin clicked links so intermediate sections do not flash during smooth scrolling.
export default function useActiveSection(spy: Spy) {
  const [active, setActive] = useState(spy[0]?.nav);
  const pinned = useRef(false);
  const pin = useRef(() => {});

  useEffect(() => {
    const navOf = new Map(spy.map((s) => [s.id, s.nav]));
    let current: string | undefined;
    let settle: number | undefined;
    let idle: number | undefined;

    const commit = () => {
      if (!pinned.current && current) setActive(navOf.get(current));
    };
    const unpin = () => {
      pinned.current = false;
      commit();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) current = e.target.id;
        });
        window.clearTimeout(settle);
        settle = window.setTimeout(commit, SETTLE_MS);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    spy.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      if (!pinned.current) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(unpin, SCROLL_IDLE_MS);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    pin.current = () => {
      pinned.current = true;
      window.clearTimeout(idle);
      idle = window.setTimeout(unpin, SCROLL_START_MS);
    };

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(settle);
      window.clearTimeout(idle);
      pinned.current = false;
    };
  }, [spy]);

  const select = useCallback((nav: string) => {
    pin.current();
    setActive(nav);
  }, []);

  return [active, select] as const;
}
