interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const memoryBuckets = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Rate limiter with in-memory Map TTL + optional Upstash Redis REST support
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash Redis REST API if configured
  if (upstashUrl && upstashToken) {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const incrRes = await fetch(`${upstashUrl}/incr/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstashToken}` },
      });
      const incrData = (await incrRes.json()) as { result?: number };
      const count = incrData.result ?? 1;

      if (count === 1) {
        await fetch(`${upstashUrl}/expire/${encodeURIComponent(key)}/${windowSec}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${upstashToken}` },
        });
      }

      return {
        allowed: count <= maxRequests,
        remaining: Math.max(0, maxRequests - count),
        resetInMs: windowMs,
      };
    } catch {
      // Fall back to in-memory map if Upstash call fails
    }
  }

  const now = Date.now();

  // Prune expired keys periodically
  memoryBuckets.forEach((value, k) => {
    if (value.expiresAt <= now) {
      memoryBuckets.delete(k);
    }
  });

  const existing = memoryBuckets.get(key);
  if (!existing || existing.expiresAt <= now) {
    memoryBuckets.set(key, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  existing.count += 1;
  memoryBuckets.set(key, existing);

  return {
    allowed: existing.count <= maxRequests,
    remaining: Math.max(0, maxRequests - existing.count),
    resetInMs: Math.max(0, existing.expiresAt - now),
  };
}

export function resetMemoryRateLimiter() {
  memoryBuckets.clear();
}
