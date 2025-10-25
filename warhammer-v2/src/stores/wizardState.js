/**
 * Wizard State Store - Manages character creation wizard flow
 *
 * This store manages the wizard's navigation state and step progression.
 * It works in conjunction with characterStore.js for character data persistence.
 *
 * Features:
 * - Current step tracking
 * - Step validation state
 * - Navigation controls (next/previous/jump)
 * - Wizard mode (creation vs edit)
 * - Auto-save integration
 *
 * V1 Reference: CharacterGenerator.html lines 8-108
 */

import { writable, derived, get } from 'svelte/store'
import { currentCharacter, updateCurrentCharacter } from './characterStore.js'

/**
 * Wizard step definitions matching V1's stepList
 * V1 Reference: CharacterGenerator.html lines 8-20
 */
export const WIZARD_STEPS = [
  { id: 0, name: 'Species', path: 'species', required: true },
  { id: 1, name: 'Careers', path: 'careers', required: true },
  { id: 2, name: 'Characteristics', path: 'characteristics', required: true },
  { id: 3, name: 'Talents', path: 'talents', required: true },
  { id: 4, name: 'Skills', path: 'skills', required: true },
  { id: 5, name: 'Trappings', path: 'trappings', required: false },
  { id: 6, name: 'Details', path: 'details', required: false },
  { id: 7, name: 'Experience', path: 'experience', required: false },
  { id: 8, name: 'Resume', path: 'resume', required: true }
]

/**
 * Current wizard step (0-8)
 * @type {import('svelte/store').Writable<number>}
 */
export const currentStep = writable(0)

/**
 * Highest step reached (for navigation validation)
 * @type {import('svelte/store').Writable<number>}
 */
export const maxStepReached = writable(0)

/**
 * Whether wizard is active
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isWizardActive = writable(false)

/**
 * Validation errors for current step
 * @type {import('svelte/store').Writable<string[]>}
 */
export const validationErrors = writable([])

/**
 * Whether current step is valid and can proceed
 * @type {import('svelte/store').Writable<boolean>}
 */
export const canProceed = writable(false)

/**
 * Wizard mode (creation or edit)
 * @type {import('svelte/store').Writable<string>}
 */
export const wizardMode = writable('creation')

/**
 * Start a new wizard session
 * V1 Reference: CharacterGenerator.html showPanel()
 * @param {Object} character - Character to edit (optional, for edit mode)
 * @returns {void}
 */
export function startWizard(character = null) {
  if (character) {
    // Edit mode - resume from last step
    wizardMode.set('edit')
    const stepIndex = character.stepIndex !== null ? character.stepIndex : 0
    currentStep.set(stepIndex)
    maxStepReached.set(WIZARD_STEPS.length - 1) // Allow navigation to all steps in edit mode
  } else {
    // Creation mode - start fresh
    wizardMode.set('creation')
    currentStep.set(0)
    maxStepReached.set(0)
  }

  isWizardActive.set(true)
  validationErrors.set([])
  canProceed.set(false)
}

/**
 * End wizard session
 * @returns {void}
 */
export function endWizard() {
  isWizardActive.set(false)
  currentStep.set(0)
  maxStepReached.set(0)
  validationErrors.set([])
  canProceed.set(false)
}

/**
 * Go to next step
 * V1 Reference: CharacterGenerator.html nextStep()
 * @returns {boolean} Success
 */
export function nextStep() {
  const current = get(currentStep)
  const canGo = get(canProceed)
  const maxReached = get(maxStepReached)

  if (!canGo) {
    console.warn('Cannot proceed to next step - validation failed')
    return false
  }

  if (current >= WIZARD_STEPS.length - 1) {
    console.warn('Already at last step')
    return false
  }

  const nextStepIndex = current + 1

  // Update character stepIndex
  const character = get(currentCharacter)
  if (character) {
    updateCurrentCharacter({ stepIndex: nextStepIndex })
  }

  // Update max step reached
  if (nextStepIndex > maxReached) {
    maxStepReached.set(nextStepIndex)
  }

  // Move to next step
  currentStep.set(nextStepIndex)

  // Reset validation for new step
  validationErrors.set([])
  canProceed.set(false)

  return true
}

