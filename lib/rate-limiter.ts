/**
 * Rate Limiter with Exponential Backoff and Jitter
 * Prevents "thundering herd" and spreads requests evenly.
 */

type QueueItem = {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  retries: number;
};

class RateLimiter {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  private readonly concurrencyLimit: number;
  private activeRequests = 0;

  constructor(
    maxRetries = 5,
    baseDelay = 1000, // 1s
    maxDelay = 30000, // 30s
    concurrencyLimit = 3
  ) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
    this.concurrencyLimit = concurrencyLimit;
  }

  /**
   * Adds a task to the queue and returns a promise
   */
  async enqueue<T>(execute: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ execute, resolve, reject, retries: 0 });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0 && this.activeRequests < this.concurrencyLimit) {
      const item = this.queue.shift();
      if (item) {
        this.activeRequests++;
        this.executeWithBackoff(item).finally(() => {
          this.activeRequests--;
          this.processQueue(); // Check for more items
        });
      }
    }

    // Reset processing flag if we hit concurrency limit or queue is empty
    if (this.activeRequests >= this.concurrencyLimit && this.queue.length > 0) {
      // Wait for one of the concurrent requests to finish before checking again
      // This is handled by the .finally() in executeWithBackoff
    } else {
      this.isProcessing = false;
    }
  }

  private async executeWithBackoff(item: QueueItem) {
    try {
      const result = await item.execute();
      item.resolve(result);
    } catch (error: any) {
      if (item.retries < this.maxRetries && this.isRateLimitError(error)) {
        item.retries++;
        const delay = this.calculateBackoff(item.retries);
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (${item.retries}/${this.maxRetries})`);
        setTimeout(() => {
          // Re-queue with higher priority (at the front)
          this.queue.unshift(item);
          this.processQueue();
        }, delay);
      } else {
        item.reject(error);
      }
    }
  }

  private isRateLimitError(error: any): boolean {
    // Check for common rate limit indicators (Supabase, OpenAI, etc.)
    return (
      error?.status === 429 ||
      error?.message?.includes('rate limit') ||
      error?.message?.includes('too many requests')
    );
  }

  private calculateBackoff(retryCount: number): number {
    // Exponential backoff with jitter
    const exponential = this.baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 0.3 * exponential; // +/- 15% jitter
    const delay = Math.min(exponential + jitter, this.maxDelay);
    return delay;
  }
}

// Singleton instance for the app
export const rateLimiter = new RateLimiter();

/**
 * Wrapper function to easily use the rate limiter
 */
export function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  return rateLimiter.enqueue(fn);
}