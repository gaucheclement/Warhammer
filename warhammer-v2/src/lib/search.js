/**
 * Search Engine - Fuzzy search with Fuse.js
 *
 * This module implements a high-performance search engine for 1000+ entries
 * using Fuse.js for fuzzy matching. Includes debouncing, caching, and
 * autocomplete support.
 *
 * Performance Target: < 300ms for 1000+ entries
 */

import Fuse from 'fuse.js'

/**
 * @typedef {Object} SearchOptions
 * @property {string[]} [keys] - Fields to search in
 * @property {number} [threshold] - Fuzzy matching threshold (0.0 - 1.0)
 * @property {number} [limit] - Maximum results to return
 * @property {boolean} [includeScore] - Include match score in results
 */

/**
 * @typedef {Object} SearchResult
 * @property {Object} item - The matched item
 * @property {number} [score] - Match score (if includeScore is true)
 * @property {Array} [matches] - Match details (if includeMatches is true)
 */

// Default Fuse.js options optimized for Warhammer data
const DEFAULT_FUSE_OPTIONS = {
  // Fuzzy matching threshold (0.0 = exact match, 1.0 = match anything)
  threshold: 0.35,
  // Distance to search from start position
  distance: 100,
  // Include match score in results
  includeScore: true,
  // Include match indices (for highlighting)
  includeMatches: true,
  // Minimum character length for search
  minMatchCharLength: 2,
  // Use extended search syntax
  useExtendedSearch: false,
  // Keys to search in (will be set per entity type)
  keys: []
}

// Cache for Fuse instances by entity type
const fuseCache = new Map()

// Cache for search results
const resultsCache = new Map()
const CACHE_SIZE = 50 // Maximum number of cached searches
const CACHE_TTL = 60000 // Cache time-to-live in ms (1 minute)

/**
 * Get search configuration for a specific entity type
 * @param {string} entityType - Type of entity
 * @returns {Object} Search configuration with keys to search
 */
function getSearchConfig(entityType) {
  const configs = {
    books: {
      keys: ['name', 'abbreviation', 'description']
    },
    careers: {
      keys: ['name', 'class', 'species', 'status', 'description']
    },
    careerLevels: {
      keys: ['name', 'career', 'description']
    },
    species: {
      keys: ['name', 'description']
    },
    classes: {
      keys: ['name', 'description']
    },
    talents: {
      keys: ['name', 'description', 'tests']
    },
    characteristics: {
      keys: ['name', 'abbreviation', 'description']
    },
    trappings: {
      keys: ['name', 'type', 'description']
    },
    skills: {
      keys: ['name', 'characteristic', 'type', 'description']
    },
    spells: {
      keys: ['name', 'description', 'lore', 'cn', 'range', 'target', 'duration']
    },
    creatures: {
      keys: ['name', 'type', 'description']
    },
    stars: {
      keys: ['name', 'description']
    },
    gods: {
      keys: ['name', 'domains', 'description']
    },
    eyes: {
      keys: ['description']
    },
    hairs: {
      keys: ['description']
    },
    details: {
      keys: ['description', 'type']
    },
    traits: {
      keys: ['name', 'type', 'description']
    },
    lores: {
      keys: ['name', 'type', 'description']
    },
    magicks: {
      keys: ['name', 'type', 'description']
    },
    etats: {
      keys: ['name', 'type', 'description']
    },
    psychologies: {
      keys: ['name', 'type', 'description']
    },
    qualities: {
      keys: ['name', 'type', 'description']
    },
    trees: {
      keys: ['name', 'type', 'description']
    },
    characters: {
      keys: ['name', 'species', 'career', 'description']
    }
  }

  return configs[entityType] || { keys: ['name', 'description'] }
}

/**
 * Create or get a cached Fuse instance for an entity type
 * @param {string} entityType - Type of entity
 * @param {Array} data - Data to index
 * @param {Object} [customOptions] - Custom Fuse options
 * @returns {Fuse} Fuse instance
 */
function getFuseInstance(entityType, data, customOptions = {}) {
  const cacheKey = `${entityType}_${data.length}`

  // Return cached instance if data hasn't changed
  if (fuseCache.has(cacheKey)) {
    const cached = fuseCache.get(cacheKey)
    // Update the data in case entries have changed
    cached.setCollection(data)
    return cached
  }

  // Create new instance
  const config = getSearchConfig(entityType)
  const options = {
    ...DEFAULT_FUSE_OPTIONS,
    ...config,
    ...customOptions
  }

  const fuse = new Fuse(data, options)
  fuseCache.set(cacheKey, fuse)

  return fuse
}

/**
 * Search in a specific entity type
 * @param {string} entityType - Type of entity to search
 * @param {Array} data - Data to search in
 * @param {string} query - Search query
 * @param {SearchOptions} [options] - Search options
 * @returns {SearchResult[]} Array of search results
 */
export function search(entityType, data, query, options = {}) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const normalizedQuery = query.trim()

  // Check cache
  const cacheKey = `${entityType}_${normalizedQuery}_${options.limit || 'all'}`
  const cached = getCachedResult(cacheKey)
  if (cached) {
    return cached
  }

  // Perform search
  const startTime = performance.now()

  const fuse = getFuseInstance(entityType, data, {
    threshold: options.threshold,
    keys: options.keys
  })

  let results = fuse.search(normalizedQuery)

  // Apply limit
  if (options.limit && options.limit > 0) {
    results = results.slice(0, options.limit)
  }

  // Transform results
  const transformed = results.map((result) => ({
    item: result.item,
    score: result.score,
    matches: result.matches
  }))

  const endTime = performance.now()
  const duration = endTime - startTime

  // Log performance warning if search is slow
  if (duration > 300) {
    console.warn(
      `Search in ${entityType} took ${duration.toFixed(2)}ms (target: < 300ms)`
    )
  }

  // Cache result
  setCachedResult(cacheKey, transformed)

  return transformed
}

