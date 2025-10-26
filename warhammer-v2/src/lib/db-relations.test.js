/**
 * Tests for db-relations.js - Relationship integrity and navigation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db.js'
import {
  getCareerWithLevels,
  getCareerClass,
  getCareerSpecies,
  getCareerLevelCareer,
  getCareerLevelSkills,
  getCareerLevelTalents,
  getCareerLevelCharacteristics,
  getCareerLevelTrappings,
  getTalentSkill,
  getTalentTalent,
  getTalentWithRelations,
  parseTalentSpecs,
  getSkillCharacteristic,
  getSkillWithCharacteristic,
  parseSkillSpecs,
  getSpellsByLore,
  getSpellLore,
  findCareerLevelsBySkill,
  findCareerLevelsByTalent,
  findCareersBySpecies,
  findTalentsBySkill,
  resolveEntityRef,
  resolveEntityRefs,
  getEntityLabel,
  entitiesToLabels,
  clearRelationCache
} from './db-relations.js'

describe('Career Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    // Set up test data
    await db.classes.add({
      id: 'warriors',
      label: 'Guerriers',
      trappings: ['sword', 'shield']
    })

    await db.species.bulkAdd([
      { id: 'human', label: 'Humain' },
      { id: 'dwarf', label: 'Nain' }
    ])

    await db.careers.add({
      id: 'soldier',
      label: 'Soldat',
      class: 'warriors',
      species: ['human', 'dwarf']
    })

    await db.careerLevels.bulkAdd([
      { id: 'soldier-1', label: 'Recrue', career: 'soldier', careerLevel: 1 },
      { id: 'soldier-2', label: 'Soldat', career: 'soldier', careerLevel: 2 },
      { id: 'soldier-3', label: 'Sergent', career: 'soldier', careerLevel: 3 }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getCareerWithLevels', () => {
    it('should get career with all levels', async () => {
      const career = await getCareerWithLevels('soldier')

      expect(career).toBeDefined()
      expect(career.id).toBe('soldier')
      expect(career.levels).toHaveLength(3)
      expect(career.levels[0].careerLevel).toBe(1)
      expect(career.levels[2].careerLevel).toBe(3)
    })

    it('should return null for non-existent career', async () => {
      const career = await getCareerWithLevels('non-existent')
      expect(career).toBeNull()
    })

    it('should cache results', async () => {
      const career1 = await getCareerWithLevels('soldier')
      const career2 = await getCareerWithLevels('soldier')

      expect(career1).toBe(career2) // Same reference from cache
    })
  })

  describe('getCareerClass', () => {
    it('should get class associated with career', async () => {
      const classObj = await getCareerClass('soldier')

      expect(classObj).toBeDefined()
      expect(classObj.id).toBe('warriors')
      expect(classObj.label).toBe('Guerriers')
    })

    it('should return null if career has no class', async () => {
      await db.careers.add({ id: 'classless', label: 'No Class' })
      const classObj = await getCareerClass('classless')

      expect(classObj).toBeNull()
    })
  })

  describe('getCareerSpecies', () => {
    it('should get all species for a career', async () => {
      const species = await getCareerSpecies('soldier')

      expect(species).toHaveLength(2)
      expect(species.map(s => s.id)).toContain('human')
      expect(species.map(s => s.id)).toContain('dwarf')
    })

    it('should handle career with no species', async () => {
      await db.careers.add({ id: 'any', label: 'Any Species' })
      const species = await getCareerSpecies('any')

      expect(species).toEqual([])
    })
  })
})

describe('Career Level Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    // Set up test data
    await db.careers.add({
      id: 'artisan',
      label: 'Artisan',
      class: 'burghers'
    })

    await db.skills.bulkAdd([
      { id: 'trade', label: 'Métier', characteristic: 'dex' },
      { id: 'charm', label: 'Charme', characteristic: 'fel' },
      { id: 'haggle', label: 'Marchandage', characteristic: 'fel' }
    ])

    await db.talents.bulkAdd([
      { id: 'craftsman', label: 'Artisan' },
      { id: 'dealmaker', label: 'Négociateur' }
    ])

    await db.characteristics.bulkAdd([
      { id: 'ag', label: 'Agilité', abr: 'Ag' },
      { id: 'dex', label: 'Dextérité', abr: 'Dex' }
    ])

    await db.careerLevels.bulkAdd([
      {
        id: 'artisan-1',
        label: 'Apprenti',
        career: 'artisan',
        careerLevel: 1,
        skills: ['trade', 'charm'],
        talents: ['craftsman'],
        characteristics: ['ag'],
        trappings: ['tools']
      },
      {
        id: 'artisan-2',
        label: 'Compagnon',
        career: 'artisan',
        careerLevel: 2,
        skills: ['haggle'],
        talents: ['dealmaker'],
        characteristics: ['dex'],
        trappings: ['workshop']
      }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getCareerLevelCareer', () => {
    it('should get career from career level', async () => {
      const career = await getCareerLevelCareer('artisan-1')

      expect(career).toBeDefined()
      expect(career.id).toBe('artisan')
    })
  })

  describe('getCareerLevelSkills', () => {
    it('should get cumulative skills across levels', async () => {
      const skills = await getCareerLevelSkills('artisan-2', false)

      expect(skills).toHaveLength(3) // All 3 skills
      expect(skills.map(s => s.id)).toContain('trade')
      expect(skills.map(s => s.id)).toContain('charm')
      expect(skills.map(s => s.id)).toContain('haggle')
    })

    it('should get only skills from current level when onlyThisLevel=true', async () => {
      const skills = await getCareerLevelSkills('artisan-2', true)

      expect(skills).toHaveLength(1)
      expect(skills[0].id).toBe('haggle')
    })

    it('should handle level 1 correctly', async () => {
      const skills = await getCareerLevelSkills('artisan-1', false)

      expect(skills).toHaveLength(2) // Only level 1 skills
      expect(skills.map(s => s.id)).not.toContain('haggle')
    })
  })

  describe('getCareerLevelTalents', () => {
    it('should get talents for career level', async () => {
      const talents = await getCareerLevelTalents('artisan-1')

      expect(talents).toHaveLength(1)
      expect(talents[0].id).toBe('craftsman')
    })

    it('should return empty array if no talents', async () => {
      await db.careerLevels.add({
        id: 'empty',
        label: 'Empty',
        career: 'artisan',
        careerLevel: 3
      })

      const talents = await getCareerLevelTalents('empty')
      expect(talents).toEqual([])
    })
  })

  describe('getCareerLevelCharacteristics', () => {
    it('should get cumulative characteristics', async () => {
      const chars = await getCareerLevelCharacteristics('artisan-2', false)

      expect(chars).toHaveLength(2) // Both ag and dex
      expect(chars.map(c => c.id)).toContain('ag')
      expect(chars.map(c => c.id)).toContain('dex')
    })

    it('should get only current level characteristics when onlyThisLevel=true', async () => {
      const chars = await getCareerLevelCharacteristics('artisan-2', true)

      expect(chars).toHaveLength(1)
      expect(chars[0].id).toBe('dex')
    })
  })

  describe('getCareerLevelTrappings', () => {
    it('should get trappings for level', async () => {
      const trappings = await getCareerLevelTrappings('artisan-1', true)

      expect(trappings).toContain('tools')
    })

    it('should include class trappings for level 1', async () => {
      await db.classes.add({
        id: 'burghers',
        label: 'Bourgeois',
        trappings: ['class-item1', 'class-item2']
      })

      const trappings = await getCareerLevelTrappings('artisan-1', false)

      expect(trappings).toContain('tools')
      expect(trappings).toContain('class-item1')
      expect(trappings).toContain('class-item2')
    })
  })
})

describe('Talent Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.skills.add({
      id: 'navigation',
      label: 'Navigation',
      characteristic: 'int'
    })

    await db.talents.bulkAdd([
      {
        id: 'sailor',
        label: 'Marin',
        addSkill: 'navigation',
        specs: ['Voile', 'Rame']
      },
      {
        id: 'magic',
        label: 'Magie',
        addTalent: 'arcane-magic'
      },
      {
        id: 'arcane-magic',
        label: 'Magie Arcane'
      }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getTalentSkill', () => {
    it('should get skill associated with talent', async () => {
      const skill = await getTalentSkill('sailor')

      expect(skill).toBeDefined()
      expect(skill.id).toBe('navigation')
    })

    it('should apply talent specs to skill', async () => {
      const skill = await getTalentSkill('sailor')

      expect(skill.specs).toEqual(['Voile', 'Rame'])
      expect(skill.origins).toContain('sailor')
    })

    it('should return null if no addSkill', async () => {
      const skill = await getTalentSkill('magic')
      expect(skill).toBeNull()
    })
  })

  describe('getTalentTalent', () => {
    it('should get talent associated with talent', async () => {
      const relatedTalent = await getTalentTalent('magic')

      expect(relatedTalent).toBeDefined()
      expect(relatedTalent.id).toBe('arcane-magic')
    })

    it('should return null if no addTalent', async () => {
      const relatedTalent = await getTalentTalent('sailor')
      expect(relatedTalent).toBeNull()
    })
  })

  describe('getTalentWithRelations', () => {
    it('should get talent with all relations', async () => {
      const talent = await getTalentWithRelations('sailor')

      expect(talent).toBeDefined()
      expect(talent.id).toBe('sailor')
      expect(talent.relatedSkill).toBeDefined()
      expect(talent.relatedSkill.id).toBe('navigation')
      expect(talent.relatedTalent).toBeNull()
    })
  })

  describe('parseTalentSpecs', () => {
    it('should parse comma-separated specs', async () => {
      const talent = parseTalentSpecs({
        id: 'test',
        specs: 'Combat, Tir, Magie'
      })

      expect(talent.specs).toEqual(['Combat', 'Tir', 'Magie'])
      expect(talent.canHaveSpec).toBe(true)
    })

    it('should handle empty specs', async () => {
      const talent = parseTalentSpecs({
        id: 'test',
        specs: ''
      })

      expect(talent.specs).toEqual([])
      expect(talent.canHaveSpec).toBe(false)
    })

    it('should pass through already-parsed arrays', async () => {
      const talent = parseTalentSpecs({
        id: 'test',
        specs: ['Already', 'Array']
      })

      expect(talent.specs).toEqual(['Already', 'Array'])
    })
  })
})

describe('Skill Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.characteristics.add({
      id: 'ag',
      label: 'Agilité',
      abr: 'Ag'
    })

    await db.skills.add({
      id: 'athleticism',
      label: 'Athlétisme',
      characteristic: 'ag',
      specs: 'Escalade, Natation'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getSkillCharacteristic', () => {
    it('should get characteristic for skill', async () => {
      const char = await getSkillCharacteristic('athleticism')

      expect(char).toBeDefined()
      expect(char.id).toBe('ag')
      expect(char.abr).toBe('Ag')
    })
  })

  describe('getSkillWithCharacteristic', () => {
    it('should get skill with characteristic object', async () => {
      const skill = await getSkillWithCharacteristic('athleticism')

      expect(skill).toBeDefined()
      expect(skill.id).toBe('athleticism')
      expect(skill.characteristicObj).toBeDefined()
      expect(skill.characteristicObj.id).toBe('ag')
    })
  })

  describe('parseSkillSpecs', () => {
    it('should parse comma-separated specs', async () => {
      const skill = parseSkillSpecs({
        id: 'test',
        specs: 'Savoir, Métier, Artisanat'
      })

      expect(skill.specs).toEqual(['Savoir', 'Métier', 'Artisanat'])
      expect(skill.canHaveSpec).toBe(true)
      expect(skill.specName).toBe('Au choix')
    })

    it('should handle empty specs', async () => {
      const skill = parseSkillSpecs({
        id: 'test',
        specs: ''
      })

      expect(skill.specs).toEqual([])
      expect(skill.canHaveSpec).toBe(false)
      expect(skill.specName).toBe('')
    })
  })
})

describe('Spell Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.lores.add({
      id: 'fire',
      label: 'Feu'
    })

    await db.spells.bulkAdd([
      { id: 'fireball', label: 'Boule de Feu', lore: 'fire', cn: '5' },
      { id: 'flame-burst', label: 'Explosion de Flammes', lore: 'fire', cn: '7' },
      { id: 'ice-bolt', label: 'Éclair de Glace', lore: 'ice', cn: '4' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getSpellsByLore', () => {
    it('should get all spells for a lore', async () => {
      const spells = await getSpellsByLore('fire')

      expect(spells).toHaveLength(2)
      expect(spells.map(s => s.id)).toContain('fireball')
      expect(spells.map(s => s.id)).toContain('flame-burst')
    })

    it('should return empty array for lore with no spells', async () => {
      const spells = await getSpellsByLore('water')
      expect(spells).toEqual([])
    })
  })

  describe('getSpellLore', () => {
    it('should get lore for a spell', async () => {
      const lore = await getSpellLore('fireball')

      expect(lore).toBeDefined()
      expect(lore.id).toBe('fire')
    })

    it('should return null if spell has no lore', async () => {
      await db.spells.add({ id: 'no-lore', label: 'No Lore' })
      const lore = await getSpellLore('no-lore')

      expect(lore).toBeNull()
    })
  })
})

describe('Bidirectional Search', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    // Set up comprehensive test data
    await db.skills.add({ id: 'combat', label: 'Combat' })
    await db.talents.add({ id: 'strike-mighty', label: 'Frappe Puissante', addSkill: 'combat' })

    await db.species.add({ id: 'human', label: 'Humain' })
    await db.careers.bulkAdd([
      { id: 'warrior', label: 'Guerrier', species: ['human'] },
      { id: 'knight', label: 'Chevalier', species: ['human'] }
    ])

    await db.careerLevels.bulkAdd([
      {
        id: 'warrior-1',
        label: 'Recrue',
        career: 'warrior',
        careerLevel: 1,
        skills: ['combat'],
        talents: ['strike-mighty']
      },
      {
        id: 'knight-1',
        label: 'Écuyer',
        career: 'knight',
        careerLevel: 1,
        skills: ['combat'],
        talents: []
      }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('findCareerLevelsBySkill', () => {
    it('should find all career levels granting a skill', async () => {
      const levels = await findCareerLevelsBySkill('combat')

      expect(levels).toHaveLength(2)
      expect(levels.map(l => l.id)).toContain('warrior-1')
      expect(levels.map(l => l.id)).toContain('knight-1')
    })

    it('should return empty array if skill not granted', async () => {
      await db.skills.add({ id: 'rare', label: 'Rare Skill' })
      const levels = await findCareerLevelsBySkill('rare')

      expect(levels).toEqual([])
    })
  })

  describe('findCareerLevelsByTalent', () => {
    it('should find all career levels granting a talent', async () => {
      const levels = await findCareerLevelsByTalent('strike-mighty')

      expect(levels).toHaveLength(1)
      expect(levels[0].id).toBe('warrior-1')
    })
  })

  describe('findCareersBySpecies', () => {
    it('should find all careers for a species', async () => {
      const careers = await findCareersBySpecies('human')

      expect(careers).toHaveLength(2)
      expect(careers.map(c => c.id)).toContain('warrior')
      expect(careers.map(c => c.id)).toContain('knight')
    })

    it('should handle species with no careers', async () => {
      await db.species.add({ id: 'rare', label: 'Rare Species' })
      const careers = await findCareersBySpecies('rare')

      expect(careers).toEqual([])
    })
  })

  describe('findTalentsBySkill', () => {
    it('should find talents granting a skill', async () => {
      const talents = await findTalentsBySkill('combat')

      expect(talents).toHaveLength(1)
      expect(talents[0].id).toBe('strike-mighty')
    })
  })
})

describe('Utility Functions', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.skills.add({
      id: 'test-skill',
      label: 'Test Skill'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('resolveEntityRef', () => {
    it('should resolve string ID', async () => {
      const entity = await resolveEntityRef('test-skill', 'skills')

      expect(entity).toBeDefined()
      expect(entity.id).toBe('test-skill')
    })

    it('should resolve object with id', async () => {
      const entity = await resolveEntityRef({ id: 'test-skill' }, 'skills')

      expect(entity).toBeDefined()
      expect(entity.id).toBe('test-skill')
    })

    it('should resolve object with data', async () => {
      const data = { id: 'test-skill', label: 'Test' }
      const entity = await resolveEntityRef({ data }, 'skills')

      expect(entity).toBe(data)
    })

    it('should return null for non-existent entity', async () => {
      const entity = await resolveEntityRef('non-existent', 'skills')
      expect(entity).toBeNull()
    })
  })

  describe('resolveEntityRefs', () => {
    it('should resolve array of references', async () => {
      await db.skills.add({ id: 'skill2', label: 'Skill 2' })
      const entities = await resolveEntityRefs(['test-skill', 'skill2'], 'skills')

      expect(entities).toHaveLength(2)
      expect(entities[0].id).toBe('test-skill')
      expect(entities[1].id).toBe('skill2')
    })

    it('should filter out null results', async () => {
      const entities = await resolveEntityRefs(['test-skill', 'non-existent'], 'skills')

      expect(entities).toHaveLength(1)
      expect(entities[0].id).toBe('test-skill')
    })
  })

  describe('getEntityLabel', () => {
    it('should format label with spec', () => {
      const label = getEntityLabel({
        label: 'Combat',
        spec: 'Épée'
      })

      expect(label).toBe('Combat (Épée)')
    })

    it('should format label with specs array', () => {
      const label = getEntityLabel({
        label: 'Combat',
        specs: ['Épée', 'Hache']
      })

      expect(label).toBe('Combat (Épée ou Hache)')
    })

    it('should format label with suffix', () => {
      const label = getEntityLabel({
        label: 'Artisan',
        suffix: 'Apprenti'
      })

      expect(label).toBe('Apprenti Artisan')
    })

    it('should format label with prefix', () => {
      const label = getEntityLabel({
        label: 'Combat',
        prefix: 'Expert'
      })

      expect(label).toBe('Combat Expert')
    })

    it('should handle complex combinations', () => {
      const label = getEntityLabel({
        label: 'Combat',
        suffix: 'Maître',
        specs: ['Épée'],
        prefix: '+2'
      })

      expect(label).toBe('Maître Combat (Épée) +2')
    })
  })

  describe('entitiesToLabels', () => {
    it('should convert array of entities to labels', () => {
      const entities = [
        { label: 'Combat', spec: 'Épée' },
        { label: 'Athlétisme' },
        { label: 'Charme', specs: ['Noble', 'Roturier'] }
      ]

      const labels = entitiesToLabels(entities)

      expect(labels).toEqual([
        'Combat (Épée)',
        'Athlétisme',
        'Charme (Noble ou Roturier)'
      ])
    })

    it('should handle empty array', () => {
      const labels = entitiesToLabels([])
      expect(labels).toEqual([])
    })

    it('should handle null input', () => {
      const labels = entitiesToLabels(null)
      expect(labels).toEqual([])
    })
  })
})

describe('Caching', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.careers.add({
      id: 'test-career',
      label: 'Test',
      class: 'test-class'
    })

    await db.classes.add({
      id: 'test-class',
      label: 'Test Class'
    })
  })

  afterEach(async () => {
    await db.close()
  })

  it('should cache relationship results', async () => {
    const class1 = await getCareerClass('test-career')
    const class2 = await getCareerClass('test-career')

    // Should be same reference (cached)
    expect(class1).toBe(class2)
  })

  it('should clear cache when requested', async () => {
    const class1 = await getCareerClass('test-career')
    clearRelationCache()
    const class2 = await getCareerClass('test-career')

    // After clear, should fetch again (different reference)
    expect(class1).not.toBe(class2)
    // But same data
    expect(class1.id).toBe(class2.id)
  })
})
