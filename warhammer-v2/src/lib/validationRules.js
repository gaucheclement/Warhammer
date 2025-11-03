/**
 * Composable Validation Rules - Unified validation system
 *
 * This module provides composable validation rules that can be combined
 * and reused across different validation contexts. It eliminates duplication
 * between characterValidation.js, validation.js, and validators.js by
 * providing a single source of truth for validation logic.
 *
 * ARCHITECTURE:
 * - ValidationRule: Object with validate(value) function returning {valid, error}
 * - Rule factories: Functions that create ValidationRule objects
 * - compose(): Combines multiple rules into a single rule
 * - validate(): Helper to run validation and collect errors
 *
 * USAGE EXAMPLES:
 *
 * // Simple required field validation
 * const nameRule = required('Name')
 * const result = nameRule.validate('John')
 * // => { valid: true, error: '' }
 *
 * // Composing multiple rules
 * const nameRules = compose(
 *   required('Name'),
 *   minLength(2, 'Name'),
 *   maxLength(100, 'Name')
 * )
 * const result = nameRules.validate('A')
 * // => { valid: false, error: 'Name must be at least 2 characters' }
 *
 * // Validating character characteristics
 * const characteristicRule = compose(
 *   required('WS'),
 *   numberRange(0, 100, 'WS')
 * )
 * const result = characteristicRule.validate(45)
 * // => { valid: true, error: '' }
 *
 * // Pattern matching
 * const idRule = compose(
 *   required('ID'),
 *   pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID')
 * )
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} error - Error message (empty if valid)
 * @property {string} [warning] - Optional warning message
 */

/**
 * @typedef {Object} ValidationRule
 * @property {function(any): ValidationResult} validate - Validation function
 */

/**
 * Rule: Required field
 * Validates that a value is not null, undefined, empty string, or empty array
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = required('Name')
 * rule.validate('John') // => { valid: true, error: '' }
 * rule.validate('') // => { valid: false, error: 'Name is required' }
 */
export function required(fieldName = 'This field') {
  return {
    validate(value) {
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)

      return {
        valid: !isEmpty,
        error: isEmpty ? `${fieldName} is required` : ''
      }
    }
  }
}

/**
 * Rule: Minimum string length
 * Validates that a string has at least the specified length
 *
 * @param {number} min - Minimum length
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = minLength(2, 'Name')
 * rule.validate('John') // => { valid: true, error: '' }
 * rule.validate('A') // => { valid: false, error: 'Name must be at least 2 characters' }
 */
