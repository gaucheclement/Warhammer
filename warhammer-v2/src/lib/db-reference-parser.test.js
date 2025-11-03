/**
 * Tests for db-reference-parser.js
 *
 * Comprehensive test suite with 100% code coverage.
 * Tests all functions, edge cases, and real-world examples.
 */

import { describe, it, expect } from 'vitest'
import {
  parseCommaSeparatedList,
  parseMultiSeparatorList,
  parseEntityReference,
  parseEntityReferenceList,
  parseSpecs,
  isEntityReference,
  extractId,
  formatEntityReference
} from './db-reference-parser.js'

describe('parseCommaSeparatedList', () => {
  it('should parse simple comma-separated list', () => {
    const result = parseCommaSeparatedList('skill1, skill2, skill3')
    expect(result).toEqual(['skill1', 'skill2', 'skill3'])
  })

  it('should trim whitespace from each item', () => {
    const result = parseCommaSeparatedList('  skill1  ,  skill2  ,  skill3  ')
    expect(result).toEqual(['skill1', 'skill2', 'skill3'])
  })

  it('should filter out empty items', () => {
    const result = parseCommaSeparatedList('skill1, , skill2,  , skill3')
    expect(result).toEqual(['skill1', 'skill2', 'skill3'])
  })

  it('should handle trailing comma', () => {
    const result = parseCommaSeparatedList('skill1, skill2, skill3,')
    expect(result).toEqual(['skill1', 'skill2', 'skill3'])
  })

  it('should handle leading comma', () => {
    const result = parseCommaSeparatedList(',skill1, skill2, skill3')
    expect(result).toEqual(['skill1', 'skill2', 'skill3'])
  })

  it('should return empty array for empty string', () => {
    const result = parseCommaSeparatedList('')
    expect(result).toEqual([])
  })

  it('should return empty array for null', () => {
    const result = parseCommaSeparatedList(null)
    expect(result).toEqual([])
  })

  it('should return empty array for undefined', () => {
    const result = parseCommaSeparatedList(undefined)
    expect(result).toEqual([])
  })

  it('should return empty array for non-string input', () => {
    const result = parseCommaSeparatedList(123)
    expect(result).toEqual([])
  })

  it('should handle single item', () => {
    const result = parseCommaSeparatedList('skill1')
    expect(result).toEqual(['skill1'])
  })

  it('should handle items with special characters', () => {
    const result = parseCommaSeparatedList('Athlétisme, Combat (Épée), Échec d\'Armes')
    expect(result).toEqual(['Athlétisme', 'Combat (Épée)', 'Échec d\'Armes'])
  })
})

describe('parseMultiSeparatorList', () => {
  it('should parse comma-separated list', () => {
    const result = parseMultiSeparatorList('A, B, C')
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should parse "ou" (or) separated list', () => {
    const result = parseMultiSeparatorList('A ou B ou C')
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should parse "et" (and) separated list', () => {
    const result = parseMultiSeparatorList('A et B et C')
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should parse mixed separators', () => {
    const result = parseMultiSeparatorList('A, B ou C et D')
    expect(result).toEqual(['A', 'B', 'C', 'D'])
  })

  it('should trim whitespace', () => {
    const result = parseMultiSeparatorList('  A  ,  B  ou  C  ')
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should filter out empty items', () => {
    const result = parseMultiSeparatorList('A, , B ou  et C')
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should return empty array for empty string', () => {
    const result = parseMultiSeparatorList('')
    expect(result).toEqual([])
  })

  it('should return empty array for null', () => {
    const result = parseMultiSeparatorList(null)
    expect(result).toEqual([])
  })

  it('should return empty array for undefined', () => {
    const result = parseMultiSeparatorList(undefined)
    expect(result).toEqual([])
  })

  it('should handle single item', () => {
    const result = parseMultiSeparatorList('skill1')
    expect(result).toEqual(['skill1'])
  })

  it('should preserve content with parentheses', () => {
    const result = parseMultiSeparatorList('Combat (Épée) ou Tir (Arc), Escalade')
    expect(result).toEqual(['Combat (Épée)', 'Tir (Arc)', 'Escalade'])
  })
})

