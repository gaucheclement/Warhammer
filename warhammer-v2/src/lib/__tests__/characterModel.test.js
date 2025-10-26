/**
 * Character Model Tests
 *
 * Unit tests for character data model and factory functions
 */

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

/**
 * Test createEmptyCharacter
 */
export function testCreateEmptyCharacter() {
  console.log('Testing createEmptyCharacter...')

  const character = createEmptyCharacter()

  console.assert(character.name === '', 'Name should be empty string')
  console.assert(character.species.id === null, 'Species ID should be null')
  console.assert(character.career.id === null, 'Career ID should be null')
  console.assert(character.characteristics.WS === 0, 'WS should be 0')
  console.assert(Array.isArray(character.skills), 'Skills should be array')
  console.assert(Array.isArray(character.talents), 'Talents should be array')
  console.assert(Array.isArray(character.spells), 'Spells should be array')
  console.assert(Array.isArray(character.trappings), 'Trappings should be array')
  console.assert(character.experience.total === 0, 'Total XP should be 0')
  console.assert(character.wounds.max === 0, 'Max wounds should be 0')
  console.assert(character.isDraft === false, 'isDraft should be false')

  console.log('✓ createEmptyCharacter tests passed')
}

/**
 * Test createCharacterFromSpecies
 */
export function testCreateCharacterFromSpecies() {
  console.log('Testing createCharacterFromSpecies...')

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

  console.assert(character.species.id === 'human', 'Species ID should be set')
  console.assert(character.species.name === 'Human', 'Species name should be set')
  console.assert(character.characteristics.WS === 20, 'WS should be 20')
  console.assert(character.characteristics.M === 4, 'M should be 4')
  console.assert(character.skills.length === 2, 'Should have 2 species skills')
  console.assert(character.talents.length === 1, 'Should have 1 species talent')

  console.log('✓ createCharacterFromSpecies tests passed')
}

/**
 * Test applyCareerToCharacter
 */
export function testApplyCareerToCharacter() {
  console.log('Testing applyCareerToCharacter...')

  const character = createEmptyCharacter()
  const career = {
    id: 'warrior',
    name: 'Warrior',
    class: 'Fighter'
  }

  applyCareerToCharacter(character, career)

  console.assert(character.career.id === 'warrior', 'Career ID should be set')
  console.assert(character.career.name === 'Warrior', 'Career name should be set')
  console.assert(character.career.level === 1, 'Career level should be 1')

  console.log('✓ applyCareerToCharacter tests passed')
}

/**
 * Test calculateDerivedStats
 */
export function testCalculateDerivedStats() {
  console.log('Testing calculateDerivedStats...')

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
  console.assert(character.wounds.max === 12, 'Max wounds should be 12')
  console.assert(character.wounds.current === 12, 'Current wounds should be set to max')

  console.log('✓ calculateDerivedStats tests passed')
}

/**
 * Test cloneCharacter
 */
export function testCloneCharacter() {
  console.log('Testing cloneCharacter...')

  const original = createEmptyCharacter()
  original.id = 123
  original.name = 'Test Character'
  original.skills = [{ id: 'melee', name: 'Melee', advances: 10 }]

  const clone = cloneCharacter(original, 'Cloned Character')

  console.assert(clone.id === undefined, 'Clone should not have ID')
  console.assert(clone.name === 'Cloned Character', 'Clone should have new name')
  console.assert(clone.skills.length === 1, 'Clone should have same skills')
  console.assert(clone.created !== original.created, 'Clone should have new timestamp')

  // Test without new name
  const clone2 = cloneCharacter(original)
  console.assert(clone2.name === 'Test Character (Copy)', 'Should add (Copy) suffix')

  console.log('✓ cloneCharacter tests passed')
}

/**
 * Test addSkillToCharacter
 */
export function testAddSkillToCharacter() {
  console.log('Testing addSkillToCharacter...')

  const character = createEmptyCharacter()
  const skill = { id: 'melee', name: 'Melee', characteristic: 'ws' }

  addSkillToCharacter(character, skill, 5)

  console.assert(character.skills.length === 1, 'Should have 1 skill')
  console.assert(character.skills[0].advances === 5, 'Skill should have 5 advances')

  // Add same skill again
  addSkillToCharacter(character, skill, 3)

  console.assert(character.skills.length === 1, 'Should still have 1 skill')
  console.assert(character.skills[0].advances === 8, 'Advances should be cumulative (8)')

  console.log('✓ addSkillToCharacter tests passed')
}

