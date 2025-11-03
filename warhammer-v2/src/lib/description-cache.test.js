/**
 * Tests for DescriptionCache (LRU cache with TTL)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DescriptionCache } from './description-cache.js';

describe('DescriptionCache', () => {
  let cache;

  beforeEach(() => {
    cache = new DescriptionCache(3, 1000); // 3 items max, 1 second TTL for testing
  });

  describe('Basic Operations', () => {
    it('should store and retrieve values', () => {
      cache.set('talent', 1, { name: 'Combat' });
      const result = cache.get('talent', 1);

      expect(result).toEqual({ name: 'Combat' });
    });

    it('should return null for missing keys', () => {
      const result = cache.get('talent', 999);
      expect(result).toBeNull();
    });

    it('should handle numeric and string IDs', () => {
      cache.set('skill', 123, { name: 'Dodge' });
      cache.set('spell', '456', { name: 'Fireball' });

      expect(cache.get('skill', 123)).toEqual({ name: 'Dodge' });
      expect(cache.get('spell', '456')).toEqual({ name: 'Fireball' });
    });

    it('should update existing keys', () => {
      cache.set('talent', 1, { name: 'Combat v1' });
      cache.set('talent', 1, { name: 'Combat v2' });

      expect(cache.get('talent', 1)).toEqual({ name: 'Combat v2' });
      expect(cache.size).toBe(1);
    });

    it('should clear all entries', () => {
      cache.set('talent', 1, { name: 'Combat' });
      cache.set('skill', 2, { name: 'Dodge' });

      cache.clear();

      expect(cache.size).toBe(0);
      expect(cache.get('talent', 1)).toBeNull();
      expect(cache.get('skill', 2)).toBeNull();
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used item when at capacity', async () => {
      cache.set('talent', 1, { name: 'A' });
      await new Promise(resolve => setTimeout(resolve, 10));

      cache.set('skill', 2, { name: 'B' });
      await new Promise(resolve => setTimeout(resolve, 10));

      cache.set('spell', 3, { name: 'C' });
      await new Promise(resolve => setTimeout(resolve, 10));

      // Cache is now full (3/3)
      expect(cache.size).toBe(3);

      // Access item 1 to make it recently used
      cache.get('talent', 1);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Add new item, should evict item 2 (least recently used)
      cache.set('class', 4, { name: 'D' });

      expect(cache.size).toBe(3);
      expect(cache.get('talent', 1)).toEqual({ name: 'A' }); // Still exists (recently accessed)
      expect(cache.get('skill', 2)).toBeNull(); // Evicted (oldest access time)
      expect(cache.get('spell', 3)).toEqual({ name: 'C' }); // Still exists
      expect(cache.get('class', 4)).toEqual({ name: 'D' }); // New item
    });

    it('should track evictions in statistics', () => {
      cache.set('talent', 1, { name: 'A' });
      cache.set('skill', 2, { name: 'B' });
      cache.set('spell', 3, { name: 'C' });
      cache.set('class', 4, { name: 'D' }); // Triggers eviction

      const stats = cache.getStats();
      expect(stats.evictions).toBe(1);
    });
  });

  describe('TTL Expiration', () => {
    it('should expire entries after TTL', async () => {
      const shortCache = new DescriptionCache(10, 100); // 100ms TTL

      shortCache.set('talent', 1, { name: 'Combat' });

      // Should exist immediately
      expect(shortCache.get('talent', 1)).toEqual({ name: 'Combat' });

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be expired
      expect(shortCache.get('talent', 1)).toBeNull();
    });

    it('should track expirations in statistics', async () => {
      const shortCache = new DescriptionCache(10, 50); // 50ms TTL

      shortCache.set('talent', 1, { name: 'Combat' });
      shortCache.set('skill', 2, { name: 'Dodge' });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Both should be expired
      shortCache.get('talent', 1);
      shortCache.get('skill', 2);

      const stats = shortCache.getStats();
      expect(stats.expirations).toBeGreaterThanOrEqual(2);
    });

    it('should cleanup expired entries periodically', async () => {
      const shortCache = new DescriptionCache(10, 50); // 50ms TTL

      // Add 10 entries
      for (let i = 0; i < 10; i++) {
        shortCache.set('talent', i, { name: `Item ${i}` });
      }

      expect(shortCache.size).toBe(10);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger cleanup by setting a new item (cleanup happens every 10 sets)
      for (let i = 0; i < 10; i++) {
        shortCache.set('skill', i, { name: `New ${i}` });
      }

      // Expired items should be cleaned up
      expect(shortCache.size).toBeLessThan(20);
    });
  });

  describe('Cache Statistics', () => {
    it('should track hits and misses', () => {
      cache.set('talent', 1, { name: 'Combat' });

      // Miss
      cache.get('talent', 999);

      // Hit
      cache.get('talent', 1);

      // Hit
      cache.get('talent', 1);

      // Miss
      cache.get('skill', 2);

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(0.5);
      expect(stats.hitRatePercent).toBe('50.0');
    });

    it('should track cache size and utilization', () => {
      cache.set('talent', 1, { name: 'A' });
      cache.set('skill', 2, { name: 'B' });

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(3);
      expect(parseFloat(stats.utilizationPercent)).toBeCloseTo(66.7, 1);
    });

    it('should track set operations', () => {
      cache.set('talent', 1, { name: 'A' });
      cache.set('skill', 2, { name: 'B' });
      cache.set('talent', 1, { name: 'A updated' }); // Update

      const stats = cache.getStats();
      expect(stats.sets).toBe(3);
    });
  });

  describe('Helper Methods', () => {
    it('should check if entry exists without marking as accessed', () => {
      cache.set('talent', 1, { name: 'Combat' });

      expect(cache.has('talent', 1)).toBe(true);
      expect(cache.has('skill', 2)).toBe(false);
    });

    it('should invalidate specific entries', () => {
      cache.set('talent', 1, { name: 'Combat' });
      cache.set('skill', 2, { name: 'Dodge' });

      const removed = cache.invalidate('talent', 1);

      expect(removed).toBe(true);
      expect(cache.get('talent', 1)).toBeNull();
      expect(cache.get('skill', 2)).toEqual({ name: 'Dodge' }); // Other entry unaffected
    });

    it('should return false when invalidating non-existent entry', () => {
      const removed = cache.invalidate('talent', 999);
      expect(removed).toBe(false);
    });

    it('should return current size via size getter', () => {
      expect(cache.size).toBe(0);

      cache.set('talent', 1, { name: 'A' });
      expect(cache.size).toBe(1);

      cache.set('skill', 2, { name: 'B' });
      expect(cache.size).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle cache with maxSize of 1', () => {
      const tinyCache = new DescriptionCache(1, 1000);

      tinyCache.set('talent', 1, { name: 'A' });
      expect(tinyCache.size).toBe(1);

      tinyCache.set('skill', 2, { name: 'B' });
      expect(tinyCache.size).toBe(1);
      expect(tinyCache.get('talent', 1)).toBeNull(); // Evicted
      expect(tinyCache.get('skill', 2)).toEqual({ name: 'B' }); // Exists
    });

    it('should handle empty cache operations', () => {
      expect(cache.get('talent', 1)).toBeNull();
      expect(cache.has('talent', 1)).toBe(false);
      expect(cache.invalidate('talent', 1)).toBe(false);
      expect(cache.size).toBe(0);

      cache.clear(); // Should not error
      expect(cache.size).toBe(0);
    });

    it('should handle ID of 0 as valid', () => {
      cache.set('talent', 0, { name: 'Zero ID' });
      expect(cache.get('talent', 0)).toEqual({ name: 'Zero ID' });
      expect(cache.has('talent', 0)).toBe(true);
    });
  });

  describe('Global Cache Instance', () => {
    it('should export a global cache instance', async () => {
      const { globalDescriptionCache } = await import('./description-cache.js');

      expect(globalDescriptionCache).toBeDefined();
      expect(globalDescriptionCache).toBeInstanceOf(DescriptionCache);

      // Test it works
      globalDescriptionCache.set('test', 1, { data: 'test' });
      expect(globalDescriptionCache.get('test', 1)).toEqual({ data: 'test' });

      // Clean up
      globalDescriptionCache.clear();
    });
  });
});
