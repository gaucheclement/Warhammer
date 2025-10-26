/**
 * Validation Utilities - Schema validation for imported data
 *
 * This module provides validation and sanitization functions for
 * JSON data import, ensuring data integrity and preventing XSS attacks.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the data is valid
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 */

// Entity type schemas - define required and optional fields
const SCHEMAS = {
  books: {
    required: ['id', 'label'],
    optional: ['abbreviation', 'description', 'author', 'year'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      abbreviation: 'string',
      description: 'string'
    }
  },
  careers: {
    required: ['id', 'label'],
    optional: ['class', 'species', 'status', 'description', 'levels'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      class: 'string',
      species: ['string', 'array'],
      status: 'string',
      description: 'string'
    }
  },
  careerLevels: {
    required: ['id', 'label'],
    optional: ['career', 'level', 'description', 'skills', 'talents', 'trappings'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      career: ['string', 'number'],
      level: 'number',
      description: 'string'
    }
  },
  species: {
    required: ['id', 'label'],
    optional: ['description', 'characteristics', 'skills', 'talents'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      description: 'string'
    }
  },
  talents: {
    required: ['id', 'label'],
    optional: ['maxRank', 'tests', 'description'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      maxRank: 'number',
      tests: 'string',
      description: 'string'
    }
  },
  skills: {
    required: ['id', 'label'],
    optional: ['characteristic', 'type', 'advanced', 'description'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      characteristic: 'string',
      type: 'string',
      advanced: 'boolean',
      description: 'string'
    }
  },
  spells: {
    required: ['id', 'label'],
    optional: ['cn', 'range', 'target', 'duration', 'description', 'lore'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      cn: ['string', 'number'],
      range: 'string',
      target: 'string',
      duration: 'string',
      description: 'string'
    }
  },
  trappings: {
    required: ['id', 'label'],
    optional: ['type', 'encumbrance', 'description', 'price'],
    types: {
      id: ['string', 'number'],
      label: 'string',
      type: 'string',
      encumbrance: 'number',
      description: 'string'
    }
  },
  characters: {
    required: ['name'],
    optional: [
      'species', 'career', 'description', 'characteristics', 'skills', 'talents',
      'spells', 'trappings', 'experience', 'wounds', 'fate', 'resilience',
      'notes', 'appearance', 'created', 'updated', 'isDraft'
    ],
    types: {
      name: 'string',
      species: 'object',
      career: 'object',
      description: 'string',
      characteristics: 'object',
      skills: 'array',
      talents: 'array',
      spells: 'array',
      trappings: 'array',
      experience: 'object',
      wounds: 'object',
      fate: 'object',
      resilience: 'object',
      notes: 'string',
      appearance: 'object',
      created: 'string',
      updated: 'string',
      isDraft: 'boolean'
    }
  }
}

/**
 * Validate a single entry against its schema
 * @param {string} entityType - Type of entity
 * @param {Object} entry - Entry to validate
 * @returns {ValidationResult} Validation result
 */
