/**
 * Unit Tests for Composable Validation Rules
 * Tests all validation rule factories and composition functionality
 */

import { describe, it, expect } from 'vitest'
import {
  required,
  minLength,
  maxLength,
  stringLength,
  pattern,
  numberType,
  minValue,
  maxValue,
  numberRange,
  email,
  url,
  arrayType,
  arrayMinLength,
  objectType,
  booleanType,
  oneOf,
  custom,
  compose,
  validate,
  validateFields,
  warnIfBelow,
  warnIfAbove
} from './validationRules.js'

describe('validationRules', () => {
  describe('required', () => {
    it('should accept non-empty values', () => {
      const rule = required('Name')
      expect(rule.validate('John').valid).toBe(true)
      expect(rule.validate(0).valid).toBe(true)
      expect(rule.validate(false).valid).toBe(true)
      expect(rule.validate(['item']).valid).toBe(true)
    })

    it('should reject empty values', () => {
      const rule = required('Name')
      expect(rule.validate(null).valid).toBe(false)
      expect(rule.validate(undefined).valid).toBe(false)
      expect(rule.validate('').valid).toBe(false)
      expect(rule.validate('   ').valid).toBe(false)
      expect(rule.validate([]).valid).toBe(false)
    })

    it('should include field name in error message', () => {
      const rule = required('Character Name')
      const result = rule.validate('')
      expect(result.error).toBe('Character Name is required')
    })
  })

  describe('minLength', () => {
    it('should accept strings at or above minimum length', () => {
      const rule = minLength(2, 'Name')
      expect(rule.validate('AB').valid).toBe(true)
      expect(rule.validate('ABC').valid).toBe(true)
      expect(rule.validate('  AB  ').valid).toBe(true) // Trims whitespace
    })

    it('should reject strings below minimum length', () => {
      const rule = minLength(2, 'Name')
      const result = rule.validate('A')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name must be at least 2 characters')
    })

    it('should skip validation for empty values', () => {
      const rule = minLength(2, 'Name')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })

    it('should handle singular/plural in error messages', () => {
      const rule1 = minLength(1, 'Name')
      expect(rule1.validate('A').error).toBe('') // Valid - at least 1 char

      const rule2 = minLength(2, 'Name')
      expect(rule2.validate('A').error).toBe('Name must be at least 2 characters')
    })
  })

  describe('maxLength', () => {
    it('should accept strings at or below maximum length', () => {
      const rule = maxLength(5, 'Name')
      expect(rule.validate('ABC').valid).toBe(true)
      expect(rule.validate('ABCDE').valid).toBe(true)
    })

    it('should reject strings above maximum length', () => {
      const rule = maxLength(5, 'Name')
      const result = rule.validate('ABCDEF')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name must be no more than 5 characters')
    })

    it('should skip validation for empty values', () => {
      const rule = maxLength(5, 'Name')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('stringLength', () => {
    it('should validate both min and max length', () => {
      const rule = stringLength(2, 5, 'Name')
      expect(rule.validate('ABC').valid).toBe(true)
      expect(rule.validate('A').valid).toBe(false)
      expect(rule.validate('ABCDEF').valid).toBe(false)
    })
  })

  describe('pattern', () => {
    it('should accept values matching the pattern', () => {
      const rule = pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID')
      expect(rule.validate('my-id-123').valid).toBe(true)
    })

    it('should reject values not matching the pattern', () => {
      const rule = pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID')
      const result = rule.validate('MyID')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('ID must contain only lowercase letters, numbers, and hyphens')
    })

    it('should accept string patterns', () => {
      const rule = pattern('^[a-z]+$', 'lowercase letters', 'ID')
      expect(rule.validate('abc').valid).toBe(true)
      expect(rule.validate('ABC').valid).toBe(false)
    })

    it('should skip validation for empty values', () => {
      const rule = pattern(/^[a-z]+$/, 'lowercase letters', 'ID')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('numberType', () => {
    it('should accept valid numbers', () => {
      const rule = numberType('Age')
      expect(rule.validate(25).valid).toBe(true)
      expect(rule.validate(0).valid).toBe(true)
      expect(rule.validate(-5).valid).toBe(true)
      expect(rule.validate(3.14).valid).toBe(true)
      expect(rule.validate('25').valid).toBe(true) // String that can be converted
    })

    it('should reject non-numeric values', () => {
      const rule = numberType('Age')
      const result = rule.validate('abc')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Age must be a valid number')
    })

    it('should skip validation for empty values', () => {
      const rule = numberType('Age')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
      expect(rule.validate(undefined).valid).toBe(true)
    })
  })

  describe('minValue', () => {
    it('should accept values at or above minimum', () => {
      const rule = minValue(0, 'Age')
      expect(rule.validate(0).valid).toBe(true)
      expect(rule.validate(10).valid).toBe(true)
    })

    it('should reject values below minimum', () => {
      const rule = minValue(0, 'Age')
      const result = rule.validate(-1)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Age must be at least 0')
    })

    it('should skip validation for empty values', () => {
      const rule = minValue(0, 'Age')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('maxValue', () => {
    it('should accept values at or below maximum', () => {
      const rule = maxValue(100, 'Age')
      expect(rule.validate(100).valid).toBe(true)
      expect(rule.validate(50).valid).toBe(true)
    })

    it('should reject values above maximum', () => {
      const rule = maxValue(100, 'Age')
      const result = rule.validate(101)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Age must be no more than 100')
    })

    it('should skip validation for empty values', () => {
      const rule = maxValue(100, 'Age')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('numberRange', () => {
    it('should validate number within range', () => {
      const rule = numberRange(0, 100, 'WS')
      expect(rule.validate(45).valid).toBe(true)
      expect(rule.validate(0).valid).toBe(true)
      expect(rule.validate(100).valid).toBe(true)
    })

    it('should reject numbers outside range', () => {
      const rule = numberRange(0, 100, 'WS')
      expect(rule.validate(-1).valid).toBe(false)
      expect(rule.validate(101).valid).toBe(false)
    })

    it('should reject non-numeric values', () => {
      const rule = numberRange(0, 100, 'WS')
      expect(rule.validate('abc').valid).toBe(false)
    })
  })

  describe('email', () => {
    it('should accept valid email addresses', () => {
      const rule = email('Email')
      expect(rule.validate('user@example.com').valid).toBe(true)
      expect(rule.validate('test.user+tag@domain.co.uk').valid).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      const rule = email('Email')
      expect(rule.validate('invalid-email').valid).toBe(false)
      expect(rule.validate('user@').valid).toBe(false)
      expect(rule.validate('@domain.com').valid).toBe(false)
    })

    it('should skip validation for empty values', () => {
      const rule = email('Email')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('url', () => {
    it('should accept valid URLs', () => {
      const rule = url('Website')
      expect(rule.validate('https://example.com').valid).toBe(true)
      expect(rule.validate('http://example.com/path?query=1').valid).toBe(true)
      expect(rule.validate('ftp://files.example.com').valid).toBe(true)
    })

    it('should reject invalid URLs', () => {
      const rule = url('Website')
      expect(rule.validate('not-a-url').valid).toBe(false)
      expect(rule.validate('http://').valid).toBe(false)
    })

    it('should skip validation for empty values', () => {
      const rule = url('Website')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
    })
  })

  describe('arrayType', () => {
    it('should accept arrays', () => {
      const rule = arrayType('Skills')
      expect(rule.validate([]).valid).toBe(true)
      expect(rule.validate([1, 2, 3]).valid).toBe(true)
    })

    it('should reject non-arrays', () => {
      const rule = arrayType('Skills')
      expect(rule.validate('not-array').valid).toBe(false)
      expect(rule.validate(123).valid).toBe(false)
      expect(rule.validate({}).valid).toBe(false)
    })

    it('should skip validation for null/undefined', () => {
      const rule = arrayType('Skills')
      expect(rule.validate(null).valid).toBe(true)
      expect(rule.validate(undefined).valid).toBe(true)
    })
  })

  describe('arrayMinLength', () => {
    it('should accept arrays with minimum length', () => {
      const rule = arrayMinLength(2, 'Skills')
      expect(rule.validate([1, 2]).valid).toBe(true)
      expect(rule.validate([1, 2, 3]).valid).toBe(true)
    })

    it('should reject arrays below minimum length', () => {
      const rule = arrayMinLength(2, 'Skills')
      const result = rule.validate([1])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Skills must contain at least 2 items')
    })

    it('should skip validation for non-arrays', () => {
      const rule = arrayMinLength(2, 'Skills')
      expect(rule.validate('not-array').valid).toBe(true)
    })

    it('should handle singular/plural in error messages', () => {
      const rule1 = arrayMinLength(1, 'Skills')
      expect(rule1.validate([]).error).toBe('Skills must contain at least 1 item')

      const rule2 = arrayMinLength(2, 'Skills')
      expect(rule2.validate([]).error).toBe('Skills must contain at least 2 items')
    })
  })

  describe('objectType', () => {
    it('should accept objects', () => {
      const rule = objectType('Characteristics')
      expect(rule.validate({}).valid).toBe(true)
      expect(rule.validate({ WS: 45 }).valid).toBe(true)
    })

    it('should reject non-objects', () => {
      const rule = objectType('Characteristics')
      expect(rule.validate('not-object').valid).toBe(false)
      expect(rule.validate(123).valid).toBe(false)
      expect(rule.validate([]).valid).toBe(false) // Arrays are not objects
    })

    it('should skip validation for null/undefined', () => {
      const rule = objectType('Characteristics')
      expect(rule.validate(null).valid).toBe(true)
      expect(rule.validate(undefined).valid).toBe(true)
    })
  })

  describe('booleanType', () => {
    it('should accept booleans', () => {
      const rule = booleanType('Equipped')
      expect(rule.validate(true).valid).toBe(true)
      expect(rule.validate(false).valid).toBe(true)
    })

    it('should reject non-booleans', () => {
      const rule = booleanType('Equipped')
      expect(rule.validate('yes').valid).toBe(false)
      expect(rule.validate(1).valid).toBe(false)
      expect(rule.validate(0).valid).toBe(false)
    })

    it('should skip validation for null/undefined', () => {
      const rule = booleanType('Equipped')
      expect(rule.validate(null).valid).toBe(true)
      expect(rule.validate(undefined).valid).toBe(true)
    })
  })

  describe('oneOf', () => {
    it('should accept allowed values', () => {
      const rule = oneOf(['small', 'medium', 'large'], 'Size')
      expect(rule.validate('small').valid).toBe(true)
      expect(rule.validate('medium').valid).toBe(true)
      expect(rule.validate('large').valid).toBe(true)
    })

    it('should reject disallowed values', () => {
      const rule = oneOf(['small', 'medium', 'large'], 'Size')
      const result = rule.validate('huge')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Size must be one of: small, medium, large')
    })

    it('should skip validation for empty values', () => {
      const rule = oneOf(['small', 'medium', 'large'], 'Size')
      expect(rule.validate('').valid).toBe(true)
      expect(rule.validate(null).valid).toBe(true)
      expect(rule.validate(undefined).valid).toBe(true)
    })
  })

  describe('custom', () => {
    it('should accept values passing custom validation', () => {
      const rule = custom((value) => value % 2 === 0, 'Value must be an even number')
      expect(rule.validate(4).valid).toBe(true)
      expect(rule.validate(10).valid).toBe(true)
    })

    it('should reject values failing custom validation', () => {
      const rule = custom((value) => value % 2 === 0, 'Value must be an even number')
      const result = rule.validate(3)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Value must be an even number')
    })
  })

  describe('compose', () => {
    it('should combine multiple rules', () => {
      const rule = compose(required('Name'), minLength(2, 'Name'), maxLength(100, 'Name'))

      expect(rule.validate('John').valid).toBe(true)
      expect(rule.validate('').valid).toBe(false) // Required fails
      expect(rule.validate('A').valid).toBe(false) // MinLength fails
      expect(rule.validate('A'.repeat(101)).valid).toBe(false) // MaxLength fails
    })

    it('should stop at first error', () => {
      const rule = compose(required('Name'), minLength(2, 'Name'), maxLength(100, 'Name'))

      const result = rule.validate('') // Required will fail first
      expect(result.error).toBe('Name is required')
    })

    it('should work with no rules', () => {
      const rule = compose()
      expect(rule.validate('anything').valid).toBe(true)
    })

    it('should work with a single rule', () => {
      const rule = compose(required('Name'))
      expect(rule.validate('John').valid).toBe(true)
      expect(rule.validate('').valid).toBe(false)
    })
  })

  describe('validate', () => {
    it('should validate a value against a rule', () => {
      const rule = compose(required('Name'), minLength(2, 'Name'))
      const result = validate('John', rule)
      expect(result.valid).toBe(true)
      expect(result.error).toBe('')
    })

    it('should return validation errors', () => {
      const rule = compose(required('Name'), minLength(2, 'Name'))
      const result = validate('A', rule)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name must be at least 2 characters')
    })
  })

  describe('validateFields', () => {
    it('should validate multiple fields', () => {
      const values = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      }

      const rules = {
        name: compose(required('Name'), minLength(2, 'Name')),
        age: numberRange(0, 100, 'Age'),
        email: compose(required('Email'), email('Email'))
      }

      const result = validateFields(values, rules)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should collect errors for invalid fields', () => {
      const values = {
        name: 'A',
        age: 150,
        email: 'invalid'
      }

      const rules = {
        name: compose(required('Name'), minLength(2, 'Name')),
        age: numberRange(0, 100, 'Age'),
        email: compose(required('Email'), email('Email'))
      }

      const result = validateFields(values, rules)
      expect(result.valid).toBe(false)
      expect(result.errors.name).toBe('Name must be at least 2 characters')
      expect(result.errors.age).toBe('Age must be no more than 100')
      expect(result.errors.email).toBe('Email must be a valid email address')
    })

    it('should handle missing fields', () => {
      const values = {
        name: 'John'
      }

      const rules = {
        name: required('Name'),
        age: required('Age')
      }

      const result = validateFields(values, rules)
      expect(result.valid).toBe(false)
      expect(result.errors.age).toBe('Age is required')
    })
  })

  describe('warnIfBelow', () => {
    it('should return warning for low values', () => {
      const rule = warnIfBelow(10, 'WS')
      const result = rule.validate(5)
      expect(result.valid).toBe(true)
      expect(result.error).toBe('')
      expect(result.warning).toBe('WS is unusually low (5)')
    })

    it('should not warn for values at or above threshold', () => {
      const rule = warnIfBelow(10, 'WS')
      const result = rule.validate(10)
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })

    it('should not warn for zero', () => {
      const rule = warnIfBelow(10, 'WS')
      const result = rule.validate(0)
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })

    it('should not warn for non-numeric values', () => {
      const rule = warnIfBelow(10, 'WS')
      const result = rule.validate('abc')
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })
  })

  describe('warnIfAbove', () => {
    it('should return warning for high values', () => {
      const rule = warnIfAbove(80, 'WS')
      const result = rule.validate(85)
      expect(result.valid).toBe(true)
      expect(result.error).toBe('')
      expect(result.warning).toBe('WS is very high (85)')
    })

    it('should not warn for values at or below threshold', () => {
      const rule = warnIfAbove(80, 'WS')
      const result = rule.validate(80)
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })

    it('should not warn for non-numeric values', () => {
      const rule = warnIfAbove(80, 'WS')
      const result = rule.validate('abc')
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })
  })

  describe('real-world usage examples', () => {
    it('should validate character name', () => {
      const nameRule = compose(
        required('Character Name'),
        minLength(2, 'Character Name'),
        maxLength(100, 'Character Name'),
        pattern(/^[a-zA-Z0-9\s'\-]+$/, "letters, numbers, spaces, hyphens, and apostrophes", 'Character Name')
      )

      expect(nameRule.validate('Gunther von Garlsberg').valid).toBe(true)
      expect(nameRule.validate("O'Malley").valid).toBe(true)
      expect(nameRule.validate('A').valid).toBe(false)
      expect(nameRule.validate('Name<script>').valid).toBe(false)
    })

    it('should validate WFRP characteristics', () => {
      const characteristicRule = compose(
        required('WS'),
        numberRange(0, 100, 'WS')
      )

      expect(characteristicRule.validate(45).valid).toBe(true)
      expect(characteristicRule.validate(0).valid).toBe(true)
      expect(characteristicRule.validate(100).valid).toBe(true)
      expect(characteristicRule.validate(-1).valid).toBe(false)
      expect(characteristicRule.validate(101).valid).toBe(false)
    })

    it('should validate skill advances', () => {
      const advancesRule = compose(
        required('Advances'),
        numberRange(0, 60, 'Advances')
      )

      expect(advancesRule.validate(10).valid).toBe(true)
      expect(advancesRule.validate(0).valid).toBe(true)
      expect(advancesRule.validate(-1).valid).toBe(false)
      expect(advancesRule.validate(61).valid).toBe(false)
    })

    it('should validate talent times taken', () => {
      const timesRule = compose(
        required('Times'),
        numberType('Times'),
        minValue(1, 'Times')
      )

      expect(timesRule.validate(1).valid).toBe(true)
      expect(timesRule.validate(3).valid).toBe(true)
      expect(timesRule.validate(0).valid).toBe(false)
      expect(timesRule.validate('abc').valid).toBe(false)
    })

    it('should validate complete character object', () => {
      const character = {
        name: 'Gunther',
        species: { id: 'human', name: 'Human' },
        career: { id: 'soldier', name: 'Soldier', level: 1 },
        characteristics: { WS: 45, BS: 40, S: 35 },
        skills: [{ id: 'melee-basic', name: 'Melee (Basic)', advances: 5 }],
        talents: [{ id: 'strike-mighty', name: 'Strike Mighty Blow', times: 1 }]
      }

      const rules = {
        name: compose(required('Name'), minLength(2, 'Name'), maxLength(100, 'Name')),
        species: compose(required('Species'), objectType('Species')),
        career: compose(required('Career'), objectType('Career')),
        characteristics: compose(required('Characteristics'), objectType('Characteristics')),
        skills: compose(required('Skills'), arrayType('Skills')),
        talents: compose(required('Talents'), arrayType('Talents'))
      }

      const result = validateFields(character, rules)
      expect(result.valid).toBe(true)
    })

    it('should validate ID format', () => {
      const idRule = compose(
        required('ID'),
        pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID'),
        custom(
          (value) => !value.startsWith('-') && !value.endsWith('-'),
          'ID cannot start or end with a hyphen'
        ),
        custom((value) => !value.includes('--'), 'ID cannot contain consecutive hyphens')
      )

      expect(idRule.validate('my-talent-id').valid).toBe(true)
      expect(idRule.validate('talent123').valid).toBe(true)
      expect(idRule.validate('MyTalent').valid).toBe(false)
      expect(idRule.validate('-invalid').valid).toBe(false)
      expect(idRule.validate('invalid-').valid).toBe(false)
      expect(idRule.validate('invalid--id').valid).toBe(false)
    })
  })
})
