/**
 * Character Calculations Tests
 *
 * Unit tests for character calculation functions
 */

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

/**
 * Test calculateWounds
 */
export function testCalculateWounds() {
  console.log('Testing calculateWounds...')

  // Base calculation: (2 × TB) + WPB + SB
  // T=35 (TB=3), S=30 (SB=3), WP=32 (WPB=3)
  // Expected: (2 × 3) + 3 + 3 = 12
  const wounds = calculateWounds(35, 30, 32)
  console.assert(wounds === 12, `Expected 12 wounds, got ${wounds}`)

  // With Hardy talent
  const talents = [{ id: 'hardy', name: 'Hardy', times: 1 }]
  const woundsWithHardy = calculateWounds(35, 30, 32, talents)
  console.assert(woundsWithHardy === 15, `Expected 15 wounds with Hardy, got ${woundsWithHardy}`)

  // Test minimum wounds
  const minWounds = calculateWounds(5, 5, 5)
  console.assert(minWounds >= 1, 'Minimum wounds should be at least 1')

  console.log('✓ calculateWounds tests passed')
}

/**
 * Test calculateMovement
 */
export function testCalculateMovement() {
  console.log('Testing calculateMovement...')

  // Base movement
  const baseMovement = calculateMovement(4)
  console.assert(baseMovement === 4, `Expected movement 4, got ${baseMovement}`)

  // With encumbrance under max
  const nopenaltyMovement = calculateMovement(4, 10, 20)
  console.assert(
    nopenaltyMovement === 4,
    `Expected no penalty with low encumbrance, got ${nopenaltyMovement}`
  )

  // With encumbrance over max
  const penaltyMovement = calculateMovement(4, 30, 20)
  console.assert(
    penaltyMovement < 4,
    `Expected penalty with high encumbrance, got ${penaltyMovement}`
  )

  console.log('✓ calculateMovement tests passed')
}

/**
 * Test calculateInitiative
 */
export function testCalculateInitiative() {
  console.log('Testing calculateInitiative...')

  // I=32 (IB=3), Ag=28 (AgB=2)
  // Expected: 3 + 2 = 5
  const initiative = calculateInitiative(32, 28)
  console.assert(initiative === 5, `Expected initiative 5, got ${initiative}`)

  console.log('✓ calculateInitiative tests passed')
}

/**
 * Test calculateEncumbrance
 */
export function testCalculateEncumbrance() {
  console.log('Testing calculateEncumbrance...')

  const trappings = [
    { id: 'sword', name: 'Sword', encumbrance: 2, quantity: 1 },
    { id: 'shield', name: 'Shield', encumbrance: 3, quantity: 1 },
    { id: 'arrows', name: 'Arrows', encumbrance: 0.1, quantity: 20 }
  ]

  const encumbrance = calculateEncumbrance(trappings)
  // Expected: 2 + 3 + (0.1 × 20) = 7
  console.assert(encumbrance === 7, `Expected encumbrance 7, got ${encumbrance}`)

  // Empty trappings
  const emptyEncumbrance = calculateEncumbrance([])
  console.assert(emptyEncumbrance === 0, 'Empty trappings should have 0 encumbrance')

  console.log('✓ calculateEncumbrance tests passed')
}

/**
 * Test calculateMaxEncumbrance
 */
export function testCalculateMaxEncumbrance() {
  console.log('Testing calculateMaxEncumbrance...')

  // T=35 (TB=3), S=30 (SB=3)
  // Expected: (3 + 3) × 10 = 60
  const maxEncumbrance = calculateMaxEncumbrance(35, 30)
  console.assert(maxEncumbrance === 60, `Expected max encumbrance 60, got ${maxEncumbrance}`)

  console.log('✓ calculateMaxEncumbrance tests passed')
}

/**
 * Test calculateCharacteristicBonus
 */
export function testCalculateCharacteristicBonus() {
  console.log('Testing calculateCharacteristicBonus...')

  console.assert(calculateCharacteristicBonus(35) === 3, 'Bonus of 35 should be 3')
  console.assert(calculateCharacteristicBonus(29) === 2, 'Bonus of 29 should be 2')
  console.assert(calculateCharacteristicBonus(10) === 1, 'Bonus of 10 should be 1')
  console.assert(calculateCharacteristicBonus(9) === 0, 'Bonus of 9 should be 0')

  console.log('✓ calculateCharacteristicBonus tests passed')
}

