/**
 * Field Validators - Validation logic for custom content creation
 *
 * This module provides validation functions for form fields when creating
 * custom content. It includes basic validators (required, string length, etc.)
 * and entity-specific validation logic.
 *
 * All validators return an object with:
 * - valid: boolean indicating if the value is valid
 * - error: string error message (empty if valid)
 */

import { getSchema } from './formSchemas.js';
import { get } from 'svelte/store';
import { mergedData } from '../stores/data.js';

/**
 * Validate a required field
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateRequired(value, fieldName = 'This field') {
  const isEmpty = value === null || value === undefined ||
                  (typeof value === 'string' && value.trim() === '') ||
                  (Array.isArray(value) && value.length === 0);

  return {
    valid: !isEmpty,
    error: isEmpty ? `${fieldName} is required` : ''
  };
}

/**
 * Validate string length
 * @param {string} value - The string to validate
 * @param {number} min - Minimum length (optional)
 * @param {number} max - Maximum length (optional)
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateStringLength(value, min = null, max = null, fieldName = 'This field') {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: '' }; // Skip if empty (use validateRequired separately)
  }

  const length = value.trim().length;

  if (min !== null && length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  if (max !== null && length > max) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${max} characters`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validate number range
 * @param {number} value - The number to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateNumberRange(value, min = null, max = null, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { valid: true, error: '' }; // Skip if empty (use validateRequired separately)
  }

  const num = Number(value);

  if (isNaN(num)) {
    return {
      valid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (min !== null && num < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (max !== null && num > max) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${max}`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validate ID format (lowercase, alphanumeric, hyphens only)
 * @param {string} value - The ID to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateIdFormat(value, fieldName = 'ID') {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  const idPattern = /^[a-z0-9-]+$/;

  if (!idPattern.test(value)) {
    return {
      valid: false,
      error: `${fieldName} must contain only lowercase letters, numbers, and hyphens`
    };
  }

  if (value.startsWith('-') || value.endsWith('-')) {
    return {
      valid: false,
      error: `${fieldName} cannot start or end with a hyphen`
    };
  }

  if (value.includes('--')) {
    return {
      valid: false,
      error: `${fieldName} cannot contain consecutive hyphens`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validate ID uniqueness within an entity type
 * @param {string} id - The ID to validate
 * @param {string} entityType - The entity type
 * @param {string} excludeId - ID to exclude from check (for editing)
 * @returns {Object} Validation result
 */
export function validateIdUniqueness(id, entityType, excludeId = null) {
  if (!id) {
    return { valid: true, error: '' }; // Skip if empty (validateRequired handles this)
  }

  const data = get(mergedData);
  const entities = data[entityType] || [];

  const exists = entities.some(entity =>
    entity.id === id && entity.id !== excludeId
  );

  return {
    valid: !exists,
    error: exists ? `An entity with ID "${id}" already exists` : ''
  };
}

/**
 * Validate pattern match (regex)
 * @param {string} value - The value to validate
 * @param {string|RegExp} pattern - The pattern to match
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {string} patternDescription - Human-readable pattern description
 * @returns {Object} Validation result
 */
