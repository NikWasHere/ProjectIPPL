import { RateLimiterMemory } from 'rate-limiter-flexible'

// Rate limiter untuk API calls (10 requests per minute)
export const apiLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
})

// Rate limiter untuk AI generation (3 requests per minute)
export const aiLimiter = new RateLimiterMemory({
  points: 3, // 3 requests
  duration: 60, // per 60 seconds
})

// Rate limiter untuk authentication (5 attempts per 15 minutes)
export const authLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
})

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<boolean> {
  try {
    await limiter.consume(key)
    return true
  } catch (error) {
    return false
  }
}
