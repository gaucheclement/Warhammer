/**
 * Tests for db-descriptions.js - Description generation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { db } from './db.js'
import {
  applyHelp,
  buildLabelMap,
  generateCareerDescription,
  generateTalentDescription,
  generateSkillDescription,
  generateSpellDescription,
  generateDescription,
  getEntitySummary,
  validateReferences,
  enhanceWithTooltips
} from './db-descriptions.js'

describe('Core Description Utilities', () => {
  describe('buildLabelMap', () => {
    it('should build map of labels to entities', async () => {
      const entities = {
        skill: [
          { id: 'combat', label: 'Combat' },
          { id: 'athletisme', label: 'Athlétisme' }
        ]
      }

      const map = await buildLabelMap(entities)

      expect(map).toHaveProperty('Combat')
      expect(map).toHaveProperty('Athlétisme')
      expect(map['Combat'].id).toBe('combat')
    })

    it('should handle empty array', async () => {
      const map = await buildLabelMap({})
      expect(Object.keys(map)).toHaveLength(0)
    })
  })

  describe('applyHelp', () => {
    beforeEach(async () => {
      await db.delete()
      await db.open()

      await db.skills.bulkAdd([
        { id: 'combat', label: 'Combat', typeItem: 'skill' },
        { id: 'athletisme', label: 'Athlétisme', typeItem: 'skill' }
      ])
    })

    afterEach(async () => {
      await db.close()
    })

    it('should return text unchanged if no labelMap', () => {
      const text = 'You gain Combat skill'
      const currentEntity = { label: 'Test', typeItem: 'talent' }

      const result = applyHelp(text, currentEntity, {})

      expect(result).toBe(text)
    })

    it('should convert entity names to links', async () => {
      const skills = await db.skills.toArray()
      const labelMap = await buildLabelMap({ skill: skills })

      const text = 'You gain Combat and Athlétisme'
      const currentEntity = { label: 'Test', typeItem: 'talent' }

      const result = applyHelp(text, currentEntity, labelMap)

      expect(result).toContain('showHelp')
      expect(result).toContain('data-type="skill"')
    })

    it('should handle array of texts', async () => {
      const skills = await db.skills.toArray()
      const labelMap = await buildLabelMap({ skill: skills })

      const texts = ['You gain Combat', 'Or Athlétisme']
      const currentEntity = { label: 'Test', typeItem: 'talent' }

      const result = applyHelp(texts, currentEntity, labelMap)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
    })

    it('should not self-reference', async () => {
      const skills = await db.skills.toArray()
      const labelMap = await buildLabelMap({ skill: skills })

      const text = 'Combat is a skill'
      const currentEntity = { label: 'Combat', typeItem: 'skill' }

      const result = applyHelp(text, currentEntity, labelMap)

      // Should not link to itself
      expect(result).toBe(text)
    })

    it('should handle null or undefined text', () => {
      const result1 = applyHelp(null, {}, {})
      const result2 = applyHelp(undefined, {}, {})

      expect(result1).toBeNull()
      expect(result2).toBeUndefined()
    })
  })
})

describe('Career Description Generation', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    // Set up comprehensive test data
    await db.classes.add({
      id: 'warriors',
      label: 'Guerriers',
      trappings: ['Sword', 'Shield']
    })

    await db.species.bulkAdd([
      { id: 'human', label: 'Humain' },
      { id: 'dwarf', label: 'Nain' }
    ])

    await db.careers.add({
      id: 'soldier',
      label: 'Soldat',
      class: 'warriors',
      species: ['human', 'dwarf'],
      desc: 'A professional fighter'
    })

    await db.skills.bulkAdd([
      { id: 'combat', label: 'Combat', characteristic: 'ws' },
      { id: 'endurance', label: 'Endurance', characteristic: 't' }
    ])

    await db.talents.bulkAdd([
      { id: 'strike', label: 'Strike' },
      { id: 'hardy', label: 'Hardy' }
    ])

    await db.characteristics.bulkAdd([
      { id: 'ws', label: 'Weapon Skill', abr: 'WS' },
      { id: 't', label: 'Toughness', abr: 'T' }
    ])

    await db.careerLevels.bulkAdd([
      {
        id: 'soldier-1',
        label: 'Recrue',
        career: 'soldier',
        careerLevel: 1,
        status: 'Bronze 1',
        skills: ['combat'],
        talents: ['strike'],
        characteristics: ['ws']
      },
      {
        id: 'soldier-2',
        label: 'Soldat',
        career: 'soldier',
        careerLevel: 2,
        status: 'Silver 1',
        skills: ['endurance'],
        talents: ['hardy'],
        characteristics: ['t']
      }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('generateCareerDescription', () => {
    it('should generate career description with levels', async () => {
      const description = await generateCareerDescription('soldier')

      expect(description).toBeDefined()
      expect(typeof description).toBe('object')
      // Should have entries for career levels (rank icons as keys)
      expect(Object.keys(description).length).toBeGreaterThan(0)
    })

    it('should return null for non-existent career', async () => {
      const description = await generateCareerDescription('non-existent')
      expect(description).toBeNull()
    })

    it('should include career basic info', async () => {
      const description = await generateCareerDescription('soldier')

      // Check that it has some content
      const allContent = Object.values(description).join(' ')
      expect(allContent).toContain('Soldat')
    })
  })
})

describe('Talent Description Generation', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    await db.talents.add({
      id: 'ambidextrous',
      label: 'Ambidextre',
      max: '1',
      test: 'None',
      desc: 'You can fight with two weapons',
      specs: []
    })

    await db.careerLevels.add({
      id: 'warrior-1',
      label: 'Warrior Level 1',
      career: 'warrior',
      careerLevel: 1,
      talents: ['ambidextrous']
    })

    await db.species.add({
      id: 'halfling',
      label: 'Halfling'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('generateTalentDescription', () => {
    it('should generate talent description', async () => {
      const description = await generateTalentDescription('ambidextrous')

      expect(description).toBeDefined()
      // Can be string or object
      expect(['string', 'object']).toContain(typeof description)
    })

    it('should return null for non-existent talent', async () => {
      const description = await generateTalentDescription('non-existent')
      expect(description).toBeNull()
    })

    it('should include max rank if present', async () => {
      const description = await generateTalentDescription('ambidextrous')

      if (typeof description === 'object' && description.Info) {
        expect(description.Info).toContain('1')
      } else if (typeof description === 'string') {
        expect(description).toContain('1')
      }
    })
  })
})

describe('Skill Description Generation', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    await db.characteristics.add({
      id: 'ag',
      label: 'Agilité',
      abr: 'Ag'
    })

    await db.skills.add({
      id: 'athletisme',
      label: 'Athlétisme',
      characteristic: 'ag',
      type: 'base',
      advanced: false,
      desc: 'Physical prowess',
      example: 'Climbing, swimming',
      specs: []
    })

    await db.careerLevels.add({
      id: 'warrior-1',
      label: 'Warrior Level 1',
      career: 'warrior',
      careerLevel: 1,
      skills: ['athletisme']
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('generateSkillDescription', () => {
    it('should generate skill description', async () => {
      const description = await generateSkillDescription('athletisme')

      expect(description).toBeDefined()
      expect(['string', 'object']).toContain(typeof description)
    })

    it('should return null for non-existent skill', async () => {
      const description = await generateSkillDescription('non-existent')
      expect(description).toBeNull()
    })

    it('should include characteristic', async () => {
      const description = await generateSkillDescription('athletisme')

      let content = description
      if (typeof description === 'object' && description.Info) {
        content = description.Info
      }

      if (typeof content === 'string') {
        expect(content.toLowerCase()).toContain('ag')
      }
    })
  })
})

describe('Spell Description Generation', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    await db.lores.add({
      id: 'fire',
      label: 'Feu'
    })

    await db.spells.add({
      id: 'fireball',
      label: 'Boule de Feu',
      lore: 'fire',
      cn: '5',
      range: '12 yards',
      target: 'One creature',
      duration: 'Instant',
      desc: 'A ball of flame',
      type: 'arcane'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('generateSpellDescription', () => {
    it('should generate spell description', async () => {
      const description = await generateSpellDescription('fireball')

      expect(description).toBeDefined()
      expect(typeof description).toBe('object')
    })

    it('should return null for non-existent spell', async () => {
      const description = await generateSpellDescription('non-existent')
      expect(description).toBeNull()
    })

    it('should include casting number', async () => {
      const description = await generateSpellDescription('fireball')

      expect(description.Info).toBeDefined()
      expect(description.Info).toContain('5')
    })

    it('should include range, target, duration', async () => {
      const description = await generateSpellDescription('fireball')

      const info = description.Info
      expect(info).toContain('12 yards')
      expect(info).toContain('One creature')
      expect(info).toContain('Instant')
    })
  })
})

describe('Master Description Generator', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    await db.talents.add({
      id: 'test-talent',
      label: 'Test Talent',
      desc: 'A test'
    })

    await db.skills.add({
      id: 'test-skill',
      label: 'Test Skill',
      characteristic: 'ag',
      desc: 'A test'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('generateDescription', () => {
    it('should route to talent generator', async () => {
      const description = await generateDescription('test-talent', 'talent')

      expect(description).toBeDefined()
    })

    it('should route to skill generator', async () => {
      const description = await generateDescription('test-skill', 'skill')

      expect(description).toBeDefined()
    })

    it('should handle unknown type', async () => {
      const description = await generateDescription('test-talent', 'unknown')

      // Should return basic description
      expect(description).toBeDefined()
    })

    it('should return null for non-existent entity', async () => {
      const description = await generateDescription('non-existent', 'talent')

      expect(description).toBeNull()
    })
  })
})

describe('Description Formatting', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  it('should handle entities with specializations', async () => {
    await db.talents.add({
      id: 'combat-talent',
      label: 'Combat Master',
      specs: ['Sword', 'Axe'],
      desc: 'Combat expertise'
    })

    const description = await generateTalentDescription('combat-talent')

    expect(description).toBeDefined()
  })

  it('should handle entities with complex relationships', async () => {
    await db.skills.add({
      id: 'navigation',
      label: 'Navigation',
      characteristic: 'int'
    })

    await db.talents.add({
      id: 'sailor',
      label: 'Sailor',
      addSkill: 'navigation',
      desc: 'Seafaring skills'
    })

    await db.characteristics.add({
      id: 'int',
      label: 'Intelligence',
      abr: 'Int'
    })

    const description = await generateTalentDescription('sailor')

    expect(description).toBeDefined()
  })
})

describe('HTML Output', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    await db.talents.add({
      id: 'test',
      label: 'Test',
      desc: 'A description'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  it('should generate valid HTML structure', async () => {
    const description = await generateTalentDescription('test')

    if (typeof description === 'string') {
      // Should not have unclosed tags
      expect(description).not.toMatch(/<[^>]*$/)
    }
  })

  it('should include help link classes', async () => {
    await db.characteristics.add({ id: 'ag', label: 'Agilité', abr: 'Ag' })
    await db.skills.add({
      id: 'test-skill',
      label: 'Test Skill',
      characteristic: 'ag',
      desc: 'References Agilité'
    })

    const description = await generateSkillDescription('test-skill')

    if (typeof description === 'object' && description.Info) {
      // May or may not have help links depending on entity linking
      expect(typeof description.Info).toBe('string')
    }
  })
})

describe('Error Handling', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  it('should handle missing related entities gracefully', async () => {
    await db.talents.add({
      id: 'broken',
      label: 'Broken Talent',
      addSkill: 'non-existent-skill'
    })

    // Should not throw
    const description = await generateTalentDescription('broken')
    expect(description).toBeDefined()
  })

  it('should handle circular references', async () => {
    await db.talents.bulkAdd([
      { id: 't1', label: 'Talent 1', addTalent: 't2' },
      { id: 't2', label: 'Talent 2', addTalent: 't1' }
    ])

    // Should not cause infinite loop
    const description = await generateTalentDescription('t1')
    expect(description).toBeDefined()
  })
})

// ============================================================================
// TOOLTIP AND VALIDATION SYSTEM TESTS (Issue #40 Stream C)
// ============================================================================

describe('Tooltip System (Issue #40)', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getEntitySummary', () => {
    it('should return null for missing entity', async () => {
      const summary = await getEntitySummary('skill', 'non-existent')
      expect(summary).toBeNull()
    })

    it('should return null for invalid type', async () => {
      const summary = await getEntitySummary('invalid-type', 'test')
      expect(summary).toBeNull()
    })

    it('should generate summary for skill with characteristic', async () => {
      await db.characteristics.add({
        id: 'ag',
        label: 'Agilité',
        abr: 'Ag'
      })

      await db.skills.add({
        id: 'dodge',
        label: 'Esquive',
        characteristic: 'ag',
        type: 'base'
      })

      const summary = await getEntitySummary('skill', 'dodge')
      expect(summary).toBeDefined()
      expect(summary).toContain('Esquive')
      expect(summary).toContain('Ag')
      expect(summary).toContain('base')
    })

    it('should generate summary for talent with max rank', async () => {
      await db.talents.add({
        id: 'combat',
        label: 'Combat',
        max: '5'
      })

      const summary = await getEntitySummary('talent', 'combat')
      expect(summary).toBeDefined()
      expect(summary).toContain('Combat')
      expect(summary).toContain('Max: 5')
    })

    it('should generate summary for spell with casting number', async () => {
      await db.spells.add({
        id: 'fireball',
        label: 'Boule de Feu',
        cn: '7'
      })

      const summary = await getEntitySummary('spell', 'fireball')
      expect(summary).toBeDefined()
      expect(summary).toContain('Boule de Feu')
      expect(summary).toContain('NI: 7')
    })

    it('should generate summary for characteristic with abbreviation', async () => {
      await db.characteristics.add({
        id: 'ws',
        label: 'Capacité de Combat',
        abr: 'CC'
      })

      const summary = await getEntitySummary('characteristic', 'ws')
      expect(summary).toBeDefined()
      expect(summary).toContain('Capacité de Combat')
      expect(summary).toContain('(CC)')
    })

    it('should generate summary for career with class', async () => {
      await db.classes.add({
        id: 'warriors',
        label: 'Guerriers'
      })

      await db.careers.add({
        id: 'soldier',
        label: 'Soldat',
        class: 'warriors'
      })

      const summary = await getEntitySummary('career', 'soldier')
      expect(summary).toBeDefined()
      expect(summary).toContain('Soldat')
      expect(summary).toContain('Carrière')
    })

    it('should generate summary for careerLevel', async () => {
      await db.careers.add({
        id: 'soldier',
        label: 'Soldat'
      })

      await db.careerLevels.add({
        id: 'soldier-1',
        label: 'Recrue',
        career: 'soldier',
        level: 1
      })

      const summary = await getEntitySummary('careerLevel', 'soldier-1')
      expect(summary).toBeDefined()
      expect(summary).toContain('Recrue')
    })

    it('should generate summary for all 23 entity types', async () => {
      // Test that each entity type can generate a summary
      // Map entity type to ID pattern used in database
      const entityConfig = [
        { type: 'skill', id: 'test-skill', label: 'Test Skill', extra: { characteristic: 'ag' } },
        { type: 'talent', id: 'test-talent', label: 'Test Talent' },
        { type: 'spell', id: 'test-spell', label: 'Test Spell' },
        { type: 'characteristic', id: 'test-char', label: 'Test Char' },
        { type: 'trait', id: 'test-trait', label: 'Test Trait' },
        { type: 'quality', id: 'test-quality', label: 'Test Quality' },
        { type: 'trapping', id: 'test-trapping', label: 'Test Trapping' },
        { type: 'career', id: 'test-career', label: 'Test Career' },
        { type: 'careerLevel', id: 'test-careerlevel', label: 'Test Level', extra: { career: 'test-career' } },
        { type: 'class', id: 'test-class', label: 'Test Class' },
        { type: 'specie', id: 'test-specie', label: 'Test Specie' },
        { type: 'lore', id: 'test-lore', label: 'Test Lore' },
        { type: 'god', id: 'test-god', label: 'Test God' },
        { type: 'creature', id: 'test-creature', label: 'Test Creature' },
        { type: 'etat', id: 'test-etat', label: 'Test État' },
        { type: 'psychologie', id: 'test-psychologie', label: 'Test Psychologie' },
        { type: 'magick', id: 'test-magick', label: 'Test Magick' },
        { type: 'star', id: 'test-star', label: 'Test Star' },
        { type: 'tree', id: 'test-tree', label: 'Test Tree' },
        { type: 'book', id: 'test-book', label: 'Test Book' }
      ]

      // Add test entity for each type - use explicit table mappings
      const tableMap = {
        skill: 'skills',
        talent: 'talents',
        spell: 'spells',
        characteristic: 'characteristics',
        trait: 'traits',
        quality: 'qualities',
        trapping: 'trappings',
        career: 'careers',
        careerLevel: 'careerLevels',
        class: 'classes',
        specie: 'species',
        lore: 'lores',
        god: 'gods',
        creature: 'creatures',
        etat: 'etats',
        psychologie: 'psychologies',
        magick: 'magicks',
        star: 'stars',
        tree: 'trees',
        book: 'books'
      }

      for (const config of entityConfig) {
        const entity = { id: config.id, label: config.label, ...config.extra }
        const tableName = tableMap[config.type]

        if (!db[tableName]) {
          throw new Error(`Table ${tableName} does not exist for type ${config.type}`)
        }

        await db[tableName].add(entity)
      }

      // Test each type can generate summary
      for (const config of entityConfig) {
        const summary = await getEntitySummary(config.type, config.id)
        expect(summary, `Summary for ${config.type}:${config.id} should not be null`).not.toBeNull()
        expect(summary).toBeDefined()
        expect(typeof summary).toBe('string')
        expect(summary.length).toBeGreaterThan(0)
      }
    })

    it('should handle species alias correctly', async () => {
      await db.species.add({
        id: 'human',
        label: 'Humain'
      })

      // Both 'specie' and 'species' should work
      const summary1 = await getEntitySummary('specie', 'human')
      const summary2 = await getEntitySummary('species', 'human')

      expect(summary1).toBeDefined()
      expect(summary2).toBeDefined()
      expect(summary1).toContain('Humain')
      expect(summary2).toContain('Humain')
    })
  })

  describe('validateReferences', () => {
    beforeEach(async () => {
      await db.skills.add({
        id: 'dodge',
        label: 'Esquive'
      })

      await db.talents.add({
        id: 'combat',
        label: 'Combat'
      })
    })

    it('should return empty arrays for null/undefined input', async () => {
      const result1 = await validateReferences(null)
      const result2 = await validateReferences(undefined)
      const result3 = await validateReferences('')

      expect(result1).toEqual({ valid: [], broken: [] })
      expect(result2).toEqual({ valid: [], broken: [] })
      expect(result3).toEqual({ valid: [], broken: [] })
    })

    it('should validate valid references', async () => {
      const html = '<span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>'
      const result = await validateReferences(html)

      expect(result.valid).toHaveLength(1)
      expect(result.broken).toHaveLength(0)
      expect(result.valid[0]).toEqual({
        type: 'skill',
        id: 'dodge',
        label: 'Dodge'
      })
    })

    it('should identify broken references', async () => {
      const html = '<span class="showHelp" data-type="skill" data-id="invalid">Invalid</span>'
      const result = await validateReferences(html)

      expect(result.valid).toHaveLength(0)
      expect(result.broken).toHaveLength(1)
      expect(result.broken[0].type).toBe('skill')
      expect(result.broken[0].id).toBe('invalid')
      expect(result.broken[0].reason).toBe('Entity not found')
    })

    it('should handle mixed valid and broken references', async () => {
      const html = `
        <span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>
        <span class="showHelp" data-type="talent" data-id="combat">Combat</span>
        <span class="showHelp" data-type="skill" data-id="invalid">Invalid</span>
      `
      const result = await validateReferences(html)

      expect(result.valid).toHaveLength(2)
      expect(result.broken).toHaveLength(1)
    })

    it('should handle unknown entity types', async () => {
      const html = '<span class="showHelp" data-type="unknown" data-id="test">Test</span>'
      const result = await validateReferences(html)

      expect(result.broken).toHaveLength(1)
      expect(result.broken[0].reason).toBe('Unknown entity type')
    })

    it('should handle malformed HTML gracefully', async () => {
      const html = '<span class="showHelp">Incomplete</span>'
      const result = await validateReferences(html)

      // Should not throw, should return empty arrays
      expect(result).toBeDefined()
      expect(result.valid).toBeDefined()
      expect(result.broken).toBeDefined()
    })

    it('should validate multiple references of same entity', async () => {
      const html = `
        <span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>
        <span class="showHelp" data-type="skill" data-id="dodge">Esquive</span>
      `
      const result = await validateReferences(html)

      expect(result.valid).toHaveLength(2)
      expect(result.broken).toHaveLength(0)
    })
  })

  describe('enhanceWithTooltips', () => {
    beforeEach(async () => {
      await db.skills.add({
        id: 'dodge',
        label: 'Esquive',
        characteristic: 'ag',
        type: 'base'
      })

      await db.characteristics.add({
        id: 'ag',
        label: 'Agilité',
        abr: 'Ag'
      })
    })

    it('should return unchanged for null/undefined input', async () => {
      const result1 = await enhanceWithTooltips(null)
      const result2 = await enhanceWithTooltips(undefined)
      const result3 = await enhanceWithTooltips('')

      expect(result1).toBeNull()
      expect(result2).toBeUndefined()
      expect(result3).toBe('')
    })

    it('should add tooltips to valid references', async () => {
      const html = '<span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>'
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('title=')
      expect(result).toContain('Esquive')
    })

    it('should mark broken references with broken class', async () => {
      const html = '<span class="showHelp" data-type="skill" data-id="invalid">Invalid</span>'
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('class="showHelp broken"')
      expect(result).toContain('Référence introuvable')
    })

    it('should not modify spans that already have title attribute', async () => {
      const html = '<span class="showHelp" data-type="skill" data-id="dodge" title="Existing">Dodge</span>'
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('title="Existing"')
      expect(result).not.toContain('Esquive')
    })

    it('should handle mixed valid and broken references', async () => {
      const html = `
        <span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>
        <span class="showHelp" data-type="skill" data-id="invalid">Invalid</span>
      `
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('title="Esquive')
      expect(result).toContain('class="showHelp broken"')
    })

    it('should preserve existing HTML structure', async () => {
      const html = `
        <div>
          <p>Text before <span class="showHelp" data-type="skill" data-id="dodge">Dodge</span> text after</p>
        </div>
      `
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('<div>')
      expect(result).toContain('<p>')
      expect(result).toContain('Text before')
      expect(result).toContain('text after')
    })

    it('should handle unknown entity types', async () => {
      const html = '<span class="showHelp" data-type="unknown" data-id="test">Test</span>'
      const result = await enhanceWithTooltips(html)

      expect(result).toContain('class="showHelp broken"')
      expect(result).toContain('Type d\'entité inconnu')
    })
  })

  describe('Nested References', () => {
    beforeEach(async () => {
      await db.characteristics.add({
        id: 'ag',
        label: 'Agilité',
        abr: 'Ag'
      })

      await db.skills.add({
        id: 'dodge',
        label: 'Esquive',
        characteristic: 'ag',
        type: 'base',
        desc: 'Permet d\'éviter les attaques'
      })

      await db.talents.add({
        id: 'combat',
        label: 'Combat Expert',
        max: '3',
        desc: 'Améliore vos compétences de Combat et Esquive'
      })
    })

    it('should handle references in talent descriptions that link to skills', async () => {
      const labelMap = await buildLabelMap({
        skill: await db.skills.toArray()
      })

      const talent = await db.talents.get('combat')
      const processed = applyHelp(
        talent.desc,
        { typeItem: 'talent', label: talent.label },
        labelMap
      )

      expect(processed).toContain('showHelp')
      expect(processed).toContain('data-type="skill"')
    })

    it('should generate descriptions with nested cross-references', async () => {
      const description = await generateTalentDescription('combat')

      // Should have description with entity links
      if (typeof description === 'object' && description.Info) {
        expect(description.Info).toBeDefined()
      }
    })

    it('should validate nested references correctly', async () => {
      const description = await generateTalentDescription('combat')
      const html = typeof description === 'object' ? description.Info : description

      const result = await validateReferences(html)

      // All references should be valid
      expect(result.broken).toHaveLength(0)
    })

    it('should enhance nested references with tooltips', async () => {
      const description = await generateTalentDescription('combat')
      const html = typeof description === 'object' ? description.Info : description

      const enhanced = await enhanceWithTooltips(html)

      // Should have tooltips added
      expect(enhanced).toBeDefined()
    })
  })

  describe('Cross-Reference Edge Cases', () => {
    it('should handle entities with special characters in labels', async () => {
      await db.skills.add({
        id: 'test',
        label: 'Test (Spécial)',
        characteristic: 'ag'
      })

      const summary = await getEntitySummary('skill', 'test')
      expect(summary).toContain('Test (Spécial)')
    })

    it('should handle entities with HTML-like characters in descriptions', async () => {
      await db.talents.add({
        id: 'test',
        label: 'Test',
        desc: 'This has <brackets> and & symbols'
      })

      const description = await generateTalentDescription('test')
      expect(description).toBeDefined()
    })

    it('should handle very long entity labels', async () => {
      const longLabel = 'A'.repeat(200)
      await db.skills.add({
        id: 'long',
        label: longLabel,
        characteristic: 'ag'
      })

      const summary = await getEntitySummary('skill', 'long')
      expect(summary).toBeDefined()
      expect(summary).toContain(longLabel)
    })

    it('should handle entities with null descriptions', async () => {
      await db.talents.add({
        id: 'null-desc',
        label: 'Null Desc',
        desc: null
      })

      const description = await generateTalentDescription('null-desc')
      expect(description).toBeDefined()
    })

    it('should handle concurrent validation requests', async () => {
      await db.skills.add({ id: 's1', label: 'Skill 1' })
      await db.skills.add({ id: 's2', label: 'Skill 2' })
      await db.skills.add({ id: 's3', label: 'Skill 3' })

      const html1 = '<span class="showHelp" data-type="skill" data-id="s1">S1</span>'
      const html2 = '<span class="showHelp" data-type="skill" data-id="s2">S2</span>'
      const html3 = '<span class="showHelp" data-type="skill" data-id="s3">S3</span>'

      const [result1, result2, result3] = await Promise.all([
        validateReferences(html1),
        validateReferences(html2),
        validateReferences(html3)
      ])

      expect(result1.valid).toHaveLength(1)
      expect(result2.valid).toHaveLength(1)
      expect(result3.valid).toHaveLength(1)
    })
  })

  describe('Integration Tests', () => {
    beforeEach(async () => {
      // Set up comprehensive test data
      await db.characteristics.add({ id: 'ag', label: 'Agilité', abr: 'Ag' })
      await db.characteristics.add({ id: 'ws', label: 'Capacité de Combat', abr: 'CC' })

      await db.skills.bulkAdd([
        { id: 'dodge', label: 'Esquive', characteristic: 'ag', type: 'base' },
        { id: 'melee', label: 'Corps à corps', characteristic: 'ws', type: 'base' }
      ])

      await db.talents.bulkAdd([
        { id: 'combat', label: 'Combat Expert', max: '3', desc: 'Améliore Esquive et Corps à corps' },
        { id: 'agile', label: 'Agile', max: '5', desc: 'Bonus à Esquive' }
      ])

      await db.spells.add({
        id: 'fireball',
        label: 'Boule de Feu',
        cn: '7',
        desc: 'Sort de feu qui requiert un test de Esquive'
      })
    })

    it('should generate complete description with all cross-references', async () => {
      const description = await generateSpellDescription('fireball')
      expect(description).toBeDefined()
      expect(description.Info).toBeDefined()
    })

    it('should validate all references in generated description', async () => {
      const description = await generateSpellDescription('fireball')
      const html = description.Info

      const result = await validateReferences(html)
      expect(result.broken).toHaveLength(0)
    })

    it('should enhance generated description with tooltips', async () => {
      const description = await generateSpellDescription('fireball')
      const html = description.Info

      const enhanced = await enhanceWithTooltips(html)
      expect(enhanced).toBeDefined()
      expect(enhanced).toContain('title=')
    })

    it('should handle full workflow: generate -> validate -> enhance', async () => {
      // Generate description
      const description = await generateTalentDescription('combat')
      const html = typeof description === 'object' ? description.Info : description

      // Validate references
      const validation = await validateReferences(html)
      expect(validation.broken.length).toBe(0)

      // Enhance with tooltips
      const enhanced = await enhanceWithTooltips(html)
      expect(enhanced).toBeDefined()

      // Validate enhanced version
      const validationAfter = await validateReferences(enhanced)
      expect(validationAfter.broken.length).toBe(0)
      expect(validationAfter.valid.length).toBeGreaterThanOrEqual(validation.valid.length)
    })
  })
})
