import { describe, expect, it } from 'vitest';
import { navBarLinks, skillGroups, spySections } from '@/lib/data';

describe('data', () => {
  it('lists 22 unique skills across the groups', () => {
    const names = skillGroups.flatMap((g) => g.items.map((s) => s.name));
    expect(names).toHaveLength(22);
    expect(new Set(names).size).toBe(22);
  });

  it('maps off-nav sections to the nav section before them', () => {
    expect(spySections.find((s) => s.id === 'off-the-clock')?.nav).toBe('projects');
    expect(spySections.every((s) => navBarLinks.some((l) => l.hash === `#${s.nav}`))).toBe(true);
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
