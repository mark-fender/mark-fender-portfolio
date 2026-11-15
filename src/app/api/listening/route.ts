import { getListening } from '@/features/off-the-clock';

// The CDN keeps each answer for 30 s, so Spotify sees about two calls a minute however many
// people have the page open.
export const GET = async () =>
  Response.json(await getListening(), {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' },
  });
