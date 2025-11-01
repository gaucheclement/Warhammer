/**
 * "WHERE USED" REVERSE LOOKUP SYSTEM
 *
 * This module extends db-relations.js with comprehensive reverse lookup capabilities.
 * It finds all entities that reference (use) a specific entity across the entire database.
 *
 * To integrate: Copy this content into db-relations.js after line 829 (after findTalentsBySkill)
 * and before the UTILITY FUNCTIONS section.
 */

import { db } from './db.js'
import { relationCache } from './db-relations.js' // Assumes relationCache is exported

/**
 * Entity type configuration for reverse lookup queries
 * Maps entity types to their relationship patterns and query strategies
 */
const ENTITY_RELATIONSHIP_CONFIG = {
  // CAREERS - referenced by careerLevels, species (via rand object)
  careers: {
    arrayReferences: [], // No entities have careers[] arrays
    stringReferences: [
      { table: 'careerLevels', field: 'career', indexed: true }
    ],
    objectReferences: [
      { table: 'careers', field: 'rand', pattern: 'keys' } // species as keys in rand object
    ]
  },

  // CAREER LEVELS - not directly referenced by other entities
  careerLevels: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // SPECIES - referenced by careers (via rand object keys)
  species: {
    arrayReferences: [
      { table: 'careers', field: 'species', type: 'string-or-array' } // Can be string or array
    ],
    stringReferences: [],
    objectReferences: []
  },

  // CLASSES - referenced by careers
  classes: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'class', indexed: true }
    ],
    objectReferences: []
  },

  // TALENTS - referenced by careerLevels, species, creatures, and other talents
  talents: {
    arrayReferences: [
      { table: 'careerLevels', field: 'talents', type: 'array' },
      { table: 'species', field: 'talents', type: 'array' },
      { table: 'creatures', field: 'talents', type: 'array' }
    ],
    stringReferences: [
      { table: 'talents', field: 'addTalent', indexed: true }
    ],
    objectReferences: []
  },

  // SKILLS - referenced by careerLevels, species, creatures, talents
  skills: {
    arrayReferences: [
      { table: 'careerLevels', field: 'skills', type: 'array' },
      { table: 'species', field: 'skills', type: 'array' },
      { table: 'creatures', field: 'skills', type: 'array' }
    ],
    stringReferences: [
      { table: 'talents', field: 'addSkill', indexed: true },
      { table: 'skills', field: 'characteristic', indexed: true }
    ],
    objectReferences: []
  },

  // CHARACTERISTICS - referenced by skills, careerLevels
  characteristics: {
    arrayReferences: [
      { table: 'careerLevels', field: 'characteristics', type: 'array' }
    ],
    stringReferences: [
      { table: 'skills', field: 'characteristic', indexed: true }
    ],
    objectReferences: [
      { table: 'creatures', field: 'char', pattern: 'values' } // characteristics as values in char object
    ]
  },

  // TRAPPINGS - referenced by careerLevels, classes, creatures
  trappings: {
    arrayReferences: [
      { table: 'careerLevels', field: 'trappings', type: 'array' },
      { table: 'classes', field: 'trappings', type: 'array' },
      { table: 'creatures', field: 'trappings', type: 'array' }
    ],
    stringReferences: [],
    objectReferences: []
  },

  // QUALITIES - referenced by trappings
  qualities: {
    arrayReferences: [
      { table: 'trappings', field: 'qualities', type: 'array' }
    ],
    stringReferences: [],
    objectReferences: []
  },

  // SPELLS - referenced by creatures, gods (blessings/miracles)
  spells: {
    arrayReferences: [
      { table: 'creatures', field: 'spells', type: 'array' },
      { table: 'gods', field: 'blessings', type: 'array' },
      { table: 'gods', field: 'miracles', type: 'array' }
    ],
    stringReferences: [],
    objectReferences: []
  },

  // LORES - referenced by spells
  lores: {
    arrayReferences: [],
    stringReferences: [
      { table: 'spells', field: 'lore', indexed: false }
    ],
    objectReferences: []
  },

  // MAGICKS - referenced by lores (parent)
  magicks: {
    arrayReferences: [],
    stringReferences: [
      { table: 'lores', field: 'parent', indexed: false }
    ],
    objectReferences: []
  },

  // GODS - not directly referenced (they reference spells)
  gods: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // CREATURES - not directly referenced
  creatures: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // TRAITS - referenced by creatures
  traits: {
    arrayReferences: [
      { table: 'creatures', field: 'traits', type: 'array' }
    ],
    stringReferences: [],
    objectReferences: []
  },

  // STARS - not directly referenced
  stars: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // EYES - not directly referenced
  eyes: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // HAIRS - not directly referenced
  hairs: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // DETAILS - referenced by species (refDetail)
  details: {
    arrayReferences: [],
    stringReferences: [
      { table: 'species', field: 'refDetail', indexed: false }
    ],
    objectReferences: []
  },

  // ETATS - not directly referenced
  etats: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // PSYCHOLOGIES - not directly referenced
  psychologies: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // BOOKS - referenced by most entities via 'book' field
  books: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'book', indexed: true },
      { table: 'careerLevels', field: 'book', indexed: true },
      { table: 'species', field: 'book', indexed: true },
      { table: 'classes', field: 'book', indexed: true },
      { table: 'talents', field: 'book', indexed: true },
      { table: 'skills', field: 'book', indexed: true },
      { table: 'characteristics', field: 'book', indexed: true },
      { table: 'trappings', field: 'book', indexed: true },
      { table: 'spells', field: 'book', indexed: true },
      { table: 'creatures', field: 'book', indexed: true },
      { table: 'traits', field: 'book', indexed: true },
      { table: 'lores', field: 'book', indexed: true },
      { table: 'magicks', field: 'book', indexed: true },
      { table: 'gods', field: 'book', indexed: true },
      { table: 'stars', field: 'book', indexed: true },
      { table: 'etats', field: 'book', indexed: true },
      { table: 'psychologies', field: 'book', indexed: true },
      { table: 'qualities', field: 'book', indexed: true }
    ],
    objectReferences: []
  },

  // TREES - referenced by most entities via 'folder' field
  trees: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'folder', indexed: true },
      { table: 'careerLevels', field: 'folder', indexed: true },
      { table: 'species', field: 'folder', indexed: true },
      { table: 'classes', field: 'folder', indexed: true },
      { table: 'talents', field: 'folder', indexed: true },
      { table: 'skills', field: 'folder', indexed: true },
      { table: 'characteristics', field: 'folder', indexed: true },
      { table: 'trappings', field: 'folder', indexed: true },
      { table: 'spells', field: 'folder', indexed: true },
      { table: 'creatures', field: 'folder', indexed: true },
      { table: 'traits', field: 'folder', indexed: true },
      { table: 'lores', field: 'folder', indexed: true },
      { table: 'magicks', field: 'folder', indexed: true },
      { table: 'gods', field: 'folder', indexed: true },
      { table: 'stars', field: 'folder', indexed: true },
      { table: 'etats', field: 'folder', indexed: true },
      { table: 'psychologies', field: 'folder', indexed: true },
      { table: 'qualities', field: 'folder', indexed: true },
      { table: 'trees', field: 'parent', indexed: false }
    ],
    objectReferences: []
  }
}

