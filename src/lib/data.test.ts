import { describe, expect, it } from 'vitest';
import { navBarLinks, skillGroups } from '@/lib/data';

describe('data', () => {
  it('lists 22 unique skills across the groups', () => {
    const names = skillGroups.flatMap((g) => g.items.map((s) => s.name));
    expect(names).toHaveLength(22);
    expect(new Set(names).size).toBe(22);
  });

  it('derives the nav from the sections that are in it', () => {
    expect(navBarLinks.map((l) => l.hash)).toEqual([
      '#home',
      '#about',
      '#skills',
      '#experience',
      '#projects',
      '#contact',
    ]);
  });
});
