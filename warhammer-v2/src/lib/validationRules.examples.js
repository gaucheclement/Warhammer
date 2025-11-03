/**
 * Validation Rules - Usage Examples
 *
 * This file demonstrates practical usage patterns for the composable validation rules.
 * These examples show how to use the rules in real-world scenarios.
 */

import {
  compose,
  required,
  minLength,
  maxLength,
  stringLength,
  pattern,
  numberRange,
  email,
  url,
  arrayType,
  objectType,
  custom,
  validateFields,
  warnIfBelow,
  warnIfAbove
} from './validationRules.js'

// ============================================================================
// WARHAMMER 4E SPECIFIC VALIDATION RULES
// ============================================================================

/**
 * Character name validation (WFRP 4e standard)
 */
export const characterNameRule = compose(
  required('Character name'),
  minLength(2, 'Character name'),
  maxLength(100, 'Character name'),
  pattern(
    /^[a-zA-Z0-9\s'\-]+$/,
    "letters, numbers, spaces, hyphens, and apostrophes",
    'Character name'
  )
)

/**
 * Characteristic value validation (0-100 range for WFRP 4e)
 * Includes warnings for unusually low (<10) or high (>80) values
 */
export const characteristicRule = compose(
  required('Characteristic'),
  numberRange(0, 100, 'Characteristic'),
  warnIfBelow(10, 'Characteristic'),
  warnIfAbove(80, 'Characteristic')
)

/**
 * Movement characteristic validation (typically 1-10 for WFRP 4e)
 */
export const movementRule = compose(
  required('Movement'),
  numberRange(1, 10, 'Movement')
)

/**
 * Skill advances validation (0-60 range for WFRP 4e)
 */
export const skillAdvancesRule = compose(
  required('Advances'),
  numberRange(0, 60, 'Advances')
)

/**
 * Talent times taken validation (minimum 1)
 */
export const talentTimesRule = compose(
  required('Times'),
  numberRange(1, Infinity, 'Times')
)

/**
 * Career level validation (1-4 for WFRP 4e)
 */
export const careerLevelRule = compose(
  required('Career level'),
  numberRange(1, 4, 'Career level')
)

/**
 * Experience points validation (non-negative)
 */
export const experienceRule = compose(
  required('Experience'),
  numberRange(0, Infinity, 'Experience')
)

/**
 * Wounds validation (positive integer)
 */
export const woundsRule = compose(
  required('Wounds'),
  numberRange(1, Infinity, 'Wounds')
)

/**
 * Fate/Fortune/Resilience/Resolve validation (non-negative)
 */
export const pointsRule = compose(
  required('Points'),
  numberRange(0, Infinity, 'Points')
)

/**
 * ID validation (lowercase alphanumeric with hyphens)
 */
export const idRule = compose(
  required('ID'),
  pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID'),
  custom(
    (value) => value && !value.startsWith('-') && !value.endsWith('-'),
    'ID cannot start or end with a hyphen'
  ),
  custom((value) => value && !value.includes('--'), 'ID cannot contain consecutive hyphens')
)

/**
 * Description validation (optional but if provided must be reasonable length)
 */
export const descriptionRule = compose(minLength(10, 'Description'), maxLength(5000, 'Description'))

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Validating a character name
 */
export function exampleCharacterName() {
  console.log('=== Character Name Validation ===')

  const validNames = ['Gunther von Garlsberg', "O'Malley", 'Alaric-the-Bold']
  const invalidNames = ['', 'A', 'Name<script>', 'A'.repeat(101)]

  validNames.forEach((name) => {
    const result = characterNameRule.validate(name)
    console.log(`"${name}": ${result.valid ? 'VALID' : 'INVALID'}`)
  })

  invalidNames.forEach((name) => {
    const result = characterNameRule.validate(name)
    console.log(`"${name}": ${result.valid ? 'VALID' : 'INVALID'} - ${result.error}`)
  })
}

/**
 * Example 2: Validating all character characteristics at once
 */
export function exampleCharacteristics() {
  console.log('=== Characteristic Validation ===')

  const characteristics = {
    M: 4,
    WS: 45,
    BS: 40,
    S: 35,
    T: 40,
    I: 38,
    Ag: 42,
    Dex: 40,
    Int: 30,
    WP: 35,
    Fel: 28
  }

  // Create rules for all characteristics
  const rules = {
    M: movementRule,
    WS: characteristicRule,
    BS: characteristicRule,
    S: characteristicRule,
    T: characteristicRule,
    I: characteristicRule,
    Ag: characteristicRule,
    Dex: characteristicRule,
    Int: characteristicRule,
    WP: characteristicRule,
    Fel: characteristicRule
  }

  const result = validateFields(characteristics, rules)
  console.log('Valid:', result.valid)
  console.log('Errors:', result.errors)
}

/**
 * Example 3: Validating a skill
 */
export function exampleSkill() {
  console.log('=== Skill Validation ===')

  const skill = {
    id: 'melee-basic',
    name: 'Melee (Basic)',
    advances: 5
  }

  const rules = {
    id: idRule,
    name: compose(required('Skill name'), minLength(2, 'Skill name'), maxLength(100, 'Skill name')),
    advances: skillAdvancesRule
  }

  const result = validateFields(skill, rules)
  console.log('Valid:', result.valid)
  console.log('Errors:', result.errors)
}

/**
 * Example 4: Validating a talent
 */
export function exampleTalent() {
  console.log('=== Talent Validation ===')

  const talent = {
    id: 'strike-mighty-blow',
    name: 'Strike Mighty Blow',
    maxRank: 3,
    times: 1,
    description: 'Add +1 to your Strength Bonus for purposes of damage calculation.'
  }

  const rules = {
    id: idRule,
    name: compose(required('Talent name'), minLength(2, 'Talent name'), maxLength(100, 'Talent name')),
    maxRank: compose(numberRange(1, Infinity, 'Max Rank')),
    times: talentTimesRule,
    description: descriptionRule
  }

  const result = validateFields(talent, rules)
  console.log('Valid:', result.valid)
  console.log('Errors:', result.errors)
}

/**
 * Example 5: Validating experience tracking
 */
export function exampleExperience() {
  console.log('=== Experience Validation ===')

  const experience = {
    total: 1000,
    spent: 750,
    available: 250
  }

  const rules = {
    total: experienceRule,
    spent: experienceRule,
    available: experienceRule
  }

  // Validate basic fields
  let result = validateFields(experience, rules)
  console.log('Basic validation valid:', result.valid)

  // Custom validation: check consistency
  const consistencyRule = custom(
    (exp) => exp.available === exp.total - exp.spent,
    'Experience calculation error: available should equal total - spent'
  )

  const consistencyResult = consistencyRule.validate(experience)
  console.log('Consistency check:', consistencyResult.valid)
}

/**
 * Example 6: Creating custom composite rules
 */
export function exampleCustomCompositeRule() {
  console.log('=== Custom Composite Rule ===')

  // Create a rule for weapon names with specific requirements
  const weaponNameRule = compose(
    required('Weapon name'),
    minLength(3, 'Weapon name'),
    maxLength(50, 'Weapon name'),
    custom(
      (name) => !name.toLowerCase().includes('nuke'),
      'Weapon name cannot contain "nuke" (not appropriate for WFRP setting)'
    )
  )

  const validWeapons = ['Hand Weapon', 'Arquebus', 'Greatsword']
  const invalidWeapons = ['', 'AK', 'Nuclear Bomb', 'A'.repeat(51)]

  validWeapons.forEach((weapon) => {
    const result = weaponNameRule.validate(weapon)
    console.log(`"${weapon}": ${result.valid ? 'VALID' : 'INVALID'}`)
  })

  invalidWeapons.forEach((weapon) => {
    const result = weaponNameRule.validate(weapon)
    console.log(`"${weapon}": ${result.valid ? 'VALID' : 'INVALID'} - ${result.error}`)
  })
}

/**
 * Example 7: Validating imported data
 */
export function exampleImportDataValidation() {
  console.log('=== Import Data Validation ===')

  const importedTalent = {
    id: 'new-talent',
    label: 'New Talent',
    description: 'A custom talent imported from another source.',
    maxRank: 2
  }

  const rules = {
    id: idRule,
    label: compose(required('Label'), minLength(2, 'Label'), maxLength(100, 'Label')),
    description: descriptionRule,
    maxRank: compose(numberRange(1, Infinity, 'Max Rank'))
  }

  const result = validateFields(importedTalent, rules)
  console.log('Valid:', result.valid)
  console.log('Errors:', result.errors)
}

/**
 * Example 8: Validating with warnings
 */
export function exampleWithWarnings() {
  console.log('=== Validation with Warnings ===')

  // Create a rule that validates and warns
  const characteristicWithWarnings = compose(
    required('WS'),
    numberRange(0, 100, 'WS'),
    warnIfBelow(10, 'WS'),
    warnIfAbove(80, 'WS')
  )

  const testValues = [5, 25, 50, 85]

  testValues.forEach((value) => {
    const result = characteristicWithWarnings.validate(value)
    console.log(`Value ${value}:`)
    console.log(`  Valid: ${result.valid}`)
    if (result.warning) {
      console.log(`  Warning: ${result.warning}`)
    }
  })
}

// ============================================================================
// BACKWARD COMPATIBILITY WRAPPERS
// ============================================================================

/**
 * Backward-compatible wrapper for validateCharacterName
 * Maintains the same API as characterValidation.js but uses the new rules
 */
export function validateCharacterName(name) {
  const result = characterNameRule.validate(name)

  // Convert to old format
  return {
    valid: result.valid,
    errors: result.valid ? [] : [result.error],
    warnings: result.warning ? [result.warning] : []
  }
}

/**
 * Backward-compatible wrapper for validateCharacteristics
 */
export function validateCharacteristics(characteristics) {
  const rules = {
    M: movementRule,
    WS: characteristicRule,
    BS: characteristicRule,
    S: characteristicRule,
    T: characteristicRule,
    I: characteristicRule,
    Ag: characteristicRule,
    Dex: characteristicRule,
    Int: characteristicRule,
    WP: characteristicRule,
    Fel: characteristicRule
  }

  const result = validateFields(characteristics, rules)

  // Convert to old format
  return {
    valid: result.valid,
    errors: Object.values(result.errors),
    warnings: []
  }
}

// ============================================================================
// RUN ALL EXAMPLES (for testing purposes)
// ============================================================================

/**
 * Run all examples - useful for testing and demonstration
 */
export function runAllExamples() {
  exampleCharacterName()
  console.log('\n')
  exampleCharacteristics()
  console.log('\n')
  exampleSkill()
  console.log('\n')
  exampleTalent()
  console.log('\n')
  exampleExperience()
  console.log('\n')
  exampleCustomCompositeRule()
  console.log('\n')
  exampleImportDataValidation()
  console.log('\n')
  exampleWithWarnings()
}

// Uncomment to run examples:
// runAllExamples()
