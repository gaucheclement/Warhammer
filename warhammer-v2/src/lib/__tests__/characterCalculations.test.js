/**
 * Character Calculations Tests
 *
 * Unit tests for character calculation functions
 */

import { describe, it, expect } from 'vitest'
import {
  calculateWounds,
  calculateMovement,
  calculateInitiative,
  calculateEncumbrance,
  calculateMaxEncumbrance,
  calculateCharacteristicBonus,
  calculateAllCharacteristicBonuses,
  calculateDefaultFate,
  calculateDefaultResilience,
  calculateSkillTarget,
  calculateCharacteristicAdvanceCost,
  calculateSkillAdvanceCost,
  calculateTalentCost,
  calculateDamageBonus,
  calculateCarryingCapacity,
  rollCharacteristic,
  rollAllCharacteristics
} from '../characterCalculations.js'

describe('characterCalculations', () => {
  describe('calculateWounds', () => {
    it('should calculate base wounds correctly', () => {
      // Base calculation: (2 × TB) + WPB + SB
      // T=35 (TB=3), S=30 (SB=3), WP=32 (WPB=3)
      // Expected: (2 × 3) + 3 + 3 = 12
      const wounds = calculateWounds(35, 30, 32)
      expect(wounds).toBe(12)
    })

    it('should calculate wounds with Hardy talent', () => {
      // With Hardy talent
      const talents = [{ id: 'hardy', name: 'Hardy', times: 1 }]
      const woundsWithHardy = calculateWounds(35, 30, 32, talents)
      expect(woundsWithHardy).toBe(15)
    })

    it('should have minimum of 1 wound', () => {
      // Test minimum wounds
      const minWounds = calculateWounds(5, 5, 5)
      expect(minWounds).toBeGreaterThanOrEqual(1)
    })
  })

  describe('calculateMovement', () => {
    it('should return base movement', () => {
      const baseMovement = calculateMovement(4)
      expect(baseMovement).toBe(4)
    })

    it('should not apply penalty when under max encumbrance', () => {
      const nopenaltyMovement = calculateMovement(4, 10, 20)
      expect(nopenaltyMovement).toBe(4)
    })

    it('should apply penalty when over max encumbrance', () => {
      const penaltyMovement = calculateMovement(4, 30, 20)
      expect(penaltyMovement).toBeLessThan(4)
    })
  })

  describe('calculateInitiative', () => {
    it('should calculate initiative from I and Ag bonuses', () => {
      // I=32 (IB=3), Ag=28 (AgB=2)
      // Expected: 3 + 2 = 5
      const initiative = calculateInitiative(32, 28)
      expect(initiative).toBe(5)
    })
  })

  describe('calculateEncumbrance', () => {
    it('should calculate total encumbrance from trappings', () => {
      const trappings = [
        { id: 'sword', name: 'Sword', encumbrance: 2, quantity: 1 },
        { id: 'shield', name: 'Shield', encumbrance: 3, quantity: 1 },
        { id: 'arrows', name: 'Arrows', encumbrance: 0.1, quantity: 20 }
      ]

      const encumbrance = calculateEncumbrance(trappings)
      // Expected: 2 + 3 + (0.1 × 20) = 7
      expect(encumbrance).toBe(7)
    })

    it('should return 0 for empty trappings', () => {
      const emptyEncumbrance = calculateEncumbrance([])
      expect(emptyEncumbrance).toBe(0)
    })
  })

  describe('calculateMaxEncumbrance', () => {
    it('should calculate max encumbrance from T and S bonuses', () => {
      // T=35 (TB=3), S=30 (SB=3)
      // Expected: (3 + 3) × 10 = 60
      const maxEncumbrance = calculateMaxEncumbrance(35, 30)
      expect(maxEncumbrance).toBe(60)
    })
  })

  describe('calculateCharacteristicBonus', () => {
    it('should calculate bonus for characteristic 35', () => {
      expect(calculateCharacteristicBonus(35)).toBe(3)
    })

    it('should calculate bonus for characteristic 29', () => {
      expect(calculateCharacteristicBonus(29)).toBe(2)
    })

    it('should calculate bonus for characteristic 10', () => {
      expect(calculateCharacteristicBonus(10)).toBe(1)
    })

    it('should calculate bonus for characteristic 9', () => {
      expect(calculateCharacteristicBonus(9)).toBe(0)
    })
  })

  describe('calculateAllCharacteristicBonuses', () => {
    it('should calculate all characteristic bonuses', () => {
      const characteristics = {
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

      const bonuses = calculateAllCharacteristicBonuses(characteristics)

      expect(bonuses.WSBonus).toBe(3)
      expect(bonuses.TBonus).toBe(3)
      expect(bonuses.AgBonus).toBe(2)
    })
  })

  describe('calculateDefaultFate', () => {
    it('should return 2 for Human', () => {
      expect(calculateDefaultFate('Human')).toBe(2)
    })

    it('should return 3 for Halfling', () => {
      expect(calculateDefaultFate('Halfling')).toBe(3)
    })

    it('should return 2 for Dwarf', () => {
      expect(calculateDefaultFate('Dwarf')).toBe(2)
    })

    it('should return 0 for Unknown species', () => {
      expect(calculateDefaultFate('Unknown')).toBe(0)
    })
  })

  describe('calculateDefaultResilience', () => {
    it('should return 1 for Human', () => {
      expect(calculateDefaultResilience('Human')).toBe(1)
    })

    it('should return 2 for Halfling', () => {
      expect(calculateDefaultResilience('Halfling')).toBe(2)
    })

    it('should return 2 for Dwarf', () => {
      expect(calculateDefaultResilience('Dwarf')).toBe(2)
    })

    it('should return 0 for High Elf', () => {
      expect(calculateDefaultResilience('High Elf')).toBe(0)
    })
  })

  describe('calculateSkillTarget', () => {
    it('should calculate skill target from characteristic and advances', () => {
      // Characteristic 30 + 10 advances = 40
      const target = calculateSkillTarget(30, 10)
      expect(target).toBe(40)
    })
  })

  describe('calculateCharacteristicAdvanceCost', () => {
    it('should cost 25 XP for first advance', () => {
      // First advance: 25 × 1 = 25
      expect(calculateCharacteristicAdvanceCost(0)).toBe(25)
    })

    it('should cost 50 XP for second advance', () => {
      // Second advance: 25 × 2 = 50
      expect(calculateCharacteristicAdvanceCost(1)).toBe(50)
    })

    it('should cost 75 XP for third advance', () => {
      // Third advance: 25 × 3 = 75
      expect(calculateCharacteristicAdvanceCost(2)).toBe(75)
    })
  })

  describe('calculateSkillAdvanceCost', () => {
    it('should cost 10 XP for first basic skill advance', () => {
      // Basic skill: 10 × 1 = 10
      expect(calculateSkillAdvanceCost(0, false)).toBe(10)
    })

    it('should cost 15 XP for first advanced skill advance', () => {
      // Advanced skill: 15 × 1 = 15
      expect(calculateSkillAdvanceCost(0, true)).toBe(15)
    })

    it('should cost 20 XP for second basic skill advance', () => {
      // Second basic skill advance: 10 × 2 = 20
      expect(calculateSkillAdvanceCost(1, false)).toBe(20)
    })
  })

  describe('calculateTalentCost', () => {
    it('should cost 100 XP for talent', () => {
      // Standard talent cost is 100 XP
      expect(calculateTalentCost(0)).toBe(100)
    })

    it('should cost 100 XP for second talent rank', () => {
      expect(calculateTalentCost(1)).toBe(100)
    })
  })

  describe('calculateDamageBonus', () => {
    it('should calculate damage bonus from Strength', () => {
      // S=35 (SB=3)
      const damageBonus = calculateDamageBonus(35)
      expect(damageBonus).toBe(3)
    })
  })

  describe('calculateCarryingCapacity', () => {
    it('should categorize as light load', () => {
      // T=35 (TB=3), S=30 (SB=3), max encumbrance = 60
      const lightCapacity = calculateCarryingCapacity(35, 30, 10)
      expect(lightCapacity.category).toBe('light')
      expect(lightCapacity.movementPenalty).toBe(0)
    })

    it('should categorize as medium load', () => {
      // maxEncumbrance = 60, lightLoad = 20, mediumLoad = 40
      // Use 30 to be in medium range (> 20 and <= 40)
      const mediumCapacity = calculateCarryingCapacity(35, 30, 30)
      expect(mediumCapacity.category).toBe('medium')
    })

    it('should categorize as heavy load with penalty', () => {
      const heavyCapacity = calculateCarryingCapacity(35, 30, 55)
      expect(heavyCapacity.category).toBe('heavy')
      expect(heavyCapacity.movementPenalty).toBe(1)
    })

    it('should categorize as overloaded with higher penalty', () => {
      const overloadedCapacity = calculateCarryingCapacity(35, 30, 70)
      expect(overloadedCapacity.category).toBe('overloaded')
      expect(overloadedCapacity.movementPenalty).toBeGreaterThan(1)
    })
  })

  describe('rollCharacteristic', () => {
    it('should roll between 2 and 20', () => {
      // Roll should be between 2 and 20 (2d10)
      for (let i = 0; i < 100; i++) {
        const roll = rollCharacteristic()
        expect(roll).toBeGreaterThanOrEqual(2)
        expect(roll).toBeLessThanOrEqual(20)
      }
    })
  })

  describe('rollAllCharacteristics', () => {
    it('should roll all characteristics with species modifiers', () => {
      const speciesModifiers = {
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
      }

      const characteristics = rollAllCharacteristics(speciesModifiers)

      // All characteristics should have species modifiers applied
      expect(characteristics.M).toBe(4)
      expect(characteristics.WS).toBeGreaterThanOrEqual(22)
      expect(characteristics.WS).toBeLessThanOrEqual(40)

      // All required characteristics should exist
      const required = ['M', 'WS', 'BS', 'S', 'T', 'I', 'Ag', 'Dex', 'Int', 'WP', 'Fel']
      for (const char of required) {
        expect(characteristics[char]).toBeDefined()
      }
    })
  })
})