/**
 * Test addTalentToCharacter
 */
export function testAddTalentToCharacter() {
  console.log('Testing addTalentToCharacter...')

  const character = createEmptyCharacter()
  const talent = { id: 'hardy', name: 'Hardy', description: 'Adds TB to wounds' }

  addTalentToCharacter(character, talent)

  console.assert(character.talents.length === 1, 'Should have 1 talent')
  console.assert(character.talents[0].times === 1, 'Talent times should be 1')

  // Add same talent again
  addTalentToCharacter(character, talent)

  console.assert(character.talents.length === 1, 'Should still have 1 talent')
  console.assert(character.talents[0].times === 2, 'Times should be incremented to 2')

  console.log('✓ addTalentToCharacter tests passed')
}

/**
 * Test removeSkillFromCharacter
 */
export function testRemoveSkillFromCharacter() {
  console.log('Testing removeSkillFromCharacter...')

  const character = createEmptyCharacter()
  character.skills = [
    { id: 'melee', name: 'Melee', advances: 10 },
    { id: 'ranged', name: 'Ranged', advances: 5 }
  ]

  removeSkillFromCharacter(character, 'melee')

  console.assert(character.skills.length === 1, 'Should have 1 skill remaining')
  console.assert(character.skills[0].id === 'ranged', 'Remaining skill should be ranged')

  console.log('✓ removeSkillFromCharacter tests passed')
}

/**
 * Test removeTalentFromCharacter
 */
export function testRemoveTalentFromCharacter() {
  console.log('Testing removeTalentFromCharacter...')

  const character = createEmptyCharacter()
  character.talents = [
    { id: 'hardy', name: 'Hardy', times: 2 },
    { id: 'savvy', name: 'Savvy', times: 1 }
  ]

  // Remove one instance of Hardy
  removeTalentFromCharacter(character, 'hardy')

  console.assert(character.talents.length === 2, 'Should still have 2 talents')
  console.assert(character.talents[0].times === 1, 'Hardy times should be decremented to 1')

  // Remove Hardy again (should remove completely)
  removeTalentFromCharacter(character, 'hardy')

  console.assert(character.talents.length === 1, 'Should have 1 talent remaining')
  console.assert(character.talents[0].id === 'savvy', 'Remaining talent should be Savvy')

  console.log('✓ removeTalentFromCharacter tests passed')
}

/**
 * Test updateCharacterXP
 */
export function testUpdateCharacterXP() {
  console.log('Testing updateCharacterXP...')

  const character = createEmptyCharacter()
  character.experience.spent = 100

  updateCharacterXP(character, 500)

  console.assert(character.experience.total === 500, 'Total XP should be 500')
  console.assert(character.experience.available === 400, 'Available should be 400 (500-100)')

  console.log('✓ updateCharacterXP tests passed')
}

/**
 * Test spendCharacterXP
 */
export function testSpendCharacterXP() {
  console.log('Testing spendCharacterXP...')

  const character = createEmptyCharacter()
  character.experience.total = 500
  character.experience.spent = 100
  character.experience.available = 400

  spendCharacterXP(character, 50)

  console.assert(character.experience.spent === 150, 'Spent should be 150')
  console.assert(character.experience.available === 350, 'Available should be 350')

  // Try to spend more than available
  const oldSpent = character.experience.spent
  spendCharacterXP(character, 1000)

  console.assert(
    character.experience.spent === oldSpent,
    'Should not spend more than available'
  )

  console.log('✓ spendCharacterXP tests passed')
}

/**
 * Run all character model tests
 */
export function runCharacterModelTests() {
  console.log('=== Running Character Model Tests ===\n')

  try {
    testCreateEmptyCharacter()
    testCreateCharacterFromSpecies()
    testApplyCareerToCharacter()
    testCalculateDerivedStats()
    testCloneCharacter()
    testAddSkillToCharacter()
    testAddTalentToCharacter()
    testRemoveSkillFromCharacter()
    testRemoveTalentFromCharacter()
    testUpdateCharacterXP()
    testSpendCharacterXP()

    console.log('\n=== All character model tests passed! ===')
    return true
  } catch (error) {
    console.error('\n=== Test failed! ===')
    console.error(error)
    return false
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runCharacterModelTests = runCharacterModelTests
}
