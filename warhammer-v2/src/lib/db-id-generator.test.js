/**
 * Tests for Database ID Generator
 *
 * Tests stable ID generation, collision handling, and label-to-ID resolution.
 */

import { describe, it, expect } from 'vitest'
import {
  normalizeLabel,
  generateStableId,
  generateIdsForEntities,
  createLabelToIdMap,
  resolveLabelToId,
  batchResolveLabelToId
} from './db-id-generator.js'

describe('normalizeLabel', () => {
  it('should convert to lowercase', () => {
    expect(normalizeLabel('Combat')).toBe('combat')
    expect(normalizeLabel('ATHLÉTISME')).toBe('athletisme')
  })

  it('should remove accents', () => {
    expect(normalizeLabel('Athlétisme')).toBe('athletisme')
    expect(normalizeLabel('Épée')).toBe('epee')
    expect(normalizeLabel('Sorcellerie')).toBe('sorcellerie')
    expect(normalizeLabel('Préjugé')).toBe('prejuge')
  })

  it('should replace spaces with hyphens', () => {
    expect(normalizeLabel('Lanceur de Sorts')).toBe('lanceur-de-sorts')
    expect(normalizeLabel('Magie Mineure')).toBe('magie-mineure')
  })

  it('should replace special characters with hyphens', () => {
    expect(normalizeLabel("L'Épée d'Argent")).toBe('l-epee-d-argent')
    expect(normalizeLabel('Combat (Épée)')).toBe('combat-epee')
    expect(normalizeLabel('Arme +5')).toBe('arme-5')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(normalizeLabel('-Combat-')).toBe('combat')
    expect(normalizeLabel('---Test---')).toBe('test')
  })

  it('should collapse multiple hyphens', () => {
    expect(normalizeLabel('Test   Multiple   Spaces')).toBe('test-multiple-spaces')
    expect(normalizeLabel('A--B---C')).toBe('a-b-c')
  })

  it('should handle empty or invalid input', () => {
    expect(normalizeLabel('')).toBe('')
    expect(normalizeLabel(null)).toBe('')
    expect(normalizeLabel(undefined)).toBe('')
  })

  it('should handle numbers', () => {
    expect(normalizeLabel('Level 1')).toBe('level-1')
    expect(normalizeLabel('2d10')).toBe('2d10')
  })

  it('should handle complex real-world examples', () => {
    expect(normalizeLabel('Lanceur de Sorts (Sorcellerie)')).toBe('lanceur-de-sorts-sorcellerie')
    expect(normalizeLabel('Préjugé (sigmarites)')).toBe('prejuge-sigmarites')
    expect(normalizeLabel('À distance +8')).toBe('a-distance-8')
  })
})

describe('generateStableId', () => {
  it('should generate ID from label when no collision', () => {
    expect(generateStableId('Combat', 'skills', [])).toBe('combat')
    expect(generateStableId('Athlétisme', 'skills', [])).toBe('athletisme')
  })

  it('should append -2 on first collision', () => {
    const existing = new Set(['combat'])
    expect(generateStableId('Combat', 'skills', existing)).toBe('combat-2')
  })

  it('should append -3, -4, etc. on subsequent collisions', () => {
    const existing = new Set(['combat', 'combat-2'])
    expect(generateStableId('Combat', 'skills', existing)).toBe('combat-3')

    existing.add('combat-3')
    expect(generateStableId('Combat', 'skills', existing)).toBe('combat-4')
  })

  it('should work with arrays instead of Sets', () => {
    expect(generateStableId('Combat', 'skills', ['combat'])).toBe('combat-2')
    expect(generateStableId('Combat', 'skills', ['combat', 'combat-2'])).toBe('combat-3')
  })

  it('should handle empty label gracefully', () => {
    expect(generateStableId('', 'skills', [])).toBe('skills-unknown')
    expect(generateStableId(null, 'talents', [])).toBe('talents-unknown')
  })

  it('should find next available suffix when gaps exist', () => {
    // Missing combat-2, but has combat-3
    const existing = new Set(['combat', 'combat-3'])
    // Should return combat-2 (finds first available)
    expect(generateStableId('Combat', 'skills', existing)).toBe('combat-2')
  })
})

