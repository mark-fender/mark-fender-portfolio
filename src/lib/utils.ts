import type { CSSProperties } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge must know the custom type scale, or it reads `text-section` as a colour and drops it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'statement',
            'section',
            'feature',
            'title',
            'lead',
            'body',
            'label',
            'caption',
          ],
        },
      ],
      shadow: [{ shadow: ['card'] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// A light direction in degrees (0-359) that looks random but is the same for the same seed on
// every render, server and client. FNV-1a over the seed's UTF-16 code units.
export const lightAngle = (seed: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 0x01000193);
  return (hash >>> 0) % 360;
};

export const lightStyle = (seed: string) =>
  ({ '--light-angle': `${lightAngle(seed)}deg` }) as CSSProperties;
