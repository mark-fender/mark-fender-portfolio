/* eslint-disable no-console -- a terminal script: printing is its job */
// One-off: gets the Spotify refresh token the site uses to read what you're listening to.
// 1. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local.
// 2. Add http://127.0.0.1:8888/callback as a Redirect URI in your Spotify app's settings.
// 3. npm run spotify:auth, open the link, approve. The refresh token prints here.
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.');
  process.exit(1);
}

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';
const state = randomBytes(16).toString('hex');

const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: id,
  response_type: 'code',
  redirect_uri: REDIRECT,
  scope: SCOPES,
  state,
})}`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', REDIRECT);
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  if (url.searchParams.get('state') !== state || !code) {
    res.writeHead(400).end('State mismatch or no code. Run the script again.');
    return;
  }
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const body = await tokenRes.json();
  if (!tokenRes.ok || !body.refresh_token) {
    res.writeHead(500).end('Token exchange failed; see the terminal.');
    console.error(body);
  } else {
    res.end('Done. You can close this tab.');
    console.log(
      `\nAdd this to .env.local and to Vercel:\n\nSPOTIFY_REFRESH_TOKEN=${body.refresh_token}\n`,
    );
  }
  server.close();
});

server.listen(PORT, '127.0.0.1', () => console.log(`Open this link and approve:\n\n${authUrl}\n`));