describe('generateIdsForEntities', () => {
  it('should generate IDs for entities without IDs', () => {
    const entities = [
      { label: 'Athlétisme' },
      { label: 'Combat' }
    ]

    const result = generateIdsForEntities(entities, 'skills')

    expect(result[0].id).toBe('athletisme')
    expect(result[1].id).toBe('combat')
  })

  it('should preserve existing IDs', () => {
    const entities = [
      { label: 'Combat', id: 'combat-custom' },
      { label: 'Athlétisme' }
    ]

    const result = generateIdsForEntities(entities, 'skills')

    expect(result[0].id).toBe('combat-custom')
    expect(result[1].id).toBe('athletisme')
  })

  it('should handle duplicate labels by adding suffixes', () => {
    const entities = [
      { label: 'Combat' },
      { label: 'Combat' },
      { label: 'Combat' }
    ]

    const result = generateIdsForEntities(entities, 'skills')

    expect(result[0].id).toBe('combat')
    expect(result[1].id).toBe('combat-2')
    expect(result[2].id).toBe('combat-3')
  })

  it('should handle mixed case with existing IDs and duplicates', () => {
    const entities = [
      { label: 'Combat', id: 'combat-preset' },
      { label: 'Combat' },
      { label: 'Combat' }
    ]

    const result = generateIdsForEntities(entities, 'skills')

    expect(result[0].id).toBe('combat-preset')
    expect(result[1].id).toBe('combat')
    expect(result[2].id).toBe('combat-2')
  })

  it('should handle empty array', () => {
    expect(generateIdsForEntities([], 'skills')).toEqual([])
  })

  it('should handle non-array input', () => {
    expect(generateIdsForEntities(null, 'skills')).toEqual([])
    expect(generateIdsForEntities(undefined, 'skills')).toEqual([])
  })

  it('should use name field if label is missing', () => {
    const entities = [
      { name: 'Combat' }
    ]

    const result = generateIdsForEntities(entities, 'skills')

    expect(result[0].id).toBe('combat')
  })
})

describe('createLabelToIdMap', () => {
  it('should create simple one-to-one mapping', () => {
    const entities = [
      { id: 'combat', label: 'Combat' },
      { id: 'athletisme', label: 'Athlétisme' }
    ]

    const map = createLabelToIdMap(entities)

    expect(map.get('combat')).toBe('combat')
    expect(map.get('athletisme')).toBe('athletisme')
  })

  it('should handle duplicate labels with array', () => {
    const entities = [
      { id: 'combat-skill', label: 'Combat' },
      { id: 'combat-talent', label: 'Combat' }
    ]

    const map = createLabelToIdMap(entities)
    const result = map.get('combat')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['combat-skill', 'combat-talent'])
  })

  it('should handle three or more duplicates', () => {
    const entities = [
      { id: 'combat-1', label: 'Combat' },
      { id: 'combat-2', label: 'Combat' },
      { id: 'combat-3', label: 'Combat' }
    ]

    const map = createLabelToIdMap(entities)
    const result = map.get('combat')

    expect(result).toEqual(['combat-1', 'combat-2', 'combat-3'])
  })

  it('should normalize labels with accents', () => {
    const entities = [
      { id: 'athletisme', label: 'Athlétisme' }
    ]

    const map = createLabelToIdMap(entities)

    // Should be accessible with normalized key
    expect(map.get('athletisme')).toBe('athletisme')
  })

  it('should use name field if label is missing', () => {
    const entities = [
      { id: 'combat', name: 'Combat' }
    ]

    const map = createLabelToIdMap(entities)

    expect(map.get('combat')).toBe('combat')
  })

  it('should skip entities without label or name', () => {
    const entities = [
      { id: 'test-1' },
      { id: 'test-2', label: 'Valid' }
    ]

    const map = createLabelToIdMap(entities)

    expect(map.size).toBe(1)
    expect(map.get('valid')).toBe('test-2')
  })
})