/**
 * Query an indexed field for entities referencing a specific ID
 * @private
 */
async function queryIndexedReference(table, field, entityId) {
  return await db[table].where(field).equals(entityId).toArray()
}

/**
 * Query array field for entities containing a specific ID
 * Handles both string arrays and object arrays with .id property
 * @private
 */
async function queryArrayReference(table, field, entityId, type) {
  const allEntities = await db[table].toArray()

  return allEntities.filter(entity => {
    const fieldValue = entity[field]
    if (!fieldValue) return false

    // Handle string-or-array type (like species in careers)
    if (type === 'string-or-array') {
      if (typeof fieldValue === 'string') {
        const ids = fieldValue.split(',').map(s => s.trim())
        return ids.includes(entityId)
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(item => {
          const id = typeof item === 'string' ? item : item?.id
          return id === entityId
        })
      }
      return false
    }

    // Handle regular arrays
    if (!Array.isArray(fieldValue)) return false

    return fieldValue.some(item => {
      const id = typeof item === 'string' ? item : item?.id
      return id === entityId
    })
  })
}

/**
 * Query object field for entities with embedded references
 * Supports 'keys' pattern (entity ID as object key) and 'values' pattern (entity ID as object value)
 * @private
 */
async function queryObjectReference(table, field, entityId, pattern) {
  const allEntities = await db[table].toArray()

  return allEntities.filter(entity => {
    const fieldValue = entity[field]
    if (!fieldValue || typeof fieldValue !== 'object') return false

    if (pattern === 'keys') {
      // Check if entityId is a key in the object (e.g., rand object in careers)
      return Object.keys(fieldValue).includes(entityId)
    }

    if (pattern === 'values') {
      // Check if entityId is a value in the object (e.g., char object in creatures)
      return Object.values(fieldValue).includes(entityId)
    }

    return false
  })
}

