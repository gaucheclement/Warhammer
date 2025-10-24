/**
 * Character Validation Tests
 *
 * Unit tests for character validation functions
 */

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

/**
 * Test validateCharacterName
 */
export function testValidateCharacterName() {
  console.log('Testing validateCharacterName...')

  // Valid name
  const validResult = validateCharacterName('Gunther von Liebewitz')
  console.assert(validResult.valid === true, 'Valid name should pass')

  // Empty name
  const emptyResult = validateCharacterName('')
  console.assert(emptyResult.valid === false, 'Empty name should fail')
  console.assert(emptyResult.errors.length > 0, 'Should have errors')

  // Too short
  const shortResult = validateCharacterName('A')
  console.assert(shortResult.valid === false, 'Name too short should fail')

  // Too long
  const longName = 'A'.repeat(101)
  const longResult = validateCharacterName(longName)
  console.assert(longResult.valid === false, 'Name too long should fail')

  // Check uniqueness
  const existingCharacters = [{ name: 'Test Character' }]
  const duplicateResult = validateCharacterName('Test Character', existingCharacters)
  console.assert(duplicateResult.warnings.length > 0, 'Duplicate name should warn')

  console.log('✓ validateCharacterName tests passed')
}

/**
 * Test validateCharacteristics
 */
export function testValidateCharacteristics() {
  console.log('Testing validateCharacteristics...')

  // Valid characteristics
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
  console.assert(validResult.valid === true, 'Valid characteristics should pass')

  // Missing characteristic
  const missingResult = validateCharacteristics({ M: 4, WS: 30 })
  console.assert(missingResult.valid === false, 'Missing characteristics should fail')

  // Out of range
  const outOfRangeResult = validateCharacteristics({ ...validCharacteristics, WS: 150 })
  console.assert(outOfRangeResult.valid === false, 'Out of range value should fail')

  // Negative value
  const negativeResult = validateCharacteristics({ ...validCharacteristics, S: -10 })
  console.assert(negativeResult.valid === false, 'Negative value should fail')

  console.log('✓ validateCharacteristics tests passed')
}

/**
 * Test validateSkillSelection
 */
export function testValidateSkillSelection() {
  console.log('Testing validateSkillSelection...')

  // Valid skills
  const validSkills = [
    { id: 'melee', name: 'Melee', advances: 10, characteristic: 'ws' },
    { id: 'ranged', name: 'Ranged', advances: 5, characteristic: 'bs' }
  ]
  const validResult = validateSkillSelection(validSkills)
  console.assert(validResult.valid === true, 'Valid skills should pass')

  // Missing fields
  const invalidSkills = [{ id: 'melee' }]
  const invalidResult = validateSkillSelection(invalidSkills)
  console.assert(invalidResult.valid === false, 'Missing fields should fail')

  // Negative advances
  const negativeSkills = [{ id: 'melee', name: 'Melee', advances: -5 }]
  const negativeResult = validateSkillSelection(negativeSkills)
  console.assert(negativeResult.valid === false, 'Negative advances should fail')

  // Duplicate skills
  const duplicateSkills = [
    { id: 'melee', name: 'Melee', advances: 10 },
    { id: 'melee', name: 'Melee', advances: 5 }
  ]
  const duplicateResult = validateSkillSelection(duplicateSkills)
  console.assert(duplicateResult.valid === false, 'Duplicate skills should fail')

  console.log('✓ validateSkillSelection tests passed')
}

/**
 * Test validateTalentPrerequisites
 */
export function testValidateTalentPrerequisites() {
  console.log('Testing validateTalentPrerequisites...')

  const character = createEmptyCharacter()

  // Valid talents
  const validTalents = [
    { id: 'hardy', name: 'Hardy', times: 1 },
    { id: 'savvy', name: 'Savvy', times: 1 }
  ]
  const validResult = validateTalentPrerequisites(validTalents, character)
  console.assert(validResult.valid === true, 'Valid talents should pass')

  // Missing fields
  const invalidTalents = [{ id: 'hardy' }]
  const invalidResult = validateTalentPrerequisites(invalidTalents, character)
  console.assert(invalidResult.valid === false, 'Missing fields should fail')

  // Invalid times value
  const invalidTimes = [{ id: 'hardy', name: 'Hardy', times: 0 }]
  const timesResult = validateTalentPrerequisites(invalidTimes, character)
  console.assert(timesResult.valid === false, 'Times < 1 should fail')

  // Duplicate talents
  const duplicateTalents = [
    { id: 'hardy', name: 'Hardy', times: 1 },
    { id: 'hardy', name: 'Hardy', times: 1 }
  ]
  const duplicateResult = validateTalentPrerequisites(duplicateTalents, character)
  console.assert(duplicateResult.valid === false, 'Duplicate talents should fail')

  console.log('✓ validateTalentPrerequisites tests passed')
}

/**
 * Test validateSpells
 */
