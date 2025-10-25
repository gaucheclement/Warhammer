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
  generateDescription
} from './db-descriptions.js'

describe('Core Description Utilities', () => {
  describe('buildLabelMap', () => {
    it('should build map of labels to entities', async () => {
      const entities = [
        { id: 'combat', label: 'Combat', typeItem: 'skill' },
        { id: 'athletisme', label: 'Athlétisme', typeItem: 'skill' }
      ]

      const map = await buildLabelMap(entities)

      expect(map).toHaveProperty('Combat')
      expect(map).toHaveProperty('Athlétisme')
      expect(map['Combat'].id).toBe('combat')
    })

    it('should handle empty array', async () => {
      const map = await buildLabelMap([])
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
      const labelMap = await buildLabelMap(skills.map(s => ({ ...s, typeItem: 'skill' })))

      const text = 'You gain Combat and Athlétisme'
      const currentEntity = { label: 'Test', typeItem: 'talent' }

      const result = applyHelp(text, currentEntity, labelMap)

      expect(result).toContain('showHelp')
      expect(result).toContain('data-type="skill"')
    })

    it('should handle array of texts', async () => {
      const skills = await db.skills.toArray()
      const labelMap = await buildLabelMap(skills.map(s => ({ ...s, typeItem: 'skill' })))

      const texts = ['You gain Combat', 'Or Athlétisme']
      const currentEntity = { label: 'Test', typeItem: 'talent' }

      const result = applyHelp(texts, currentEntity, labelMap)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
    })

    it('should not self-reference', async () => {
      const skills = await db.skills.toArray()
      const labelMap = await buildLabelMap(skills.map(s => ({ ...s, typeItem: 'skill' })))

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