/**
 * Get all entities that reference (use) a specific entity
 *
 * This function performs a comprehensive reverse lookup across all entity types
 * to find where a specific entity is used. It handles multiple relationship patterns:
 * - Array-based references (skills[], talents[], trappings[])
 * - String-based references (career, class, characteristic)
 * - Object-embedded references (rand object keys, char object values)
 *
 * Results are grouped by entity type and cached for 5 minutes.
 * Performance is optimized using batch queries and indexed lookups where available.
 *
 * @param {string} entityType - Type of the entity (e.g., 'skills', 'talents', 'careers')
 * @param {string} entityId - ID of the entity to find usage for
 * @param {Object} options - Optional configuration
 * @param {boolean} options.skipCache - If true, bypass cache and fetch fresh data
 * @param {boolean} options.benchmark - If true, return performance metrics
 * @returns {Promise<Object>} Object with results grouped by entity type and optional performance data
 *
 * @example
 * // Find all entities that reference a specific skill
 * const usage = await getEntityUsage('skills', 'athletisme')
 * // Returns: {
 * //   careerLevels: [{ id: 'artisan|1', label: 'Apprenti Artisan', ... }],
 * //   talents: [{ id: 'acrobat', label: 'Acrobate', ... }],
 * //   species: [{ id: 'human', label: 'Humain', ... }],
 * //   _performance: { queryTime: 45, cacheHit: false }
 * // }
 *
 * @example
 * // Find where a talent is used
 * const usage = await getEntityUsage('talents', 'combat-au-contact')
 * // Returns grouped results showing career levels and other talents that reference it
 *
 * @example
 * // Find career levels that use a specific career
 * const usage = await getEntityUsage('careers', 'artisan')
 * // Returns: { careerLevels: [...], species: [...] }
 */
