import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getListening } = vi.hoisted(() => ({ getListening: vi.fn() }));
vi.mock('@/features/off-the-clock', () => ({ getListening }));

import { GET } from './route';

beforeEach(() => getListening.mockReset());

describe('GET /api/listening', () => {
  it('returns the listening result as JSON with a bounded CDN cache', async () => {
    const track = {
      title: 'Says',
      artist: 'Nils Frahm',
      url: 'https://open.spotify.com/track/1',
      playing: true,
    };
    getListening.mockResolvedValue(track);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(track);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toBe(
      'public, s-maxage=30, stale-while-revalidate=30',
    );
    expect(getListening).toHaveBeenCalledTimes(1);
  });

  it('returns JSON null when Spotify is unavailable', async () => {
    getListening.mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
  });
});
