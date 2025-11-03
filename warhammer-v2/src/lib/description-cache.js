/**
 * DescriptionCache - LRU cache with TTL for entity descriptions
 *
 * Implements a Least Recently Used (LRU) cache with time-to-live (TTL)
 * functionality. When the cache reaches max capacity, the least recently
 * used item is evicted. Items automatically expire after TTL milliseconds.
 *
 * Features:
 * - LRU eviction policy
 * - Configurable TTL per item
 * - Hit/miss rate tracking
 * - Memory-efficient storage
 * - Automatic cleanup of expired items
 *
 * @example
 * const cache = new DescriptionCache(100, 300000); // 100 items, 5 min TTL
 * cache.set('talent', 123, { sections: [...] });
 * const data = cache.get('talent', 123); // Returns data or null if expired/missing
 * const stats = cache.getStats(); // { hits: 5, misses: 2, hitRate: 0.71, size: 1 }
 */

export class DescriptionCache {
  /**
   * Create a new DescriptionCache
   * @param {number} maxSize - Maximum number of items to store (default: 100)
   * @param {number} ttl - Time-to-live in milliseconds (default: 300000 = 5 minutes)
   */
  constructor(maxSize = 100, ttl = 300000) {
    this.maxSize = maxSize;
    this.ttl = ttl;

    // Map to store cache entries { key: { value, timestamp, accessTime } }
    this.cache = new Map();

    // Statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0
    };
  }

  /**
   * Generate cache key from entity type and ID
   * @param {string} type - Entity type
   * @param {string|number} id - Entity ID
   * @returns {string} Cache key
   */
  _makeKey(type, id) {
    return `${type}:${id}`;
  }

  /**
   * Check if a cache entry is expired
   * @param {Object} entry - Cache entry
   * @returns {boolean} True if expired
   */
  _isExpired(entry) {
    const now = Date.now();
    return (now - entry.timestamp) > this.ttl;
  }

  /**
   * Remove expired entries from cache
   * @returns {number} Number of expired entries removed
   */
  _cleanupExpired() {
    let removed = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if ((now - entry.timestamp) > this.ttl) {
        this.cache.delete(key);
        removed++;
        this.stats.expirations++;
      }
    }

    return removed;
  }

  /**
   * Evict least recently used item
   * @returns {boolean} True if an item was evicted
   */
  _evictLRU() {
    if (this.cache.size === 0) return false;

    // Find entry with oldest access time
    let oldestKey = null;
    let oldestAccessTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessTime < oldestAccessTime) {
        oldestAccessTime = entry.accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
      return true;
    }

    return false;
  }

  /**
   * Get an item from the cache
   * @param {string} type - Entity type
   * @param {string|number} id - Entity ID
   * @returns {*} Cached value or null if not found/expired
   */
  get(type, id) {
    const key = this._makeKey(type, id);
    const entry = this.cache.get(key);

    // Miss: not in cache
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Miss: expired
    if (this._isExpired(entry)) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.stats.misses++;
      return null;
    }

    // Hit: update access time and return value
    entry.accessTime = Date.now();
    this.stats.hits++;
    return entry.value;
  }

  /**
   * Set an item in the cache
   * @param {string} type - Entity type
   * @param {string|number} id - Entity ID
   * @param {*} value - Value to cache
   * @returns {void}
   */
  set(type, id, value) {
    const key = this._makeKey(type, id);
    const now = Date.now();

    // If key already exists, update it
    if (this.cache.has(key)) {
      this.cache.set(key, {
        value,
        timestamp: now,
        accessTime: now
      });
      this.stats.sets++;
      return;
    }

    // Cleanup expired entries periodically (every 10 sets)
    if (this.stats.sets % 10 === 0) {
      this._cleanupExpired();
    }

    // If at capacity, evict LRU
    if (this.cache.size >= this.maxSize) {
      this._evictLRU();
    }

    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: now,
      accessTime: now
    });

    this.stats.sets++;
  }

  /**
   * Invalidate a specific cache entry
   * @param {string} type - Entity type
   * @param {string|number} id - Entity ID
   * @returns {boolean} True if entry was removed
   */
  invalidate(type, id) {
    const key = this._makeKey(type, id);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   * @returns {void}
   */
  clear() {
    this.cache.clear();
    // Reset stats but preserve historical hit/miss for rate calculation
    const { hits, misses } = this.stats;
    this.stats = {
      hits,
      misses,
      sets: 0,
      evictions: 0,
      expirations: 0
    };
  }

  /**
   * Get cache statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: hitRate,
      hitRatePercent: (hitRate * 100).toFixed(1),
      sets: this.stats.sets,
      evictions: this.stats.evictions,
      expirations: this.stats.expirations,
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercent: ((this.cache.size / this.maxSize) * 100).toFixed(1)
    };
  }

  /**
   * Get current cache size
   * @returns {number} Number of items in cache
   */
  get size() {
    return this.cache.size;
  }

  /**
   * Check if cache has an entry (without marking as accessed)
   * @param {string} type - Entity type
   * @param {string|number} id - Entity ID
   * @returns {boolean} True if entry exists and is not expired
   */
  has(type, id) {
    const key = this._makeKey(type, id);
    const entry = this.cache.get(key);

    if (!entry) return false;

    if (this._isExpired(entry)) {
      this.cache.delete(key);
      this.stats.expirations++;
      return false;
    }

    return true;
  }
}

/**
 * Create a singleton instance for global use
 */
export const globalDescriptionCache = new DescriptionCache(100, 300000);
