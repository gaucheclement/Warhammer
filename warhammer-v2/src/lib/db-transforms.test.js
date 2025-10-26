/**
 * Comprehensive tests for db-transforms.js - Data transformation and parsing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db.js'
import {
  toId,
  createElem,
  getLabelForElem,
  getLabelForData,
  stringToElems,
  bindElem,
  formatComplexElem,
  parseSpecs,
  transformCareer,
  transformTalent,
  transformSkill,
  transformSpell,
  transformCareerLevel,
  transform,
  validate,
  eachElem,
  flattenElemIteratively
} from './db-transforms.js'

describe('ID Normalization', () => {
  describe('toId', () => {
    it('should convert to lowercase', () => {
      expect(toId('Combat')).toBe('combat')
      expect(toId('MAGIC')).toBe('magic')
    })

    it('should remove accents', () => {
      expect(toId('Équitation')).toBe('equitation')
      expect(toId('Magie Mineure')).toBe('magie-mineure')
      expect(toId('Épée')).toBe('epee')
    })

    it('should replace spaces with dashes', () => {
      expect(toId('Magie Mineure')).toBe('magie-mineure')
      expect(toId('Combat à Distance')).toBe('combat-a-distance')
    })

    it('should remove special characters', () => {
      expect(toId('Cavalier (Nain)')).toBe('cavalier-nain')
      expect(toId('Art (Métier)')).toBe('art-metier')
    })

    it('should handle multiple dashes', () => {
      expect(toId('Test  -  Value')).toBe('test-value')
    })

    it('should handle empty string', () => {
      expect(toId('')).toBe('')
      expect(toId(null)).toBe('')
    })
  })
})

describe('Element Creation', () => {
  describe('createElem', () => {
    it('should create basic element structure', () => {
      const elem = createElem('Combat')

      expect(elem).toHaveProperty('label', 'Combat')
      expect(elem).toHaveProperty('specs', [])
      expect(elem).toHaveProperty('suffix', '')
      expect(elem).toHaveProperty('prefix', '')
      expect(elem).toHaveProperty('original')
    })

    it('should create element with specs', () => {
      const elem = createElem('Combat', ['Épée', 'Hache'])

      expect(elem.specs).toEqual(['Épée', 'Hache'])
      expect(elem.original).toBe('Combat (Épée ou Hache)')
    })

    it('should create element with suffix', () => {
      const elem = createElem('Combat', [], '+2')

      expect(elem.suffix).toBe('+2')
      expect(elem.original).toBe('+2 Combat')
    })

    it('should create element with prefix', () => {
      const elem = createElem('Combat', [], '', 'Expert')

      expect(elem.prefix).toBe('Expert')
      expect(elem.original).toBe('Combat Expert')
    })

    it('should handle empty parameters', () => {
      const elem = createElem()

      expect(elem.label).toBe('')
      expect(elem.specs).toEqual([])
      expect(elem.original).toBe('')
    })
  })
})

describe('Label Generation', () => {
  describe('getLabelForElem', () => {
    it('should format simple label', () => {
      const elem = { label: 'Combat' }
      expect(getLabelForElem(elem)).toBe('Combat')
    })

    it('should format label with single spec', () => {
      const elem = { label: 'Combat', spec: 'Épée' }
      expect(getLabelForElem(elem)).toBe('Combat (Épée)')
    })

    it('should format label with specs array', () => {
      const elem = { label: 'Combat', specs: ['Épée', 'Hache'] }
      expect(getLabelForElem(elem)).toBe('Combat (Épée ou Hache)')
    })

    it('should format label with suffix', () => {
      const elem = { label: 'Combat', suffix: '+2' }
      expect(getLabelForElem(elem)).toBe('+2 Combat')
    })

    it('should format label with prefix', () => {
      const elem = { label: 'Combat', prefix: 'Expert' }
      expect(getLabelForElem(elem)).toBe('Combat Expert')
    })

    it('should format label with all components', () => {
      const elem = {
        label: 'Combat',
        suffix: '+2',
        specs: ['Épée'],
        prefix: 'Expert'
      }
      expect(getLabelForElem(elem)).toBe('+2 Combat (Épée) Expert')
    })

    it('should handle empty element', () => {
      expect(getLabelForElem(null)).toBe('')
      expect(getLabelForElem({})).toBe('')
    })

    it('should handle specs as string (legacy format)', () => {
      const elem = { label: 'Combat', specs: 'Épée' }
      expect(getLabelForElem(elem)).toBe('Combat (Épée)')
    })
  })

  describe('getLabelForData', () => {
    it('should format data label', () => {
      const data = { label: 'Magie' }
      expect(getLabelForData(data)).toBe('Magie')
    })

    it('should format label with suffix', () => {
      const data = { label: 'Magie', suffix: 'Arcane' }
      expect(getLabelForData(data)).toBe('Arcane Magie')
    })

    it('should format label with prefix', () => {
      const data = { label: 'Combat', prefix: 'Maître' }
      expect(getLabelForData(data)).toBe('Combat Maître')
    })

    it('should format label with abbreviation', () => {
      const data = { label: 'Magie', abr: 'MA' }
      expect(getLabelForData(data)).toBe('Magie (MA)')
    })

    it('should format label with specName', () => {
      const data = { label: 'Combat', specName: 'Au choix' }
      expect(getLabelForData(data)).toBe('Combat (Au choix)')
    })

    it('should format label with title', () => {
      const data = { label: 'Talent', title: 'Description' }
      expect(getLabelForData(data)).toBe('Talent - Description')
    })

    it('should handle empty data', () => {
      expect(getLabelForData(null)).toBe('')
      expect(getLabelForData({})).toBe('')
    })
  })
})

describe('Spec Parsing', () => {
  describe('parseSpecs', () => {
    it('should parse comma-separated specs', () => {
      expect(parseSpecs('Savoir, Métier, Artisanat')).toEqual(['Savoir', 'Métier', 'Artisanat'])
    })

    it('should trim whitespace', () => {
      expect(parseSpecs('Combat , Tir , Magie')).toEqual(['Combat', 'Tir', 'Magie'])
    })

    it('should handle single spec', () => {
      expect(parseSpecs('Combat')).toEqual(['Combat'])
    })

    it('should handle empty string', () => {
      expect(parseSpecs('')).toEqual([])
      expect(parseSpecs(null)).toEqual([])
    })

    it('should pass through arrays unchanged', () => {
      const arr = ['Already', 'Array']
      expect(parseSpecs(arr)).toBe(arr)
    })

    it('should filter out empty specs', () => {
      expect(parseSpecs('Combat, , Tir')).toEqual(['Combat', 'Tir'])
    })
  })
})

describe('String Parsing', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    // Set up test data
    await db.skills.bulkAdd([
      { id: 'combat', label: 'Combat' },
      { id: 'combat-arme-a-une-main', label: 'Combat', specs: ['Arme à une main'] },
      { id: 'athletisme', label: 'Athlétisme' }
    ])

    await db.talents.bulkAdd([
      { id: 'ambidextre', label: 'Ambidextre' },
      { id: 'combat-au-contact', label: 'Combat au Contact' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('stringToElems', () => {
    it('should parse simple string', async () => {
      const result = await stringToElems(db, 'Combat', null, 'skill', true)

      expect(result.label).toBe('Combat')
      expect(result.data).toBeDefined()
      expect(result.data.id).toBe('combat')
    })

    it('should parse string with specs', async () => {
      const result = await stringToElems(db, 'Combat (Arme à une main)', null, 'skill', true)

      expect(result.label).toBe('Combat')
      expect(result.specs).toContain('Arme à une main')
    })

    it('should parse string with suffix', async () => {
      const result = await stringToElems(db, '+2 Combat', null, 'skill', true)

      expect(result.label).toBe('Combat')
      expect(result.suffix).toBe('+2')
    })

    it('should parse string with prefix', async () => {
      const result = await stringToElems(db, 'Combat +2', null, 'skill', true)

      expect(result.label).toBe('Combat')
      expect(result.prefix).toBe('+2')
    })

    it('should parse multiple elements separated by comma', async () => {
      const result = await stringToElems(db, 'Combat, Athlétisme', null, 'skill', false)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result[0].label).toBe('Combat')
      expect(result[1].label).toBe('Athlétisme')
    })

    it('should parse alternatives separated by "ou"', async () => {
      const result = await stringToElems(db, 'Combat ou Athlétisme', null, 'skill', false)

      expect(Array.isArray(result[0])).toBe(true) // First element is array of alternatives
      expect(result[0]).toHaveLength(2)
    })

    it('should return empty for empty string', async () => {
      const result = await stringToElems(db, '', null, 'skill', true)
      expect(result).toBe('')
    })

    it('should return empty array for empty string when not "one"', async () => {
      const result = await stringToElems(db, '', null, 'skill', false)
      expect(result).toEqual([])
    })

    it('should track origin from source object', async () => {
      const from = { id: 'source-id' }
      const result = await stringToElems(db, 'Combat', from, 'skill', true)

      expect(result.origins).toContain('source-id')
    })
  })

  describe('bindElem', () => {
    it('should bind element to database data', async () => {
      const elem = createElem('Combat')
      await bindElem(db, elem, null, 'skill')

      expect(elem.data).toBeDefined()
      expect(elem.data.id).toBe('combat')
    })

    it('should set typeItem', async () => {
      const elem = createElem('Combat')
      await bindElem(db, elem, null, 'skill')

      expect(elem.typeItem).toBe('skill')
    })
  })

  describe('formatComplexElem', () => {
    it('should format and resolve element', async () => {
      const elem = createElem('Combat', ['Arme à une main'])
      await formatComplexElem(db, elem, 'skill', null)

      expect(elem.data).toBeDefined()
      expect(elem.id).toBe('combat')
    })

    it('should try spec variations', async () => {
      const elem = createElem('Combat', ['Arme à une main'])
      await formatComplexElem(db, elem, 'skill', null)

      // Should find either combat or combat-arme-a-une-main
      expect(elem.data).toBeDefined()
    })

    it('should add helper methods', async () => {
      const elem = createElem('Combat')
      await formatComplexElem(db, elem, 'skill', null)

      expect(typeof elem.getLabel).toBe('function')
      expect(typeof elem.getData).toBe('function')
    })
  })
})

describe('Type-Specific Transformations', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()

    // Set up test data
    await db.classes.add({ id: 'warriors', label: 'Guerriers' })
    await db.characteristics.add({ id: 'ag', label: 'Agilité', abr: 'Ag' })
    await db.skills.add({ id: 'navigation', label: 'Navigation', characteristic: 'ag' })
    await db.talents.add({ id: 'arcane-magic', label: 'Magie Arcane' })
    await db.careers.add({ id: 'soldier', label: 'Soldat', class: 'warriors' })
  })

  afterEach(async () => {
    await db.close()
  })

  describe('transformCareer', () => {
    it('should transform career with class reference', async () => {
      const career = {
        id: 'warrior',
        label: 'Guerrier',
        class: 'warriors'
      }

      const result = await transformCareer(db, career)

      expect(result.classData).toBeDefined()
      expect(result.classData.id).toBe('warriors')
    })

    it('should handle career without class', async () => {
      const career = {
        id: 'test',
        label: 'Test'
      }

      const result = await transformCareer(db, career)
      expect(result).toBe(career)
    })

    it('should handle null career', async () => {
      const result = await transformCareer(db, null)
      expect(result).toBeNull()
    })
  })

  describe('transformTalent', () => {
    it('should parse specs', async () => {
      const talent = {
        id: 'test',
        label: 'Test',
        specs: 'Combat, Tir, Magie'
      }

      const result = await transformTalent(db, talent)

      expect(result.specs).toEqual(['Combat', 'Tir', 'Magie'])
      expect(result.canHaveSpec).toBe(true)
    })

    it('should handle empty specs', async () => {
      const talent = {
        id: 'test',
        label: 'Test',
        specs: ''
      }

      const result = await transformTalent(db, talent)

      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
    })

    it('should resolve addSkill reference', async () => {
      const talent = {
        id: 'sailor',
        label: 'Marin',
        addSkill: 'navigation'
      }

      const result = await transformTalent(db, talent)

      expect(result.addSkillData).toBeDefined()
      expect(result.addSkillData.id).toBe('navigation')
    })

    it('should resolve addTalent reference', async () => {
      const talent = {
        id: 'magic',
        label: 'Magie',
        addTalent: 'arcane-magic'
      }

      const result = await transformTalent(db, talent)

      expect(result.addTalentData).toBeDefined()
      expect(result.addTalentData.id).toBe('arcane-magic')
    })

    it('should initialize empty origins and spec', async () => {
      const talent = {
        id: 'test',
        label: 'Test'
      }

      const result = await transformTalent(db, talent)

      expect(result.origins).toEqual([])
      expect(result.spec).toBe('')
    })
  })

  describe('transformSkill', () => {
    it('should parse specs', async () => {
      const skill = {
        id: 'test',
        label: 'Test',
        specs: 'Savoir, Métier'
      }

      const result = await transformSkill(db, skill)

      expect(result.specs).toEqual(['Savoir', 'Métier'])
      expect(result.canHaveSpec).toBe(true)
      expect(result.specName).toBe('Au choix')
    })

    it('should handle empty specs', async () => {
      const skill = {
        id: 'test',
        label: 'Test',
        specs: ''
      }

      const result = await transformSkill(db, skill)

      expect(result.specs).toEqual([])
      expect(result.canHaveSpec).toBe(false)
      expect(result.specName).toBe('')
    })

    it('should resolve characteristic reference', async () => {
      const skill = {
        id: 'athleticism',
        label: 'Athlétisme',
        characteristic: 'ag'
      }

      const result = await transformSkill(db, skill)

      expect(result.characteristicData).toBeDefined()
      expect(result.characteristicData.id).toBe('ag')
    })
  })

  describe('transformSpell', () => {
    it('should handle spell transformation', async () => {
      const spell = {
        id: 'fireball',
        label: 'Boule de Feu',
        type: 'arcane',
        cn: '5'
      }

      const result = await transformSpell(db, spell)

      expect(result).toBe(spell)
    })

    it('should handle null spell', async () => {
      const result = await transformSpell(db, null)
      expect(result).toBeNull()
    })
  })

  describe('transformCareerLevel', () => {
    it('should transform career level', async () => {
      const careerLevel = {
        id: 'soldier-1',
        label: 'Recrue',
        career: 'soldier'
      }

      const result = await transformCareerLevel(db, careerLevel)

      expect(result).toBe(careerLevel)
    })

    it('should handle null career level', async () => {
      const result = await transformCareerLevel(db, null)
      expect(result).toBeNull()
    })
  })

  describe('transform (master function)', () => {
    it('should route to correct type-specific transformer', async () => {
      const talent = {
        id: 'test',
        label: 'Test',
        specs: 'Combat'
      }

      const result = await transform(db, talent, 'talent')

      expect(result.specs).toEqual(['Combat'])
    })

    it('should handle unknown type', async () => {
      const data = { id: 'test', label: 'Test' }
      const result = await transform(db, data, 'unknown')

      expect(result).toBe(data)
    })

    it('should handle null data', async () => {
      const result = await transform(db, null, 'talent')
      expect(result).toBeNull()
    })
  })
})

describe('Validation', () => {
  describe('validate', () => {
    it('should validate talent with required fields', () => {
      const talent = {
        id: 'ambidextre',
        label: 'Ambidextre',
        specs: []
      }

      const result = validate(talent, 'talent')

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should detect missing id', () => {
      const talent = {
        label: 'Missing ID'
      }

      const result = validate(talent, 'talent')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing required field: id')
    })

    it('should detect missing label', () => {
      const talent = {
        id: 'test'
      }

      const result = validate(talent, 'talent')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing required field: label')
    })

    it('should validate career requires class', () => {
      const career = {
        id: 'test',
        label: 'Test'
      }

      const result = validate(career, 'career')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Career must have a class')
    })

    it('should validate skill requires characteristic', () => {
      const skill = {
        id: 'test',
        label: 'Test'
      }

      const result = validate(skill, 'skill')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Skill must have a characteristic')
    })

    it('should validate talent specs must be array', () => {
      const talent = {
        id: 'test',
        label: 'Test',
        specs: 'Not an array'
      }

      const result = validate(talent, 'talent')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Talent specs must be an array')
    })

    it('should validate career level requires career and careerLevel', () => {
      const cl = {
        id: 'test',
        label: 'Test'
      }

      const result = validate(cl, 'careerLevel')

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle null data', () => {
      const result = validate(null, 'talent')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Data is null or undefined')
    })
  })
})

describe('Utility Functions', () => {
  describe('eachElem', () => {
    it('should iterate over single element', () => {
      const elem = { id: 'test' }
      const results = []

      eachElem(elem, (e) => results.push(e.id))

      expect(results).toEqual(['test'])
    })

    it('should iterate over array', () => {
      const elems = [{ id: '1' }, { id: '2' }, { id: '3' }]
      const results = []

      eachElem(elems, (e) => results.push(e.id))

      expect(results).toEqual(['1', '2', '3'])
    })

    it('should handle null input', () => {
      const results = []
      eachElem(null, (e) => results.push(e))

      expect(results).toEqual([])
    })
  })

  describe('flattenElemIteratively', () => {
    it('should flatten tree structure', () => {
      const tree = {
        id: 'root',
        label: 'Root',
        children: [
          {
            id: 'child1',
            label: 'Child 1',
            children: [
              { id: 'grandchild1', label: 'Grandchild 1', children: [] }
            ]
          },
          {
            id: 'child2',
            label: 'Child 2',
            children: []
          }
        ]
      }

      const flattened = flattenElemIteratively(tree)

      expect(flattened).toHaveLength(4) // root + 2 children + 1 grandchild
      expect(flattened[0].level).toBe(0) // root
      expect(flattened[1].level).toBe(1) // child1
      expect(flattened[2].level).toBe(2) // grandchild1
      expect(flattened[3].level).toBe(1) // child2
    })

    it('should handle tree without children', () => {
      const tree = {
        id: 'single',
        label: 'Single Node'
      }

      const flattened = flattenElemIteratively(tree)

      expect(flattened).toHaveLength(1)
      expect(flattened[0].id).toBe('single')
      expect(flattened[0].level).toBe(0)
    })

    it('should apply condition filter', () => {
      const tree = {
        id: 'root',
        type: 'folder',
        children: [
          { id: 'child1', type: 'file', children: [] },
          { id: 'child2', type: 'folder', children: [] }
        ]
      }

      const flattened = flattenElemIteratively(tree, (node) => node.type === 'folder')

      expect(flattened).toHaveLength(2) // Only root and child2
      expect(flattened.map(n => n.id)).toEqual(['root', 'child2'])
    })
  })
})
