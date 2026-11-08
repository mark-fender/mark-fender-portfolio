'use client';
import { useEffect, useState } from 'react';

type Spy = readonly { id: string; nav: string }[];

// A section is active while it crosses the vertical middle of the viewport; it lights up the nav
// item it maps to.
export default function useActiveSection(spy: Spy) {
  const [active, setActive] = useState(spy[0]?.nav);
  useEffect(() => {
    const navOf = new Map(spy.map((s) => [s.id, s.nav]));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(navOf.get(e.target.id))),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    spy.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [spy]);
  return [active, setActive] as const;
}
