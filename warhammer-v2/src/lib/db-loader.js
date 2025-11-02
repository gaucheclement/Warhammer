/**
 * Database Loader
 *
 * Transforms JSON data into IndexedDB format with structured EntityReferences.
 * This is the core transformation layer for Issue #47.
 *
 * Key Responsibilities:
 * - Load original JSON (unchanged format)
 * - Generate stable IDs for all entities
 * - Parse all reference strings using db-reference-parser
 * - Resolve labels to IDs with context-aware lookup
 * - Store normalized EntityReference objects in IndexedDB
 * - Generate validation and integrity reports
 *
 * @module db-loader
 */

import {
  parseCommaSeparatedList,
  parseMultiSeparatorList,
  parseEntityReference,
  parseEntityReferenceList
} from './db-reference-parser.js'

import {
  generateIdsForEntities,
  createLabelToIdMap,
  resolveLabelToId
} from './db-id-generator.js'

/**
 * Entity type configuration
 * Maps JSON field names to entity types
 */
export const ENTITY_RELATIONSHIP_CONFIG = {
  // Career fields
  career: 'careers',
  careers: 'careers',

  // Species fields
  species: 'species',

  // Class fields
  class: 'classes',

  // Skill fields
  skill: 'skills',
  skills: 'skills',
  addSkill: 'skills',

  // Talent fields
  talent: 'talents',
  talents: 'talents',
  addTalent: 'talents',

  // Trait fields
  trait: 'traits',
  traits: 'traits',
  optionals: 'traits',  // Optional traits for creatures

  // Characteristic fields
  characteristic: 'characteristics',
  characteristics: 'characteristics',

  // Trapping fields
  trapping: 'trappings',
  trappings: 'trappings',

  // Quality fields
  quality: 'qualities',
  qualities: 'qualities',

  // Spell fields
  spell: 'spells',
  spells: 'spells',
  blessings: 'spells',
  miracles: 'spells',

  // Lore fields
  lore: 'lores',

  // Book fields
  book: 'books',

  // Folder/tree fields
  folder: 'trees'
}

/**
 * Get entity type from field name
 *
 * @param {string} fieldName - Field name from JSON
 * @returns {string|null} Entity type or null
 */
export function getEntityTypeForField(fieldName) {
  return ENTITY_RELATIONSHIP_CONFIG[fieldName] || null
}

/**
 * Check if a field contains entity references
 *
 * @param {string} fieldName - Field name
 * @returns {boolean} True if field contains references
 */
export function isReferenceField(fieldName) {
  return fieldName in ENTITY_RELATIONSHIP_CONFIG
}

/**
 * Transform a simple reference (string or array of strings)
 *
 * @param {string|Array<string>} value - Reference value
 * @param {string} entityType - Target entity type
 * @param {Map} labelMap - Label-to-ID mapping for target type
 * @returns {string|Array<string>|null} Transformed reference(s)
 */
function transformSimpleReference(value, entityType, labelMap) {
  if (!value) return null

  // Single string reference
  if (typeof value === 'string') {
    // If it looks like an ID already (lowercase, no spaces), keep it
    if (/^[a-z0-9-]+$/.test(value)) {
      return value
    }

    // Otherwise, try to resolve as label
    const id = resolveLabelToId(value, labelMap, entityType)
    return id || value  // Fallback to original if unresolved
  }

  // Array of string references
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') {
        if (/^[a-z0-9-]+$/.test(item)) {
          return item
        }
        const id = resolveLabelToId(item, labelMap, entityType)
        return id || item
      }
      return item
    })
  }

  return value
}

/**
 * Transform a complex reference with modifiers
 *
 * Parses strings like "Arme +5, Lanceur de Sorts (Sorcellerie)"
 * into EntityReference objects with id, prefix, spec, etc.
 *
 * @param {string} value - Reference string
 * @param {string} entityType - Target entity type
 * @param {Map} labelMap - Label-to-ID mapping
 * @returns {Array<Object>} Array of EntityReference objects
 */
