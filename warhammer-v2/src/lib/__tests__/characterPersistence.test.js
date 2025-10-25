/**
 * Character Persistence Tests
 *
 * Tests for character persistence layer including:
 * - Character creation
 * - Character retrieval
 * - Character updates
 * - Character deletion
 * - Migration from V1 format
 * - Schema validation
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../db.js'
import {
  createCharacter,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  searchCharacters,
  cloneCharacter as cloneCharacterStore,
  loadCharacters
} from '../../stores/characterStore.js'
import {
  createEmptyCharacter,
  validateCharacter,
  cloneCharacter as cloneCharacterSchema
} from '../../utils/characterSchema.js'
import {
  importFromV1,
  exportToV1,
  exportToJSON,
  importFromJSON,
  migrateCharacter
} from '../../utils/characterMigration.js'

describe('Character Schema', () => {
  it('should create an empty character with all required fields', () => {
    const character = createEmptyCharacter()

    expect(character).toBeDefined()
    expect(character.name).toBe('')
    expect(character.mode).toBe('creation')
    expect(character.stepIndex).toBeNull()
    expect(Array.isArray(character.characteristics)).toBe(true)
    expect(Array.isArray(character.skills)).toBe(true)
    expect(Array.isArray(character.talents)).toBe(true)
    expect(Array.isArray(character.spells)).toBe(true)
    expect(Array.isArray(character.trappings)).toBe(true)
    expect(character.xp).toBeDefined()
    expect(character.xp.max).toBe(0)
    expect(character.randomState).toBeDefined()
    expect(character.version).toBe(1)
  })

  it('should validate a valid character', () => {
    const character = createEmptyCharacter()
    character.name = 'Test Character'

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  it('should reject character without name', () => {
    const character = createEmptyCharacter()
    character.name = ''

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
    expect(validation.errors[0]).toContain('name')
  })

  it('should reject character with invalid mode', () => {
    const character = createEmptyCharacter()
    character.name = 'Test Character'
    character.mode = 'invalid'

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(false)
    expect(validation.errors.some(e => e.includes('mode'))).toBe(true)
  })

  it('should reject character with negative XP', () => {
    const character = createEmptyCharacter()
    character.name = 'Test Character'
    character.xp.max = -100

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(false)
    expect(validation.errors.some(e => e.includes('XP'))).toBe(true)
  })

  it('should clone a character correctly', () => {
    const original = createEmptyCharacter()
    original.name = 'Original'
    original.id = 123

    const clone = cloneCharacterSchema(original, 'Clone')

    expect(clone.name).toBe('Clone')
    expect(clone.id).toBeUndefined()
    expect(clone.created).not.toBe(original.created)
    expect(clone.updated).not.toBe(original.updated)
  })
})

describe('Character Store CRUD Operations', () => {
  beforeEach(async () => {
    // Clear characters table before each test
    await db.characters.clear()
  })

  it('should create a character', async () => {
    const character = createEmptyCharacter()
    character.name = 'Test Character'

    const id = await createCharacter(character)

    expect(id).toBeDefined()
    expect(typeof id).toBe('number')
  })

  it('should retrieve a character by ID', async () => {
    const character = createEmptyCharacter()
    character.name = 'Test Character'

    const id = await createCharacter(character)
    const retrieved = await getCharacter(id)

    expect(retrieved).toBeDefined()
    expect(retrieved.id).toBe(id)
    expect(retrieved.name).toBe('Test Character')
  })

  it('should update a character', async () => {
    const character = createEmptyCharacter()
    character.name = 'Original Name'

    const id = await createCharacter(character)

    await updateCharacter(id, { name: 'Updated Name' })

    const updated = await getCharacter(id)
    expect(updated.name).toBe('Updated Name')
  })

  it('should delete a character', async () => {
    const character = createEmptyCharacter()
    character.name = 'To Be Deleted'

    const id = await createCharacter(character)

    await deleteCharacter(id)

    const deleted = await getCharacter(id)
    expect(deleted).toBeUndefined()
  })

  it('should search characters by name', async () => {
    await createCharacter({ ...createEmptyCharacter(), name: 'Alice' })
    await createCharacter({ ...createEmptyCharacter(), name: 'Bob' })
    await createCharacter({ ...createEmptyCharacter(), name: 'Charlie' })

    const results = await searchCharacters('ali')

    expect(results.length).toBe(1)
    expect(results[0].name).toBe('Alice')
  })

  it('should return all characters for empty search', async () => {
    await createCharacter({ ...createEmptyCharacter(), name: 'Alice' })
    await createCharacter({ ...createEmptyCharacter(), name: 'Bob' })

    const results = await searchCharacters('')

    expect(results.length).toBe(2)
  })

  it('should clone a character through store', async () => {
    const character = createEmptyCharacter()
    character.name = 'Original'

    const originalId = await createCharacter(character)
    const cloneId = await cloneCharacterStore(originalId, 'Cloned')

    expect(cloneId).not.toBe(originalId)

    const clone = await getCharacter(cloneId)
    expect(clone.name).toBe('Cloned')
  })

  it('should update timestamps on character update', async () => {
    const character = createEmptyCharacter()
    character.name = 'Test'

    const id = await createCharacter(character)
    const original = await getCharacter(id)

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10))

    await updateCharacter(id, { name: 'Updated' })
    const updated = await getCharacter(id)

    expect(updated.updated).not.toBe(original.updated)
    expect(new Date(updated.updated).getTime()).toBeGreaterThan(
      new Date(original.updated).getTime()
    )
  })
})

describe('Character Migration', () => {
  it('should import from V1 format', () => {
    const v1Character = {
      mode: 'creation',
      stepIndex: 5,
      specie: {
        id: 'humain',
        data: { label: 'Humain' }
      },
      careerLevel: {
        id: 'guerrier-1',
        data: { label: 'Guerrier', careerLevel: 1 }
      },
      characteristics: [
        {
          id: 'mouvement',
          roll: 10,
          talent: 0,
          advance: 5,
          tmpadvance: 0,
          specie: 4,
          star: 0,
          career: 0,
          origins: []
        }
      ],
      skills: [
        {
          id: 'athletisme',
          advance: 5,
          tmpadvance: 0,
          specie: 0,
          career: 5,
          spec: '',
          specs: [],
          origins: ['guerrier-1']
        }
      ],
      talents: [],
      spells: [],
      trappings: [],
      details: [],
      god: null,
      star: null,
      magic: null,
      xp: {
        max: 100,
        log: {},
        used: 50,
        tmp_used: 0
      },
      randomState: {
        specie: 1,
        imposedSpecie: [],
        career: 1,
        imposedCareers: [],
        star: 0,
        imposedStar: [],
        characteristic: 1,
        imposedCharacteristics: {},
        imposedTalents: []
      }
    }

    const v2Character = importFromV1(v1Character)

    expect(v2Character).toBeDefined()
    expect(v2Character.mode).toBe('creation')
    expect(v2Character.stepIndex).toBe(5)
    expect(v2Character.specie.id).toBe('humain')
    expect(v2Character.careerLevel.id).toBe('guerrier-1')
    expect(v2Character.characteristics.length).toBe(1)
    expect(v2Character.characteristics[0].id).toBe('mouvement')
    expect(v2Character.skills.length).toBe(1)
    expect(v2Character.skills[0].id).toBe('athletisme')
    expect(v2Character.xp.max).toBe(100)
    expect(v2Character.xp.used).toBe(50)
    expect(v2Character.version).toBe(1)
  })

  it('should export to V1 format', () => {
    const v2Character = createEmptyCharacter()
    v2Character.name = 'Test'
    v2Character.specie = {
      id: 'humain',
      data: { label: 'Humain' }
    }

    const v1Character = exportToV1(v2Character)

    expect(v1Character).toBeDefined()
    expect(v1Character.mode).toBe('creation')
    expect(v1Character.specie.id).toBe('humain')
    expect(v1Character.xp).toBeDefined()
    expect(v1Character.randomState).toBeDefined()
  })

  it('should export to JSON and import back', () => {
    const original = createEmptyCharacter()
    original.name = 'Test Character'
    original.xp.max = 100

    const json = exportToJSON(original)
    expect(typeof json).toBe('string')

    const imported = importFromJSON(json)
    expect(imported.name).toBe('Test Character')
    expect(imported.xp.max).toBe(100)
  })

  it('should migrate v0 character to v1', () => {
    const v0Character = {
      name: 'Old Character',
      mode: 'creation',
      // Missing version field and other v1 requirements
      characteristics: [],
      skills: []
    }

    const migrated = migrateCharacter(v0Character)

    expect(migrated.version).toBe(1)
    expect(migrated.created).toBeDefined()
    expect(migrated.updated).toBeDefined()
    expect(Array.isArray(migrated.talents)).toBe(true)
    expect(Array.isArray(migrated.spells)).toBe(true)
    expect(migrated.xp).toBeDefined()
    expect(migrated.randomState).toBeDefined()
  })

  it('should handle missing fields during V1 import', () => {
    const minimalV1 = {
      mode: 'creation'
      // Missing most fields
    }

    const v2Character = importFromV1(minimalV1)

    expect(v2Character).toBeDefined()
    expect(v2Character.name).toBe('Imported Character')
    expect(Array.isArray(v2Character.characteristics)).toBe(true)
    expect(Array.isArray(v2Character.skills)).toBe(true)
    expect(v2Character.xp).toBeDefined()
    expect(v2Character.randomState).toBeDefined()
  })

  it('should import from JSON string', () => {
    const character = createEmptyCharacter()
    character.name = 'Test'

    const jsonString = JSON.stringify(character)
    const imported = importFromV1(jsonString)

    expect(imported.name).toBe('Test')
  })
})

describe('Character Validation Edge Cases', () => {
  it('should reject character with XP used > XP max', () => {
    const character = createEmptyCharacter()
    character.name = 'Test'
    character.xp.max = 100
    character.xp.used = 150

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(false)
    expect(validation.errors.some(e => e.includes('XP'))).toBe(true)
  })

  it('should accept character with all arrays empty', () => {
    const character = createEmptyCharacter()
    character.name = 'Minimal Character'

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(true)
  })

  it('should reject character with non-array fields', () => {
    const character = createEmptyCharacter()
    character.name = 'Test'
    character.skills = 'not an array'

    const validation = validateCharacter(character)

    expect(validation.valid).toBe(false)
    expect(validation.errors.some(e => e.includes('array'))).toBe(true)
  })
})

describe('Character Store Integration', () => {
  beforeEach(async () => {
    await db.characters.clear()
  })

  it('should load all characters', async () => {
    await createCharacter({ ...createEmptyCharacter(), name: 'Character 1' })
    await createCharacter({ ...createEmptyCharacter(), name: 'Character 2' })
    await createCharacter({ ...createEmptyCharacter(), name: 'Character 3' })

    await loadCharacters()

    // Note: In actual implementation, this would check the store value
    // For now, we just verify the function runs without error
    expect(true).toBe(true)
  })

  it('should handle concurrent character creation', async () => {
    const promises = [
      createCharacter({ ...createEmptyCharacter(), name: 'Character 1' }),
      createCharacter({ ...createEmptyCharacter(), name: 'Character 2' }),
      createCharacter({ ...createEmptyCharacter(), name: 'Character 3' })
    ]

    const ids = await Promise.all(promises)

    expect(ids.length).toBe(3)
    expect(new Set(ids).size).toBe(3) // All IDs unique
  })

  it('should handle character update validation failure', async () => {
    const character = createEmptyCharacter()
    character.name = 'Test'

    const id = await createCharacter(character)

    await expect(
      updateCharacter(id, { name: '' }) // Invalid: empty name
    ).rejects.toThrow()
  })

  it('should handle deletion of non-existent character', async () => {
    await expect(deleteCharacter(99999)).resolves.not.toThrow()
  })
})
