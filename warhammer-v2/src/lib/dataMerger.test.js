/**
 * Unit Tests for Data Merging Logic
 * Tests the core functionality of merging official and custom data
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  mergeData,
  mergeEntityType,
  createModification,
  createCustomEntry,
  markAsDeleted,
  restoreDeleted,
  revertToOriginal,
  generateCustomId,
  isOfficialEntry,
  isCustomEntry,
  isModifiedEntry,
  getModifiedEntries,
  getCustomEntries,
  getMergeStats,
  detectConflicts,
  resolveConflict
} from './dataMerger.js'

describe('dataMerger', () => {
  describe('mergeEntityType', () => {
    it('should merge official and custom arrays correctly', () => {
      const official = [
        { id: 1, name: 'Sword', type: 'weapon', isOfficial: false },
        { id: 2, name: 'Shield', type: 'armor', isOfficial: false }
      ]

      const custom = [
        { id: 1, name: 'Magic Sword', type: 'weapon' },
        { id: 3, name: 'Potion', type: 'consumable' }
      ]

      const merged = mergeEntityType(official, custom)

      expect(merged).toHaveLength(3)
      expect(merged.find(e => e.id === 1).name).toBe('Magic Sword')
      expect(merged.find(e => e.id === 1).isModified).toBe(true)
      expect(merged.find(e => e.id === 2).isOfficial).toBe(true)
      expect(merged.find(e => e.id === 3).isCustom).toBe(true)
    })

    it('should preserve original data for modified entries', () => {
      const official = [{ id: 1, name: 'Original', value: 100 }]
      const custom = [{ id: 1, name: 'Modified', value: 200 }]

      const merged = mergeEntityType(official, custom)
      const entry = merged.find(e => e.id === 1)

      expect(entry._original).toBeDefined()
      expect(entry._original.name).toBe('Original')
      expect(entry._original.value).toBe(100)
    })

    it('should filter out deleted entries', () => {
      const official = [
        { id: 1, name: 'Entry 1' },
        { id: 2, name: 'Entry 2' }
      ]
      const custom = [
        { id: 1, name: 'Entry 1', isDeleted: true }
      ]

      const merged = mergeEntityType(official, custom)

      expect(merged).toHaveLength(1)
      expect(merged.find(e => e.id === 1)).toBeUndefined()
      expect(merged.find(e => e.id === 2)).toBeDefined()
    })

    it('should handle empty arrays', () => {
      expect(mergeEntityType([], [])).toEqual([])
      expect(mergeEntityType([{ id: 1, name: 'Test' }], [])).toHaveLength(1)
      expect(mergeEntityType([], [{ id: 1, name: 'Test' }])).toHaveLength(1)
    })
  })

  describe('mergeData', () => {
    it('should merge multiple entity types', () => {
      const official = {
        talents: [{ id: 1, name: 'Talent 1' }],
        skills: [{ id: 1, name: 'Skill 1' }],
        spells: []
      }

      const custom = {
        talents: [{ id: 2, name: 'Talent 2' }],
        spells: [{ id: 1, name: 'Spell 1' }]
      }

      const merged = mergeData(official, custom)

      expect(merged.talents).toHaveLength(2)
      expect(merged.skills).toHaveLength(1)
      expect(merged.spells).toHaveLength(1)
    })

    it('should handle missing entity types in custom', () => {
      const official = {
        talents: [{ id: 1, name: 'Talent 1' }],
        skills: [{ id: 1, name: 'Skill 1' }]
      }
      const custom = {}

      const merged = mergeData(official, custom)

      expect(merged.talents).toHaveLength(1)
      expect(merged.skills).toHaveLength(1)
    })
  })

  describe('createModification', () => {
    it('should create a modified entry with timestamp', () => {
      const original = { id: 1, name: 'Original', value: 100 }
      const modifications = { name: 'Modified', value: 200 }

      const modified = createModification(original, modifications)

      expect(modified.id).toBe(1)
      expect(modified.name).toBe('Modified')
      expect(modified.value).toBe(200)
      expect(modified._modifiedAt).toBeDefined()
      expect(typeof modified._modifiedAt).toBe('string')
    })

    it('should preserve unmodified fields', () => {
      const original = { id: 1, name: 'Original', value: 100, extra: 'data' }
      const modifications = { name: 'Modified' }

      const modified = createModification(original, modifications)

      expect(modified.value).toBe(100)
      expect(modified.extra).toBe('data')
    })
  })

  describe('createCustomEntry', () => {
    it('should create a custom entry with unique ID', () => {
      const data = { label: 'Custom Talent', description: 'Test' }
      const entry = createCustomEntry('talents', data)

      expect(entry.id).toBeDefined()
      expect(entry.id).toContain('custom_talents_')
      expect(entry.label).toBe('Custom Talent')
      expect(entry.isCustom).toBe(true)
      expect(entry._createdAt).toBeDefined()
    })

    it('should generate unique IDs for different calls', () => {
      const entry1 = createCustomEntry('talents', { label: 'Talent 1' })
      const entry2 = createCustomEntry('talents', { label: 'Talent 2' })

      expect(entry1.id).not.toBe(entry2.id)
    })
  })

  describe('generateCustomId', () => {
    it('should generate IDs with correct format', () => {
      const id = generateCustomId('talents')

      expect(id).toMatch(/^custom_talents_\d+_[a-z0-9]+$/)
    })

    it('should generate unique IDs', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateCustomId('talents'))
      }

      expect(ids.size).toBe(100)
    })
  })

  describe('markAsDeleted', () => {
    it('should mark an entry as deleted', () => {
      const entry = { id: 1, name: 'Entry' }
      const deleted = markAsDeleted(entry)

      expect(deleted.isDeleted).toBe(true)
      expect(deleted._deletedAt).toBeDefined()
      expect(typeof deleted._deletedAt).toBe('string')
    })

    it('should preserve original data', () => {
      const entry = { id: 1, name: 'Entry', value: 100 }
      const deleted = markAsDeleted(entry)

      expect(deleted.name).toBe('Entry')
      expect(deleted.value).toBe(100)
    })
  })

  describe('restoreDeleted', () => {
    it('should restore a deleted entry', () => {
      const entry = { id: 1, name: 'Entry', isDeleted: true, _deletedAt: '2024-01-01' }
      const restored = restoreDeleted(entry)

      expect(restored.isDeleted).toBeUndefined()
      expect(restored._deletedAt).toBeUndefined()
      expect(restored.name).toBe('Entry')
    })
  })

  describe('revertToOriginal', () => {
    it('should revert a modified entry to original', () => {
      const modified = {
        id: 1,
        name: 'Modified',
        _original: { id: 1, name: 'Original' }
      }

      const original = revertToOriginal(modified)

      expect(original).toBeDefined()
      expect(original.name).toBe('Original')
    })

    it('should return null if no original exists', () => {
      const entry = { id: 1, name: 'Entry' }
      const original = revertToOriginal(entry)

      expect(original).toBeNull()
    })
  })

  describe('isOfficialEntry', () => {
    it('should identify official entries', () => {
      const official = { id: 1, name: 'Entry', isOfficial: true }
      const modified = { id: 2, name: 'Entry', isOfficial: false, isModified: true }

      expect(isOfficialEntry(official)).toBe(true)
      expect(isOfficialEntry(modified)).toBe(false)
    })
  })

  describe('isCustomEntry', () => {
    it('should identify custom entries', () => {
      const custom = { id: 1, name: 'Entry', isCustom: true }
      const official = { id: 2, name: 'Entry', isOfficial: true }

      expect(isCustomEntry(custom)).toBe(true)
      expect(isCustomEntry(official)).toBe(false)
    })
  })

  describe('isModifiedEntry', () => {
    it('should identify modified entries', () => {
      const modified = { id: 1, name: 'Entry', isModified: true }
      const official = { id: 2, name: 'Entry', isOfficial: true }

      expect(isModifiedEntry(modified)).toBe(true)
      expect(isModifiedEntry(official)).toBe(false)
    })
  })

  describe('getModifiedEntries', () => {
    it('should extract all modified entries', () => {
      const mergedData = {
        talents: [
          { id: 1, name: 'Talent 1', isOfficial: true },
          { id: 2, name: 'Talent 2', isModified: true },
          { id: 3, name: 'Talent 3', isCustom: true }
        ],
        skills: [
          { id: 1, name: 'Skill 1', isModified: true }
        ]
      }

      const modified = getModifiedEntries(mergedData)

      expect(modified.talents).toHaveLength(1)
      expect(modified.talents[0].id).toBe(2)
      expect(modified.skills).toHaveLength(1)
      expect(modified.skills[0].id).toBe(1)
    })
  })

  describe('getCustomEntries', () => {
    it('should extract all custom entries', () => {
      const mergedData = {
        talents: [
          { id: 1, name: 'Talent 1', isOfficial: true },
          { id: 2, name: 'Talent 2', isModified: true },
          { id: 3, name: 'Talent 3', isCustom: true }
        ]
      }

      const custom = getCustomEntries(mergedData)

      expect(custom.talents).toHaveLength(1)
      expect(custom.talents[0].id).toBe(3)
    })
  })

  describe('getMergeStats', () => {
    it('should calculate merge statistics', () => {
      const mergedData = {
        talents: [
          { id: 1, name: 'Talent 1', isOfficial: true },
          { id: 2, name: 'Talent 2', isModified: true },
          { id: 3, name: 'Talent 3', isCustom: true }
        ],
        skills: [
          { id: 1, name: 'Skill 1', isOfficial: true },
          { id: 2, name: 'Skill 2', isCustom: true }
        ]
      }

      const stats = getMergeStats(mergedData)

      expect(stats.total).toBe(5)
      expect(stats.official).toBe(2)
      expect(stats.custom).toBe(2)
      expect(stats.modified).toBe(1)
      expect(stats.byEntityType.talents.total).toBe(3)
      expect(stats.byEntityType.skills.total).toBe(2)
    })
  })

  describe('detectConflicts', () => {
    it('should detect conflicts between official and custom data', () => {
      const official = {
        talents: [{ id: 1, name: 'Talent 1', description: 'Official' }]
      }

      const custom = {
        talents: [{ id: 1, name: 'Talent 1', description: 'Custom' }]
      }

      const conflicts = detectConflicts(official, custom)

      expect(conflicts).toHaveLength(1)
      expect(conflicts[0].entityType).toBe('talents')
      expect(conflicts[0].id).toBe(1)
      expect(conflicts[0].differences).toContain('description')
    })

    it('should not report conflicts for identical entries', () => {
      const official = {
        talents: [{ id: 1, name: 'Talent 1', description: 'Same' }]
      }

      const custom = {
        talents: [{ id: 1, name: 'Talent 1', description: 'Same' }]
      }

      const conflicts = detectConflicts(official, custom)

      expect(conflicts).toHaveLength(0)
    })

    it('should ignore internal fields in conflict detection', () => {
      const official = {
        talents: [{ id: 1, name: 'Talent 1', _internal: 'old' }]
      }

      const custom = {
        talents: [{ id: 1, name: 'Talent 1', _internal: 'new' }]
      }

      const conflicts = detectConflicts(official, custom)

      expect(conflicts).toHaveLength(0)
    })
  })

  describe('resolveConflict', () => {
    const conflict = {
      entityType: 'talents',
      id: 1,
      officialEntry: { id: 1, name: 'Official', value: 100 },
      customEntry: { id: 1, name: 'Custom', value: 200 },
      differences: ['name', 'value']
    }

    it('should resolve conflict by choosing official', () => {
      const resolved = resolveConflict(conflict, 'official')

      expect(resolved.name).toBe('Official')
      expect(resolved.value).toBe(100)
    })

    it('should resolve conflict by choosing custom', () => {
      const resolved = resolveConflict(conflict, 'custom')

      expect(resolved.name).toBe('Custom')
      expect(resolved.value).toBe(200)
    })

    it('should resolve conflict by merging with custom fields', () => {
      const resolved = resolveConflict(conflict, 'merge', { name: 'Merged' })

      expect(resolved.name).toBe('Merged')
      expect(resolved._conflictResolvedAt).toBeDefined()
    })

    it('should throw error for unknown resolution', () => {
      expect(() => resolveConflict(conflict, 'invalid')).toThrow()
    })
  })
})
