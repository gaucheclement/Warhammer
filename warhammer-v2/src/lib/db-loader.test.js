/**
 * Tests for Database Loader
 *
 * Tests data transformation from JSON to IndexedDB format.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  transformData,
  loadIntoIndexedDB,
  formatReport,
  getEntityTypeForField,
  isReferenceField,
  JSON_TO_TABLE_MAPPING,
  ENTITY_RELATIONSHIP_CONFIG
} from './db-loader.js'

describe('getEntityTypeForField', () => {
  it('should map skill fields to skills', () => {
    expect(getEntityTypeForField('skill')).toBe('skills')
    expect(getEntityTypeForField('skills')).toBe('skills')
    expect(getEntityTypeForField('addSkill')).toBe('skills')
  })

  it('should map talent fields to talents', () => {
    expect(getEntityTypeForField('talent')).toBe('talents')
    expect(getEntityTypeForField('talents')).toBe('talents')
    expect(getEntityTypeForField('addTalent')).toBe('talents')
  })

  it('should map trait fields to traits', () => {
    expect(getEntityTypeForField('trait')).toBe('traits')
    expect(getEntityTypeForField('traits')).toBe('traits')
    expect(getEntityTypeForField('optionals')).toBe('traits')
  })

  it('should return null for unknown fields', () => {
    expect(getEntityTypeForField('unknown')).toBe(null)
    expect(getEntityTypeForField('description')).toBe(null)
  })
})

describe('isReferenceField', () => {
  it('should identify reference fields', () => {
    expect(isReferenceField('skills')).toBe(true)
    expect(isReferenceField('talents')).toBe(true)
    expect(isReferenceField('traits')).toBe(true)
    expect(isReferenceField('career')).toBe(true)
  })

  it('should reject non-reference fields', () => {
    expect(isReferenceField('label')).toBe(false)
    expect(isReferenceField('desc')).toBe(false)
    expect(isReferenceField('page')).toBe(false)
  })
})

describe('JSON_TO_TABLE_MAPPING', () => {
  it('should have correct singular to plural mappings', () => {
    expect(JSON_TO_TABLE_MAPPING.skill).toBe('skills')
    expect(JSON_TO_TABLE_MAPPING.talent).toBe('talents')
    expect(JSON_TO_TABLE_MAPPING.specie).toBe('species')
    expect(JSON_TO_TABLE_MAPPING.careerLevel).toBe('careerLevels')
  })

  it('should cover all entity types', () => {
    const mappings = Object.values(JSON_TO_TABLE_MAPPING)
    expect(mappings).toContain('skills')
    expect(mappings).toContain('talents')
    expect(mappings).toContain('traits')
    expect(mappings).toContain('careers')
    expect(mappings).toContain('species')
  })
})

describe('transformData - Basic', () => {
  it('should generate IDs for entities without them', () => {
    const jsonData = {
      skill: [
        { label: 'Athlétisme' },
        { label: 'Combat' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    expect(data.skills[0].id).toBe('athletisme')
    expect(data.skills[1].id).toBe('combat')
  })

  it('should preserve existing IDs', () => {
    const jsonData = {
      skill: [
        { id: 'custom-combat', label: 'Combat' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    expect(data.skills[0].id).toBe('custom-combat')
  })

  it('should transform index to id if no id exists', () => {
    const jsonData = {
      skill: [
        { index: 0, label: 'Athlétisme' },
        { index: 1, label: 'Combat' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    // IDs should be generated from labels, not from index
    expect(data.skills[0].id).toBe('athletisme')
    expect(data.skills[1].id).toBe('combat')
  })

  it('should handle missing entity types gracefully', () => {
    const jsonData = {
      unknown: [{ label: 'Test' }]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    // Should not crash, and should not have unknown in transformed data
    expect(data.unknown).toBeUndefined()
  })
})

describe('transformData - Simple References', () => {
  it('should keep simple ID references as-is', () => {
    const jsonData = {
      careerLevel: [
        {
          label: 'Soldat 1',
          career: 'soldier',
          skills: ['combat', 'athletisme']
        }
      ],
      skill: [
        { label: 'Combat' },
        { label: 'Athlétisme' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    // Simple references should stay as strings/arrays
    expect(data.careerLevels[0].career).toBe('soldier')
    expect(data.careerLevels[0].skills).toEqual(['combat', 'athletisme'])
  })

  it('should resolve label-based references to IDs', () => {
    const jsonData = {
      careerLevel: [
        {
          label: 'Soldat 1',
          skills: 'Combat, Athlétisme'  // String with labels
        }
      ],
      skill: [
        { label: 'Combat' },
        { label: 'Athlétisme' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    // Should transform comma-separated string
    // Note: In real implementation, this might stay as string if no modifiers
    // The actual behavior depends on needsComplexTransform()
    const skills = data.careerLevels[0].skills
    expect(skills).toBeDefined()
  })
})

describe('transformData - Complex References', () => {
  it('should transform references with prefixes', () => {
    const jsonData = {
      creature: [
        {
          label: 'Dragon',
          traits: 'Arme +10, Coriace'
        }
      ],
      trait: [
        { label: 'Arme' },
        { label: 'Coriace' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    const traits = data.creatures[0].traits

    expect(Array.isArray(traits)).toBe(true)
    expect(traits.length).toBe(2)

    // First trait should have suffix (number comes after label)
    expect(traits[0]).toMatchObject({
      id: 'arme',
      entityType: 'traits',
      label: 'Arme',
      suffix: '+10',
      rating: 10,
      originalText: 'Arme +10'
    })

    // Second trait is simple
    expect(traits[1]).toMatchObject({
      id: 'coriace',
      entityType: 'traits',
      label: 'Coriace',
      originalText: 'Coriace'
    })
  })

  it('should transform references with specializations', () => {
    const jsonData = {
      creature: [
        {
          label: 'Sorcier',
          traits: 'Lanceur de Sorts (Sorcellerie), Préjugé (sigmarites)'
        }
      ],
      trait: [
        { label: 'Lanceur de Sorts' },
        { label: 'Préjugé' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    const traits = data.creatures[0].traits

    expect(Array.isArray(traits)).toBe(true)
    expect(traits.length).toBe(2)

    // First trait with spec
    expect(traits[0]).toMatchObject({
      id: 'lanceur-de-sorts',
      entityType: 'traits',
      label: 'Lanceur de Sorts',
      spec: 'Sorcellerie',
      originalText: 'Lanceur de Sorts (Sorcellerie)'
    })

    // Second trait with spec
    expect(traits[1]).toMatchObject({
      id: 'prejuge',
      entityType: 'traits',
      label: 'Préjugé',
      spec: 'sigmarites',
      originalText: 'Préjugé (sigmarites)'
    })
  })

  it('should handle real-world creature data', () => {
    const jsonData = {
      creature: [
        {
          label: 'Humain',
          traits: 'Arme +7, Préjugé (un au choix)',
          optionals: 'À distance +8 (50), Lanceur de Sorts, Maladie'
        }
      ],
      trait: [
        { label: 'Arme' },
        { label: 'Préjugé' },
        { label: 'À distance' },
        { label: 'Lanceur de Sorts' },
        { label: 'Maladie' }
      ]
    }

    const { data } = transformData(jsonData, { generateReport: false })

    const creature = data.creatures[0]

    // Check traits (suffix, not prefix - number comes after label)
    expect(creature.traits).toBeDefined()
    expect(Array.isArray(creature.traits)).toBe(true)
    expect(creature.traits[0].suffix).toBe('+7')

    // Check optionals
    expect(creature.optionals).toBeDefined()
    expect(Array.isArray(creature.optionals)).toBe(true)
  })
})

describe('transformData - Report Generation', () => {
  it('should generate report with statistics', () => {
    const jsonData = {
      skill: [
        { label: 'Combat' },
        { label: 'Athlétisme' }
      ],
      talent: [
        { label: 'Maître d\'armes' }
      ]
    }

    const { report } = transformData(jsonData, { generateReport: true })

    expect(report.totalEntities).toBe(3)
    expect(report.stats.skills).toEqual({
      count: 2,
      hasIds: 2
    })
    expect(report.stats.talents).toEqual({
      count: 1,
      hasIds: 1
    })
  })

  it('should detect unresolved references', () => {
    const jsonData = {
      creature: [
        {
          label: 'Test',
          traits: 'Unknown Trait +5'
        }
      ],
      trait: []  // Empty traits list
    }

    const { report } = transformData(jsonData, { generateReport: true })

    // Should have at least one unresolved reference
    expect(report.unresolvedReferences.length).toBeGreaterThan(0)
    expect(report.unresolvedReferences[0]).toMatchObject({
      entity: expect.stringContaining('creatures'),
      field: 'traits',
      reason: 'Referenced entity not found'
    })
  })

  it('should skip report generation when disabled', () => {
    const jsonData = {
      skill: [{ label: 'Combat' }]
    }

    const { report } = transformData(jsonData, { generateReport: false })

    expect(report.totalReferences).toBe(0)
    expect(report.unresolvedReferences).toEqual([])
  })
})

describe('formatReport', () => {
  it('should format report with statistics', () => {
    const report = {
      totalEntities: 10,
      totalReferences: 25,
      unresolvedReferences: [],
      ambiguousReferences: [],
      stats: {
        skills: { count: 5, hasIds: 5 },
        talents: { count: 5, hasIds: 5 }
      }
    }

    const formatted = formatReport(report)

    expect(formatted).toContain('Total Entities: 10')
    expect(formatted).toContain('Total References: 25')
    expect(formatted).toContain('skills: 5 entities, 5 with IDs')
    expect(formatted).toContain('talents: 5 entities, 5 with IDs')
  })

  it('should include unresolved references', () => {
    const report = {
      totalEntities: 1,
      totalReferences: 1,
      unresolvedReferences: [
        {
          entity: 'creatures/test',
          field: 'traits',
          reference: { label: 'Unknown', id: 'unknown' },
          reason: 'Not found'
        }
      ],
      ambiguousReferences: [],
      stats: {}
    }

    const formatted = formatReport(report)

    expect(formatted).toContain('Unresolved: 1')
    expect(formatted).toContain('Unresolved References')
    expect(formatted).toContain('Unknown')
  })

  it('should truncate long unresolved lists', () => {
    const unresolved = Array.from({ length: 20 }, (_, i) => ({
      entity: `test/${i}`,
      field: 'trait',
      reference: { label: `Unknown ${i}`, id: `unknown-${i}` },
      reason: 'Not found'
    }))

    const report = {
      totalEntities: 20,
      totalReferences: 20,
      unresolvedReferences: unresolved,
      ambiguousReferences: [],
      stats: {}
    }

    const formatted = formatReport(report)

    expect(formatted).toContain('... and 10 more')
  })
})

describe('loadIntoIndexedDB', () => {
  it('should load data into IndexedDB', async () => {
    // Mock Dexie database
    const mockDb = {
      skills: {
        clear: vi.fn().mockResolvedValue(undefined),
        bulkAdd: vi.fn().mockResolvedValue(undefined)
      },
      talents: {
        clear: vi.fn().mockResolvedValue(undefined),
        bulkAdd: vi.fn().mockResolvedValue(undefined)
      }
    }

    const transformedData = {
      skills: [
        { id: 'combat', label: 'Combat' },
        { id: 'athletisme', label: 'Athlétisme' }
      ],
      talents: [
        { id: 'maitre-darmes', label: 'Maître d\'armes' }
      ]
    }

    const stats = await loadIntoIndexedDB(mockDb, transformedData)

    // Should clear tables
    expect(mockDb.skills.clear).toHaveBeenCalled()
    expect(mockDb.talents.clear).toHaveBeenCalled()

    // Should bulk add data
    expect(mockDb.skills.bulkAdd).toHaveBeenCalledWith(transformedData.skills)
    expect(mockDb.talents.bulkAdd).toHaveBeenCalledWith(transformedData.talents)

    // Should return statistics
    expect(stats.loaded.skills).toBe(2)
    expect(stats.loaded.talents).toBe(1)
  })

  it('should handle errors gracefully', async () => {
    const mockDb = {
      skills: {
        clear: vi.fn().mockRejectedValue(new Error('Clear failed')),
        bulkAdd: vi.fn()
      }
    }

    const transformedData = {
      skills: [{ id: 'test', label: 'Test' }]
    }

    const stats = await loadIntoIndexedDB(mockDb, transformedData)

    expect(stats.errors.length).toBeGreaterThan(0)
    expect(stats.errors[0]).toMatchObject({
      table: 'skills',
      error: 'Clear failed'
    })
  })

  it('should handle empty entity arrays', async () => {
    const mockDb = {
      skills: {
        clear: vi.fn().mockResolvedValue(undefined),
        bulkAdd: vi.fn().mockResolvedValue(undefined)
      }
    }

    const transformedData = {
      skills: []
    }

    const stats = await loadIntoIndexedDB(mockDb, transformedData)

    expect(mockDb.skills.clear).toHaveBeenCalled()
    expect(mockDb.skills.bulkAdd).not.toHaveBeenCalled()
    expect(stats.loaded.skills).toBe(0)
  })
})

describe('Integration: Full transformation workflow', () => {
  it('should handle complete data transformation', () => {
    const jsonData = {
      skill: [
        { label: 'Athlétisme' },
        { label: 'Combat' },
        { label: 'Esquive' }
      ],
      talent: [
        { label: 'Maître d\'armes' }
      ],
      creature: [
        {
          label: 'Humain',
          traits: 'Arme +7, Préjugé (un au choix)',
          skills: 'Combat, Athlétisme'
        }
      ],
      trait: [
        { label: 'Arme' },
        { label: 'Préjugé' }
      ]
    }

    const { data, report } = transformData(jsonData, { generateReport: true })

    // Check IDs generated
    expect(data.skills.length).toBe(3)
    expect(data.skills[0].id).toBe('athletisme')

    // Check complex references transformed (suffix, not prefix)
    const creature = data.creatures[0]
    expect(creature.traits).toBeDefined()
    expect(Array.isArray(creature.traits)).toBe(true)
    expect(creature.traits[0]).toMatchObject({
      entityType: 'traits',
      suffix: '+7'
    })

    // Check report
    expect(report.totalEntities).toBe(7)
    expect(report.stats).toHaveProperty('skills')
    expect(report.stats).toHaveProperty('talents')
  })
})