export function testValidateSpells() {
  console.log('Testing validateSpells...')

  // Valid spells
  const validSpells = [
    { id: 'magic-missile', name: 'Magic Missile', cn: 5 },
    { id: 'fireball', name: 'Fireball', cn: 7 }
  ]
  const validResult = validateSpells(validSpells)
  console.assert(validResult.valid === true, 'Valid spells should pass')

  // Missing fields
  const invalidSpells = [{ id: 'magic-missile' }]
  const invalidResult = validateSpells(invalidSpells)
  console.assert(invalidResult.valid === false, 'Missing fields should fail')

  // Duplicate spells
  const duplicateSpells = [
    { id: 'fireball', name: 'Fireball', cn: 7 },
    { id: 'fireball', name: 'Fireball', cn: 7 }
  ]
  const duplicateResult = validateSpells(duplicateSpells)
  console.assert(duplicateResult.valid === false, 'Duplicate spells should fail')

  console.log('✓ validateSpells tests passed')
}

/**
 * Test validateTrappings
 */
export function testValidateTrappings() {
  console.log('Testing validateTrappings...')

  // Valid trappings
  const validTrappings = [
    { id: 'sword', name: 'Sword', quantity: 1, equipped: true },
    { id: 'shield', name: 'Shield', quantity: 1, equipped: false }
  ]
  const validResult = validateTrappings(validTrappings)
  console.assert(validResult.valid === true, 'Valid trappings should pass')

  // Missing fields
  const invalidTrappings = [{ id: 'sword' }]
  const invalidResult = validateTrappings(invalidTrappings)
  console.assert(invalidResult.valid === false, 'Missing fields should fail')

  // Negative quantity
  const negativeTrappings = [{ id: 'sword', name: 'Sword', quantity: -1, equipped: true }]
  const negativeResult = validateTrappings(negativeTrappings)
  console.assert(negativeResult.valid === false, 'Negative quantity should fail')

  console.log('✓ validateTrappings tests passed')
}

/**
 * Test validateExperience
 */
export function testValidateExperience() {
  console.log('Testing validateExperience...')

  // Valid experience
  const validExperience = { total: 500, spent: 200, available: 300 }
  const validResult = validateExperience(validExperience)
  console.assert(validResult.valid === true, 'Valid experience should pass')

  // Inconsistent calculation
  const inconsistentExperience = { total: 500, spent: 200, available: 200 }
  const inconsistentResult = validateExperience(inconsistentExperience)
  console.assert(inconsistentResult.valid === false, 'Inconsistent calculation should fail')

  // Negative values
  const negativeExperience = { total: -100, spent: 0, available: -100 }
  const negativeResult = validateExperience(negativeExperience)
  console.assert(negativeResult.valid === false, 'Negative values should fail')

  // Spent exceeds total
  const exceededExperience = { total: 100, spent: 200, available: -100 }
  const exceededResult = validateExperience(exceededExperience)
  console.assert(exceededResult.valid === false, 'Spent > total should fail')

  console.log('✓ validateExperience tests passed')
}

/**
 * Test validateCompleteCharacter
 */
export function testValidateCompleteCharacter() {
  console.log('Testing validateCompleteCharacter...')

  // Create valid character
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
  console.assert(validResult.valid === true, 'Valid character should pass')

  // Missing name
  const noNameCharacter = { ...validCharacter, name: '' }
  const noNameResult = validateCompleteCharacter(noNameCharacter)
  console.assert(noNameResult.valid === false, 'Character without name should fail')

  // Missing species
  const noSpeciesCharacter = { ...validCharacter, species: { id: null } }
  const noSpeciesResult = validateCompleteCharacter(noSpeciesCharacter)
  console.assert(noSpeciesResult.valid === false, 'Character without species should fail')

  // Invalid career level
  const invalidLevelCharacter = {
    ...validCharacter,
    career: { id: 'warrior', name: 'Warrior', level: 10 }
  }
  const invalidLevelResult = validateCompleteCharacter(invalidLevelCharacter)
  console.assert(invalidLevelResult.valid === false, 'Invalid career level should fail')

  console.log('✓ validateCompleteCharacter tests passed')
}

/**
 * Test validateCharacterDraft
 */
export function testValidateCharacterDraft() {
  console.log('Testing validateCharacterDraft...')

  // Valid draft (minimal requirements)
  const validDraft = createEmptyCharacter()
  validDraft.name = 'Draft Character'

  const validResult = validateCharacterDraft(validDraft)
  console.assert(validResult.valid === true, 'Valid draft should pass')
  console.assert(validResult.warnings.length > 0, 'Draft should have warnings about missing data')

  // Invalid draft (no name)
  const invalidDraft = createEmptyCharacter()
  const invalidResult = validateCharacterDraft(invalidDraft)
  console.assert(invalidResult.valid === false, 'Draft without name should fail')

  console.log('✓ validateCharacterDraft tests passed')
}

/**
 * Run all character validation tests
 */
export function runCharacterValidationTests() {
  console.log('=== Running Character Validation Tests ===\n')

  try {
    testValidateCharacterName()
    testValidateCharacteristics()
    testValidateSkillSelection()
    testValidateTalentPrerequisites()
    testValidateSpells()
    testValidateTrappings()
    testValidateExperience()
    testValidateCompleteCharacter()
    testValidateCharacterDraft()

    console.log('\n=== All character validation tests passed! ===')
    return true
  } catch (error) {
    console.error('\n=== Test failed! ===')
    console.error(error)
    return false
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runCharacterValidationTests = runCharacterValidationTests
}
