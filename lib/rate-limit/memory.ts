type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalStore.__rateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalStore.__rateLimitStore) {
  globalStore.__rateLimitStore = store;
}

export function checkRateLimit({
  key,
  max,
  windowMs,
}: {
  key: string;
  max: number;
  windowMs: number;
}) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: max - 1,
      resetAt: now + windowMs,
    };
  }

  if (existing.count >= max) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    remaining: max - existing.count,
    resetAt: existing.resetAt,
  };
}