/**
 * Search across all entity types
 * @param {Object} mergedData - Merged data object with all entity types
 * @param {string} query - Search query
 * @param {SearchOptions} [options] - Search options
 * @returns {Object} Object with search results grouped by entity type
 */
export function searchAll(mergedData, query, options = {}) {
  if (!query || query.trim().length < 2) {
    return {}
  }

  const results = {}
  const entityTypes = Object.keys(mergedData)

  for (const entityType of entityTypes) {
    const data = mergedData[entityType]
    if (data && data.length > 0) {
      const entityResults = search(entityType, data, query, options)
      if (entityResults.length > 0) {
        results[entityType] = entityResults
      }
    }
  }

  return results
}

/**
 * Get autocomplete suggestions for a query
 * @param {string} entityType - Type of entity
 * @param {Array} data - Data to search in
 * @param {string} query - Partial query
 * @param {number} [limit=10] - Maximum suggestions
 * @returns {string[]} Array of suggested completion strings
 */
export function getAutocompleteSuggestions(
  entityType,
  data,
  query,
  limit = 10
) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const results = search(entityType, data, query, {
    limit: limit * 2, // Get more results to filter from
    threshold: 0.3 // Stricter threshold for autocomplete
  })

  // Extract unique names/titles
  const suggestions = new Set()

  for (const result of results) {
    const item = result.item
    if (item.name) {
      suggestions.add(item.name)
    }
  }

  return Array.from(suggestions).slice(0, limit)
}

/**
 * Search with debouncing - useful for real-time search inputs
 * @param {Function} searchFn - Search function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Function} Debounced search function
 */
export function createDebouncedSearch(searchFn, delay = 300) {
  let timeoutId = null

  return function debouncedSearch(...args) {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        const results = searchFn(...args)
        resolve(results)
      }, delay)
    })
  }
}

/**
 * Get cached search result
 * @param {string} key - Cache key
 * @returns {SearchResult[]|null} Cached results or null
 */
function getCachedResult(key) {
  const cached = resultsCache.get(key)

  if (!cached) {
    return null
  }

  // Check if cache has expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    resultsCache.delete(key)
    return null
  }

  return cached.results
}

/**
 * Set cached search result
 * @param {string} key - Cache key
 * @param {SearchResult[]} results - Results to cache
 * @returns {void}
 */
function setCachedResult(key, results) {
  // Implement LRU cache: remove oldest entry if cache is full
  if (resultsCache.size >= CACHE_SIZE) {
    const firstKey = resultsCache.keys().next().value
    resultsCache.delete(firstKey)
  }

  resultsCache.set(key, {
    results,
    timestamp: Date.now()
  })
}

/**
 * Clear search cache
 * @returns {void}
 */
export function clearSearchCache() {
  resultsCache.clear()
  console.log('Search cache cleared')
}

/**
 * Clear Fuse instance cache
 * Call this when data structure changes significantly
 * @returns {void}
 */
export function clearFuseCache() {
  fuseCache.clear()
  console.log('Fuse instance cache cleared')
}

/**
 * Get search statistics
 * @returns {Object} Search cache statistics
 */
export function getSearchStats() {
  return {
    cacheSize: resultsCache.size,
    maxCacheSize: CACHE_SIZE,
    cacheTTL: CACHE_TTL,
    fuseInstances: fuseCache.size
  }
}

/**
 * Highlight matching text in search results
 * @param {string} text - Text to highlight
 * @param {Array} matches - Match indices from Fuse.js
 * @returns {string} HTML string with highlighted matches
 */
export function highlightMatches(text, matches) {
  if (!matches || matches.length === 0) {
    return text
  }

  let highlighted = ''
  let lastIndex = 0

  // Sort matches by position
  const sortedMatches = matches
    .flatMap((match) => match.indices)
    .sort((a, b) => a[0] - b[0])

  for (const [start, end] of sortedMatches) {
    // Add text before match
    highlighted += text.slice(lastIndex, start)
    // Add highlighted match
    highlighted += `<mark>${text.slice(start, end + 1)}</mark>`
    lastIndex = end + 1
  }

  // Add remaining text
  highlighted += text.slice(lastIndex)

  return highlighted
}

/**
 * Filter search results by additional criteria
 * @param {SearchResult[]} results - Search results
 * @param {Function} filterFn - Filter function
 * @returns {SearchResult[]} Filtered results
 */
export function filterResults(results, filterFn) {
  return results.filter((result) => filterFn(result.item))
}

/**
 * Sort search results by a field
 * @param {SearchResult[]} results - Search results
 * @param {string} field - Field to sort by
 * @param {string} [order='asc'] - Sort order ('asc' or 'desc')
 * @returns {SearchResult[]} Sorted results
 */
export function sortResults(results, field, order = 'asc') {
  return results.sort((a, b) => {
    const aValue = a.item[field]
    const bValue = b.item[field]

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Group search results by a field
 * @param {SearchResult[]} results - Search results
 * @param {string} field - Field to group by
 * @returns {Object} Results grouped by field value
 */
export function groupResults(results, field) {
  const grouped = {}

  for (const result of results) {
    const value = result.item[field] || 'Other'
    if (!grouped[value]) {
      grouped[value] = []
    }
    grouped[value].push(result)
  }

  return grouped
}