export async function getEntityUsage(entityType, entityId, options = {}) {
  const { skipCache = false, benchmark = false } = options
  const startTime = benchmark ? performance.now() : 0

  // Check cache first
  const cacheKey = `usage:${entityType}:${entityId}`
  if (!skipCache) {
    const cached = relationCache.get(cacheKey)
    if (cached) {
      if (benchmark) {
        return {
          ...cached,
          _performance: {
            queryTime: performance.now() - startTime,
            cacheHit: true
          }
        }
      }
      return cached
    }
  }

  // Get relationship configuration for this entity type
  const config = ENTITY_RELATIONSHIP_CONFIG[entityType]
  if (!config) {
    console.warn(`No relationship configuration found for entity type: ${entityType}`)
    return {}
  }

  const results = {}

  // Query all array-based references
  const arrayQueries = config.arrayReferences.map(async ref => {
    const entities = await queryArrayReference(ref.table, ref.field, entityId, ref.type)
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Query all string-based references
  const stringQueries = config.stringReferences.map(async ref => {
    const entities = ref.indexed
      ? await queryIndexedReference(ref.table, ref.field, entityId)
      : await queryArrayReference(ref.table, ref.field, entityId, 'string')
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Query all object-embedded references
  const objectQueries = config.objectReferences.map(async ref => {
    const entities = await queryObjectReference(ref.table, ref.field, entityId, ref.pattern)
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Execute all queries in parallel
  await Promise.all([...arrayQueries, ...stringQueries, ...objectQueries])

  // Remove duplicates within each entity type (using Set with id as key)
  for (const table in results) {
    const uniqueMap = new Map()
    results[table].forEach(entity => {
      if (!uniqueMap.has(entity.id)) {
        uniqueMap.set(entity.id, entity)
      }
    })
    results[table] = Array.from(uniqueMap.values())
  }

  // Cache the results
  relationCache.set(cacheKey, results)

  // Add performance metrics if requested
  if (benchmark) {
    return {
      ...results,
      _performance: {
        queryTime: performance.now() - startTime,
        cacheHit: false,
        resultCount: Object.values(results).reduce((sum, arr) => sum + arr.length, 0),
        entityTypesFound: Object.keys(results).length
      }
    }
  }

  return results
}

/**
 * Get usage statistics for an entity
 *
 * Returns a summary of how many times an entity is referenced across all entity types.
 * Useful for determining if an entity can be safely deleted or understanding its importance.
 *
 * @param {string} entityType - Type of the entity
 * @param {string} entityId - ID of the entity
 * @returns {Promise<Object>} Object with usage counts and total
 *
 * @example
 * const stats = await getEntityUsageStats('skills', 'athletisme')
 * // Returns: {
 * //   counts: { careerLevels: 15, talents: 2, species: 3 },
 * //   total: 20,
 * //   canDelete: false
 * // }
 */
export async function getEntityUsageStats(entityType, entityId) {
  const usage = await getEntityUsage(entityType, entityId)

  const counts = {}
  let total = 0

  for (const table in usage) {
    if (table !== '_performance') {
      counts[table] = usage[table].length
      total += usage[table].length
    }
  }

  return {
    counts,
    total,
    canDelete: total === 0 // Entity is safe to delete if not used anywhere
  }
}

/**
 * Batch query for entity usage
 *
 * Efficiently finds usage for multiple entities of the same type.
 * Uses Promise.all for parallel processing.
 *
 * @param {string} entityType - Type of entities
 * @param {Array<string>} entityIds - Array of entity IDs
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} Object mapping entity IDs to their usage data
 *
 * @example
 * const batchUsage = await getEntityUsageBatch('skills', ['athletisme', 'escalade', 'natation'])
 * // Returns: {
 * //   'athletisme': { careerLevels: [...], talents: [...] },
 * //   'escalade': { careerLevels: [...] },
 * //   'natation': { species: [...] }
 * // }
 */
export async function getEntityUsageBatch(entityType, entityIds, options = {}) {
  const results = await Promise.all(
    entityIds.map(async id => {
      const usage = await getEntityUsage(entityType, id, options)
      return { id, usage }
    })
  )

  // Convert array to object with IDs as keys
  return results.reduce((acc, { id, usage }) => {
    acc[id] = usage
    return acc
  }, {})
}

/**
 * Find orphaned entities
 *
 * Finds all entities of a specific type that are not referenced by any other entities.
 * Useful for data cleanup and identifying unused content.
 *
 * @param {string} entityType - Type of entities to check
 * @param {Object} options - Optional configuration
 * @param {number} options.limit - Maximum number of orphans to return (default: 100)
 * @returns {Promise<Array>} Array of orphaned entities
 *
 * @example
 * const orphanedSkills = await findOrphanedEntities('skills')
 * // Returns: [{ id: 'rare-skill', label: 'Rare Skill', usage: {} }]
 */
export async function findOrphanedEntities(entityType, options = {}) {
  const { limit = 100 } = options

  // Get all entities of this type
  const allEntities = await db[entityType].toArray()

  const orphans = []

  // Check usage for each entity (with limit to avoid excessive queries)
  for (const entity of allEntities.slice(0, Math.min(allEntities.length, limit * 2))) {
    const stats = await getEntityUsageStats(entityType, entity.id)

    if (stats.canDelete) {
      orphans.push({
        ...entity,
        usage: stats
      })

      if (orphans.length >= limit) break
    }
  }

  return orphans
}

export default {
  getEntityUsage,
  getEntityUsageStats,
  getEntityUsageBatch,
  findOrphanedEntities
}