describe('parseEntityReference', () => {
  describe('simple labels', () => {
    it('should parse simple label', () => {
      const result = parseEntityReference('Coriace')
      expect(result).toEqual({
        label: 'Coriace',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should parse multi-word label', () => {
      const result = parseEntityReference('Lanceur de Sorts')
      expect(result).toEqual({
        label: 'Lanceur de Sorts',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should trim whitespace', () => {
      const result = parseEntityReference('  Coriace  ')
      expect(result).toEqual({
        label: 'Coriace',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })
  })

  describe('prefix modifiers', () => {
    it('should parse positive prefix', () => {
      const result = parseEntityReference('+5 Arme')
      expect(result).toEqual({
        label: 'Arme',
        prefix: '+5',
        suffix: null,
        spec: null,
        rating: 5
      })
    })

    it('should parse negative prefix', () => {
      const result = parseEntityReference('-2 Dextérité')
      expect(result).toEqual({
        label: 'Dextérité',
        prefix: '-2',
        suffix: null,
        spec: null,
        rating: -2
      })
    })

    it('should parse prefix without sign', () => {
      const result = parseEntityReference('5 Blessures')
      expect(result).toEqual({
        label: 'Blessures',
        prefix: '5',
        suffix: null,
        spec: null,
        rating: 5
      })
    })

    it('should parse dice notation prefix', () => {
      const result = parseEntityReference('2d10 Dégâts')
      expect(result).toEqual({
        label: 'Dégâts',
        prefix: '2d10',
        suffix: null,
        spec: null,
        rating: 2  // Extract first number
      })
    })

    it('should parse complex dice notation', () => {
      const result = parseEntityReference('+1d6+3 Blessures')
      expect(result).toEqual({
        label: 'Blessures',
        prefix: '+1d6+3',
        suffix: null,
        spec: null,
        rating: 1
      })
    })
  })

  describe('suffix modifiers', () => {
    it('should parse positive suffix', () => {
      const result = parseEntityReference('Effrayant +3')
      expect(result).toEqual({
        label: 'Effrayant',
        prefix: null,
        suffix: '+3',
        spec: null,
        rating: 3  // Rating extracted from suffix when no prefix
      })
    })

    it('should parse negative suffix', () => {
      const result = parseEntityReference('Mouvement -1')
      expect(result).toEqual({
        label: 'Mouvement',
        prefix: null,
        suffix: '-1',
        spec: null,
        rating: -1
      })
    })

    it('should prefer prefix rating over suffix when both exist', () => {
      const result = parseEntityReference('+2 Arme +5')
      expect(result).toEqual({
        label: 'Arme',
        prefix: '+2',
        suffix: '+5',
        spec: null,
        rating: 2  // Prefix takes precedence
      })
    })
  })

  describe('specializations', () => {
    it('should parse specialization', () => {
      const result = parseEntityReference('Combat (Épée)')
      expect(result).toEqual({
        label: 'Combat',
        prefix: null,
        suffix: null,
        spec: 'Épée',
        rating: null
      })
    })

    it('should parse multi-word specialization', () => {
      const result = parseEntityReference('Lanceur de Sorts (Sorcellerie)')
      expect(result).toEqual({
        label: 'Lanceur de Sorts',
        prefix: null,
        suffix: null,
        spec: 'Sorcellerie',
        rating: null
      })
    })

    it('should parse specialization with lowercase', () => {
      const result = parseEntityReference('Préjugé (sigmarites)')
      expect(result).toEqual({
        label: 'Préjugé',
        prefix: null,
        suffix: null,
        spec: 'sigmarites',
        rating: null
      })
    })

    it('should parse specialization with accents', () => {
      const result = parseEntityReference('Magie (Domaine Mineur)')
      expect(result).toEqual({
        label: 'Magie',
        prefix: null,
        suffix: null,
        spec: 'Domaine Mineur',
        rating: null
      })
    })

    it('should trim whitespace in spec', () => {
      const result = parseEntityReference('Combat (  Épée  )')
      expect(result).toEqual({
        label: 'Combat',
        prefix: null,
        suffix: null,
        spec: 'Épée',
        rating: null
      })
    })

    it('should handle spec without space before paren', () => {
      const result = parseEntityReference('Combat(Épée)')
      expect(result).toEqual({
        label: 'Combat',
        prefix: null,
        suffix: null,
        spec: 'Épée',
        rating: null
      })
    })
  })

  describe('complex combinations', () => {
    it('should parse prefix + label + spec', () => {
      const result = parseEntityReference('+2 Combat (Épée)')
      expect(result).toEqual({
        label: 'Combat',
        prefix: '+2',
        suffix: null,
        spec: 'Épée',
        rating: 2
      })
    })

    it('should parse label + suffix + spec', () => {
      const result = parseEntityReference('Effrayant +3 (Monstres)')
      expect(result).toEqual({
        label: 'Effrayant',
        prefix: null,
        suffix: '+3',
        spec: 'Monstres',
        rating: 3
      })
    })

    it('should parse prefix + label + suffix', () => {
      const result = parseEntityReference('+1 Arme +5')
      expect(result).toEqual({
        label: 'Arme',
        prefix: '+1',
        suffix: '+5',
        spec: null,
        rating: 1
      })
    })

    it('should parse prefix + label + suffix + spec', () => {
      const result = parseEntityReference('+2 Combat +1 (Épée)')
      expect(result).toEqual({
        label: 'Combat',
        prefix: '+2',
        suffix: '+1',
        spec: 'Épée',
        rating: 2
      })
    })
  })

  describe('edge cases', () => {
    it('should return empty result for null', () => {
      const result = parseEntityReference(null)
      expect(result).toEqual({
        label: '',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should return empty result for undefined', () => {
      const result = parseEntityReference(undefined)
      expect(result).toEqual({
        label: '',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should return empty result for non-string', () => {
      const result = parseEntityReference(123)
      expect(result).toEqual({
        label: '',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should return empty result for empty string', () => {
      const result = parseEntityReference('')
      expect(result).toEqual({
        label: '',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should handle label with apostrophe', () => {
      const result = parseEntityReference('L\'Épée d\'Argent')
      expect(result).toEqual({
        label: 'L\'Épée d\'Argent',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })

    it('should handle label with hyphens', () => {
      const result = parseEntityReference('Corps-à-Corps')
      expect(result).toEqual({
        label: 'Corps-à-Corps',
        prefix: null,
        suffix: null,
        spec: null,
        rating: null
      })
    })
  })
})

describe('parseEntityReferenceList', () => {
  it('should parse simple list', () => {
    const result = parseEntityReferenceList('+5 Arme, Coriace', 'traits')
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      label: 'Arme',
      prefix: '+5',
      rating: 5,
      entityType: 'traits',
      originalText: '+5 Arme'
    })
    expect(result[1]).toMatchObject({
      label: 'Coriace',
      entityType: 'traits',
      originalText: 'Coriace'
    })
  })

  it('should parse complex list with mixed separators', () => {
    const result = parseEntityReferenceList(
      'Combat (Épée), Tir (Arc) ou Escalade',
      'skills'
    )
    expect(result).toHaveLength(3)
    expect(result[0]).toMatchObject({
      label: 'Combat',
      spec: 'Épée',
      entityType: 'skills',
      originalText: 'Combat (Épée)'
    })
    expect(result[1]).toMatchObject({
      label: 'Tir',
      spec: 'Arc',
      entityType: 'skills',
      originalText: 'Tir (Arc)'
    })
    expect(result[2]).toMatchObject({
      label: 'Escalade',
      entityType: 'skills',
      originalText: 'Escalade'
    })
  })

  it('should parse real-world creature traits example', () => {
    const result = parseEntityReferenceList(
      'Arme +10, Vol, Souffle de Feu, Effrayant +3, Taille (Énorme)',
      'traits'
    )
    expect(result).toHaveLength(5)
    expect(result[0].label).toBe('Arme')
    expect(result[0].rating).toBe(10)
    expect(result[1].label).toBe('Vol')
    expect(result[2].label).toBe('Souffle de Feu')
    expect(result[3].label).toBe('Effrayant')
    expect(result[3].rating).toBe(3)
    expect(result[4].label).toBe('Taille')
    expect(result[4].spec).toBe('Énorme')
  })

  it('should return empty array for null', () => {
    const result = parseEntityReferenceList(null, 'skills')
    expect(result).toEqual([])
  })

  it('should return empty array for undefined', () => {
    const result = parseEntityReferenceList(undefined, 'skills')
    expect(result).toEqual([])
  })

  it('should return empty array for empty string', () => {
    const result = parseEntityReferenceList('', 'skills')
    expect(result).toEqual([])
  })

  it('should handle single item', () => {
    const result = parseEntityReferenceList('Combat (Épée)', 'skills')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      label: 'Combat',
      spec: 'Épée',
      entityType: 'skills'
    })
  })
})

describe('parseSpecs', () => {
  describe('with addSpecName: false (talents)', () => {
    it('should parse string specs', () => {
      const result = parseSpecs(
        { id: 'test', specs: 'Combat, Tir' },
        { addSpecName: false }
      )
      expect(result.specs).toEqual(['Combat', 'Tir'])
      expect(result.canHaveSpec).toBe(true)
      expect(result.specName).toBeUndefined()
      expect(result.spec).toBe('')
      expect(result.origins).toEqual([])
    })

    it('should handle entity without specs', () => {
      const result = parseSpecs({ id: 'test' }, { addSpecName: false })
      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
      expect(result.specName).toBeUndefined()
      expect(result.spec).toBe('')
    })

    it('should handle entity with empty specs string', () => {
      const result = parseSpecs({ id: 'test', specs: '' }, { addSpecName: false })
      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
    })

    it('should preserve existing spec field', () => {
      const result = parseSpecs(
        { id: 'test', specs: 'Combat, Tir', spec: 'Combat' },
        { addSpecName: false }
      )
      expect(result.spec).toBe('Combat')
    })

    it('should preserve existing origins', () => {
      const result = parseSpecs(
        { id: 'test', specs: 'Combat, Tir', origins: ['career'] },
        { addSpecName: false }
      )
      expect(result.origins).toEqual(['career'])
    })
  })

  describe('with addSpecName: true (skills)', () => {
    it('should parse string specs and add specName', () => {
      const result = parseSpecs(
        { id: 'test', specs: 'Épée, Hache' },
        { addSpecName: true }
      )
      expect(result.specs).toEqual(['Épée', 'Hache'])
      expect(result.canHaveSpec).toBe(true)
      expect(result.specName).toBe('Au choix')
      expect(result.spec).toBe('')
    })

    it('should handle entity without specs and add empty specName', () => {
      const result = parseSpecs({ id: 'test' }, { addSpecName: true })
      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
      expect(result.specName).toBe('')
    })

    it('should handle entity with empty specs string and add empty specName', () => {
      const result = parseSpecs({ id: 'test', specs: '' }, { addSpecName: true })
      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
      expect(result.specName).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should return null for null input', () => {
      const result = parseSpecs(null, { addSpecName: false })
      expect(result).toBeNull()
    })

    it('should return undefined for undefined input', () => {
      const result = parseSpecs(undefined, { addSpecName: false })
      expect(result).toBeUndefined()
    })

    it('should use default options when not provided', () => {
      const result = parseSpecs({ id: 'test', specs: 'Combat, Tir' })
      expect(result.specs).toEqual(['Combat', 'Tir'])
      expect(result.specName).toBeUndefined()
    })

    it('should not mutate input object', () => {
      const input = { id: 'test', specs: 'Combat, Tir' }
      const result = parseSpecs(input, { addSpecName: false })
      expect(input.specs).toBe('Combat, Tir')  // Original unchanged
      expect(result.specs).toEqual(['Combat', 'Tir'])  // Result has array
    })

    it('should handle already-parsed array specs', () => {
      const result = parseSpecs(
        { id: 'test', specs: ['Combat', 'Tir'] },
        { addSpecName: false }
      )
      expect(result.specs).toEqual(['Combat', 'Tir'])
      expect(result.canHaveSpec).toBe(false)  // Not set to true for arrays
    })
  })
})

describe('isEntityReference', () => {
  it('should return true for valid EntityReference', () => {
    const ref = {
      id: 'combat',
      entityType: 'skills',
      originalText: 'Combat (Épée)',
      label: 'Combat',
      spec: 'Épée'
    }
    expect(isEntityReference(ref)).toBe(true)
  })

  it('should return true for minimal EntityReference', () => {
    const ref = {
      id: 'combat',
      entityType: 'skills'
    }
    expect(isEntityReference(ref)).toBe(true)
  })

  it('should return true for EntityReference with label but no id', () => {
    const ref = {
      label: 'Combat',
      entityType: 'skills'
    }
    expect(isEntityReference(ref)).toBe(true)
  })

  it('should return false for object without entityType', () => {
    const ref = {
      id: 'combat',
      label: 'Combat'
    }
    expect(isEntityReference(ref)).toBe(false)
  })

  it('should return false for object without id or label', () => {
    const ref = {
      entityType: 'skills',
      spec: 'Épée'
    }
    expect(isEntityReference(ref)).toBe(false)
  })

  it('should return false for string', () => {
    expect(isEntityReference('combat')).toBe(false)
  })

  it('should return false for null', () => {
    expect(isEntityReference(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isEntityReference(undefined)).toBe(false)
  })

  it('should return false for number', () => {
    expect(isEntityReference(123)).toBe(false)
  })

  it('should return false for array', () => {
    expect(isEntityReference([])).toBe(false)
  })
})

describe('extractId', () => {
  it('should extract ID from string', () => {
    expect(extractId('combat')).toBe('combat')
  })

  it('should extract ID from object with id', () => {
    expect(extractId({ id: 'combat' })).toBe('combat')
  })

  it('should extract ID from EntityReference', () => {
    const ref = {
      id: 'combat',
      entityType: 'skills',
      label: 'Combat'
    }
    expect(extractId(ref)).toBe('combat')
  })

  it('should return null for object without id', () => {
    expect(extractId({ label: 'Combat' })).toBeNull()
  })

  it('should return null for null', () => {
    expect(extractId(null)).toBeNull()
  })

  it('should return null for undefined', () => {
    expect(extractId(undefined)).toBeNull()
  })

  it('should return null for number', () => {
    expect(extractId(123)).toBeNull()
  })

  it('should return null for array', () => {
    expect(extractId([])).toBeNull()
  })
})

describe('formatEntityReference', () => {
  it('should format simple label', () => {
    const ref = { label: 'Coriace' }
    expect(formatEntityReference(ref)).toBe('Coriace')
  })

  it('should format label with prefix', () => {
    const ref = { label: 'Arme', prefix: '+5' }
    expect(formatEntityReference(ref)).toBe('+5 Arme')
  })

  it('should format label with suffix', () => {
    const ref = { label: 'Effrayant', suffix: '+3' }
    expect(formatEntityReference(ref)).toBe('Effrayant +3')
  })

  it('should format label with spec', () => {
    const ref = { label: 'Combat', spec: 'Épée' }
    expect(formatEntityReference(ref)).toBe('Combat (Épée)')
  })

  it('should format label with prefix and spec', () => {
    const ref = { label: 'Combat', prefix: '+2', spec: 'Épée' }
    expect(formatEntityReference(ref)).toBe('+2 Combat (Épée)')
  })

  it('should format label with suffix and spec', () => {
    const ref = { label: 'Effrayant', suffix: '+3', spec: 'Monstres' }
    expect(formatEntityReference(ref)).toBe('Effrayant +3 (Monstres)')
  })

  it('should format label with prefix and suffix', () => {
    const ref = { label: 'Arme', prefix: '+2', suffix: '+5' }
    expect(formatEntityReference(ref)).toBe('+2 Arme +5')
  })

  it('should format label with all modifiers', () => {
    const ref = { label: 'Combat', prefix: '+2', suffix: '+1', spec: 'Épée' }
    expect(formatEntityReference(ref)).toBe('+2 Combat +1 (Épée)')
  })

  it('should return empty string for null', () => {
    expect(formatEntityReference(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(formatEntityReference(undefined)).toBe('')
  })

  it('should return empty string for object without label', () => {
    expect(formatEntityReference({ id: 'combat' })).toBe('')
  })

  it('should handle multi-word labels', () => {
    const ref = { label: 'Lanceur de Sorts', spec: 'Sorcellerie' }
    expect(formatEntityReference(ref)).toBe('Lanceur de Sorts (Sorcellerie)')
  })
})