describe('resolveLabelToId', () => {
  it('should resolve exact label match', () => {
    const map = new Map([
      ['combat', 'combat-id'],
      ['athletisme', 'athletisme-id']
    ])

    expect(resolveLabelToId('Combat', map, 'skills')).toBe('combat-id')
    expect(resolveLabelToId('Athlétisme', map, 'skills')).toBe('athletisme-id')
  })

  it('should handle case-insensitive matching', () => {
    const map = new Map([['combat', 'combat-id']])

    expect(resolveLabelToId('COMBAT', map, 'skills')).toBe('combat-id')
    expect(resolveLabelToId('CoMbAt', map, 'skills')).toBe('combat-id')
  })

  it('should handle accent-insensitive matching', () => {
    const map = new Map([['athletisme', 'athletisme-id']])

    expect(resolveLabelToId('Athlétisme', map, 'skills')).toBe('athletisme-id')
    expect(resolveLabelToId('Athletisme', map, 'skills')).toBe('athletisme-id')
  })

  it('should return first match for duplicate labels', () => {
    const map = new Map([
      ['combat', ['combat-skill', 'combat-talent']]
    ])

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(resolveLabelToId('Combat', map, 'skills')).toBe('combat-skill')
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Ambiguous label "Combat"')
    )

    consoleSpy.mockRestore()
  })

  it('should return null for unresolved labels', () => {
    const map = new Map([['combat', 'combat-id']])

    expect(resolveLabelToId('Unknown', map, 'skills')).toBe(null)
    expect(resolveLabelToId('NotFound', map, 'skills')).toBe(null)
  })

  it('should handle null or empty input', () => {
    const map = new Map([['combat', 'combat-id']])

    expect(resolveLabelToId('', map, 'skills')).toBe(null)
    expect(resolveLabelToId(null, map, 'skills')).toBe(null)
    expect(resolveLabelToId('Combat', null, 'skills')).toBe(null)
  })
})

describe('batchResolveLabelToId', () => {
  it('should resolve multiple labels', () => {
    const map = new Map([
      ['combat', 'combat-id'],
      ['athletisme', 'athletisme-id']
    ])

    const result = batchResolveLabelToId(['Combat', 'Athlétisme'], map, 'skills')

    expect(result).toEqual([
      { label: 'Combat', id: 'combat-id', resolved: true },
      { label: 'Athlétisme', id: 'athletisme-id', resolved: true }
    ])
  })

  it('should mark unresolved labels', () => {
    const map = new Map([['combat', 'combat-id']])

    const result = batchResolveLabelToId(['Combat', 'Unknown'], map, 'skills')

    expect(result).toEqual([
      { label: 'Combat', id: 'combat-id', resolved: true },
      { label: 'Unknown', id: null, resolved: false }
    ])
  })

  it('should handle empty array', () => {
    const map = new Map()

    expect(batchResolveLabelToId([], map, 'skills')).toEqual([])
  })

  it('should handle non-array input', () => {
    const map = new Map()

    expect(batchResolveLabelToId(null, map, 'skills')).toEqual([])
    expect(batchResolveLabelToId(undefined, map, 'skills')).toEqual([])
  })
})

describe('Integration: Full workflow', () => {
  it('should generate IDs and create label mapping', () => {
    // Step 1: Generate IDs
    const entities = [
      { label: 'Athlétisme' },
      { label: 'Combat' },
      { label: 'Esquive' }
    ]

    generateIdsForEntities(entities, 'skills')

    // Step 2: Create label map
    const labelMap = createLabelToIdMap(entities)

    // Step 3: Resolve labels
    expect(resolveLabelToId('Athlétisme', labelMap, 'skills')).toBe('athletisme')
    expect(resolveLabelToId('Combat', labelMap, 'skills')).toBe('combat')
    expect(resolveLabelToId('Esquive', labelMap, 'skills')).toBe('esquive')
  })

  it('should handle collisions and resolve correctly', () => {
    const entities = [
      { label: 'Combat' },
      { label: 'Combat' }
    ]

    generateIdsForEntities(entities, 'skills')

    const labelMap = createLabelToIdMap(entities)

    // Should return array with both IDs
    const result = labelMap.get('combat')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['combat', 'combat-2'])
  })

  it('should handle real-world entity data', () => {
    const creatures = [
      { label: 'Humain', traits: 'Arme +7, Préjugé (un au choix)' },
      { label: 'Elfe', traits: 'Vision Nocturne, Préjugé (nains)' },
      { label: 'Nain', traits: 'Vision Nocturne, Résistance au Chaos' }
    ]

    generateIdsForEntities(creatures, 'creatures')

    expect(creatures[0].id).toBe('humain')
    expect(creatures[1].id).toBe('elfe')
    expect(creatures[2].id).toBe('nain')
  })
})
