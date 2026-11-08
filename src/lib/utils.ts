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
            'reveal',
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