/**
 * Test calculateAllCharacteristicBonuses
 */
export function testCalculateAllCharacteristicBonuses() {
  console.log('Testing calculateAllCharacteristicBonuses...')

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

  console.assert(bonuses.WSBonus === 3, 'WS bonus should be 3')
  console.assert(bonuses.TBonus === 3, 'T bonus should be 3')
  console.assert(bonuses.AgBonus === 2, 'Ag bonus should be 2')

  console.log('✓ calculateAllCharacteristicBonuses tests passed')
}

/**
 * Test calculateDefaultFate
 */
export function testCalculateDefaultFate() {
  console.log('Testing calculateDefaultFate...')

  console.assert(calculateDefaultFate('Human') === 2, 'Human fate should be 2')
  console.assert(calculateDefaultFate('Halfling') === 3, 'Halfling fate should be 3')
  console.assert(calculateDefaultFate('Dwarf') === 2, 'Dwarf fate should be 2')
  console.assert(calculateDefaultFate('Unknown') === 0, 'Unknown species fate should be 0')

  console.log('✓ calculateDefaultFate tests passed')
}

/**
 * Test calculateDefaultResilience
 */
export function testCalculateDefaultResilience() {
  console.log('Testing calculateDefaultResilience...')

  console.assert(calculateDefaultResilience('Human') === 1, 'Human resilience should be 1')
  console.assert(calculateDefaultResilience('Halfling') === 2, 'Halfling resilience should be 2')
  console.assert(calculateDefaultResilience('Dwarf') === 2, 'Dwarf resilience should be 2')
  console.assert(
    calculateDefaultResilience('High Elf') === 0,
    'High Elf resilience should be 0'
  )

  console.log('✓ calculateDefaultResilience tests passed')
}

/**
 * Test calculateSkillTarget
 */
export function testCalculateSkillTarget() {
  console.log('Testing calculateSkillTarget...')

  // Characteristic 30 + 10 advances = 40
  const target = calculateSkillTarget(30, 10)
  console.assert(target === 40, `Expected skill target 40, got ${target}`)

  console.log('✓ calculateSkillTarget tests passed')
}

/**
 * Test calculateCharacteristicAdvanceCost
 */
export function testCalculateCharacteristicAdvanceCost() {
  console.log('Testing calculateCharacteristicAdvanceCost...')

  // First advance: 25 × 1 = 25
  console.assert(
    calculateCharacteristicAdvanceCost(0) === 25,
    'First advance should cost 25 XP'
  )

  // Second advance: 25 × 2 = 50
  console.assert(
    calculateCharacteristicAdvanceCost(1) === 50,
    'Second advance should cost 50 XP'
  )

  // Third advance: 25 × 3 = 75
  console.assert(
    calculateCharacteristicAdvanceCost(2) === 75,
    'Third advance should cost 75 XP'
  )

  console.log('✓ calculateCharacteristicAdvanceCost tests passed')
}

/**
 * Test calculateSkillAdvanceCost
 */
export function testCalculateSkillAdvanceCost() {
  console.log('Testing calculateSkillAdvanceCost...')

  // Basic skill: 10 × 1 = 10
  console.assert(
    calculateSkillAdvanceCost(0, false) === 10,
    'First basic skill advance should cost 10 XP'
  )

  // Advanced skill: 15 × 1 = 15
  console.assert(
    calculateSkillAdvanceCost(0, true) === 15,
    'First advanced skill advance should cost 15 XP'
  )

  // Second basic skill advance: 10 × 2 = 20
  console.assert(
    calculateSkillAdvanceCost(1, false) === 20,
    'Second basic skill advance should cost 20 XP'
  )

  console.log('✓ calculateSkillAdvanceCost tests passed')
}

/**
 * Test calculateTalentCost
 */
