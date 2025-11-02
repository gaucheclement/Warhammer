/**
 * Character Model Tests
 *
 * Unit tests for character data model and factory functions
 */

import { describe, it, expect } from 'vitest'
import {
  createEmptyCharacter,
  createCharacterFromSpecies,
  applyCareerToCharacter,
  calculateDerivedStats,
  cloneCharacter,
  addSkillToCharacter,
  addTalentToCharacter,
  addSpellToCharacter,
  addTrappingToCharacter,
  removeSkillFromCharacter,
  removeTalentFromCharacter,
  removeSpellFromCharacter,
  removeTrappingFromCharacter,
  updateCharacterXP,
  spendCharacterXP
} from '../characterModel.js'

describe('characterModel', () => {
  describe('createEmptyCharacter', () => {
    it('should create empty character with default values', () => {
      const character = createEmptyCharacter()

      expect(character.name).toBe('')
      expect(character.species.id).toBeNull()
      expect(character.career.id).toBeNull()
      expect(character.characteristics.WS).toBe(0)
      expect(Array.isArray(character.skills)).toBe(true)
      expect(Array.isArray(character.talents)).toBe(true)
      expect(Array.isArray(character.spells)).toBe(true)
      expect(Array.isArray(character.trappings)).toBe(true)
      expect(character.experience.total).toBe(0)
      expect(character.wounds.max).toBe(0)
      expect(character.isDraft).toBe(false)
    })
  })

  describe('createCharacterFromSpecies', () => {
    it('should create character with species data', () => {
      const species = {
        id: 'human',
        name: 'Human',
        characteristics: {
          WS: 20,
          BS: 20,
          S: 20,
          T: 20,
          I: 20,
          Ag: 20,
          Dex: 20,
          Int: 20,
          WP: 20,
          Fel: 20,
          M: 4
        },
        skills: ['Animal Care', 'Charm'],
        talents: ['Savvy']
      }

      const character = createCharacterFromSpecies(species)

      expect(character.species.id).toBe('human')
      expect(character.species.name).toBe('Human')
      expect(character.characteristics.WS).toBe(20)
      expect(character.characteristics.M).toBe(4)
      expect(character.skills).toHaveLength(2)
      expect(character.talents).toHaveLength(1)
    })
  })

  describe('applyCareerToCharacter', () => {
    it('should apply career data to character', () => {
      const character = createEmptyCharacter()
      const career = {
        id: 'warrior',
        name: 'Warrior',
        class: 'Fighter'
      }

      applyCareerToCharacter(character, career)

      expect(character.career.id).toBe('warrior')
      expect(character.career.name).toBe('Warrior')
      expect(character.career.level).toBe(1)
    })
  })

  describe('calculateDerivedStats', () => {
    it('should calculate derived stats correctly', () => {
      const character = createEmptyCharacter()
      character.characteristics = {
        M: 4,
        WS: 35,
        BS: 30,
        S: 30,
        T: 35,
        I: 32,
        Ag: 28,
        Dex: 30,
        Int: 30,
        WP: 32,
        Fel: 28
      }

      calculateDerivedStats(character)

      // Base wounds = (2 × T Bonus) + WP Bonus + S Bonus
      // T Bonus = 3, WP Bonus = 3, S Bonus = 3
      // Base wounds = (2 × 3) + 3 + 3 = 12
      expect(character.wounds.max).toBe(12)
      expect(character.wounds.current).toBe(12)
    })
  })

  describe('cloneCharacter', () => {
    it('should clone character without ID', () => {
      const original = createEmptyCharacter()
      original.id = 123
      original.name = 'Test Character'
      original.skills = [{ id: 'melee', name: 'Melee', advances: 10 }]

      const clone = cloneCharacter(original, 'Cloned Character')

      expect(clone.id).toBeUndefined()
      expect(clone.name).toBe('Cloned Character')
      expect(clone.skills).toHaveLength(1)
      // Clone should have different timestamp (created field exists and is a valid ISO string)
      expect(clone.created).toBeDefined()
      expect(typeof clone.created).toBe('string')
    })

    it('should add (Copy) suffix when no name provided', () => {
      const original = createEmptyCharacter()
      original.name = 'Test Character'

      const clone2 = cloneCharacter(original)
      expect(clone2.name).toBe('Test Character (Copy)')
    })
  })

  describe('addSkillToCharacter', () => {
    it('should add new skill to character', () => {
      const character = createEmptyCharacter()
      const skill = { id: 'melee', name: 'Melee', characteristic: 'ws' }

      addSkillToCharacter(character, skill, 5)

      expect(character.skills).toHaveLength(1)
      expect(character.skills[0].advances).toBe(5)
    })

    it('should accumulate advances for existing skill', () => {
      const character = createEmptyCharacter()
      const skill = { id: 'melee', name: 'Melee', characteristic: 'ws' }

      // Add skill twice
      addSkillToCharacter(character, skill, 5)
      addSkillToCharacter(character, skill, 3)

      expect(character.skills).toHaveLength(1)
      expect(character.skills[0].advances).toBe(8)
    })
  })

  describe('addTalentToCharacter', () => {
    it('should add new talent to character', () => {
      const character = createEmptyCharacter()
      const talent = { id: 'hardy', name: 'Hardy', description: 'Adds TB to wounds' }

      addTalentToCharacter(character, talent)

      expect(character.talents).toHaveLength(1)
      expect(character.talents[0].times).toBe(1)
    })

    it('should increment times for existing talent', () => {
      const character = createEmptyCharacter()
      const talent = { id: 'hardy', name: 'Hardy', description: 'Adds TB to wounds' }

      // Add same talent twice
      addTalentToCharacter(character, talent)
      addTalentToCharacter(character, talent)

      expect(character.talents).toHaveLength(1)
      expect(character.talents[0].times).toBe(2)
    })
  })

  describe('removeSkillFromCharacter', () => {
    it('should remove skill from character', () => {
      const character = createEmptyCharacter()
      character.skills = [
        { id: 'melee', name: 'Melee', advances: 10 },
        { id: 'ranged', name: 'Ranged', advances: 5 }
      ]

      removeSkillFromCharacter(character, 'melee')

      expect(character.skills).toHaveLength(1)
      expect(character.skills[0].id).toBe('ranged')
    })
  })

  describe('removeTalentFromCharacter', () => {
    it('should decrement times when talent taken multiple times', () => {
      const character = createEmptyCharacter()
      character.talents = [
        { id: 'hardy', name: 'Hardy', times: 2 },
        { id: 'savvy', name: 'Savvy', times: 1 }
      ]

      // Remove one instance of Hardy
      removeTalentFromCharacter(character, 'hardy')

      expect(character.talents).toHaveLength(2)
      expect(character.talents[0].times).toBe(1)
    })

    it('should remove talent completely when times reaches 0', () => {
      const character = createEmptyCharacter()
      character.talents = [
        { id: 'hardy', name: 'Hardy', times: 1 },
        { id: 'savvy', name: 'Savvy', times: 1 }
      ]

      // Remove Hardy (should remove completely)
      removeTalentFromCharacter(character, 'hardy')

      expect(character.talents).toHaveLength(1)
      expect(character.talents[0].id).toBe('savvy')
    })
  })

  describe('updateCharacterXP', () => {
    it('should update character XP and calculate available', () => {
      const character = createEmptyCharacter()
      character.experience.spent = 100

      updateCharacterXP(character, 500)

      expect(character.experience.total).toBe(500)
      expect(character.experience.available).toBe(400)
    })
  })

  describe('spendCharacterXP', () => {
    it('should spend XP when available', () => {
      const character = createEmptyCharacter()
      character.experience.total = 500
      character.experience.spent = 100
      character.experience.available = 400

      spendCharacterXP(character, 50)

      expect(character.experience.spent).toBe(150)
      expect(character.experience.available).toBe(350)
    })

    it('should not spend more than available XP', () => {
      const character = createEmptyCharacter()
      character.experience.total = 500
      character.experience.spent = 100
      character.experience.available = 400

      const oldSpent = character.experience.spent

      // Try to spend more than available
      spendCharacterXP(character, 1000)

      expect(character.experience.spent).toBe(oldSpent)
    })
  })
})
