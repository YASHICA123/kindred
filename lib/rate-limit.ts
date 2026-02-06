interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private windowMs: number
  private max: number
  private message: string

  constructor(options: { windowMs: number; max: number; message: string }) {
    this.windowMs = options.windowMs
    this.max = options.max
    this.message = options.message
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  async check(identifier: string): Promise<{ success: boolean; remaining?: number; resetTime?: number }> {
    const now = Date.now()
    const key = identifier

    // Initialize or get existing record
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.windowMs
      }
    }

    // Increment count
    this.store[key].count++

    // Check if limit exceeded
    if (this.store[key].count > this.max) {
      return {
        success: false,
        resetTime: this.store[key].resetTime
      }
    }

    return {
      success: true,
      remaining: Math.max(0, this.max - this.store[key].count),
      resetTime: this.store[key].resetTime
    }
  }
}

export function rateLimit(options: { windowMs: number; max: number; message: string }) {
  return new RateLimiter(options)
}
