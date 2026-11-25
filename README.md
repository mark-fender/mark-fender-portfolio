My personal web developer portfolio built with Next.js.

## Go listening-route experiment

This branch pins Next.js to `16.5.0-canary.62` and enables `experimental.goRoutes`.
`src/app/api/listening/route.go` serves the existing listening JSON contract using
`internal/spotify`, with no external Go dependencies. The browser still polls the
same `/api/listening` URL.

Install Node.js 24 and Go 1.24 or newer, then run `npm ci` and `npm run dev`.
The two Vercel packages have narrow Next.js peer overrides because their stable-only
ranges exclude canary versions.
Go must be on `PATH` for development and builds (or set `TURBOPACK_GO` to its
executable). Keep the existing `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and
`SPOTIFY_REFRESH_TOKEN` values in `.env.local`. Missing credentials or Spotify
failures return JSON `null`, so the page shows its written fallback.

The Go client preserves the 30-second result cache, shared concurrent fetches,
access-token reuse, 401 invalidation, and 429 `Retry-After` cooldown. HTTP requests
have a 10-second timeout. The route retains its 30-second CDN cache headers.

Run `npm test` for TypeScript tests and `npm run test:go` for Go tests with the race
detector. `npm run check` includes both suites, coverage, build, and browser tests.

This is an experiment, not a production deployment change. Go routes require
Turbopack. Self-host with `npm run build` and `npm start` on the same OS and
architecture, preserving the complete `.next` directory and executable permissions.
`output: 'standalone'` and static export are unsupported. Adapter deployments need
explicit support for `runtime: 'go'`; Vercel deployment has not been verified.
See the [Next.js Go route documentation](https://preview.nextjs.org/docs/app/api-reference/file-conventions/route-go).
