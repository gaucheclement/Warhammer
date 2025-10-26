/**
 * Unit Tests for CRUD Operations
 * Tests Create, Read, Update, Delete operations for data entities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { writable } from 'svelte/store'

// Create mock stores
const mockCustomModifications = writable({})
const mockCharacters = writable([])
const mockSaveCustomModifications = vi.fn()

// Mock the stores module
vi.mock('../stores/data.js', () => ({
  officialData: writable({}),
  customModifications: mockCustomModifications,
  characters: mockCharacters,
  saveCustomModifications: mockSaveCustomModifications
}))

// Mock the db module
vi.mock('./db.js', () => ({
  db: {
    characters: {
      add: vi.fn((char) => Promise.resolve(Date.now())),
      get: vi.fn((id) => Promise.resolve(null)),
      put: vi.fn((char) => Promise.resolve(char.id)),
      delete: vi.fn((id) => Promise.resolve())
    }
  }
}))

import {
  createEntry,
  bulkCreateEntries,
  getEntryById,
  getAllEntries,
  filterEntries,
  getEntriesByIds,
  updateEntry,
  bulkUpdateEntries,
  deleteEntry,
  bulkDeleteEntries,
  restoreEntry,
  revertEntry,
  duplicateEntry
} from './dataOperations.js'

describe('dataOperations', () => {
  const testMergedData = {
    talents: [
      { id: 1, name: 'Talent 1', description: 'Description 1', isOfficial: true },
      { id: 2, name: 'Talent 2', description: 'Description 2', isOfficial: true },
      { id: 3, name: 'Custom Talent', description: 'Custom', isCustom: true }
    ],
    skills: [
      { id: 1, name: 'Skill 1', description: 'Description 1', isOfficial: true }
    ]
  }

  describe('Read Operations', () => {
    describe('getEntryById', () => {
      it('should find entry by ID', () => {
        const entry = getEntryById('talents', 1, testMergedData)

        expect(entry).toBeDefined()
        expect(entry.id).toBe(1)
        expect(entry.name).toBe('Talent 1')
      })

      it('should return null if entry not found', () => {
        const entry = getEntryById('talents', 999, testMergedData)

        expect(entry).toBeNull()
      })

      it('should return null if entity type not found', () => {
        const entry = getEntryById('unknown', 1, testMergedData)

        expect(entry).toBeNull()
      })
    })

    describe('getAllEntries', () => {
      it('should return all entries of a type', () => {
        const entries = getAllEntries('talents', testMergedData)

        expect(entries).toHaveLength(3)
        expect(entries.every(e => testMergedData.talents.includes(e))).toBe(true)
      })

      it('should return empty array for unknown entity type', () => {
        const entries = getAllEntries('unknown', testMergedData)

        expect(entries).toEqual([])
      })
    })

    describe('filterEntries', () => {
      it('should filter entries by predicate', () => {
        const filtered = filterEntries(
          'talents',
          testMergedData,
          (entry) => entry.isCustom === true
        )

        expect(filtered).toHaveLength(1)
        expect(filtered[0].id).toBe(3)
      })

      it('should return empty array if no matches', () => {
        const filtered = filterEntries(
          'talents',
          testMergedData,
          (entry) => entry.id === 999
        )

        expect(filtered).toEqual([])
      })
    })

    describe('getEntriesByIds', () => {
      it('should return entries matching the IDs', () => {
        const entries = getEntriesByIds('talents', [1, 3], testMergedData)

        expect(entries).toHaveLength(2)
        expect(entries.map(e => e.id)).toContain(1)
        expect(entries.map(e => e.id)).toContain(3)
      })

      it('should return empty array if no IDs match', () => {
        const entries = getEntriesByIds('talents', [999, 998], testMergedData)

        expect(entries).toEqual([])
      })
    })
  })

  beforeEach(() => {
    // Reset stores before each test
    mockCustomModifications.set({})
    mockCharacters.set([])
    vi.clearAllMocks()
  })

  describe('Create Operations', () => {

    describe('createEntry', () => {
      it('should create a new custom entry', () => {
        const data = {
          name: 'New Talent',
          description: 'A new custom talent',
          maxRank: 3
        }

        const result = createEntry('talents', data)

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(result.data.id).toBeDefined()
        expect(result.data.name).toBe('New Talent')
        expect(result.data.isCustom).toBe(true)
      })

      it('should reject invalid entries', () => {
        const data = {
          description: 'Missing name field'
        }

        const result = createEntry('talents', data)

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    describe('bulkCreateEntries', () => {
      it('should create multiple entries', () => {
        const entries = [
          { name: 'Talent 1', description: 'Test 1' },
          { name: 'Talent 2', description: 'Test 2' }
        ]

        const result = bulkCreateEntries('talents', entries)

        expect(result.success).toBe(true)
        expect(result.data.created).toBe(2)
        expect(result.data.errors).toHaveLength(0)
      })

      it('should collect errors for invalid entries', () => {
        const entries = [
          { name: 'Valid Talent', description: 'Test' },
          { description: 'Missing name' }
        ]

        const result = bulkCreateEntries('talents', entries)

        expect(result.success).toBe(false)
        expect(result.data.created).toBe(1)
        expect(result.data.errors).toHaveLength(1)
      })

      it('should reject non-array input', () => {
        const result = bulkCreateEntries('talents', { not: 'an array' })

        expect(result.success).toBe(false)
        expect(result.error).toContain('array')
      })
    })
  })

  describe('Update Operations', () => {
    describe('updateEntry', () => {
      it('should update an existing entry', () => {
        const updates = {
          name: 'Updated Talent',
          description: 'Updated description'
        }

        const result = updateEntry('talents', 1, updates, testMergedData)

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(result.data.name).toBe('Updated Talent')
      })

      it('should reject updates for non-existent entry', () => {
        const updates = { name: 'Updated' }
        const result = updateEntry('talents', 999, updates, testMergedData)

        expect(result.success).toBe(false)
        expect(result.error).toContain('not found')
      })

      it('should reject invalid updates', () => {
        const updates = {
          name: 123 // Invalid type
        }

        const result = updateEntry('talents', 1, updates, testMergedData)

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    describe('bulkUpdateEntries', () => {
      it('should update multiple entries', () => {
        const updates = [
          { id: 1, updates: { name: 'Updated 1' } },
          { id: 2, updates: { name: 'Updated 2' } }
        ]

        const result = bulkUpdateEntries('talents', updates, testMergedData)

        expect(result.success).toBe(true)
        expect(result.data.updated).toBe(2)
        expect(result.data.errors).toHaveLength(0)
      })

      it('should collect errors for invalid updates', () => {
        const updates = [
          { id: 1, updates: { name: 'Valid' } },
          { id: 999, updates: { name: 'Invalid ID' } }
        ]

        const result = bulkUpdateEntries('talents', updates, testMergedData)

        expect(result.success).toBe(false)
        expect(result.data.updated).toBe(1)
        expect(result.data.errors).toHaveLength(1)
      })
    })
  })

  describe('Delete Operations', () => {
    describe('deleteEntry', () => {
      it('should soft delete official entries', () => {
        const result = deleteEntry('talents', 1, testMergedData)

        expect(result.success).toBe(true)
        expect(result.data.deleted).toBe(true)
      })

      it('should hard delete custom entries', () => {
        const result = deleteEntry('talents', 3, testMergedData)

        expect(result.success).toBe(true)
        expect(result.data.deleted).toBe(true)
      })

      it('should reject deletion of non-existent entry', () => {
        const result = deleteEntry('talents', 999, testMergedData)

        expect(result.success).toBe(false)
        expect(result.error).toContain('not found')
      })
    })

    describe('bulkDeleteEntries', () => {
      it('should delete multiple entries', () => {
        const result = bulkDeleteEntries('talents', [1, 2], testMergedData)

        expect(result.success).toBe(true)
        expect(result.data.deleted).toBe(2)
        expect(result.data.errors).toHaveLength(0)
      })

      it('should collect errors for invalid IDs', () => {
        const result = bulkDeleteEntries('talents', [1, 999], testMergedData)

        expect(result.success).toBe(false)
        expect(result.data.deleted).toBe(1)
        expect(result.data.errors).toHaveLength(1)
      })
    })
  })

  describe('Special Operations', () => {
    describe('duplicateEntry', () => {
      it('should create a duplicate of an entry', () => {
        const result = duplicateEntry('talents', 1, testMergedData)

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(result.data.id).not.toBe(1)
        expect(result.data.name).toContain('Copy')
      })

      it('should apply modifications to duplicate', () => {
        const modifications = { name: 'Custom Name' }
        const result = duplicateEntry('talents', 1, testMergedData, modifications)

        expect(result.success).toBe(true)
        expect(result.data.name).toBe('Custom Name')
      })

      it('should reject duplication of non-existent entry', () => {
        const result = duplicateEntry('talents', 999, testMergedData)

        expect(result.success).toBe(false)
        expect(result.error).toContain('not found')
      })
    })
  })
})
