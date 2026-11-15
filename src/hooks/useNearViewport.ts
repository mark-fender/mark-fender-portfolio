'use client';
import { useInView } from 'motion/react';
import type { RefObject } from 'react';

// True once the element comes within this distance of the viewport, and stays true. Heavy
// islands (the game, the globe) load their code then, so it is ready by the time they scroll in.
const NEAR = '600px';

export default function useNearViewport(ref: RefObject<Element | null>) {
  return useInView(ref, { once: true, margin: NEAR });
}
