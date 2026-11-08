import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('keeps a custom font size next to a colour', () => {
    expect(cn('text-section', 'text-muted-foreground')).toBe('text-section text-muted-foreground');
  });

  it('still lets a later font size win', () => {
    expect(cn('text-section', 'text-title')).toBe('text-title');
  });
});
