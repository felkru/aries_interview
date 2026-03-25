import clientPromise from './mongodb';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

/**
 * Simple IP-based rate limiter using MongoDB.
 * 
 * @param {string} ip - The client's IP address.
 * @returns {Promise<{ success: boolean, limit: number, remaining: number, reset: number }>}
 */
export async function rateLimit(ip) {
  const client = await clientPromise;
  const db = client.db('smart-reviewer');
  const collection = db.collection('rate_limits');

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Remove old entries
  await collection.deleteMany({ timestamp: { $lt: windowStart } });

  // Count requests from this IP in the current window
  const count = await collection.countDocuments({ ip, timestamp: { $gte: windowStart } });

  if (count >= MAX_REQUESTS_PER_WINDOW) {
    const oldestEntry = await collection.findOne({ ip }, { sort: { timestamp: 1 } });
    const reset = oldestEntry ? oldestEntry.timestamp + RATE_LIMIT_WINDOW_MS : now + RATE_LIMIT_WINDOW_MS;
    
    return {
      success: false,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: 0,
      reset
    };
  }

  // Record this request
  await collection.insertOne({ ip, timestamp: now });

  return {
    success: true,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: MAX_REQUESTS_PER_WINDOW - count - 1,
    reset: now + RATE_LIMIT_WINDOW_MS
  };
}
