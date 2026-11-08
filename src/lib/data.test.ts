import { describe, expect, it } from 'vitest';
import { navBarLinks, skillGroups, skillsData } from '@/lib/data';

describe('data', () => {
  it('puts every skill in exactly one group', () => {
    const grouped = skillGroups.flatMap((g) => g.items.map((s) => s.name));
    expect([...grouped].sort()).toEqual(skillsData.map((s) => s.name).sort());
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
