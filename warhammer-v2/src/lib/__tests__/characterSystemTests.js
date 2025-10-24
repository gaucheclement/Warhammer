/**
 * Character System Test Suite
 *
 * Master test file that runs all character system tests
 */

import { runCharacterModelTests } from './characterModel.test.js'
import { runCharacterValidationTests } from './characterValidation.test.js'
import { runCharacterCalculationTests } from './characterCalculations.test.js'

/**
 * Run all character system tests
 */
export function runAllCharacterTests() {
  console.log('========================================')
  console.log('CHARACTER SYSTEM TEST SUITE')
  console.log('========================================\n')

  const results = {
    model: false,
    validation: false,
    calculations: false
  }

  try {
    results.model = runCharacterModelTests()
    console.log('\n')
    results.validation = runCharacterValidationTests()
    console.log('\n')
    results.calculations = runCharacterCalculationTests()
  } catch (error) {
    console.error('Fatal error running tests:', error)
  }

  console.log('\n========================================')
  console.log('TEST SUITE SUMMARY')
  console.log('========================================')
  console.log(`Model Tests: ${results.model ? 'PASSED' : 'FAILED'}`)
  console.log(`Validation Tests: ${results.validation ? 'PASSED' : 'FAILED'}`)
  console.log(`Calculation Tests: ${results.calculations ? 'PASSED' : 'FAILED'}`)
  console.log('========================================')

  const allPassed = results.model && results.validation && results.calculations

  if (allPassed) {
    console.log('\n✓ All character system tests passed!')
  } else {
    console.log('\n✗ Some tests failed. Please review the output above.')
  }

  return allPassed
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runAllCharacterTests = runAllCharacterTests
}

// Export individual test runners as well
export { runCharacterModelTests, runCharacterValidationTests, runCharacterCalculationTests }
