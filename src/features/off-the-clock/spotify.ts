// Server only: reads the Spotify secrets. Called by the /api/listening route.

export type Listening = {
  title: string;
  artist: string;
  url: string;
  /** True while the track is playing right now; false for the last played one. */
  playing: boolean;
};

type Track = {
  type?: string;
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1/me/player';

// One access token per server instance, reused until a minute before it expires.
let cached: { token: string; expiresAt: number } | null = null;

const accessToken = async (): Promise<string | null> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  });
  check(res, 'token refresh');
  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cached = { token: access_token, expiresAt: Date.now() + (expires_in - 60) * 1000 };
  return access_token;
};

const toListening = (track: Track, playing: boolean): Listening => ({
  title: track.name,
  artist: track.artists.map((a) => a.name).join(', '),
  url: track.external_urls.spotify,
  playing,
});

// Spotify is asked at most once per RESULT_MS per server instance, however the route is hit:
// the CDN cache alone can be bypassed (an Authorization header or a new query string skips it).
const RESULT_MS = 30_000;
let result: { until: number; value: Promise<Listening | null> } | null = null;
let blockedUntil = 0; // set from Retry-After when Spotify answers 429

const check = (res: Response, what: string) => {
  if (res.status === 401) cached = null; // revoked or expired early: refresh next time
  if (res.status === 429) {
    const seconds = Number(res.headers.get('Retry-After')) || 60;
    blockedUntil = Date.now() + seconds * 1000;
  }
  if (!res.ok) throw new Error(`${what}: ${res.status}`);
};

const fetchListening = async (): Promise<Listening | null> => {
  try {
    const token = await accessToken();
    if (!token) return null;
    const get = (path: string) =>
      fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });

    const now = await get('/currently-playing');
    check(now, 'currently-playing');
    if (now.status === 200) {
      const body = (await now.json()) as { is_playing: boolean; item: Track | null };
      // Podcasts and ads aren't tracks; fall through to the last played track.
      if (body.is_playing && body.item?.type === 'track') return toListening(body.item, true);
    }

    const recent = await get('/recently-played?limit=1');
    check(recent, 'recently-played');
    const { items } = (await recent.json()) as { items: { track: Track }[] };
    return items[0] ? toListening(items[0].track, false) : null;
  } catch (error) {
    console.error('spotify:', error instanceof Error ? error.message : error);
    return null;
  }
};

/** The track playing now, else the last one played. Null when Spotify isn't set up or fails. */
export const getListening = (): Promise<Listening | null> => {
  if (result && Date.now() < Math.max(result.until, blockedUntil)) return result.value;
  result = { until: Date.now() + RESULT_MS, value: fetchListening() };
  return result.value;
};

/** For tests: forget the cached token, result and any 429 cooldown. */
export const resetSpotifyCache = () => {
  cached = null;
  result = null;
  blockedUntil = 0;
};
