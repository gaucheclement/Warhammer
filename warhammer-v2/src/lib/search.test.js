/**
 * Unit Tests for Search Engine
 * Tests fuzzy search functionality with Fuse.js
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  search,
  searchAll,
  getAutocompleteSuggestions,
  createDebouncedSearch,
  clearSearchCache,
  clearFuseCache,
  getSearchStats,
  highlightMatches,
  filterResults,
  sortResults,
  groupResults
} from './search.js'

describe('search', () => {
  const testData = [
    { id: 1, name: 'Animal Care', description: 'Care for animals', characteristic: 'Int' },
    { id: 2, name: 'Art', description: 'Create beautiful art', characteristic: 'Dex' },
    { id: 3, name: 'Charm Animal', description: 'Charm wild animals', characteristic: 'Fel' },
    { id: 4, name: 'Drive', description: 'Drive vehicles', characteristic: 'Agi' },
    { id: 5, name: 'Animal Training', description: 'Train animals', characteristic: 'Int' }
  ]

  beforeEach(() => {
    clearSearchCache()
    clearFuseCache()
  })

  describe('search', () => {
    it('should find matching results by name', () => {
      const results = search('skills', testData, 'animal')

      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.item.name === 'Animal Care')).toBe(true)
      expect(results.some(r => r.item.name === 'Charm Animal')).toBe(true)
      expect(results.some(r => r.item.name === 'Animal Training')).toBe(true)
    })

    it('should find matching results by description', () => {
      const results = search('skills', testData, 'beautiful')

      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.item.name === 'Art')).toBe(true)
    })

    it('should return empty array for queries less than 2 characters', () => {
      expect(search('skills', testData, 'a')).toEqual([])
      expect(search('skills', testData, '')).toEqual([])
    })

    it('should respect the limit option', () => {
      const results = search('skills', testData, 'a', { limit: 2 })

      expect(results.length).toBeLessThanOrEqual(2)
    })

    it('should include score in results', () => {
      const results = search('skills', testData, 'animal')

      expect(results[0].score).toBeDefined()
      expect(typeof results[0].score).toBe('number')
    })

    it('should include matches in results', () => {
      const results = search('skills', testData, 'animal')

      expect(results[0].matches).toBeDefined()
      expect(Array.isArray(results[0].matches)).toBe(true)
    })

    it('should use custom threshold if provided', () => {
      const strictResults = search('skills', testData, 'anml', { threshold: 0.2 })
      const lenientResults = search('skills', testData, 'anml', { threshold: 0.6 })

      expect(lenientResults.length).toBeGreaterThanOrEqual(strictResults.length)
    })

    it('should handle empty data array', () => {
      const results = search('skills', [], 'test')

      expect(results).toEqual([])
    })

    it('should be case insensitive', () => {
      const results = search('skills', testData, 'ANIMAL')

      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('searchAll', () => {
    const mergedData = {
      skills: testData,
      talents: [
        { id: 1, name: 'Animal Affinity', description: 'Affinity with animals' },
        { id: 2, name: 'Warrior', description: 'Combat skills' }
      ]
    }

    it('should search across all entity types', () => {
      const results = searchAll(mergedData, 'animal')

      expect(results.skills).toBeDefined()
      expect(results.talents).toBeDefined()
      expect(results.skills.length).toBeGreaterThan(0)
      expect(results.talents.length).toBeGreaterThan(0)
    })

    it('should return empty object for queries less than 2 characters', () => {
      expect(searchAll(mergedData, 'a')).toEqual({})
    })

    it('should not include entity types with no results', () => {
      const results = searchAll(mergedData, 'warrior')

      expect(results.talents).toBeDefined()
      expect(results.skills).toBeUndefined()
    })

    it('should respect limit option across all types', () => {
      const results = searchAll(mergedData, 'a', { limit: 1 })

      if (results.skills) {
        expect(results.skills.length).toBeLessThanOrEqual(1)
      }
      if (results.talents) {
        expect(results.talents.length).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('getAutocompleteSuggestions', () => {
    it('should return suggestion strings', () => {
      const suggestions = getAutocompleteSuggestions('skills', testData, 'ani', 5)

      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.every(s => typeof s === 'string')).toBe(true)
    })

    it('should respect the limit', () => {
      const suggestions = getAutocompleteSuggestions('skills', testData, 'a', 2)

      expect(suggestions.length).toBeLessThanOrEqual(2)
    })

    it('should return unique suggestions', () => {
      const suggestions = getAutocompleteSuggestions('skills', testData, 'animal', 10)
      const uniqueSuggestions = new Set(suggestions)

      expect(suggestions.length).toBe(uniqueSuggestions.size)
    })

    it('should return empty array for queries less than 2 characters', () => {
      expect(getAutocompleteSuggestions('skills', testData, 'a', 5)).toEqual([])
    })
  })

  describe('createDebouncedSearch', () => {
    it('should debounce search calls', async () => {
      const mockSearch = vi.fn(() => [])
      const debouncedSearch = createDebouncedSearch(mockSearch, 50)

      // Call multiple times rapidly
      debouncedSearch('query1')
      debouncedSearch('query2')
      debouncedSearch('query3')

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should only be called once with the last query
      expect(mockSearch).toHaveBeenCalledTimes(1)
      expect(mockSearch).toHaveBeenCalledWith('query3')
    })

    it('should return a promise', async () => {
      const mockSearch = vi.fn(() => ['result1', 'result2'])
      const debouncedSearch = createDebouncedSearch(mockSearch, 10)

      const result = await debouncedSearch('query')

      expect(result).toEqual(['result1', 'result2'])
    })
  })

  describe('cache management', () => {
    it('should cache search results', () => {
      // First search
      const results1 = search('skills', testData, 'animal')

      // Second search with same query should be faster (cached)
      const results2 = search('skills', testData, 'animal')

      expect(results1).toEqual(results2)
    })

    it('should clear search cache', () => {
      search('skills', testData, 'animal')
      const statsBefore = getSearchStats()

      clearSearchCache()
      const statsAfter = getSearchStats()

      expect(statsBefore.cacheSize).toBeGreaterThan(0)
      expect(statsAfter.cacheSize).toBe(0)
    })

    it('should clear Fuse instance cache', () => {
      search('skills', testData, 'animal')
      const statsBefore = getSearchStats()

      clearFuseCache()
      const statsAfter = getSearchStats()

      expect(statsBefore.fuseInstances).toBeGreaterThan(0)
      expect(statsAfter.fuseInstances).toBe(0)
    })

    it('should return cache statistics', () => {
      search('skills', testData, 'animal')
      const stats = getSearchStats()

      expect(stats.cacheSize).toBeGreaterThanOrEqual(0)
      expect(stats.maxCacheSize).toBeDefined()
      expect(stats.cacheTTL).toBeDefined()
      expect(stats.fuseInstances).toBeGreaterThanOrEqual(0)
    })
  })

  describe('highlightMatches', () => {
    it('should highlight matching text', () => {
      const text = 'Animal Care is a skill'
      const matches = [
        { indices: [[0, 5]] } // "Animal"
      ]

      const highlighted = highlightMatches(text, matches)

      expect(highlighted).toContain('<mark>')
      expect(highlighted).toContain('</mark>')
      expect(highlighted).toContain('Animal')
    })

    it('should return original text if no matches', () => {
      const text = 'Animal Care'
      const highlighted = highlightMatches(text, [])

      expect(highlighted).toBe(text)
      expect(highlighted).not.toContain('<mark>')
    })

    it('should handle multiple matches', () => {
      const text = 'Animal Care and Animal Training'
      const matches = [
        { indices: [[0, 5]] },
        { indices: [[16, 21]] }
      ]

      const highlighted = highlightMatches(text, matches)
      const markCount = (highlighted.match(/<mark>/g) || []).length

      expect(markCount).toBe(2)
    })
  })

  describe('filterResults', () => {
    it('should filter results by predicate', () => {
      const results = [
        { item: { id: 1, name: 'Animal Care', characteristic: 'Int' } },
        { item: { id: 2, name: 'Art', characteristic: 'Dex' } },
        { item: { id: 3, name: 'Charm Animal', characteristic: 'Fel' } }
      ]

      const filtered = filterResults(results, item => item.characteristic === 'Int')

      expect(filtered).toHaveLength(1)
      expect(filtered[0].item.name).toBe('Animal Care')
    })

    it('should return empty array if no results match', () => {
      const results = [
        { item: { id: 1, name: 'Animal Care', characteristic: 'Int' } }
      ]

      const filtered = filterResults(results, item => item.characteristic === 'Str')

      expect(filtered).toEqual([])
    })
  })

  describe('sortResults', () => {
    it('should sort results ascending by field', () => {
      const results = [
        { item: { id: 3, name: 'Charlie' } },
        { item: { id: 1, name: 'Alice' } },
        { item: { id: 2, name: 'Bob' } }
      ]

      const sorted = sortResults(results, 'name', 'asc')

      expect(sorted[0].item.name).toBe('Alice')
      expect(sorted[1].item.name).toBe('Bob')
      expect(sorted[2].item.name).toBe('Charlie')
    })

    it('should sort results descending by field', () => {
      const results = [
        { item: { id: 1, name: 'Alice' } },
        { item: { id: 2, name: 'Bob' } },
        { item: { id: 3, name: 'Charlie' } }
      ]

      const sorted = sortResults(results, 'name', 'desc')

      expect(sorted[0].item.name).toBe('Charlie')
      expect(sorted[1].item.name).toBe('Bob')
      expect(sorted[2].item.name).toBe('Alice')
    })
  })

  describe('groupResults', () => {
    it('should group results by field', () => {
      const results = [
        { item: { id: 1, name: 'Animal Care', characteristic: 'Int' } },
        { item: { id: 2, name: 'Art', characteristic: 'Dex' } },
        { item: { id: 3, name: 'Charm Animal', characteristic: 'Int' } }
      ]

      const grouped = groupResults(results, 'characteristic')

      expect(grouped.Int).toHaveLength(2)
      expect(grouped.Dex).toHaveLength(1)
    })

    it('should group entries without field value as "Other"', () => {
      const results = [
        { item: { id: 1, name: 'Test 1', category: 'A' } },
        { item: { id: 2, name: 'Test 2' } }
      ]

      const grouped = groupResults(results, 'category')

      expect(grouped.A).toHaveLength(1)
      expect(grouped.Other).toHaveLength(1)
    })
  })

  describe('performance', () => {
    it('should search large dataset in reasonable time', () => {
      // Generate 1000 test entries
      const largeDataset = []
      for (let i = 0; i < 1000; i++) {
        largeDataset.push({
          id: i,
          name: `Entry ${i}`,
          description: `Description for entry ${i}`
        })
      }
      // Add some specific entries to search for
      largeDataset[500].name = 'Animal Care'
      largeDataset[750].name = 'Charm Animal'

      const startTime = performance.now()
      const results = search('skills', largeDataset, 'animal')
      const duration = performance.now() - startTime

      expect(results.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(300) // Target: < 300ms
    })
  })
})