function transformComplexReference(value, entityType, labelMap) {
  if (!value || typeof value !== 'string') {
    return []
  }

  // Parse the reference list
  const parsed = parseEntityReferenceList(value, entityType)

  // Resolve labels to IDs
  return parsed.map(ref => {
    const id = resolveLabelToId(ref.label, labelMap, entityType)

    const result = {
      id: id || ref.label,  // Fallback to label if unresolved
      entityType,
      label: ref.label,
      originalText: ref.originalText
    }

    // Only include optional fields if they have values
    if (ref.prefix !== null && ref.prefix !== undefined) {
      result.prefix = ref.prefix
    }
    if (ref.suffix !== null && ref.suffix !== undefined) {
      result.suffix = ref.suffix
    }
    if (ref.spec !== null && ref.spec !== undefined) {
      result.spec = ref.spec
    }
    if (ref.rating !== null && ref.rating !== undefined) {
      result.rating = ref.rating
    }

    return result
  })
}

/**
 * Check if a field needs complex reference transformation
 *
 * Complex references have modifiers like "+5" or specs like "(Épée)"
 *
 * @param {string} fieldName - Field name
 * @param {*} value - Field value
 * @returns {boolean} True if complex transformation needed
 */
function needsComplexTransform(fieldName, value) {
  if (typeof value !== 'string') return false

  // Fields that commonly have modifiers or specs
  const complexFields = ['traits', 'optionals', 'talents', 'skills', 'spells']

  if (!complexFields.includes(fieldName)) return false

  // Check if value contains modifiers or specializations
  return /[+\-]\d+|[()]/. test(value)
}

/**
 * Transform entity fields with references
 *
 * @param {Object} entity - Entity object
 * @param {string} entityType - Entity type
 * @param {Object} labelMaps - Label-to-ID maps for all entity types
 * @returns {Object} Transformed entity
 */
function transformEntityReferences(entity, entityType, labelMaps) {
  const transformed = { ...entity }

  for (const [fieldName, value] of Object.entries(entity)) {
    // Skip if not a reference field
    if (!isReferenceField(fieldName)) continue

    const targetType = getEntityTypeForField(fieldName)
    if (!targetType) continue

    const labelMap = labelMaps[targetType]
    if (!labelMap) continue

    // Transform based on complexity
    if (needsComplexTransform(fieldName, value)) {
      transformed[fieldName] = transformComplexReference(value, targetType, labelMap)
    } else {
      transformed[fieldName] = transformSimpleReference(value, targetType, labelMap)
    }
  }

  return transformed
}

/**
 * Mapping from JSON keys (singular) to IndexedDB table names (plural)
 */
export const JSON_TO_TABLE_MAPPING = {
  book: 'books',
  career: 'careers',
  careerLevel: 'careerLevels',
  specie: 'species',
  class: 'classes',
  talent: 'talents',
  characteristic: 'characteristics',
  trapping: 'trappings',
  skill: 'skills',
  spell: 'spells',
  creature: 'creatures',
  star: 'stars',
  god: 'gods',
  eye: 'eyes',
  hair: 'hairs',
  detail: 'details',
  trait: 'traits',
  lore: 'lores',
  magick: 'magicks',
  etat: 'etats',
  psychologie: 'psychologies',
  quality: 'qualities',
  tree: 'trees'
}

/**
 * Transform and load JSON data into structured format
 *
 * Main entry point for data transformation.
 *
 * @param {Object} jsonData - Raw JSON data (from all-data.json)
 * @param {Object} options - Loading options
 * @param {boolean} options.generateReport - Generate validation report
 * @param {boolean} options.preserveOriginal - Keep original fields
 * @returns {Object} Transformed data and report
 */
