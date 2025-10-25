/**
 * Unit Tests for Import/Export Utilities
 * Tests JSON data import/export with validation and conflict resolution
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  importCustomModifications,
  exportCustomModifications,
  exportCharacters,
  generateJSONPatch,
  previewImport,
  validateImport
} from './importExport.js'

describe('importExport', () => {
  const existingData = {
    talents: [
      { id: 1, name: 'Existing Talent 1', description: 'Description 1' },
      { id: 2, name: 'Existing Talent 2', description: 'Description 2' }
    ],
    skills: [
      { id: 1, name: 'Existing Skill', description: 'Description' }
    ]
  }

  describe('importCustomModifications', () => {
    it('should import valid JSON data', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 3, name: 'New Talent', description: 'New' }
        ]
      })

      const result = await importCustomModifications(json, existingData)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.importedCount).toBeGreaterThan(0)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid JSON', async () => {
      const json = '{invalid json}'
      const result = await importCustomModifications(json, existingData)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(e => e.includes('Invalid JSON'))).toBe(true)
    })

    it('should detect ID conflicts and warn', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Conflicting Talent', description: 'Conflict' }
        ]
      })

      const result = await importCustomModifications(json, existingData)

      expect(result.warnings.some(w => w.includes('conflict'))).toBe(true)
      expect(Object.keys(result.conflicts)).toContain('talents')
    })

    it('should merge with existing data by default', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 3, name: 'New Talent', description: 'New' }
        ]
      })

      const result = await importCustomModifications(json, existingData, { merge: true })

      expect(result.success).toBe(true)
      expect(result.data.talents.length).toBeGreaterThan(existingData.talents.length)
    })

    it('should skip conflicting entries when overwrite is false', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Updated Talent', description: 'Updated' }
        ]
      })

      const result = await importCustomModifications(json, existingData, {
        merge: true,
        overwrite: false
      })

      expect(result.success).toBe(true)
      expect(result.warnings.some(w => w.includes('skipped'))).toBe(true)
    })

    it('should overwrite conflicting entries when overwrite is true', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Updated Talent', description: 'Updated' }
        ]
      })

      const result = await importCustomModifications(json, existingData, {
        merge: true,
        overwrite: true
      })

      expect(result.success).toBe(true)
      expect(result.warnings.some(w => w.includes('overwritten'))).toBe(true)
      expect(result.data.talents.find(t => t.id === 1).name).toBe('Updated Talent')
    })

    it('should filter by entity types when specified', async () => {
      const json = JSON.stringify({
        talents: [{ id: 3, name: 'New Talent', description: 'New' }],
        skills: [{ id: 3, name: 'New Skill', description: 'New' }]
      })

      const result = await importCustomModifications(json, existingData, {
        entityTypes: ['talents']
      })

      expect(result.success).toBe(true)
      expect(result.data.talents).toBeDefined()
      expect(result.data.skills).toBeUndefined()
    })

    it('should validate data when validation is enabled', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 3, description: 'Missing name' } // Invalid: missing required field
        ]
      })

      const result = await importCustomModifications(json, existingData, {
        validate: true
      })

      expect(result.success).toBe(false)
      expect(result.errors.some(e => e.includes('name'))).toBe(true)
    })

    it('should skip validation when disabled', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 3, description: 'Missing name' }
        ]
      })

      const result = await importCustomModifications(json, existingData, {
        validate: false
      })

      expect(result.success).toBe(true)
    })

    it('should sanitize data when sanitization is enabled', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 3, name: '<script>Evil</script>', description: 'Test' }
        ]
      })

      const result = await importCustomModifications(json, existingData, {
        sanitize: true
      })

      expect(result.success).toBe(true)
      expect(result.data.talents.find(t => t.id === 3).name).not.toContain('<script>')
    })
  })

  describe('exportCustomModifications', () => {
    const customData = {
      talents: [
        { id: 1, name: 'Custom Talent 1', description: 'Description 1' },
        { id: 2, name: 'Custom Talent 2', description: 'Description 2' }
      ],
      skills: [
        { id: 1, name: 'Custom Skill', description: 'Description' }
      ]
    }

    it('should export data as JSON string', () => {
      const json = exportCustomModifications(customData)

      expect(typeof json).toBe('string')
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('should include all entity types by default', () => {
      const json = exportCustomModifications(customData)
      const parsed = JSON.parse(json)

      expect(parsed.talents).toBeDefined()
      expect(parsed.skills).toBeDefined()
    })

    it('should filter by entity types when specified', () => {
      const json = exportCustomModifications(customData, {
        entityTypes: ['talents']
      })
      const parsed = JSON.parse(json)

      expect(parsed.talents).toBeDefined()
      expect(parsed.skills).toBeUndefined()
    })

    it('should include metadata by default', () => {
      const json = exportCustomModifications(customData)
      const parsed = JSON.parse(json)

      expect(parsed._metadata).toBeDefined()
      expect(parsed._metadata.exportedAt).toBeDefined()
      expect(parsed._metadata.version).toBeDefined()
      expect(parsed._metadata.entityTypes).toBeDefined()
    })

    it('should exclude metadata when disabled', () => {
      const json = exportCustomModifications(customData, {
        includeMetadata: false
      })
      const parsed = JSON.parse(json)

      expect(parsed._metadata).toBeUndefined()
    })

    it('should pretty print when enabled', () => {
      const json = exportCustomModifications(customData, {
        prettyPrint: true
      })

      expect(json).toContain('\n')
      expect(json).toContain('  ')
    })

    it('should minify when pretty print is disabled', () => {
      const json = exportCustomModifications(customData, {
        prettyPrint: false
      })

      expect(json).not.toContain('\n  ')
    })

    it('should exclude characters by default', () => {
      const dataWithCharacters = {
        ...customData,
        characters: [{ name: 'Test Character' }]
      }

      const json = exportCustomModifications(dataWithCharacters)
      const parsed = JSON.parse(json)

      expect(parsed.characters).toBeUndefined()
    })

    it('should include characters when specified', () => {
      const dataWithCharacters = {
        ...customData,
        characters: [{ name: 'Test Character' }]
      }

      const json = exportCustomModifications(dataWithCharacters, {
        includeCharacters: true
      })
      const parsed = JSON.parse(json)

      expect(parsed.characters).toBeDefined()
    })
  })

  describe('exportCharacters', () => {
    const characters = [
      { id: 1, name: 'Character 1', species: 'Human' },
      { id: 2, name: 'Character 2', species: 'Dwarf' }
    ]

    it('should export characters as JSON', () => {
      const json = exportCharacters(characters)

      expect(typeof json).toBe('string')
      const parsed = JSON.parse(json)
      expect(parsed.characters).toBeDefined()
      expect(parsed.characters).toHaveLength(2)
    })

    it('should include metadata by default', () => {
      const json = exportCharacters(characters)
      const parsed = JSON.parse(json)

      expect(parsed._metadata).toBeDefined()
      expect(parsed._metadata.characterCount).toBe(2)
    })

    it('should exclude metadata when disabled', () => {
      const json = exportCharacters(characters, false)
      const parsed = JSON.parse(json)

      expect(parsed._metadata).toBeUndefined()
    })
  })

  describe('generateJSONPatch', () => {
    it('should generate patch for custom modifications', () => {
      const customMods = {
        talents: [
          { id: 1, name: 'Modified Talent', description: 'Updated' }
        ]
      }

      const official = {
        talents: [
          { id: 1, name: 'Original Talent', description: 'Original' }
        ]
      }

      const patch = generateJSONPatch(customMods, official)
      const parsed = JSON.parse(patch)

      expect(parsed.modifications).toBeDefined()
      expect(parsed.modifications.length).toBeGreaterThan(0)
      expect(parsed._metadata.type).toBe('json-patch')
    })

    it('should identify update operations', () => {
      const customMods = {
        talents: [
          { id: 1, name: 'Modified', description: 'Changed' }
        ]
      }

      const official = {
        talents: [
          { id: 1, name: 'Original', description: 'Original' }
        ]
      }

      const patch = generateJSONPatch(customMods, official)
      const parsed = JSON.parse(patch)

      const updateOp = parsed.modifications.find(m => m.op === 'update')
      expect(updateOp).toBeDefined()
      expect(updateOp.changes).toBeDefined()
    })

    it('should identify add operations for custom entries', () => {
      const customMods = {
        talents: [
          { id: 'custom_1', name: 'New Custom', description: 'Custom', isCustom: true }
        ]
      }

      const official = {
        talents: []
      }

      const patch = generateJSONPatch(customMods, official)
      const parsed = JSON.parse(patch)

      const addOp = parsed.modifications.find(m => m.op === 'add')
      expect(addOp).toBeDefined()
    })

    it('should only include changed fields for updates', () => {
      const customMods = {
        talents: [
          { id: 1, name: 'Original', description: 'Changed', value: 100 }
        ]
      }

      const official = {
        talents: [
          { id: 1, name: 'Original', description: 'Original', value: 100 }
        ]
      }

      const patch = generateJSONPatch(customMods, official)
      const parsed = JSON.parse(patch)

      const updateOp = parsed.modifications.find(m => m.op === 'update')
      expect(updateOp.changes).toBeDefined()
      expect(updateOp.changes.description).toBe('Changed')
      expect(updateOp.changes.name).toBeUndefined() // Unchanged
    })
  })

  describe('previewImport', () => {
    it('should generate import preview', async () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Updated Talent', description: 'Updated' },
          { id: 3, name: 'New Talent', description: 'New' }
        ]
      })

      const result = await previewImport(json, existingData)

      expect(result.success).toBe(true)
      expect(result.preview).toBeDefined()
      expect(result.preview.summary).toBeDefined()
      expect(result.preview.summary.totalNew).toBeGreaterThan(0)
      expect(result.preview.summary.totalUpdated).toBeGreaterThan(0)
    })

    it('should return errors for invalid JSON', async () => {
      const result = await previewImport('{invalid}', existingData)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.preview).toBeNull()
    })
  })

  describe('validateImport', () => {
    it('should validate import and return report', () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Updated Talent', description: 'Test' }
        ]
      })

      const report = validateImport(json, existingData)

      expect(report.valid).toBe(true)
      expect(report.errors).toHaveLength(0)
      expect(report.preview).toBeDefined()
      expect(report.conflicts).toBeDefined()
    })

    it('should detect validation errors', () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, description: 'Missing name' }
        ]
      })

      const report = validateImport(json, existingData)

      expect(report.valid).toBe(false)
      expect(report.errors.length).toBeGreaterThan(0)
    })

    it('should detect conflicts', () => {
      const json = JSON.stringify({
        talents: [
          { id: 1, name: 'Conflict', description: 'Test' }
        ]
      })

      const report = validateImport(json, existingData)

      expect(report.valid).toBe(true)
      expect(Object.keys(report.conflicts)).toContain('talents')
    })

    it('should handle invalid JSON', () => {
      const report = validateImport('{invalid}', existingData)

      expect(report.valid).toBe(false)
      expect(report.errors.some(e => e.includes('Invalid JSON'))).toBe(true)
    })
  })
})
