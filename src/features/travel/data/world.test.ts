import { describe, expect, it } from 'vitest';
import { visited } from '@/content/travel';
import world from './world.json';

describe('world map', () => {
  it('has a shape for every visited place', () => {
    for (const code of visited) expect(world.countries[code].length).toBeGreaterThan(0);
    // Mainland, Madeira and the Azores: a rebuild of the map data must not lose the islands.
    expect(world.countries.PT.length).toBeGreaterThanOrEqual(3);
  });
});
