/**
 * Unified sanitization module
 * Provides comprehensive XSS protection for all string inputs
 */

/**
 * Sanitize a string to prevent XSS attacks
 * Uses HTML entity encoding for comprehensive protection
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string with HTML entities encoded
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
 * Sanitize an object's string properties
 * @param {Object} obj - Object to sanitize
 * @param {Array} stringFields - Fields to sanitize (if empty, no sanitization)
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj, stringFields = []) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized = { ...obj }
  for (const field of stringFields) {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeString(sanitized[field])
    }
  }
  return sanitized
}

/**
 * Sanitize an array of objects
 * @param {Array} arr - Array to sanitize
 * @param {Array} stringFields - Fields to sanitize in each object
 * @returns {Array} Sanitized array
 */
export function sanitizeArray(arr, stringFields = []) {
  if (!Array.isArray(arr)) {
    return []
  }
  return arr.map(item => sanitizeObject(item, stringFields))
}

/**
 * Recursively sanitize an entry object (all string fields and nested objects/arrays)
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
 * Sanitize imported data (deep sanitization of all entities)
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
 * Sanitize form values (trim strings, validate numbers)
 * @param {Object} values - Form values
 * @returns {Object} Sanitized values
 */
export function sanitizeFormValues(values) {
  const sanitized = {}

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string') {
      // Trim whitespace
      sanitized[key] = value.trim()
    } else if (typeof value === 'number') {
      // Ensure it's a valid number
      sanitized[key] = isNaN(value) ? 0 : value
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