export function testCalculateTalentCost() {
  console.log('Testing calculateTalentCost...')

  // Standard talent cost is 100 XP
  console.assert(calculateTalentCost(0) === 100, 'Talent should cost 100 XP')
  console.assert(calculateTalentCost(1) === 100, 'Second talent rank should cost 100 XP')

  console.log('✓ calculateTalentCost tests passed')
}

/**
 * Test calculateDamageBonus
 */
export function testCalculateDamageBonus() {
  console.log('Testing calculateDamageBonus...')

  // S=35 (SB=3)
  const damageBonus = calculateDamageBonus(35)
  console.assert(damageBonus === 3, `Expected damage bonus 3, got ${damageBonus}`)

  console.log('✓ calculateDamageBonus tests passed')
}

/**
 * Test calculateCarryingCapacity
 */
export function testCalculateCarryingCapacity() {
  console.log('Testing calculateCarryingCapacity...')

  // T=35 (TB=3), S=30 (SB=3), max encumbrance = 60
  const lightCapacity = calculateCarryingCapacity(35, 30, 10)
  console.assert(lightCapacity.category === 'light', 'Should be light load')
  console.assert(lightCapacity.movementPenalty === 0, 'Should have no penalty')

  const mediumCapacity = calculateCarryingCapacity(35, 30, 45)
  console.assert(mediumCapacity.category === 'medium', 'Should be medium load')

  const heavyCapacity = calculateCarryingCapacity(35, 30, 55)
  console.assert(heavyCapacity.category === 'heavy', 'Should be heavy load')
  console.assert(heavyCapacity.movementPenalty === 1, 'Should have penalty')

  const overloadedCapacity = calculateCarryingCapacity(35, 30, 70)
  console.assert(overloadedCapacity.category === 'overloaded', 'Should be overloaded')
  console.assert(overloadedCapacity.movementPenalty > 1, 'Should have higher penalty')

  console.log('✓ calculateCarryingCapacity tests passed')
}

/**
 * Test rollCharacteristic
 */
export function testRollCharacteristic() {
  console.log('Testing rollCharacteristic...')

  // Roll should be between 2 and 20 (2d10)
  for (let i = 0; i < 100; i++) {
    const roll = rollCharacteristic()
    console.assert(
      roll >= 2 && roll <= 20,
      `Roll should be 2-20, got ${roll}`
    )
  }

  console.log('✓ rollCharacteristic tests passed')
}

/**
 * Test rollAllCharacteristics
 */
export function testRollAllCharacteristics() {
  console.log('Testing rollAllCharacteristics...')

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
  console.assert(characteristics.M === 4, 'M should be species modifier')
  console.assert(characteristics.WS >= 22, 'WS should be at least base + min roll')
  console.assert(characteristics.WS <= 40, 'WS should be at most base + max roll')

  // All required characteristics should exist
  const required = ['M', 'WS', 'BS', 'S', 'T', 'I', 'Ag', 'Dex', 'Int', 'WP', 'Fel']
  for (const char of required) {
    console.assert(
      characteristics[char] !== undefined,
      `${char} should be defined`
    )
  }

  console.log('✓ rollAllCharacteristics tests passed')
}

/**
 * Run all character calculation tests
 */
export function runCharacterCalculationTests() {
  console.log('=== Running Character Calculation Tests ===\n')

  try {
    testCalculateWounds()
    testCalculateMovement()
    testCalculateInitiative()
    testCalculateEncumbrance()
    testCalculateMaxEncumbrance()
    testCalculateCharacteristicBonus()
    testCalculateAllCharacteristicBonuses()
    testCalculateDefaultFate()
    testCalculateDefaultResilience()
    testCalculateSkillTarget()
    testCalculateCharacteristicAdvanceCost()
    testCalculateSkillAdvanceCost()
    testCalculateTalentCost()
    testCalculateDamageBonus()
    testCalculateCarryingCapacity()
    testRollCharacteristic()
    testRollAllCharacteristics()

    console.log('\n=== All character calculation tests passed! ===')
    return true
  } catch (error) {
    console.error('\n=== Test failed! ===')
    console.error(error)
    return false
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runCharacterCalculationTests = runCharacterCalculationTests
}