/**
 * Go to previous step
 * @returns {boolean} Success
 */
export function previousStep() {
  const current = get(currentStep)

  if (current <= 0) {
    console.warn('Already at first step')
    return false
  }

  const prevStepIndex = current - 1

  // Update character stepIndex
  const character = get(currentCharacter)
  if (character) {
    updateCurrentCharacter({ stepIndex: prevStepIndex })
  }

  // Move to previous step
  currentStep.set(prevStepIndex)

  // Reset validation for new step
  validationErrors.set([])
  canProceed.set(false)

  return true
}

/**
 * Jump to a specific step
 * Only allowed if step has been reached before (maxStepReached)
 * V1 Reference: Menu navigation allows jumping back to completed steps
 * @param {number} stepIndex - Target step index
 * @returns {boolean} Success
 */
export function jumpToStep(stepIndex) {
  const maxReached = get(maxStepReached)
  const mode = get(wizardMode)

  // Validation
  if (stepIndex < 0 || stepIndex >= WIZARD_STEPS.length) {
    console.warn('Invalid step index:', stepIndex)
    return false
  }

  // In edit mode, can jump to any step
  // In creation mode, can only jump to reached steps
  if (mode === 'creation' && stepIndex > maxReached) {
    console.warn('Cannot jump to unreached step:', stepIndex)
    return false
  }

  // Update character stepIndex
  const character = get(currentCharacter)
  if (character) {
    updateCurrentCharacter({ stepIndex })
  }

  // Jump to step
  currentStep.set(stepIndex)

  // Reset validation for new step
  validationErrors.set([])
  canProceed.set(false)

  return true
}

/**
 * Set validation state for current step
 * Called by step components after validation
 * @param {boolean} isValid - Whether step is valid
 * @param {string[]} errors - Validation error messages
 * @returns {void}
 */
export function setStepValidation(isValid, errors = []) {
  canProceed.set(isValid)
  validationErrors.set(errors)
}

/**
 * Cancel wizard and return to menu
 * V1 Reference: CharacterGenerator.html defaultAction.cancel
 * @returns {void}
 */
export function cancelWizard() {
  // Clear validation state
  validationErrors.set([])
  canProceed.set(false)

  // End wizard
  endWizard()
}

/**
 * Reset current step
 * V1 Reference: Step resetAction() functions
 * @returns {void}
 */
export function resetCurrentStep() {
  validationErrors.set([])
  canProceed.set(false)
}

/**
 * Derived store: Current step info
 */
export const currentStepInfo = derived(
  currentStep,
  $currentStep => WIZARD_STEPS[$currentStep] || null
)

/**
 * Derived store: Is first step
 */
export const isFirstStep = derived(
  currentStep,
  $currentStep => $currentStep === 0
)

/**
 * Derived store: Is last step
 */
export const isLastStep = derived(
  currentStep,
  $currentStep => $currentStep === WIZARD_STEPS.length - 1
)

/**
 * Derived store: Can navigate backward
 */
export const canGoBack = derived(
  [currentStep, isWizardActive],
  ([$currentStep, $isWizardActive]) => $isWizardActive && $currentStep > 0
)

/**
 * Derived store: Can navigate forward
 */
export const canGoForward = derived(
  [currentStep, canProceed, isWizardActive],
  ([$currentStep, $canProceed, $isWizardActive]) =>
    $isWizardActive && $canProceed && $currentStep < WIZARD_STEPS.length - 1
)

/**
 * Derived store: Progress percentage (0-100)
 */
export const progressPercentage = derived(
  currentStep,
  $currentStep => Math.round(($currentStep / (WIZARD_STEPS.length - 1)) * 100)
)

/**
 * Derived store: Steps with completion status
 */
export const stepsWithStatus = derived(
  [currentStep, maxStepReached],
  ([$currentStep, $maxStepReached]) => {
    return WIZARD_STEPS.map((step, index) => ({
      ...step,
      isCurrent: index === $currentStep,
      isCompleted: index < $maxStepReached,
      isReached: index <= $maxStepReached,
      isAccessible: index <= $maxStepReached
    }))
  }
)