export function minLength(min, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (!value || typeof value !== 'string') {
        return { valid: true, error: '' }
      }

      const length = value.trim().length

      if (length < min) {
        return {
          valid: false,
          error: `${fieldName} must be at least ${min} character${min !== 1 ? 's' : ''}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Maximum string length
 * Validates that a string does not exceed the specified length
 *
 * @param {number} max - Maximum length
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = maxLength(100, 'Name')
 * rule.validate('John') // => { valid: true, error: '' }
 * rule.validate('A'.repeat(101)) // => { valid: false, error: 'Name must be no more than 100 characters' }
 */
export function maxLength(max, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (!value || typeof value !== 'string') {
        return { valid: true, error: '' }
      }

      const length = value.trim().length

      if (length > max) {
        return {
          valid: false,
          error: `${fieldName} must be no more than ${max} character${max !== 1 ? 's' : ''}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: String length range
 * Validates that a string is within a length range
 *
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = stringLength(2, 100, 'Name')
 * rule.validate('John') // => { valid: true, error: '' }
 */
export function stringLength(min, max, fieldName = 'This field') {
  return compose(minLength(min, fieldName), maxLength(max, fieldName))
}

/**
 * Rule: Pattern matching
 * Validates that a value matches a regular expression pattern
 *
 * @param {RegExp|string} regex - Regular expression or pattern string
 * @param {string} description - Human-readable pattern description
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = pattern(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and hyphens', 'ID')
 * rule.validate('my-id-123') // => { valid: true, error: '' }
 * rule.validate('MyID') // => { valid: false, error: 'ID must contain only lowercase letters, numbers, and hyphens' }
 */
export function pattern(regex, description, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (!value || typeof value !== 'string') {
        return { valid: true, error: '' }
      }

      const pattern = typeof regex === 'string' ? new RegExp(regex) : regex

      if (!pattern.test(value)) {
        return {
          valid: false,
          error: `${fieldName} must contain only ${description}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Number type validation
 * Validates that a value is a valid number
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = numberType('Age')
 * rule.validate(25) // => { valid: true, error: '' }
 * rule.validate('25') // => { valid: true, error: '' }
 * rule.validate('abc') // => { valid: false, error: 'Age must be a valid number' }
 */
export function numberType(fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined || value === '') {
        return { valid: true, error: '' }
      }

      const num = Number(value)

      if (isNaN(num)) {
        return {
          valid: false,
          error: `${fieldName} must be a valid number`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Minimum number value
 * Validates that a number is at least the specified value
 *
 * @param {number} min - Minimum value
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = minValue(0, 'Age')
 * rule.validate(25) // => { valid: true, error: '' }
 * rule.validate(-1) // => { valid: false, error: 'Age must be at least 0' }
 */
export function minValue(min, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined || value === '') {
        return { valid: true, error: '' }
      }

      const num = Number(value)

      if (isNaN(num)) {
        return { valid: true, error: '' } // Let numberType handle this
      }

      if (num < min) {
        return {
          valid: false,
          error: `${fieldName} must be at least ${min}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Maximum number value
 * Validates that a number does not exceed the specified value
 *
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = maxValue(100, 'Age')
 * rule.validate(25) // => { valid: true, error: '' }
 * rule.validate(101) // => { valid: false, error: 'Age must be no more than 100' }
 */
export function maxValue(max, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined || value === '') {
        return { valid: true, error: '' }
      }

      const num = Number(value)

      if (isNaN(num)) {
        return { valid: true, error: '' } // Let numberType handle this
      }

      if (num > max) {
        return {
          valid: false,
          error: `${fieldName} must be no more than ${max}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Number range
 * Validates that a number is within a specified range
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = numberRange(0, 100, 'WS')
 * rule.validate(45) // => { valid: true, error: '' }
 * rule.validate(-1) // => { valid: false, error: 'WS must be at least 0' }
 * rule.validate(101) // => { valid: false, error: 'WS must be no more than 100' }
 */
export function numberRange(min, max, fieldName = 'This field') {
  return compose(numberType(fieldName), minValue(min, fieldName), maxValue(max, fieldName))
}

/**
 * Rule: Email format
 * Validates that a value is a valid email address
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = email('Email')
 * rule.validate('user@example.com') // => { valid: true, error: '' }
 * rule.validate('invalid-email') // => { valid: false, error: 'Email must be a valid email address' }
 */
export function email(fieldName = 'Email') {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (!value || typeof value !== 'string') {
        return { valid: true, error: '' }
      }

      if (!emailPattern.test(value)) {
        return {
          valid: false,
          error: `${fieldName} must be a valid email address`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: URL format
 * Validates that a value is a valid URL
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = url('Website')
 * rule.validate('https://example.com') // => { valid: true, error: '' }
 * rule.validate('not-a-url') // => { valid: false, error: 'Website must be a valid URL' }
 */
export function url(fieldName = 'URL') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (!value || typeof value !== 'string') {
        return { valid: true, error: '' }
      }

      try {
        new URL(value)
        return { valid: true, error: '' }
      } catch (e) {
        return {
          valid: false,
          error: `${fieldName} must be a valid URL`
        }
      }
    }
  }
}

/**
 * Rule: Array type validation
 * Validates that a value is an array
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = arrayType('Skills')
 * rule.validate([1, 2, 3]) // => { valid: true, error: '' }
 * rule.validate('not-array') // => { valid: false, error: 'Skills must be an array' }
 */
export function arrayType(fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined) {
        return { valid: true, error: '' }
      }

      if (!Array.isArray(value)) {
        return {
          valid: false,
          error: `${fieldName} must be an array`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Array minimum length
 * Validates that an array has at least the specified number of items
 *
 * @param {number} min - Minimum number of items
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = arrayMinLength(1, 'Skills')
 * rule.validate([1, 2]) // => { valid: true, error: '' }
 * rule.validate([]) // => { valid: false, error: 'Skills must contain at least 1 item' }
 */
export function arrayMinLength(min, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if not array (use arrayType separately)
      if (!Array.isArray(value)) {
        return { valid: true, error: '' }
      }

      if (value.length < min) {
        return {
          valid: false,
          error: `${fieldName} must contain at least ${min} item${min !== 1 ? 's' : ''}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Object type validation
 * Validates that a value is an object
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = objectType('Characteristics')
 * rule.validate({WS: 45}) // => { valid: true, error: '' }
 * rule.validate('not-object') // => { valid: false, error: 'Characteristics must be an object' }
 */
export function objectType(fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined) {
        return { valid: true, error: '' }
      }

      if (typeof value !== 'object' || Array.isArray(value)) {
        return {
          valid: false,
          error: `${fieldName} must be an object`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Boolean type validation
 * Validates that a value is a boolean
 *
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = booleanType('Equipped')
 * rule.validate(true) // => { valid: true, error: '' }
 * rule.validate('yes') // => { valid: false, error: 'Equipped must be true or false' }
 */
export function booleanType(fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined) {
        return { valid: true, error: '' }
      }

      if (typeof value !== 'boolean') {
        return {
          valid: false,
          error: `${fieldName} must be true or false`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: One of (enum)
 * Validates that a value is one of the allowed values
 *
 * @param {Array} allowedValues - Array of allowed values
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = oneOf(['small', 'medium', 'large'], 'Size')
 * rule.validate('medium') // => { valid: true, error: '' }
 * rule.validate('huge') // => { valid: false, error: 'Size must be one of: small, medium, large' }
 */
export function oneOf(allowedValues, fieldName = 'This field') {
  return {
    validate(value) {
      // Skip if empty (use required separately)
      if (value === null || value === undefined || value === '') {
        return { valid: true, error: '' }
      }

      if (!allowedValues.includes(value)) {
        return {
          valid: false,
          error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
        }
      }

      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Custom validation function
 * Creates a rule from a custom validation function
 *
 * @param {function(any): boolean} fn - Validation function returning true if valid
 * @param {string} errorMessage - Error message to display if invalid
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * const rule = custom(
 *   (value) => value % 2 === 0,
 *   'Value must be an even number'
 * )
 * rule.validate(4) // => { valid: true, error: '' }
 * rule.validate(3) // => { valid: false, error: 'Value must be an even number' }
 */
export function custom(fn, errorMessage) {
  return {
    validate(value) {
      const isValid = fn(value)
      return {
        valid: isValid,
        error: isValid ? '' : errorMessage
      }
    }
  }
}

/**
 * Compose multiple validation rules into a single rule
 * Rules are applied in order, stopping at the first error
 *
 * @param {...ValidationRule} rules - Validation rules to compose
 * @returns {ValidationRule} Combined validation rule
 *
 * @example
 * const nameRules = compose(
 *   required('Name'),
 *   minLength(2, 'Name'),
 *   maxLength(100, 'Name')
 * )
 * const result = nameRules.validate('A')
 * // => { valid: false, error: 'Name must be at least 2 characters' }
 */
export function compose(...rules) {
  return {
    validate(value) {
      for (const rule of rules) {
        const result = rule.validate(value)
        if (!result.valid) {
          return result
        }
      }
      return { valid: true, error: '' }
    }
  }
}

/**
 * Validate a value against a rule and return the result
 * Convenience function for one-off validations
 *
 * @param {any} value - Value to validate
 * @param {ValidationRule} rule - Validation rule to apply
 * @returns {ValidationResult} Validation result
 *
 * @example
 * const result = validate('John', compose(required('Name'), minLength(2, 'Name')))
 * // => { valid: true, error: '' }
 */
export function validate(value, rule) {
  return rule.validate(value)
}

/**
 * Validate multiple fields against their rules
 * Returns an object with errors for each field that failed validation
 *
 * @param {Object} values - Object with field names as keys and values to validate
 * @param {Object} rules - Object with field names as keys and ValidationRule as values
 * @returns {Object} Object with { valid: boolean, errors: {fieldName: error, ...} }
 *
 * @example
 * const values = { name: 'A', age: 150 }
 * const rules = {
 *   name: compose(required('Name'), minLength(2, 'Name')),
 *   age: numberRange(0, 100, 'Age')
 * }
 * const result = validateFields(values, rules)
 * // => { valid: false, errors: { name: 'Name must be at least 2 characters', age: 'Age must be no more than 100' } }
 */
export function validateFields(values, rules) {
  const errors = {}
  let hasErrors = false

  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = values[fieldName]
    const result = rule.validate(value)

    if (!result.valid) {
      errors[fieldName] = result.error
      hasErrors = true
    }
  }

  return {
    valid: !hasErrors,
    errors
  }
}

/**
 * WARNING RULES
 * These rules return warnings instead of errors
 */

/**
 * Rule: Warning for low value
 * Returns a warning if a number is below a threshold
 *
 * @param {number} threshold - Warning threshold
 * @param {string} fieldName - Name of the field (for warning messages)
 * @returns {ValidationRule} Validation rule with warning
 *
 * @example
 * const rule = warnIfBelow(10, 'WS')
 * rule.validate(5) // => { valid: true, error: '', warning: 'WS is unusually low (5)' }
 */
export function warnIfBelow(threshold, fieldName = 'This field') {
  return {
    validate(value) {
      if (typeof value === 'number' && value > 0 && value < threshold) {
        return {
          valid: true,
          error: '',
          warning: `${fieldName} is unusually low (${value})`
        }
      }
      return { valid: true, error: '' }
    }
  }
}

/**
 * Rule: Warning for high value
 * Returns a warning if a number exceeds a threshold
 *
 * @param {number} threshold - Warning threshold
 * @param {string} fieldName - Name of the field (for warning messages)
 * @returns {ValidationRule} Validation rule with warning
 *
 * @example
 * const rule = warnIfAbove(80, 'WS')
 * rule.validate(85) // => { valid: true, error: '', warning: 'WS is very high (85)' }
 */
export function warnIfAbove(threshold, fieldName = 'This field') {
  return {
    validate(value) {
      if (typeof value === 'number' && value > threshold) {
        return {
          valid: true,
          error: '',
          warning: `${fieldName} is very high (${value})`
        }
      }
      return { valid: true, error: '' }
    }
  }
}
