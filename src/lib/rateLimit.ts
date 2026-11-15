// shortcut: in-memory and per server instance, so a distributed spammer gets more tries. Upgrade to Upstash/Vercel KV if spam gets through.
const hits = new Map<string, number[]>();

export const isRateLimited = (key: string, limit = 3, windowMs = 10 * 60_000, now = Date.now()) => {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const limited = recent.length >= limit;
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear(); // bound memory on a long-lived instance
  return limited;
};
