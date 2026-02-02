// Simple in-memory rate limiter (client-side)

const WINDOW_MS = 60000; // 1 minute

const buckets = {
  weather: { limit: 10, timestamps: [] },
  forecast: { limit: 10, timestamps: [] },
  search: { limit: 30, timestamps: [] }, // search needs higher limit
};

export const checkRateLimit = (type) => {
  const now = Date.now();
  const bucket = buckets[type];

  if (!bucket) return true;

  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (bucket.timestamps.length >= bucket.limit) {
    return false;
  }

  bucket.timestamps.push(now);
  return true;
};