export function validatePattern(value, pattern, fieldName = 'This field', patternDescription = 'the required format') {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: '' }; // Skip if empty
  }

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  if (!regex.test(value)) {
    return {
      valid: false,
      error: `${fieldName} does not match ${patternDescription}`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validate email format
 * @param {string} value - The email to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateEmail(value, fieldName = 'Email') {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: '' }; // Skip if empty
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return {
    valid: emailPattern.test(value),
    error: emailPattern.test(value) ? '' : `${fieldName} must be a valid email address`
  };
}

/**
 * Validate URL format
 * @param {string} value - The URL to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateUrl(value, fieldName = 'URL') {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: '' }; // Skip if empty
  }

  try {
    new URL(value);
    return { valid: true, error: '' };
  } catch (e) {
    return {
      valid: false,
      error: `${fieldName} must be a valid URL`
    };
  }
}

/**
 * Validate a comma-separated list
 * @param {string} value - The comma-separated string
 * @param {number} minItems - Minimum number of items (optional)
 * @param {number} maxItems - Maximum number of items (optional)
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {Object} Validation result
 */
export function validateCommaSeparatedList(value, minItems = null, maxItems = null, fieldName = 'This field') {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: '' }; // Skip if empty
  }

  const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);

  if (minItems !== null && items.length < minItems) {
    return {
      valid: false,
      error: `${fieldName} must contain at least ${minItems} item${minItems !== 1 ? 's' : ''}`
    };
  }

  if (maxItems !== null && items.length > maxItems) {
    return {
      valid: false,
      error: `${fieldName} must contain no more than ${maxItems} item${maxItems !== 1 ? 's' : ''}`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validate field based on its schema definition
 * @param {string} entityType - The entity type
 * @param {string} fieldName - The field name
 * @param {any} value - The field value
 * @param {Object} allValues - All form values (for cross-field validation)
 * @returns {Object} Validation result
 */
export function validateField(entityType, fieldName, value, allValues = {}) {
  const schema = getSchema(entityType);

  if (!schema) {
    return { valid: false, error: 'Invalid entity type' };
  }

  const field = schema.fields.find(f => f.name === fieldName);

  if (!field) {
    return { valid: true, error: '' }; // Unknown field, skip validation
  }

  // Check required
  if (field.required) {
    const requiredResult = validateRequired(value, field.label);
    if (!requiredResult.valid) {
      return requiredResult;
    }
  }

  // Skip further validation if value is empty and not required
  if (!field.required && (value === null || value === undefined || value === '')) {
    return { valid: true, error: '' };
  }

  // Type-specific validation
  switch (field.type) {
    case 'text':
      // Check pattern if specified
      if (field.pattern) {
        const patternResult = validatePattern(value, field.pattern, field.label);
        if (!patternResult.valid) {
          return patternResult;
        }
      }

      // Special handling for ID field
      if (fieldName === 'id') {
        const idFormatResult = validateIdFormat(value, field.label);
        if (!idFormatResult.valid) {
          return idFormatResult;
        }

        const idUniquenessResult = validateIdUniqueness(value, entityType);
        if (!idUniquenessResult.valid) {
          return idUniquenessResult;
        }
      }

      // Check string length constraints
      const minLength = field.minLength || null;
      const maxLength = field.maxLength || null;
      return validateStringLength(value, minLength, maxLength, field.label);

    case 'textarea':
      // Check string length constraints
      const textMinLength = field.minLength || null;
      const textMaxLength = field.maxLength || null;
      return validateStringLength(value, textMinLength, textMaxLength, field.label);

    case 'number':
      return validateNumberRange(value, field.min, field.max, field.label);

    case 'email':
      return validateEmail(value, field.label);

    case 'url':
      return validateUrl(value, field.label);

    case 'checkbox':
      // Checkbox values are always valid (true/false)
      return { valid: true, error: '' };

    case 'select':
      // Check if value is one of the valid options
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map(opt => opt.value);
        const isValid = validValues.includes(value);
        return {
          valid: isValid,
          error: isValid ? '' : `${field.label} must be one of the available options`
        };
      }
      return { valid: true, error: '' };

    default:
      return { valid: true, error: '' };
  }
}

/**
 * Validate all fields in an entity
 * @param {string} entityType - The entity type
 * @param {Object} values - All field values
 * @returns {Object} Validation result with field-specific errors
 */
export function validateEntity(entityType, values) {
  const schema = getSchema(entityType);

  if (!schema) {
    return {
      valid: false,
      errors: { _entity: 'Invalid entity type' }
    };
  }

  const errors = {};
  let hasErrors = false;

  // Validate each field
  for (const field of schema.fields) {
    const value = values[field.name];
    const result = validateField(entityType, field.name, value, values);

    if (!result.valid) {
      errors[field.name] = result.error;
      hasErrors = true;
    }
  }

  // Entity-specific validation
  const entityValidation = validateEntitySpecific(entityType, values);
  if (!entityValidation.valid) {
    Object.assign(errors, entityValidation.errors);
    hasErrors = true;
  }

  return {
    valid: !hasErrors,
    errors
  };
}

/**
 * Entity-specific validation rules
 * @param {string} entityType - The entity type
 * @param {Object} values - All field values
 * @returns {Object} Validation result
 */
function validateEntitySpecific(entityType, values) {
  const errors = {};

  switch (entityType) {
    case 'careers':
      // Validate that species format is correct if provided
      if (values.species && typeof values.species === 'string') {
        const speciesList = values.species.split(',').map(s => s.trim()).filter(s => s);
        if (speciesList.length === 0) {
          errors.species = 'If specified, species must contain at least one species name';
        }
      }
      break;

    case 'skills':
      // Validate characteristic is provided
      if (!values.characteristic) {
        errors.characteristic = 'Characteristic is required for skills';
      }
      break;

    case 'spells':
      // Validate casting number range for magic spells
      if (values.type && values.type.includes('Magie') && values.cn) {
        const cn = Number(values.cn);
        if (isNaN(cn) || cn < 0 || cn > 30) {
          errors.cn = 'Casting Number must be between 0 and 30';
        }
      }
      break;

    case 'talents':
      // Validate maxRank if specified
      if (values.maxRank) {
        const maxRank = Number(values.maxRank);
        if (isNaN(maxRank) || maxRank < 1) {
          errors.maxRank = 'Max Rank must be at least 1';
        }
      }
      break;

    case 'trappings':
      // Validate encumbrance if specified
      if (values.encumbrance) {
        const enc = Number(values.encumbrance);
        if (isNaN(enc) || enc < 0) {
          errors.encumbrance = 'Encumbrance must be a non-negative number';
        }
      }
      break;

    case 'careerLevels':
      // Validate level is 1-4
      if (values.level) {
        const level = Number(values.level);
        if (isNaN(level) || level < 1 || level > 4) {
          errors.level = 'Career level must be between 1 and 4';
        }
      }
      // Validate career is specified
      if (!values.career) {
        errors.career = 'Career is required for career levels';
      }
      break;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check for potential issues (warnings, not errors)
 * @param {string} entityType - The entity type
 * @param {Object} values - All field values
 * @returns {Array} Array of warning messages
 */
export function getWarnings(entityType, values) {
  const warnings = [];

  // Check for very short descriptions
  if (values.description && values.description.length < 20) {
    warnings.push('Description is very short. Consider adding more detail.');
  }

  // Check for very long names
  if (values.name && values.name.length > 50) {
    warnings.push('Name is quite long. Consider using a shorter name.');
  }

  // Entity-specific warnings
  switch (entityType) {
    case 'talents':
      if (!values.maxRank) {
        warnings.push('No max rank specified - this talent can be taken unlimited times.');
      }
      break;

    case 'spells':
      if (!values.cn && values.type && values.type.includes('Magie')) {
        warnings.push('No Casting Number specified for a spell.');
      }
      if (!values.range) {
        warnings.push('No range specified for the spell.');
      }
      if (!values.duration) {
        warnings.push('No duration specified for the spell.');
      }
      break;

    case 'skills':
      if (!values.characteristic) {
        warnings.push('No characteristic specified for the skill.');
      }
      break;
  }

  return warnings;
}

// Re-export sanitization function from unified module
export { sanitizeFormValues } from './sanitization.js'

/**
 * Generate a unique ID from a name
 * @param {string} name - The name to generate ID from
 * @param {string} entityType - The entity type
 * @returns {string} Generated ID
 */
export function generateIdFromName(name, entityType) {
  if (!name) {
    return '';
  }

  // Convert to lowercase, replace spaces and special chars with hyphens
  let id = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Ensure uniqueness
  const data = get(mergedData);
  const entities = data[entityType] || [];

  let finalId = id;
  let counter = 1;

  while (entities.some(entity => entity.id === finalId)) {
    finalId = `${id}-${counter}`;
    counter++;
  }

  return finalId;
}

/**
 * Get all validation errors in a flat structure
 * @param {Object} errors - Errors object from validateEntity
 * @returns {Array} Array of error messages
 */
export function getErrorMessages(errors) {
  return Object.entries(errors)
    .filter(([key]) => key !== '_entity')
    .map(([field, message]) => message);
}

/**
 * Check if there are any errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if there are errors
 */
export function hasErrors(errors) {
  return errors && Object.keys(errors).length > 0;
}