export function transformData(jsonData, options = {}) {
  const {
    generateReport = true,
    preserveOriginal = false
  } = options

  const transformed = {}
  const report = {
    totalEntities: 0,
    totalReferences: 0,
    unresolvedReferences: [],
    ambiguousReferences: [],
    stats: {}
  }

  // Step 1: Generate IDs for all entities and create label maps
  const labelMaps = {}

  for (const [jsonKey, tableName] of Object.entries(JSON_TO_TABLE_MAPPING)) {
    const entities = jsonData[jsonKey]
    if (!entities || !Array.isArray(entities)) continue

    // Generate IDs
    const entitiesWithIds = generateIdsForEntities(
      entities.map(e => ({ ...e })),  // Clone to avoid mutation
      tableName
    )

    // Transform 'index' field to 'id' if 'id' doesn't exist
    for (const entity of entitiesWithIds) {
      if (!entity.id && entity.index !== undefined) {
        entity.id = entity.index.toString()
      }
    }

    // Create label map for this type
    labelMaps[tableName] = createLabelToIdMap(entitiesWithIds)

    // Store in transformed data
    transformed[tableName] = entitiesWithIds

    report.totalEntities += entitiesWithIds.length
    report.stats[tableName] = {
      count: entitiesWithIds.length,
      hasIds: entitiesWithIds.filter(e => e.id).length
    }
  }

  // Step 2: Transform references in all entities
  for (const [tableName, entities] of Object.entries(transformed)) {
    transformed[tableName] = entities.map(entity =>
      transformEntityReferences(entity, tableName, labelMaps)
    )
  }

  // Step 3: Generate validation report (if requested)
  if (generateReport) {
    // Count references and check for unresolved ones
    for (const [tableName, entities] of Object.entries(transformed)) {
      for (const entity of entities) {
        for (const [fieldName, value] of Object.entries(entity)) {
          if (!isReferenceField(fieldName)) continue

          // Count this reference
          if (Array.isArray(value)) {
            report.totalReferences += value.length

            // Check for unresolved EntityReferences
            for (const ref of value) {
              if (ref && typeof ref === 'object' && ref.entityType) {
                const targetEntities = transformed[ref.entityType] || []
                const exists = targetEntities.some(e => e.id === ref.id)

                if (!exists) {
                  report.unresolvedReferences.push({
                    entity: `${tableName}/${entity.id}`,
                    field: fieldName,
                    reference: ref,
                    reason: 'Referenced entity not found'
                  })
                }
              }
            }
          } else if (value) {
            report.totalReferences++
          }
        }
      }
    }
  }

  return {
    data: transformed,
    report
  }
}

/**
 * Load transformed data into IndexedDB
 *
 * @param {Object} db - Dexie database instance
 * @param {Object} transformedData - Data from transformData()
 * @returns {Promise<Object>} Load statistics
 */
export async function loadIntoIndexedDB(db, transformedData) {
  const stats = {
    loaded: {},
    errors: []
  }

  for (const [tableName, entities] of Object.entries(transformedData)) {
    try {
      // Clear existing data
      await db[tableName].clear()

      // Bulk add new data
      if (entities && entities.length > 0) {
        await db[tableName].bulkAdd(entities)
        stats.loaded[tableName] = entities.length
      } else {
        stats.loaded[tableName] = 0
      }
    } catch (error) {
      stats.errors.push({
        table: tableName,
        error: error.message
      })
    }
  }

  return stats
}

/**
 * Format validation report for display
 *
 * @param {Object} report - Validation report from transformData()
 * @returns {string} Formatted report
 */
export function formatReport(report) {
  const lines = []

  lines.push('=== Data Transformation Report ===')
  lines.push('')
  lines.push(`Total Entities: ${report.totalEntities}`)
  lines.push(`Total References: ${report.totalReferences}`)
  lines.push(`Unresolved: ${report.unresolvedReferences.length}`)
  lines.push(`Ambiguous: ${report.ambiguousReferences.length}`)
  lines.push('')

  if (report.unresolvedReferences.length > 0) {
    lines.push('--- Unresolved References ---')
    for (const ref of report.unresolvedReferences.slice(0, 10)) {
      lines.push(`  ${ref.entity}.${ref.field}: "${ref.reference.label}" -> ${ref.reference.id}`)
    }
    if (report.unresolvedReferences.length > 10) {
      lines.push(`  ... and ${report.unresolvedReferences.length - 10} more`)
    }
    lines.push('')
  }

  lines.push('--- Entity Type Statistics ---')
  for (const [type, stats] of Object.entries(report.stats)) {
    lines.push(`  ${type}: ${stats.count} entities, ${stats.hasIds} with IDs`)
  }

  return lines.join('\n')
}

export default {
  transformData,
  loadIntoIndexedDB,
  formatReport,
  getEntityTypeForField,
  isReferenceField,
  JSON_TO_TABLE_MAPPING,
  ENTITY_RELATIONSHIP_CONFIG
}
