/**
 * Unit Tests for Validation Utilities
 * Tests data validation, sanitization, and conflict detection
 */

import { describe, it, expect } from 'vitest'
import {
  validateEntry,
  validateEntries,
  validateImportData,
  sanitizeString,
  sanitizeEntry,
  sanitizeImportData,
  checkIdConflicts,
  generateChangePreview,
  validateJSON,
  validateFileSize,
  isValidEntityType,
  getValidEntityTypes,
  getSchema
} from './validation.js'

describe('validation', () => {
  describe('validateEntry', () => {
    it('should validate a valid talent entry', () => {
      const entry = {
        id: 1,
        name: 'Test Talent',
        description: 'A test talent',
        maxRank: 3
      }

      const result = validateEntry('talents', entry)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject entry with missing required fields', () => {
      const entry = {
        id: 1,
        description: 'Missing name'
      }

      const result = validateEntry('talents', entry)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing required field: name')
    })

    it('should reject entry with wrong field types', () => {
      const entry = {
        id: 1,
        name: 123, // Should be string
        description: 'Test'
      }

      const result = validateEntry('talents', entry)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Invalid type'))).toBe(true)
    })

    it('should warn about unexpected fields', () => {
      const entry = {
        id: 1,
        name: 'Test',
        unexpectedField: 'value'
      }

      const result = validateEntry('talents', entry)

      expect(result.warnings.some(w => w.includes('Unexpected field'))).toBe(true)
    })

    it('should reject unknown entity type', () => {
      const entry = { id: 1, name: 'Test' }
      const result = validateEntry('unknownType', entry)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Unknown entity type: unknownType')
    })

    it('should allow internal fields (starting with _)', () => {
      const entry = {
        id: 1,
        name: 'Test',
        _internal: 'value'
      }

      const result = validateEntry('talents', entry)

      expect(result.warnings.some(w => w.includes('_internal'))).toBe(false)
    })
  })

  describe('validateEntries', () => {
    it('should validate an array of entries', () => {
      const entries = [
        { id: 1, name: 'Talent 1', description: 'Test 1' },
        { id: 2, name: 'Talent 2', description: 'Test 2' }
      ]

      const result = validateEntries('talents', entries)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should report errors for invalid entries with index', () => {
      const entries = [
        { id: 1, name: 'Talent 1' },
        { id: 2, description: 'Missing name' },
        { id: 3, name: 'Talent 3' }
      ]

      const result = validateEntries('talents', entries)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entry 1'))).toBe(true)
    })

    it('should reject non-array input', () => {
      const result = validateEntries('talents', { not: 'an array' })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Entries must be an array')
    })
  })

  describe('validateImportData', () => {
    it('should validate complete import data', () => {
      const data = {
        talents: [
          { id: 1, name: 'Talent 1', description: 'Test' },
          { id: 2, name: 'Talent 2', description: 'Test' }
        ],
        skills: [
          { id: 1, name: 'Skill 1', description: 'Test' }
        ]
      }

      const result = validateImportData(data)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject non-object input', () => {
      const result = validateImportData('not an object')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Import data must be an object')
    })

    it('should warn about unknown entity types', () => {
      const data = {
        unknownType: [{ id: 1, name: 'Test' }]
      }

      const result = validateImportData(data)

      expect(result.warnings.some(w => w.includes('Unknown entity type'))).toBe(true)
    })

    it('should skip metadata fields', () => {
      const data = {
        _metadata: { version: '2.0.0' },
        talents: [{ id: 1, name: 'Talent 1' }]
      }

      const result = validateImportData(data)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should collect errors from multiple entity types', () => {
      const data = {
        talents: [{ id: 1 }], // Missing name
        skills: [{ id: 1 }] // Missing name
      }

      const result = validateImportData(data)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('talents'))).toBe(true)
      expect(result.errors.some(e => e.includes('skills'))).toBe(true)
    })
  })

  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      const dangerous = '<script>alert("XSS")</script>'
      const sanitized = sanitizeString(dangerous)

      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
      expect(sanitized).not.toContain('<script>')
    })

    it('should escape ampersands', () => {
      expect(sanitizeString('A & B')).toBe('A &amp; B')
    })

    it('should escape quotes', () => {
      expect(sanitizeString('He said "hello"')).toContain('&quot;')
      expect(sanitizeString("It's OK")).toContain('&#x27;')
    })

    it('should escape forward slashes', () => {
      expect(sanitizeString('a/b/c')).toBe('a&#x2F;b&#x2F;c')
    })

    it('should return non-string values unchanged', () => {
      expect(sanitizeString(123)).toBe(123)
      expect(sanitizeString(null)).toBe(null)
      expect(sanitizeString(undefined)).toBe(undefined)
    })
  })

  describe('sanitizeEntry', () => {
    it('should sanitize all string fields in an entry', () => {
      const entry = {
        id: 1,
        name: '<script>Evil</script>',
        description: 'Test & Example',
        value: 100
      }

      const sanitized = sanitizeEntry(entry)

      expect(sanitized.name).not.toContain('<script>')
      expect(sanitized.description).toContain('&amp;')
      expect(sanitized.value).toBe(100)
    })

    it('should sanitize string arrays', () => {
      const entry = {
        id: 1,
        name: 'Test',
        tags: ['<tag1>', '<tag2>']
      }

      const sanitized = sanitizeEntry(entry)

      expect(sanitized.tags[0]).not.toContain('<tag1>')
      expect(sanitized.tags[0]).toBe('&lt;tag1&gt;')
    })

    it('should recursively sanitize nested objects', () => {
      const entry = {
        id: 1,
        name: 'Test',
        nested: {
          field: '<script>Bad</script>'
        }
      }

      const sanitized = sanitizeEntry(entry)

      expect(sanitized.nested.field).not.toContain('<script>')
    })
  })

  describe('sanitizeImportData', () => {
    it('should sanitize all entries in import data', () => {
      const data = {
        talents: [
          { id: 1, name: '<script>Evil</script>', description: 'Test' },
          { id: 2, name: 'Safe Name', description: 'Test & Example' }
        ]
      }

      const sanitized = sanitizeImportData(data)

      expect(sanitized.talents[0].name).not.toContain('<script>')
      expect(sanitized.talents[1].description).toContain('&amp;')
    })
  })

  describe('checkIdConflicts', () => {
    it('should detect ID conflicts', () => {
      const importData = {
        talents: [
          { id: 1, name: 'New Talent' },
          { id: 2, name: 'Another Talent' }
        ]
      }

      const existingData = {
        talents: [
          { id: 1, name: 'Existing Talent' }
        ]
      }

      const conflicts = checkIdConflicts(importData, existingData)

      expect(conflicts.talents).toBeDefined()
      expect(conflicts.talents).toContain(1)
      expect(conflicts.talents).not.toContain(2)
    })

    it('should return empty object if no conflicts', () => {
      const importData = {
        talents: [{ id: 3, name: 'New Talent' }]
      }

      const existingData = {
        talents: [{ id: 1, name: 'Existing Talent' }]
      }

      const conflicts = checkIdConflicts(importData, existingData)

      expect(Object.keys(conflicts)).toHaveLength(0)
    })

    it('should handle missing entity types in existing data', () => {
      const importData = {
        skills: [{ id: 1, name: 'New Skill' }]
      }

      const existingData = {
        talents: [{ id: 1, name: 'Existing Talent' }]
      }

      const conflicts = checkIdConflicts(importData, existingData)

      expect(conflicts.skills).toBeUndefined()
    })
  })

  describe('generateChangePreview', () => {
    it('should preview new and updated entries', () => {
      const importData = {
        talents: [
          { id: 1, name: 'Updated Talent' },
          { id: 2, name: 'New Talent' }
        ]
      }

      const existingData = {
        talents: [{ id: 1, name: 'Old Talent' }]
      }

      const preview = generateChangePreview(importData, existingData)

      expect(preview.summary.totalNew).toBe(1)
      expect(preview.summary.totalUpdated).toBe(1)
      expect(preview.new.talents).toHaveLength(1)
      expect(preview.updated.talents).toHaveLength(1)
    })

    it('should include both existing and imported data in updated entries', () => {
      const importData = {
        talents: [{ id: 1, name: 'Updated' }]
      }

      const existingData = {
        talents: [{ id: 1, name: 'Original' }]
      }

      const preview = generateChangePreview(importData, existingData)
      const updated = preview.updated.talents[0]

      expect(updated.existing).toBeDefined()
      expect(updated.imported).toBeDefined()
      expect(updated.existing.name).toBe('Original')
      expect(updated.imported.name).toBe('Updated')
    })

    it('should handle empty existing data', () => {
      const importData = {
        talents: [{ id: 1, name: 'New Talent' }]
      }

      const preview = generateChangePreview(importData, {})

      expect(preview.summary.totalNew).toBe(1)
      expect(preview.summary.totalUpdated).toBe(0)
    })
  })

  describe('validateJSON', () => {
    it('should validate and parse valid JSON', () => {
      const json = '{"talents": [{"id": 1, "name": "Test"}]}'
      const result = validateJSON(json)

      expect(result.valid).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.talents).toBeDefined()
    })

    it('should reject invalid JSON', () => {
      const json = '{invalid json}'
      const result = validateJSON(json)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Invalid JSON'))).toBe(true)
      expect(result.data).toBeNull()
    })

    it('should handle empty strings', () => {
      const result = validateJSON('')

      expect(result.valid).toBe(false)
    })
  })

  describe('validateFileSize', () => {
    it('should accept files within size limit', () => {
      const result = validateFileSize(1048576) // 1 MB

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject files exceeding size limit', () => {
      const result = validateFileSize(15728640) // 15 MB (default limit is 10 MB)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('exceeds maximum'))).toBe(true)
    })

    it('should warn when approaching size limit', () => {
      const result = validateFileSize(9437184) // 9 MB (90% of 10 MB)

      expect(result.valid).toBe(true)
      expect(result.warnings.some(w => w.includes('approaching'))).toBe(true)
    })

    it('should respect custom size limit', () => {
      const result = validateFileSize(2097152, 1048576) // 2 MB with 1 MB limit

      expect(result.valid).toBe(false)
    })
  })

  describe('isValidEntityType', () => {
    it('should identify valid entity types', () => {
      expect(isValidEntityType('talents')).toBe(true)
      expect(isValidEntityType('skills')).toBe(true)
      expect(isValidEntityType('careers')).toBe(true)
    })

    it('should reject invalid entity types', () => {
      expect(isValidEntityType('invalid')).toBe(false)
      expect(isValidEntityType('')).toBe(false)
    })
  })

  describe('getValidEntityTypes', () => {
    it('should return array of valid entity types', () => {
      const types = getValidEntityTypes()

      expect(Array.isArray(types)).toBe(true)
      expect(types.length).toBeGreaterThan(0)
      expect(types).toContain('talents')
      expect(types).toContain('skills')
      expect(types).toContain('careers')
    })
  })

  describe('getSchema', () => {
    it('should return schema for valid entity type', () => {
      const schema = getSchema('talents')

      expect(schema).toBeDefined()
      expect(schema.required).toBeDefined()
      expect(schema.optional).toBeDefined()
      expect(schema.required).toContain('id')
      expect(schema.required).toContain('name')
    })

    it('should return null for invalid entity type', () => {
      const schema = getSchema('invalid')

      expect(schema).toBeNull()
    })
  })
})
