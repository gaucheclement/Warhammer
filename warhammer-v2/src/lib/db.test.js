/**
 * Tests for db.js - Schema migrations and basic database operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db, getAllFromTable, searchByName, getById, clearTable, bulkAdd, getDbStats } from './db.js'

describe('Database Schema', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    // Clean up after each test
    await db.close()
  })

  it('should create database with v2 schema', async () => {
    expect(db.verno).toBe(2)
  })

  it('should have all 24 tables defined', async () => {
    const expectedTables = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees', 'characters', 'settings'
    ]

    expectedTables.forEach(tableName => {
      expect(db[tableName]).toBeDefined()
      expect(db[tableName].name).toBe(tableName)
    })
  })

  it('should support compound index on careerLevels', async () => {
    const schema = db.table('careerLevels').schema
    const indexes = schema.indexes.map(idx => idx.name)

    expect(indexes).toContain('[career+careerLevel]')
  })

  it('should support multi-entry indexes on talents.specs', async () => {
    const schema = db.table('talents').schema
    const indexes = schema.indexes.map(idx => idx.name)

    expect(indexes).toContain('specs')
    // Check if it's a multi-entry index
    const specsIndex = schema.indexes.find(idx => idx.name === 'specs')
    expect(specsIndex.multi).toBe(true)
  })

  it('should support multi-entry indexes on skills.specs', async () => {
    const schema = db.table('skills').schema
    const indexes = schema.indexes.map(idx => idx.name)

    expect(indexes).toContain('specs')
    // Check if it's a multi-entry index
    const specsIndex = schema.indexes.find(idx => idx.name === 'specs')
    expect(specsIndex.multi).toBe(true)
  })
})

describe('Schema Migration (v1 to v2)', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    // Clean up after each test
    await db.close()
  })

  it('should have v2 enhanced fields in schema', async () => {
    // Test that v2 fields are available
    const careerSchema = db.table('careers').schema
    const careerIndexes = careerSchema.indexes.map(idx => idx.name)

    // V2 should include book, page, folder indexes
    expect(careerIndexes).toContain('book')
    expect(careerIndexes).toContain('page')
    expect(careerIndexes).toContain('folder')
  })

  it('should support all v2 enhanced entity fields', async () => {
    // Add test data with v2 fields
    const testTalent = {
      id: 'test-talent',
      label: 'Test Talent',
      max: '3',
      test: 'Intelligence',
      specs: ['Spec1', 'Spec2'],
      addSkill: 'test-skill',
      book: 'core',
      page: '123',
      desc: 'Test description',
      folder: 'test-folder'
    }

    await db.talents.add(testTalent)
    const retrieved = await db.talents.get('test-talent')

    expect(retrieved).toMatchObject(testTalent)
    expect(retrieved.specs).toEqual(['Spec1', 'Spec2'])
  })

  it('should handle spec-based queries with multi-entry index', async () => {
    // Add talents with different specs
    await db.talents.bulkAdd([
      { id: 't1', label: 'Talent 1', specs: ['Combat', 'Melee'], max: '1' },
      { id: 't2', label: 'Talent 2', specs: ['Magic', 'Arcane'], max: '1' },
      { id: 't3', label: 'Talent 3', specs: ['Combat', 'Ranged'], max: '1' }
    ])

    // Query by specific spec using multi-entry index
    const combatTalents = await db.talents.where('specs').equals('Combat').toArray()

    expect(combatTalents).toHaveLength(2)
    expect(combatTalents.map(t => t.id)).toContain('t1')
    expect(combatTalents.map(t => t.id)).toContain('t3')
  })

  it('should handle compound index queries on careerLevels', async () => {
    // Add career levels with compound key
    await db.careerLevels.bulkAdd([
      { id: 'cl1', label: 'Level 1', career: 'artisan', careerLevel: 1 },
      { id: 'cl2', label: 'Level 2', career: 'artisan', careerLevel: 2 },
      { id: 'cl3', label: 'Level 1', career: 'warrior', careerLevel: 1 }
    ])

    // Query using compound index
    const artisanLevel1 = await db.careerLevels
      .where('[career+careerLevel]')
      .equals(['artisan', 1])
      .toArray()

    expect(artisanLevel1).toHaveLength(1)
    expect(artisanLevel1[0].id).toBe('cl1')
  })
})

describe('Helper Functions', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getAllFromTable', () => {
    it('should return all records from a table', async () => {
      await db.skills.bulkAdd([
        { id: 's1', label: 'Skill 1' },
        { id: 's2', label: 'Skill 2' },
        { id: 's3', label: 'Skill 3' }
      ])

      const skills = await getAllFromTable('skills')
      expect(skills).toHaveLength(3)
    })

    it('should return empty array for empty table', async () => {
      const skills = await getAllFromTable('skills')
      expect(skills).toEqual([])
    })
  })

  describe('searchByName', () => {
    it('should find records by name (case insensitive)', async () => {
      await db.talents.bulkAdd([
        { id: 't1', label: 'Combat Master' },
        { id: 't2', label: 'Magic Sense' },
        { id: 't3', label: 'Combat Reflexes' }
      ])

      const results = await searchByName('talents', 'combat')
      expect(results).toHaveLength(2)
    })

    it('should return empty array if no matches', async () => {
      await db.talents.bulkAdd([
        { id: 't1', label: 'Combat Master' }
      ])

      const results = await searchByName('talents', 'magic')
      expect(results).toEqual([])
    })
  })

  describe('getById', () => {
    it('should retrieve record by ID', async () => {
      const testSkill = { id: 'athletisme', label: 'Athlétisme' }
      await db.skills.add(testSkill)

      const retrieved = await getById('skills', 'athletisme')
      expect(retrieved).toMatchObject(testSkill)
    })

    it('should return undefined for non-existent ID', async () => {
      const retrieved = await getById('skills', 'non-existent')
      expect(retrieved).toBeUndefined()
    })
  })

  describe('clearTable', () => {
    it('should clear all records from a table', async () => {
      await db.skills.bulkAdd([
        { id: 's1', label: 'Skill 1' },
        { id: 's2', label: 'Skill 2' }
      ])

      expect(await db.skills.count()).toBe(2)

      await clearTable('skills')

      expect(await db.skills.count()).toBe(0)
    })
  })

  describe('bulkAdd', () => {
    it('should add multiple records at once', async () => {
      const skills = [
        { id: 's1', label: 'Skill 1' },
        { id: 's2', label: 'Skill 2' },
        { id: 's3', label: 'Skill 3' }
      ]

      await bulkAdd('skills', skills)

      expect(await db.skills.count()).toBe(3)
    })

    it('should handle empty array', async () => {
      await bulkAdd('skills', [])
      expect(await db.skills.count()).toBe(0)
    })

    it('should handle null data', async () => {
      await bulkAdd('skills', null)
      expect(await db.skills.count()).toBe(0)
    })
  })

  describe('getDbStats', () => {
    it('should return counts for all tables', async () => {
      await db.skills.add({ id: 's1', label: 'Skill 1' })
      await db.talents.add({ id: 't1', label: 'Talent 1' })
      await db.careers.add({ id: 'c1', label: 'Career 1' })

      const stats = await getDbStats()

      expect(stats).toHaveProperty('skills', 1)
      expect(stats).toHaveProperty('talents', 1)
      expect(stats).toHaveProperty('careers', 1)
      expect(stats).toHaveProperty('books')
      expect(Object.keys(stats)).toHaveLength(24)
    })

    it('should return zero counts for empty database', async () => {
      const stats = await getDbStats()

      Object.values(stats).forEach(count => {
        expect(count).toBe(0)
      })
    })
  })
})

describe('Data Integrity', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  it('should preserve array fields', async () => {
    const talent = {
      id: 'test',
      label: 'Test',
      specs: ['Spec1', 'Spec2', 'Spec3']
    }

    await db.talents.add(talent)
    const retrieved = await db.talents.get('test')

    expect(Array.isArray(retrieved.specs)).toBe(true)
    expect(retrieved.specs).toEqual(['Spec1', 'Spec2', 'Spec3'])
  })

  it('should preserve object fields', async () => {
    const career = {
      id: 'test',
      label: 'Test',
      rand: { human: 10, dwarf: 5, elf: 3 }
    }

    await db.careers.add(career)
    const retrieved = await db.careers.get('test')

    expect(typeof retrieved.rand).toBe('object')
    expect(retrieved.rand).toEqual({ human: 10, dwarf: 5, elf: 3 })
  })

  it('should handle special characters in IDs', async () => {
    const skill = {
      id: 'art-métier',
      label: 'Art (Métier)'
    }

    await db.skills.add(skill)
    const retrieved = await db.skills.get('art-métier')

    expect(retrieved).toBeDefined()
    expect(retrieved.label).toBe('Art (Métier)')
  })

  it('should handle unicode characters in data', async () => {
    const talent = {
      id: 'test',
      label: 'Magie Mineure',
      desc: 'Capacité à lancer des sorts mineurs'
    }

    await db.talents.add(talent)
    const retrieved = await db.talents.get('test')

    expect(retrieved.label).toBe('Magie Mineure')
    expect(retrieved.desc).toBe('Capacité à lancer des sorts mineurs')
  })
})

describe('Indexing Performance', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  it('should efficiently query by indexed field', async () => {
    // Add many skills
    const skills = Array.from({ length: 100 }, (_, i) => ({
      id: `skill-${i}`,
      label: `Skill ${i}`,
      characteristic: i % 5 === 0 ? 'ag' : 'int'
    }))

    await db.skills.bulkAdd(skills)

    const start = Date.now()
    const agSkills = await db.skills.where('characteristic').equals('ag').toArray()
    const duration = Date.now() - start

    expect(agSkills.length).toBeGreaterThan(0)
    expect(duration).toBeLessThan(100) // Should be fast with index
  })

  it('should efficiently query by compound index', async () => {
    // Add many career levels
    const levels = Array.from({ length: 100 }, (_, i) => ({
      id: `cl-${i}`,
      label: `Level ${i}`,
      career: `career-${Math.floor(i / 4)}`,
      careerLevel: (i % 4) + 1
    }))

    await db.careerLevels.bulkAdd(levels)

    const start = Date.now()
    const results = await db.careerLevels
      .where('[career+careerLevel]')
      .equals(['career-5', 2])
      .toArray()
    const duration = Date.now() - start

    expect(results.length).toBeGreaterThan(0)
    expect(duration).toBeLessThan(100) // Should be fast with compound index
  })
})
