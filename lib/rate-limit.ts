import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter, keyed by IP + bucket name.
 *
 * This is process-local, which is fine for a single Vercel serverless
 * instance under light load but is NOT shared across regions/instances.
 * For production-grade protection, swap this for Upstash Redis
 * (@upstash/ratelimit) — the call signature below is designed to make
 * that a drop-in replacement.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const existing = (hits.get(key) || []).filter((t) => t > windowStart);
  existing.push(now);
  hits.set(key, existing);

  // Periodically prevent unbounded map growth.
  if (hits.size > 5000) {
    for (const [k, arr] of hits) {
      if (arr.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return {
    success: existing.length <= limit,
    remaining: Math.max(0, limit - existing.length),
  };
}

export function getRequestIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
