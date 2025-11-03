/**
 * Character Validation Tests
 *
 * Unit tests for character validation functions
 */

import { describe, it, expect } from 'vitest'
import {
  validateCharacterName,
  validateCharacteristics,
  validateSkillSelection,
  validateTalentPrerequisites,
  validateSpells,
  validateTrappings,
  validateExperience,
  validateCompleteCharacter,
  validateCharacterDraft
} from '../characterValidation.js'

import { createEmptyCharacter } from '../characterModel.js'

describe('characterValidation', () => {
  describe('validateCharacterName', () => {
    it('should accept valid name', () => {
      const validResult = validateCharacterName('Gunther von Liebewitz')
      expect(validResult.valid).toBe(true)
    })

    it('should reject empty name', () => {
      const emptyResult = validateCharacterName('')
      expect(emptyResult.valid).toBe(false)
      expect(emptyResult.errors.length).toBeGreaterThan(0)
    })

    it('should reject name too short', () => {
      const shortResult = validateCharacterName('A')
      expect(shortResult.valid).toBe(false)
    })

    it('should reject name too long', () => {
      const longName = 'A'.repeat(101)
      const longResult = validateCharacterName(longName)
      expect(longResult.valid).toBe(false)
    })

    it('should warn about duplicate names', () => {
      const existingCharacters = [{ name: 'Test Character' }]
      const duplicateResult = validateCharacterName('Test Character', existingCharacters)
      expect(duplicateResult.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('validateCharacteristics', () => {
    it('should accept valid characteristics', () => {
      const validCharacteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      const validResult = validateCharacteristics(validCharacteristics)
      expect(validResult.valid).toBe(true)
    })

    it('should reject missing characteristic', () => {
      const missingResult = validateCharacteristics({ M: 4, WS: 30 })
      expect(missingResult.valid).toBe(false)
    })

    it('should reject out of range value', () => {
      const validCharacteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      const outOfRangeResult = validateCharacteristics({ ...validCharacteristics, WS: 150 })
      expect(outOfRangeResult.valid).toBe(false)
    })

    it('should reject negative value', () => {
      const validCharacteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      const negativeResult = validateCharacteristics({ ...validCharacteristics, S: -10 })
      expect(negativeResult.valid).toBe(false)
    })
  })

  describe('validateSkillSelection', () => {
    it('should accept valid skills', () => {
      const validSkills = [
        { id: 'melee', name: 'Melee', advances: 10, characteristic: 'ws' },
        { id: 'ranged', name: 'Ranged', advances: 5, characteristic: 'bs' }
      ]
      const validResult = validateSkillSelection(validSkills)
      expect(validResult.valid).toBe(true)
    })

    it('should reject missing fields', () => {
      const invalidSkills = [{ id: 'melee' }]
      const invalidResult = validateSkillSelection(invalidSkills)
      expect(invalidResult.valid).toBe(false)
    })

    it('should reject negative advances', () => {
      const negativeSkills = [{ id: 'melee', name: 'Melee', advances: -5 }]
      const negativeResult = validateSkillSelection(negativeSkills)
      expect(negativeResult.valid).toBe(false)
    })

    it('should reject duplicate skills', () => {
      const duplicateSkills = [
        { id: 'melee', name: 'Melee', advances: 10 },
        { id: 'melee', name: 'Melee', advances: 5 }
      ]
      const duplicateResult = validateSkillSelection(duplicateSkills)
      expect(duplicateResult.valid).toBe(false)
    })
  })

  describe('validateTalentPrerequisites', () => {
    it('should accept valid talents', () => {
      const character = createEmptyCharacter()
      const validTalents = [
        { id: 'hardy', name: 'Hardy', times: 1 },
        { id: 'savvy', name: 'Savvy', times: 1 }
      ]
      const validResult = validateTalentPrerequisites(validTalents, character)
      expect(validResult.valid).toBe(true)
    })

    it('should reject missing fields', () => {
      const character = createEmptyCharacter()
      const invalidTalents = [{ id: 'hardy' }]
      const invalidResult = validateTalentPrerequisites(invalidTalents, character)
      expect(invalidResult.valid).toBe(false)
    })

    it('should reject invalid times value', () => {
      const character = createEmptyCharacter()
      const invalidTimes = [{ id: 'hardy', name: 'Hardy', times: 0 }]
      const timesResult = validateTalentPrerequisites(invalidTimes, character)
      expect(timesResult.valid).toBe(false)
    })

    it('should reject duplicate talents', () => {
      const character = createEmptyCharacter()
      const duplicateTalents = [
        { id: 'hardy', name: 'Hardy', times: 1 },
        { id: 'hardy', name: 'Hardy', times: 1 }
      ]
      const duplicateResult = validateTalentPrerequisites(duplicateTalents, character)
      expect(duplicateResult.valid).toBe(false)
    })
  })

  describe('validateSpells', () => {
    it('should accept valid spells', () => {
      const validSpells = [
        { id: 'magic-missile', name: 'Magic Missile', cn: 5 },
        { id: 'fireball', name: 'Fireball', cn: 7 }
      ]
      const validResult = validateSpells(validSpells)
      expect(validResult.valid).toBe(true)
    })

    it('should reject missing fields', () => {
      const invalidSpells = [{ id: 'magic-missile' }]
      const invalidResult = validateSpells(invalidSpells)
      expect(invalidResult.valid).toBe(false)
    })

    it('should reject duplicate spells', () => {
      const duplicateSpells = [
        { id: 'fireball', name: 'Fireball', cn: 7 },
        { id: 'fireball', name: 'Fireball', cn: 7 }
      ]
      const duplicateResult = validateSpells(duplicateSpells)
      expect(duplicateResult.valid).toBe(false)
    })
  })

  describe('validateTrappings', () => {
    it('should accept valid trappings', () => {
      const validTrappings = [
        { id: 'sword', name: 'Sword', quantity: 1, equipped: true },
        { id: 'shield', name: 'Shield', quantity: 1, equipped: false }
      ]
      const validResult = validateTrappings(validTrappings)
      expect(validResult.valid).toBe(true)
    })

    it('should reject missing fields', () => {
      const invalidTrappings = [{ id: 'sword' }]
      const invalidResult = validateTrappings(invalidTrappings)
      expect(invalidResult.valid).toBe(false)
    })

    it('should reject negative quantity', () => {
      const negativeTrappings = [{ id: 'sword', name: 'Sword', quantity: -1, equipped: true }]
      const negativeResult = validateTrappings(negativeTrappings)
      expect(negativeResult.valid).toBe(false)
    })
  })

  describe('validateExperience', () => {
    it('should accept valid experience', () => {
      const validExperience = { total: 500, spent: 200, available: 300 }
      const validResult = validateExperience(validExperience)
      expect(validResult.valid).toBe(true)
    })

    it('should reject inconsistent calculation', () => {
      const inconsistentExperience = { total: 500, spent: 200, available: 200 }
      const inconsistentResult = validateExperience(inconsistentExperience)
      expect(inconsistentResult.valid).toBe(false)
    })

    it('should reject negative values', () => {
      const negativeExperience = { total: -100, spent: 0, available: -100 }
      const negativeResult = validateExperience(negativeExperience)
      expect(negativeResult.valid).toBe(false)
    })

    it('should reject spent exceeding total', () => {
      const exceededExperience = { total: 100, spent: 200, available: -100 }
      const exceededResult = validateExperience(exceededExperience)
      expect(exceededResult.valid).toBe(false)
    })
  })

  describe('validateCompleteCharacter', () => {
    it('should accept valid character', () => {
      const validCharacter = createEmptyCharacter()
      validCharacter.name = 'Test Character'
      validCharacter.species = { id: 'human', name: 'Human' }
      validCharacter.career = { id: 'warrior', name: 'Warrior', level: 1 }
      validCharacter.characteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      validCharacter.wounds = { current: 12, max: 12 }
      validCharacter.fate = { current: 2, max: 2 }
      validCharacter.resilience = { current: 1, max: 1 }

      const validResult = validateCompleteCharacter(validCharacter)
      expect(validResult.valid).toBe(true)
    })

    it('should reject character without name', () => {
      const validCharacter = createEmptyCharacter()
      validCharacter.species = { id: 'human', name: 'Human' }
      validCharacter.career = { id: 'warrior', name: 'Warrior', level: 1 }
      validCharacter.characteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      validCharacter.wounds = { current: 12, max: 12 }
      validCharacter.fate = { current: 2, max: 2 }
      validCharacter.resilience = { current: 1, max: 1 }

      const noNameCharacter = { ...validCharacter, name: '' }
      const noNameResult = validateCompleteCharacter(noNameCharacter)
      expect(noNameResult.valid).toBe(false)
    })

    it('should reject character without species', () => {
      const validCharacter = createEmptyCharacter()
      validCharacter.name = 'Test Character'
      validCharacter.career = { id: 'warrior', name: 'Warrior', level: 1 }
      validCharacter.characteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      validCharacter.wounds = { current: 12, max: 12 }
      validCharacter.fate = { current: 2, max: 2 }
      validCharacter.resilience = { current: 1, max: 1 }

      const noSpeciesCharacter = { ...validCharacter, species: { id: null } }
      const noSpeciesResult = validateCompleteCharacter(noSpeciesCharacter)
      expect(noSpeciesResult.valid).toBe(false)
    })

    it('should reject invalid career level', () => {
      const validCharacter = createEmptyCharacter()
      validCharacter.name = 'Test Character'
      validCharacter.species = { id: 'human', name: 'Human' }
      validCharacter.characteristics = {
        M: 4,
        WS: 30,
        BS: 28,
        S: 32,
        T: 35,
        I: 30,
        Ag: 28,
        Dex: 30,
        Int: 32,
        WP: 33,
        Fel: 28
      }
      validCharacter.wounds = { current: 12, max: 12 }
      validCharacter.fate = { current: 2, max: 2 }
      validCharacter.resilience = { current: 1, max: 1 }

      const invalidLevelCharacter = {
        ...validCharacter,
        career: { id: 'warrior', name: 'Warrior', level: 10 }
      }
      const invalidLevelResult = validateCompleteCharacter(invalidLevelCharacter)
      expect(invalidLevelResult.valid).toBe(false)
    })
  })

  describe('validateCharacterDraft', () => {
    it('should accept valid draft with warnings', () => {
      const validDraft = createEmptyCharacter()
      validDraft.name = 'Draft Character'

      const validResult = validateCharacterDraft(validDraft)
      expect(validResult.valid).toBe(true)
      expect(validResult.warnings.length).toBeGreaterThan(0)
    })

    it('should reject draft without name', () => {
      const invalidDraft = createEmptyCharacter()
      const invalidResult = validateCharacterDraft(invalidDraft)
      expect(invalidResult.valid).toBe(false)
    })
  })
})