export function validateEntry(entityType, entry) {
  const errors = []
  const warnings = []

  // Get schema for entity type
  const schema = SCHEMAS[entityType]
  if (!schema) {
    errors.push(`Unknown entity type: ${entityType}`)
    return { valid: false, errors, warnings }
  }

  // Check required fields
  for (const field of schema.required) {
    if (!(field in entry) || entry[field] === null || entry[field] === undefined) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Check field types
  if (schema.types) {
    for (const [field, expectedType] of Object.entries(schema.types)) {
      if (field in entry && entry[field] !== null && entry[field] !== undefined) {
        const actualType = Array.isArray(entry[field]) ? 'array' : typeof entry[field]
        const expectedTypes = Array.isArray(expectedType) ? expectedType : [expectedType]

        if (!expectedTypes.includes(actualType)) {
          errors.push(
            `Invalid type for field '${field}': expected ${expectedTypes.join(' or ')}, got ${actualType}`
          )
        }
      }
    }
  }

  // Check for unexpected fields (warnings only)
  const allFields = [...schema.required, ...schema.optional]
  for (const field of Object.keys(entry)) {
    if (!field.startsWith('_') && !allFields.includes(field)) {
      warnings.push(`Unexpected field: ${field}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate an array of entries
 * @param {string} entityType - Type of entity
 * @param {Array} entries - Entries to validate
 * @returns {ValidationResult} Validation result with entry-specific errors
 */
export function validateEntries(entityType, entries) {
  const errors = []
  const warnings = []

  if (!Array.isArray(entries)) {
    errors.push('Entries must be an array')
    return { valid: false, errors, warnings }
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const result = validateEntry(entityType, entry)

    if (!result.valid) {
      errors.push(`Entry ${i}: ${result.errors.join(', ')}`)
    }

    if (result.warnings.length > 0) {
      warnings.push(`Entry ${i}: ${result.warnings.join(', ')}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate imported data structure
 * @param {Object} data - Imported data object
 * @returns {ValidationResult} Validation result
 */
export function validateImportData(data) {
  const errors = []
  const warnings = []

  if (typeof data !== 'object' || data === null) {
    errors.push('Import data must be an object')
    return { valid: false, errors, warnings }
  }

  // Validate each entity type
  for (const [entityType, entries] of Object.entries(data)) {
    // Skip metadata fields
    if (entityType.startsWith('_')) {
      continue
    }

    // Check if entity type is known
    if (!SCHEMAS[entityType]) {
      warnings.push(`Unknown entity type: ${entityType}`)
      continue
    }

    // Validate entries
    const result = validateEntries(entityType, entries)
    if (!result.valid) {
      errors.push(`${entityType}: ${result.errors.join(', ')}`)
    }
    if (result.warnings.length > 0) {
      warnings.push(`${entityType}: ${result.warnings.join(', ')}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Sanitize a string to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize an entry object
 * @param {Object} entry - Entry to sanitize
 * @returns {Object} Sanitized entry
 */
export function sanitizeEntry(entry) {
  const sanitized = {}

  for (const [key, value] of Object.entries(entry)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeEntry(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Sanitize imported data
 * @param {Object} data - Data to sanitize
 * @returns {Object} Sanitized data
 */
export function sanitizeImportData(data) {
  const sanitized = {}

  for (const [entityType, entries] of Object.entries(data)) {
    if (Array.isArray(entries)) {
      sanitized[entityType] = entries.map((entry) => sanitizeEntry(entry))
    } else if (typeof entries === 'object' && entries !== null) {
      sanitized[entityType] = sanitizeEntry(entries)
    } else {
      sanitized[entityType] = entries
    }
  }

  return sanitized
}

/**
 * Check for ID conflicts with existing data
 * @param {Object} importData - Data to import
 * @param {Object} existingData - Existing data
 * @returns {Object} Conflict report
 */
export function checkIdConflicts(importData, existingData) {
  const conflicts = {}

  for (const [entityType, entries] of Object.entries(importData)) {
    if (!Array.isArray(entries) || !existingData[entityType]) {
      continue
    }

    const existingIds = new Set(existingData[entityType].map((e) => e.id))
    const conflictingIds = []

    for (const entry of entries) {
      if (entry.id && existingIds.has(entry.id)) {
        conflictingIds.push(entry.id)
      }
    }

    if (conflictingIds.length > 0) {
      conflicts[entityType] = conflictingIds
    }
  }

  return conflicts
}

/**
 * Generate a preview of changes that will be applied
 * @param {Object} importData - Data to import
 * @param {Object} existingData - Existing data
 * @returns {Object} Change preview
 */
export function generateChangePreview(importData, existingData) {
  const preview = {
    new: {},
    updated: {},
    summary: {
      totalNew: 0,
      totalUpdated: 0
    }
  }

  for (const [entityType, entries] of Object.entries(importData)) {
    if (!Array.isArray(entries)) {
      continue
    }

    const existingMap = new Map()
    if (existingData[entityType]) {
      for (const entry of existingData[entityType]) {
        existingMap.set(entry.id, entry)
      }
    }

    const newEntries = []
    const updatedEntries = []

    for (const entry of entries) {
      if (entry.id && existingMap.has(entry.id)) {
        updatedEntries.push({
          id: entry.id,
          existing: existingMap.get(entry.id),
          imported: entry
        })
      } else {
        newEntries.push(entry)
      }
    }

    if (newEntries.length > 0) {
      preview.new[entityType] = newEntries
      preview.summary.totalNew += newEntries.length
    }

    if (updatedEntries.length > 0) {
      preview.updated[entityType] = updatedEntries
      preview.summary.totalUpdated += updatedEntries.length
    }
  }

  return preview
}

/**
 * Validate JSON structure (basic JSON validation)
 * @param {string} jsonString - JSON string to validate
 * @returns {ValidationResult} Validation result with parsed data
 */
export function validateJSON(jsonString) {
  const errors = []
  const warnings = []
  let data = null

  try {
    data = JSON.parse(jsonString)
  } catch (error) {
    errors.push(`Invalid JSON: ${error.message}`)
    return { valid: false, errors, warnings, data: null }
  }

  return { valid: true, errors, warnings, data }
}

/**
 * Validate file size before import
 * @param {number} size - File size in bytes
 * @param {number} [maxSize=10485760] - Maximum allowed size (default 10MB)
 * @returns {ValidationResult} Validation result
 */
export function validateFileSize(size, maxSize = 10485760) {
  const errors = []
  const warnings = []

  if (size > maxSize) {
    errors.push(
      `File size ${(size / 1048576).toFixed(2)}MB exceeds maximum allowed size ${(maxSize / 1048576).toFixed(2)}MB`
    )
  } else if (size > maxSize * 0.8) {
    warnings.push(`File size is approaching the maximum allowed size`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check if an entity type is valid
 * @param {string} entityType - Entity type to check
 * @returns {boolean} Whether the entity type is valid
 */
export function isValidEntityType(entityType) {
  return entityType in SCHEMAS
}

/**
 * Get all valid entity types
 * @returns {string[]} Array of valid entity types
 */
export function getValidEntityTypes() {
  return Object.keys(SCHEMAS)
}

/**
 * Get schema for an entity type
 * @param {string} entityType - Entity type
 * @returns {Object|null} Schema or null if not found
 */
export function getSchema(entityType) {
  return SCHEMAS[entityType] || null
}
