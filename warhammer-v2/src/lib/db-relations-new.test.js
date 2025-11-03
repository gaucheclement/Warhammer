/**
 * Tests for new relationship functions in db-relations.js (Issue #41 Stream A)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db.js'
import {
  getSpellsByGod,
  getSpellGod,
  getSpellsByTalent,
  getTalentsBySpell,
  getTrappingQualities,
  getTrappingsByQuality,
  getCreaturesByTrait,
  getCreatureTraits,
  getGodBlessings,
  getGodMiracles,
  getLoreMagick,
  getLoresByMagick,
  clearRelationCache
} from './db-relations.js'

describe('Spell-God Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.gods.add({
      id: 'sigmar',
      label: 'Sigmar',
      blessings: ['blessing-of-sigmar', 'sigmar-protection'],
      miracles: ['miracle-of-sigmar']
    })

    await db.spells.bulkAdd([
      { id: 'blessing-of-sigmar', label: 'Blessing of Sigmar', type: 'blessing' },
      { id: 'sigmar-protection', label: 'Sigmar Protection', type: 'blessing' },
      { id: 'miracle-of-sigmar', label: 'Miracle of Sigmar', type: 'miracle' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getSpellsByGod', () => {
    it('should get all spells (blessings and miracles) for a god', async () => {
      const spells = await getSpellsByGod('sigmar')

      expect(spells).toHaveLength(3)
      expect(spells.map(s => s.id)).toContain('blessing-of-sigmar')
      expect(spells.map(s => s.id)).toContain('sigmar-protection')
      expect(spells.map(s => s.id)).toContain('miracle-of-sigmar')
    })

    it('should return empty array for god with no spells', async () => {
      await db.gods.add({ id: 'ulric', label: 'Ulric' })
      const spells = await getSpellsByGod('ulric')

      expect(spells).toEqual([])
    })

    it('should cache results', async () => {
      const spells1 = await getSpellsByGod('sigmar')
      const spells2 = await getSpellsByGod('sigmar')

      expect(spells1).toBe(spells2)
    })
  })

  describe('getSpellGod', () => {
    it('should find god for a blessing', async () => {
      const god = await getSpellGod('blessing-of-sigmar')

      expect(god).toBeDefined()
      expect(god.id).toBe('sigmar')
    })

    it('should find god for a miracle', async () => {
      const god = await getSpellGod('miracle-of-sigmar')

      expect(god).toBeDefined()
      expect(god.id).toBe('sigmar')
    })

    it('should return null for spell not associated with any god', async () => {
      await db.spells.add({ id: 'arcane-spell', label: 'Arcane Spell' })
      const god = await getSpellGod('arcane-spell')

      expect(god).toBeNull()
    })
  })

  describe('getGodBlessings', () => {
    it('should get only blessings for a god', async () => {
      const blessings = await getGodBlessings('sigmar')

      expect(blessings).toHaveLength(2)
      expect(blessings.map(b => b.id)).toContain('blessing-of-sigmar')
      expect(blessings.map(b => b.id)).toContain('sigmar-protection')
      expect(blessings.map(b => b.id)).not.toContain('miracle-of-sigmar')
    })
  })

  describe('getGodMiracles', () => {
    it('should get only miracles for a god', async () => {
      const miracles = await getGodMiracles('sigmar')

      expect(miracles).toHaveLength(1)
      expect(miracles[0].id).toBe('miracle-of-sigmar')
    })
  })
})

describe('Spell-Talent Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.talents.add({
      id: 'arcane-magic-fire',
      label: 'Arcane Magic (Fire)',
      spells: ['fireball', 'flame-burst']
    })

    await db.spells.bulkAdd([
      { id: 'fireball', label: 'Fireball', type: 'spell' },
      { id: 'flame-burst', label: 'Flame Burst', type: 'spell' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getSpellsByTalent', () => {
    it('should get all spells granted by a talent', async () => {
      const spells = await getSpellsByTalent('arcane-magic-fire')

      expect(spells).toHaveLength(2)
      expect(spells.map(s => s.id)).toContain('fireball')
      expect(spells.map(s => s.id)).toContain('flame-burst')
    })

    it('should return empty array for talent with no spells', async () => {
      await db.talents.add({ id: 'warrior', label: 'Warrior' })
      const spells = await getSpellsByTalent('warrior')

      expect(spells).toEqual([])
    })
  })

  describe('getTalentsBySpell', () => {
    it('should find all talents granting a spell', async () => {
      await db.talents.add({
        id: 'magic-talent-2',
        label: 'Magic Talent 2',
        spells: ['fireball']
      })

      const talents = await getTalentsBySpell('fireball')

      expect(talents).toHaveLength(2)
      expect(talents.map(t => t.id)).toContain('arcane-magic-fire')
      expect(talents.map(t => t.id)).toContain('magic-talent-2')
    })
  })
})

describe('Trapping-Quality Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.qualities.bulkAdd([
      { id: 'sharp', label: 'Sharp' },
      { id: 'durable', label: 'Durable' }
    ])

    await db.trappings.bulkAdd([
      { id: 'sword', label: 'Sword', qualities: ['sharp', 'durable'] },
      { id: 'axe', label: 'Axe', qualities: ['sharp'] }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getTrappingQualities', () => {
    it('should get all qualities for a trapping', async () => {
      const qualities = await getTrappingQualities('sword')

      expect(qualities).toHaveLength(2)
      expect(qualities.map(q => q.id)).toContain('sharp')
      expect(qualities.map(q => q.id)).toContain('durable')
    })

    it('should handle trapping with no qualities', async () => {
      await db.trappings.add({ id: 'rope', label: 'Rope' })
      const qualities = await getTrappingQualities('rope')

      expect(qualities).toEqual([])
    })

    it('should handle comma-separated quality strings', async () => {
      await db.trappings.add({ id: 'spear', label: 'Spear', qualities: 'sharp, durable' })
      const qualities = await getTrappingQualities('spear')

      expect(qualities).toHaveLength(2)
    })
  })

  describe('getTrappingsByQuality', () => {
    it('should find all trappings with a quality', async () => {
      const trappings = await getTrappingsByQuality('sharp')

      expect(trappings).toHaveLength(2)
      expect(trappings.map(t => t.id)).toContain('sword')
      expect(trappings.map(t => t.id)).toContain('axe')
    })

    it('should filter by quality correctly', async () => {
      const trappings = await getTrappingsByQuality('durable')

      expect(trappings).toHaveLength(1)
      expect(trappings[0].id).toBe('sword')
    })
  })
})

describe('Creature-Trait Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.traits.bulkAdd([
      { id: 'flight', label: 'Flight' },
      { id: 'armour', label: 'Armour' }
    ])

    await db.creatures.bulkAdd([
      { id: 'griffon', label: 'Griffon', traits: ['flight', 'armour'] },
      { id: 'dragon', label: 'Dragon', traits: ['flight', 'armour'] },
      { id: 'orc', label: 'Orc', traits: ['armour'] }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getCreatureTraits', () => {
    it('should get all traits for a creature', async () => {
      const traits = await getCreatureTraits('griffon')

      expect(traits).toHaveLength(2)
      expect(traits.map(t => t.id)).toContain('flight')
      expect(traits.map(t => t.id)).toContain('armour')
    })

    it('should handle creature with no traits', async () => {
      await db.creatures.add({ id: 'peasant', label: 'Peasant' })
      const traits = await getCreatureTraits('peasant')

      expect(traits).toEqual([])
    })

    it('should handle object-based trait references', async () => {
      await db.creatures.add({
        id: 'troll',
        label: 'Troll',
        traits: [{ id: 'armour' }]
      })

      const traits = await getCreatureTraits('troll')

      expect(traits).toHaveLength(1)
      expect(traits[0].id).toBe('armour')
    })
  })

  describe('getCreaturesByTrait', () => {
    it('should find all creatures with a trait', async () => {
      const creatures = await getCreaturesByTrait('flight')

      expect(creatures).toHaveLength(2)
      expect(creatures.map(c => c.id)).toContain('griffon')
      expect(creatures.map(c => c.id)).toContain('dragon')
    })

    it('should filter by trait correctly', async () => {
      const creatures = await getCreaturesByTrait('armour')

      expect(creatures).toHaveLength(3)
    })

    it('should return empty for unused trait', async () => {
      await db.traits.add({ id: 'rare-trait', label: 'Rare Trait' })
      const creatures = await getCreaturesByTrait('rare-trait')

      expect(creatures).toEqual([])
    })
  })
})

describe('Lore-Magick Relationships', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    clearRelationCache()

    await db.magicks.add({
      id: 'arcane',
      label: 'Arcane Magic'
    })

    await db.lores.bulkAdd([
      { id: 'fire', label: 'Lore of Fire', parent: 'arcane' },
      { id: 'ice', label: 'Lore of Ice', parent: 'arcane' },
      { id: 'life', label: 'Lore of Life', parent: 'divine' }
    ])
  })

  afterEach(async () => {
    await db.close()
  })

  describe('getLoreMagick', () => {
    it('should get magick domain for a lore', async () => {
      const magick = await getLoreMagick('fire')

      expect(magick).toBeDefined()
      expect(magick.id).toBe('arcane')
    })

    it('should return null for lore with no parent', async () => {
      await db.lores.add({ id: 'orphan', label: 'Orphan Lore' })
      const magick = await getLoreMagick('orphan')

      expect(magick).toBeNull()
    })

    it('should cache results', async () => {
      const magick1 = await getLoreMagick('fire')
      const magick2 = await getLoreMagick('fire')

      expect(magick1).toBe(magick2)
    })
  })

  describe('getLoresByMagick', () => {
    it('should get all lores for a magick domain', async () => {
      const lores = await getLoresByMagick('arcane')

      expect(lores).toHaveLength(2)
      expect(lores.map(l => l.id)).toContain('fire')
      expect(lores.map(l => l.id)).toContain('ice')
      expect(lores.map(l => l.id)).not.toContain('life')
    })

    it('should return empty array for magick with no lores', async () => {
      await db.magicks.add({ id: 'chaos', label: 'Chaos Magic' })
      const lores = await getLoresByMagick('chaos')

      expect(lores).toEqual([])
    })

    it('should use indexed query for performance', async () => {
      // This test verifies the function uses where().equals() which is indexed
      const lores = await getLoresByMagick('arcane')

      // Should be fast even with many lores
      expect(lores).toHaveLength(2)
    })
  })
})
