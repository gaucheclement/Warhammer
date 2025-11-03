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
  clearRelationCache,
  getEntityUsage,
  getEntityUsageStats,
  getEntityUsageBatch,
  findOrphanedEntities
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

describe('Where Used / Reverse Lookup System', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    // Set up comprehensive test data
    // Species
    await db.species.bulkAdd([
      { id: 'human', label: 'Humain', skills: ['athletics'], talents: ['tough'] },
      { id: 'elf', label: 'Elfe', skills: ['perception'] }
    ])

    // Classes
    await db.classes.bulkAdd([
      { id: 'warriors', label: 'Guerriers', trappings: ['sword'] },
      { id: 'rogues', label: 'Roublards', trappings: ['lockpick'] }
    ])

    // Careers
    await db.careers.bulkAdd([
      { id: 'soldier', label: 'Soldat', class: 'warriors', species: ['human', 'elf'] },
      { id: 'thief', label: 'Voleur', class: 'rogues', species: ['human'] }
    ])

    // Career Levels
    await db.careerLevels.bulkAdd([
      {
        id: 'soldier-1',
        label: 'Recrue',
        career: 'soldier',
        level: 1,
        skills: ['athletics', 'combat'],
        talents: ['tough', 'strike-mighty'],
        characteristics: ['str', 'tgh'],
        trappings: ['sword', 'armor']
      },
      {
        id: 'soldier-2',
        label: 'Soldat',
        career: 'soldier',
        level: 2,
        skills: ['athletics', 'leadership'],
        talents: ['combat-master']
      },
      {
        id: 'thief-1',
        label: 'Voleur',
        career: 'thief',
        level: 1,
        skills: ['stealth', 'lockpick'],
        talents: ['nimble']
      }
    ])

    // Skills
    await db.skills.bulkAdd([
      { id: 'athletics', label: 'Athlétisme', characteristic: 'ag' },
      { id: 'combat', label: 'Combat', characteristic: 'ws' },
      { id: 'leadership', label: 'Commandement', characteristic: 'fel' },
      { id: 'stealth', label: 'Discrétion', characteristic: 'ag' },
      { id: 'lockpick', label: 'Crochetage', characteristic: 'dex' },
      { id: 'perception', label: 'Perception', characteristic: 'int' }
    ])

    // Characteristics
    await db.characteristics.bulkAdd([
      { id: 'str', label: 'Force' },
      { id: 'tgh', label: 'Endurance' },
      { id: 'ag', label: 'Agilité' },
      { id: 'ws', label: 'Capacité de Combat' },
      { id: 'fel', label: 'Sociabilité' },
      { id: 'dex', label: 'Dextérité' },
      { id: 'int', label: 'Intelligence' }
    ])

    // Talents
    await db.talents.bulkAdd([
      { id: 'tough', label: 'Résistant' },
      { id: 'strike-mighty', label: 'Frappe puissante', addSkill: 'combat' },
      { id: 'combat-master', label: 'Maître du combat', addTalent: 'strike-mighty' },
      { id: 'nimble', label: 'Agile' }
    ])

    // Trappings
    await db.trappings.bulkAdd([
      { id: 'sword', label: 'Épée', qualities: ['sharp', 'metal'] },
      { id: 'armor', label: 'Armure', qualities: ['metal', 'heavy'] },
      { id: 'lockpick', label: 'Crochets', qualities: ['small'] }
    ])

    // Qualities
    await db.qualities.bulkAdd([
      { id: 'sharp', label: 'Tranchant' },
      { id: 'metal', label: 'Métal' },
      { id: 'heavy', label: 'Lourd' },
      { id: 'small', label: 'Petit' }
    ])

    // Lores and Magicks
    await db.magicks.add({ id: 'arcane', label: 'Magie Arcanique' })
    await db.lores.add({ id: 'fire', label: 'Domaine du Feu', parent: 'arcane' })

    // Spells
    await db.spells.bulkAdd([
      { id: 'fireball', label: 'Boule de feu', lore: 'fire' },
      { id: 'flame-wall', label: 'Mur de flammes', lore: 'fire' }
    ])

    // Gods
    await db.gods.add({
      id: 'sigmar',
      label: 'Sigmar',
      blessings: ['blessing-of-sigmar'],
      miracles: ['miracle-of-sigmar']
    })

    // Divine spells
    await db.spells.bulkAdd([
      { id: 'blessing-of-sigmar', label: 'Bénédiction de Sigmar', type: 'blessing' },
      { id: 'miracle-of-sigmar', label: 'Miracle de Sigmar', type: 'miracle' }
    ])

    // Creatures
    await db.creatures.add({
      id: 'goblin',
      label: 'Gobelin',
      skills: ['stealth'],
      talents: ['nimble'],
      trappings: ['sword'],
      traits: ['night-vision', 'small-size']
    })

    // Traits
    await db.traits.bulkAdd([
      { id: 'night-vision', label: 'Vision nocturne' },
      { id: 'small-size', label: 'Petite taille' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getEntityUsage', () => {
    it('should find all entities using a skill', async () => {
      const usage = await getEntityUsage('skills', 'athletics')

      // Athletics is used by:
      // - careerLevels: soldier-1, soldier-2
      // - species: human
      expect(usage.careerLevels).toHaveLength(2)
      expect(usage.careerLevels.some(cl => cl.id === 'soldier-1')).toBe(true)
      expect(usage.careerLevels.some(cl => cl.id === 'soldier-2')).toBe(true)
      expect(usage.species).toHaveLength(1)
      expect(usage.species[0].id).toBe('human')
    })

    it('should find all entities using a talent', async () => {
      const usage = await getEntityUsage('talents', 'strike-mighty')

      // strike-mighty is used by:
      // - careerLevels: soldier-1
      // - talents: combat-master (via addTalent)
      expect(usage.careerLevels).toHaveLength(1)
      expect(usage.careerLevels[0].id).toBe('soldier-1')
      expect(usage.talents).toHaveLength(1)
      expect(usage.talents[0].id).toBe('combat-master')
    })

    it('should find all entities using a characteristic', async () => {
      const usage = await getEntityUsage('characteristics', 'ag')

      // ag (Agilité) is used by:
      // - skills: athletics, stealth
      expect(usage.skills).toHaveLength(2)
      expect(usage.skills.some(s => s.id === 'athletics')).toBe(true)
      expect(usage.skills.some(s => s.id === 'stealth')).toBe(true)
    })

    it('should find all entities using a career', async () => {
      const usage = await getEntityUsage('careers', 'soldier')

      // soldier career is used by:
      // - careerLevels: soldier-1, soldier-2
      expect(usage.careerLevels).toHaveLength(2)
    })

    it('should find all entities using a class', async () => {
      const usage = await getEntityUsage('classes', 'warriors')

      // warriors class is used by:
      // - careers: soldier
      expect(usage.careers).toHaveLength(1)
      expect(usage.careers[0].id).toBe('soldier')
    })

    it('should find all entities using a trapping', async () => {
      const usage = await getEntityUsage('trappings', 'sword')

      // sword is used by:
      // - careerLevels: soldier-1
      // - classes: warriors
      // - creatures: goblin
      expect(usage.careerLevels).toHaveLength(1)
      expect(usage.classes).toHaveLength(1)
      expect(usage.creatures).toHaveLength(1)
    })

    it('should find all entities using a quality', async () => {
      const usage = await getEntityUsage('qualities', 'metal')

      // metal quality is used by:
      // - trappings: sword, armor
      expect(usage.trappings).toHaveLength(2)
      expect(usage.trappings.some(t => t.id === 'sword')).toBe(true)
      expect(usage.trappings.some(t => t.id === 'armor')).toBe(true)
    })

    it('should find all entities using a lore', async () => {
      const usage = await getEntityUsage('lores', 'fire')

      // fire lore is used by:
      // - spells: fireball, flame-wall
      expect(usage.spells).toHaveLength(2)
      expect(usage.spells.some(s => s.id === 'fireball')).toBe(true)
      expect(usage.spells.some(s => s.id === 'flame-wall')).toBe(true)
    })

    it('should find all entities using a magick domain', async () => {
      const usage = await getEntityUsage('magicks', 'arcane')

      // arcane magick is used by:
      // - lores: fire
      expect(usage.lores).toHaveLength(1)
      expect(usage.lores[0].id).toBe('fire')
    })

    it('should find all entities using a trait', async () => {
      const usage = await getEntityUsage('traits', 'night-vision')

      // night-vision is used by:
      // - creatures: goblin
      expect(usage.creatures).toHaveLength(1)
      expect(usage.creatures[0].id).toBe('goblin')
    })

    it('should return empty object for unused entity', async () => {
      // Add an unused skill
      await db.skills.add({ id: 'unused-skill', label: 'Unused Skill' })

      const usage = await getEntityUsage('skills', 'unused-skill')

      expect(Object.keys(usage)).toHaveLength(0)
    })

    it('should cache results', async () => {
      const usage1 = await getEntityUsage('skills', 'athletics')
      const usage2 = await getEntityUsage('skills', 'athletics')

      // Should be same reference (cached)
      expect(usage1).toBe(usage2)
    })

    it('should skip cache when requested', async () => {
      const usage1 = await getEntityUsage('skills', 'athletics')
      const usage2 = await getEntityUsage('skills', 'athletics', { skipCache: true })

      // Should be different references
      expect(usage1).not.toBe(usage2)
      // But same content
      expect(usage1.careerLevels?.length).toBe(usage2.careerLevels?.length)
    })

    it('should provide performance metrics when benchmarking', async () => {
      const result = await getEntityUsage('skills', 'athletics', { benchmark: true })

      expect(result._performance).toBeDefined()
      expect(result._performance.queryTime).toBeGreaterThanOrEqual(0)
      expect(result._performance.cacheHit).toBeDefined()
    })

    it('should handle bidirectional relationships', async () => {
      // If skill is used by talent (via addSkill), talent should appear in usage
      const usage = await getEntityUsage('skills', 'combat')

      expect(usage.talents).toHaveLength(1)
      expect(usage.talents[0].id).toBe('strike-mighty')
    })
  })

  describe('getEntityUsageStats', () => {
    it('should return usage statistics', async () => {
      const stats = await getEntityUsageStats('skills', 'athletics')

      expect(stats.counts).toBeDefined()
      expect(stats.counts.careerLevels).toBe(2)
      expect(stats.counts.species).toBe(1)
      expect(stats.total).toBe(3)
      expect(stats.canDelete).toBe(false)
    })

    it('should indicate entity can be deleted when unused', async () => {
      await db.skills.add({ id: 'unused', label: 'Unused' })

      const stats = await getEntityUsageStats('skills', 'unused')

      expect(stats.total).toBe(0)
      expect(stats.canDelete).toBe(true)
    })

    it('should count unique references', async () => {
      // Even if skill appears in multiple arrays in same entity,
      // it should only count that entity once
      const stats = await getEntityUsageStats('trappings', 'sword')

      // sword is in careerLevels, classes, creatures
      expect(stats.total).toBe(3)
    })
  })

  describe('getEntityUsageBatch', () => {
    it('should get usage for multiple entities', async () => {
      const batchUsage = await getEntityUsageBatch('skills', ['athletics', 'combat', 'stealth'])

      expect(Object.keys(batchUsage)).toHaveLength(3)
      expect(batchUsage.athletics).toBeDefined()
      expect(batchUsage.combat).toBeDefined()
      expect(batchUsage.stealth).toBeDefined()
    })

    it('should process requests in parallel', async () => {
      const start = Date.now()
      await getEntityUsageBatch('skills', ['athletics', 'combat', 'stealth', 'leadership'])
      const duration = Date.now() - start

      // Should be reasonably fast (< 500ms for 4 queries)
      expect(duration).toBeLessThan(500)
    })
  })

  describe('findOrphanedEntities', () => {
    it('should find unused entities', async () => {
      // Add some unused skills
      await db.skills.bulkAdd([
        { id: 'orphan1', label: 'Orphan 1' },
        { id: 'orphan2', label: 'Orphan 2' }
      ])

      const orphans = await findOrphanedEntities('skills', { limit: 10 })

      expect(orphans.length).toBeGreaterThanOrEqual(2)
      expect(orphans.some(o => o.id === 'orphan1')).toBe(true)
      expect(orphans.some(o => o.id === 'orphan2')).toBe(true)
    })

    it('should respect limit parameter', async () => {
      // Add many unused entities
      await db.skills.bulkAdd([
        { id: 'orphan1', label: 'Orphan 1' },
        { id: 'orphan2', label: 'Orphan 2' },
        { id: 'orphan3', label: 'Orphan 3' },
        { id: 'orphan4', label: 'Orphan 4' },
        { id: 'orphan5', label: 'Orphan 5' }
      ])

      const orphans = await findOrphanedEntities('skills', { limit: 2 })

      expect(orphans.length).toBeLessThanOrEqual(2)
    })

    it('should return empty array when all entities are used', async () => {
      const orphans = await findOrphanedEntities('careers', { limit: 10 })

      // All careers should be referenced by careerLevels
      expect(orphans).toHaveLength(0)
    })
  })

  describe('Performance', () => {
    it('should query in under 100ms for typical usage', async () => {
      const start = performance.now()
      await getEntityUsage('skills', 'athletics')
      const duration = performance.now() - start

      // Target: < 100ms
      expect(duration).toBeLessThan(100)
    })

    it('should handle large result sets efficiently', async () => {
      // Add many career levels using the same skill
      const manyLevels = []
      for (let i = 0; i < 100; i++) {
        manyLevels.push({
          id: `level-${i}`,
          label: `Level ${i}`,
          career: 'soldier',
          level: i + 1,
          skills: ['athletics']
        })
      }
      await db.careerLevels.bulkAdd(manyLevels)

      const start = performance.now()
      const usage = await getEntityUsage('skills', 'athletics')
      const duration = performance.now() - start

      expect(usage.careerLevels.length).toBeGreaterThan(100)
      // Should still be reasonably fast even with large result set
      expect(duration).toBeLessThan(200)
    })
  })

  describe('Edge Cases', () => {
    it('should handle entity type with no relationships configured', async () => {
      // Eyes, hairs, stars are not referenced by other entities
      const usage = await getEntityUsage('eyes', 'blue')

      expect(Object.keys(usage)).toHaveLength(0)
    })

    it('should handle non-existent entity type', async () => {
      const usage = await getEntityUsage('nonexistent', 'test')

      expect(Object.keys(usage)).toHaveLength(0)
    })

    it('should handle empty database', async () => {
      await db.delete()
      await db.open()

      const usage = await getEntityUsage('skills', 'test')

      expect(Object.keys(usage)).toHaveLength(0)
    })

    it('should deduplicate results within entity types', async () => {
      // Even if an entity appears multiple times in queries,
      // it should only appear once in results
      const usage = await getEntityUsage('talents', 'tough')

      // tough is in careerLevels and species
      // Each should have unique entries
      expect(usage.careerLevels).toHaveLength(1)
      expect(usage.species).toHaveLength(1)
    })
  })
})
