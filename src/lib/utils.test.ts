import { describe, expect, it } from 'vitest';
import { clamp, cn, lightAngle, lightStyle } from '@/lib/utils';

describe('cn', () => {
  it('keeps a custom font size next to a colour', () => {
    expect(cn('text-section', 'text-muted-foreground')).toBe('text-section text-muted-foreground');
  });

  it('still lets a later font size win', () => {
    expect(cn('text-section', 'text-title')).toBe('text-title');
  });
});

describe('clamp', () => {
  it('keeps a value inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(12, 0, 10)).toBe(10);
  });
});

describe('lightAngle', () => {
  it('gives the same angle for the same seed', () => {
    expect(lightAngle('«R1»')).toBe(lightAngle('«R1»'));
  });

  it('stays in 0–359 and spreads different seeds apart', () => {
    const angles = Array.from({ length: 50 }, (_, i) => lightAngle(`«R${i}»`));
    for (const angle of angles) expect(angle).toBeGreaterThanOrEqual(0);
    for (const angle of angles) expect(angle).toBeLessThan(360);
    expect(new Set(angles.map((a) => Math.floor(a / 45))).size).toBeGreaterThan(5);
  });

  it('formats a seed as an angle-valued CSS custom property', () => {
    expect(lightStyle('«R1»')).toEqual({ '--light-angle': `${lightAngle('«R1»')}deg` });
    expect(Number.isFinite(lightAngle(''))).toBe(true);
  });
});
