import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getListening, resetSpotifyCache } from './spotify';

const track = (name: string) => ({
  type: 'track',
  name,
  artists: [{ name: 'Nils Frahm' }, { name: 'Ólafur Arnalds' }],
  external_urls: { spotify: `https://open.spotify.com/track/${name}` },
});
const json = (body: unknown, status = 200) => Response.json(body, { status });
const token = () => json({ access_token: 'at', expires_in: 3600 });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  resetSpotifyCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('SPOTIFY_CLIENT_ID', 'id');
  vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'secret');
  vi.stubEnv('SPOTIFY_REFRESH_TOKEN', 'rt');
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ['Date'] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const later = (seconds: number) => vi.setSystemTime(Date.now() + seconds * 1000);

describe('getListening', () => {
  it.each(['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'])(
    'returns null without calling Spotify when %s is missing',
    async (name) => {
      vi.stubEnv(name, '');
      expect(await getListening()).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('returns the track playing now', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(json({ is_playing: true, item: track('Says') }));
    expect(await getListening()).toEqual({
      title: 'Says',
      artist: 'Nils Frahm, Ólafur Arnalds',
      url: 'https://open.spotify.com/track/Says',
      playing: true,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from('id:secret').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: 'rt' }),
      cache: 'no-store',
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: { Authorization: 'Bearer at' },
        cache: 'no-store',
      },
    );
  });

  it('falls back to the last played track when nothing plays', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json({ items: [{ track: track('Ambre') }] }));
    expect(await getListening()).toMatchObject({ title: 'Ambre', playing: false });
  });

  it.each([
    { is_playing: false, item: track('Paused') },
    { is_playing: true, item: { ...track('Ep'), type: 'episode' } },
    { is_playing: true, item: null },
    { is_playing: true, item: { ...track('Ad'), type: undefined } },
  ])('falls back for an unplayable current item %j', async (current) => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(json(current))
      .mockResolvedValueOnce(json({ items: [{ track: track('Ambre') }] }));
    expect(await getListening()).toMatchObject({ title: 'Ambre', playing: false });
  });

  it('returns null when there is no listening history', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json({ items: [] }));
    expect(await getListening()).toBeNull();
  });

  it('asks Spotify once per 30 s, however often it is called', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockImplementation(async () => json({ is_playing: true, item: track('Says') }));
    await Promise.all([getListening(), getListening()]);
    later(10);
    await getListening();
    expect(fetchMock).toHaveBeenCalledTimes(2); // one token, one currently-playing
  });

  it('reuses the access token after the result expires', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockImplementation(async () => json({ is_playing: true, item: track('Says') }));
    await getListening();
    later(31);
    await getListening();
    const tokenCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/api/token'));
    expect(tokenCalls).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('waits out Retry-After when Spotify answers 429', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { 'Retry-After': '120' } }))
      .mockResolvedValue(json({ is_playing: true, item: track('Says') }));
    expect(await getListening()).toBeNull();
    later(60);
    expect(await getListening()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    later(61);
    expect(await getListening()).toMatchObject({ title: 'Says' });
  });

  it('returns null when Spotify fails', async () => {
    fetchMock.mockResolvedValueOnce(json({ error: 'invalid_grant' }, 400));
    expect(await getListening()).toBeNull();
  });

  it('shares an in-flight request and refreshes exactly at the result expiry', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockImplementation(async () => json({ is_playing: true, item: track('Says') }));
    const pending = getListening();
    expect(getListening()).toBe(pending);
    await pending;
    later(29.999);
    expect(await getListening()).toMatchObject({ title: 'Says' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    later(0.001);
    expect(await getListening()).toMatchObject({ title: 'Says' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('refreshes the token one minute before it expires', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(json({ is_playing: true, item: track('First') }))
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(json({ is_playing: true, item: track('Next') }));
    await getListening();
    later(3540);
    expect(await getListening()).toMatchObject({ title: 'Next' });
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/api/token'))).toHaveLength(
      2,
    );
  });

  it('refreshes a revoked access token on the next request after its result cache expires', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(json({ access_token: 'replacement', expires_in: 3600 }))
      .mockResolvedValueOnce(json({ is_playing: true, item: track('Recovered') }));
    expect(await getListening()).toBeNull();
    later(30);
    expect(await getListening()).toMatchObject({ title: 'Recovered' });
    expect(fetchMock).toHaveBeenLastCalledWith(expect.any(String), {
      headers: { Authorization: 'Bearer replacement' },
      cache: 'no-store',
    });
  });

  it.each([null, 'invalid', '0'])(
    'defaults a missing or unusable Retry-After %s to one minute',
    async (retryAfter) => {
      fetchMock
        .mockResolvedValueOnce(
          new Response(null, {
            status: 429,
            headers: retryAfter === null ? {} : { 'Retry-After': retryAfter },
          }),
        )
        .mockResolvedValueOnce(token())
        .mockResolvedValueOnce(json({ is_playing: true, item: track('Recovered') }));
      expect(await getListening()).toBeNull();
      later(59.999);
      expect(await getListening()).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      later(0.001);
      expect(await getListening()).toMatchObject({ title: 'Recovered' });
    },
  );

  it('caches errors briefly and can recover from a network failure', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(json({ is_playing: true, item: track('Recovered') }));
    expect(await getListening()).toBeNull();
    expect(await getListening()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    later(30);
    expect(await getListening()).toMatchObject({ title: 'Recovered' });
  });

  it('returns null when the recent-history endpoint fails', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    expect(await getListening()).toBeNull();
  });

  it('returns null rather than rejecting for malformed Spotify JSON', async () => {
    fetchMock
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(new Response('{', { status: 200 }));
    expect(await getListening()).toBeNull();
  });

  it('handles non-Error rejections without throwing while logging the failure', async () => {
    fetchMock.mockRejectedValueOnce('connection closed');
    expect(await getListening()).toBeNull();
    expect(console.error).toHaveBeenCalledWith('spotify:', 'connection closed');
  });
});
