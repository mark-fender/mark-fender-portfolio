'use client';
import { useInView } from 'motion/react';
import { type RefObject, useSyncExternalStore } from 'react';

const NEAR = '600px';

// Mount lazy content on the first Tab so keyboard navigation can reach it before scrolling.
let tabbing = false;
const listeners = new Set<() => void>();
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return;
  tabbing = true;
  window.removeEventListener('keydown', onKeyDown, true);
  listeners.forEach((notify) => notify());
};
if (typeof window !== 'undefined') window.addEventListener('keydown', onKeyDown, true);

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export default function useNearViewport(ref: RefObject<Element | null>) {
  const near = useInView(ref, { once: true, margin: NEAR });
  const keyboard = useSyncExternalStore(
    subscribe,
    () => tabbing,
    () => false,
  );
  return near || keyboard;
}
