/**
 * Character Generator - Generate random characters
 *
 * This module provides functionality to generate random characters with
 * species, career, characteristics, skills, talents, and trappings.
 */

import { rollAllCharacteristics, calculateDefaultFate, calculateDefaultResilience } from './characterCalculations.js'
import { createEmptyCharacter } from './characterModel.js'
import { calculateDerivedStats } from './characterModel.js'

/**
 * Random name lists by species
 */
const NAME_LISTS = {
  human: {
    male: ['Karl', 'Wilhelm', 'Otto', 'Hans', 'Franz', 'Gustav', 'Heinrich', 'Bruno', 'Konrad', 'Ludwig'],
    female: ['Katarina', 'Helga', 'Greta', 'Ingrid', 'Brunhilde', 'Elsa', 'Petra', 'Ursula', 'Frieda', 'Margarete']
  },
  halfling: {
    male: ['Mungo', 'Bungo', 'Bilbo', 'Frodo', 'Samwise', 'Merry', 'Pippin', 'Ponto', 'Largo', 'Fosco'],
    female: ['Primrose', 'Daisy', 'Rose', 'Lily', 'Peony', 'Poppy', 'Amaranth', 'Pansy', 'Lobelia', 'Belladonna']
  },
  dwarf: {
    male: ['Thorin', 'Balin', 'Dwalin', 'Gimli', 'Gloin', 'Oin', 'Bifur', 'Bofur', 'Bombur', 'Dain'],
    female: ['Dis', 'Katrin', 'Grelda', 'Helga', 'Brunhilde', 'Thora', 'Astrid', 'Sigrid', 'Frida', 'Gerda']
  },
  elf: {
    male: ['Arandir', 'Legolas', 'Elrond', 'Glorfindel', 'Celeborn', 'Thranduil', 'Haldir', 'Elladan', 'Elrohir', 'Lindir'],
    female: ['Arwen', 'Galadriel', 'Luthien', 'Idril', 'Nimloth', 'Finduilas', 'Morwen', 'Elwing', 'Aredhel', 'Melian']
  }
}

/**
 * Eye colors
 */
const EYE_COLORS = ['Blue', 'Brown', 'Green', 'Grey', 'Hazel', 'Amber', 'Violet', 'Dark Brown']

/**
 * Hair colors
 */
const HAIR_COLORS = ['Black', 'Dark Brown', 'Brown', 'Light Brown', 'Blonde', 'Red', 'Auburn', 'Grey', 'White', 'Silver']

/**
 * Distinguishing features
 */
const DISTINGUISHING_FEATURES = [
  'Scar across cheek',
  'Missing tooth',
  'Tattoo on arm',
  'Broken nose',
  'Piercing gaze',
  'Distinctive birthmark',
  'Crooked smile',
  'Weathered face',
  'Calloused hands',
  'Peculiar accent',
  'Limp',
  'Nervous tic',
  'Deep voice',
  'Soft-spoken',
  'Missing finger',
  'Burn scar',
  'Unusual height',
  'Broad shoulders',
  'Thin frame',
  'Muscular build'
]

/**
 * Generate a random name based on species
 * @param {Object} species - Species object
 * @returns {string} Random name
 */
export function generateRandomName(species) {
  const speciesName = (species?.name || 'human').toLowerCase()

  // Get name list for species (fallback to human)
  let nameList = NAME_LISTS[speciesName] || NAME_LISTS.human

  // Handle variations (e.g., "High Elf" -> "elf")
  if (!nameList) {
    for (const [key, value] of Object.entries(NAME_LISTS)) {
      if (speciesName.includes(key)) {
        nameList = value
        break
      }
    }
  }

  // Default to human if still not found
  if (!nameList) {
    nameList = NAME_LISTS.human
  }

  // Random gender selection
  const gender = Math.random() < 0.5 ? 'male' : 'female'
  const names = nameList[gender] || nameList.male

  // Pick random name
  const firstName = names[Math.floor(Math.random() * names.length)]

  // Add surname (simple generation)
  const surnames = ['von Berg', 'Schmidt', 'Mueller', 'Fischer', 'Weber', 'Becker', 'Koch', 'Richter', 'Klein', 'Wolf']
  const surname = surnames[Math.floor(Math.random() * surnames.length)]

  return `${firstName} ${surname}`
}

/**
 * Generate random appearance
 * @returns {Object} Appearance object
 */
export function generateRandomAppearance() {
  return {
    eyes: EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)],
    hair: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
    distinguishing: DISTINGUISHING_FEATURES[Math.floor(Math.random() * DISTINGUISHING_FEATURES.length)]
  }
}

/**
 * Select random item from array
 * @param {Array} array - Array to select from
 * @returns {*} Random item
 */
function randomFromArray(array) {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Select random species from available species
 * @param {Array} species - Available species
 * @returns {Object|null} Random species
 */
export function selectRandomSpecies(species) {
  if (!species || species.length === 0) return null
  return randomFromArray(species)
}

/**
 * Select random career from available careers (optionally filtered by species)
 * @param {Array} careers - Available careers
 * @param {Object} species - Selected species (optional)
 * @returns {Object|null} Random career
 */
export function selectRandomCareer(careers, species = null) {
  if (!careers || careers.length === 0) return null

  // Filter careers by species if specified
  let availableCareers = careers
  if (species && species.id) {
    const filtered = careers.filter(career => {
      // Check if career has species restrictions
      if (career.species && Array.isArray(career.species)) {
        return career.species.includes(species.id) || career.species.includes(species.name)
      }
      // If no restrictions, available to all
      return true
    })

    // Use filtered if not empty, otherwise use all
    if (filtered.length > 0) {
      availableCareers = filtered
    }
  }

  return randomFromArray(availableCareers)
}

/**
 * Generate random skills from career skills
 * @param {Object} career - Career object
 * @param {Array} allSkills - All available skills
 * @param {number} probability - Probability (0-1) of including each skill (default: 0.5)
 * @returns {Array} Array of character skills
 */
export function generateRandomSkills(career, allSkills, probability = 0.5) {
  const characterSkills = []

  if (!career || !career.skills || !Array.isArray(career.skills)) {
    return characterSkills
  }

  for (const careerSkill of career.skills) {
    // Random chance to include skill
    if (Math.random() < probability) {
      // Find skill definition
      const skillId = typeof careerSkill === 'string' ? careerSkill : careerSkill.id
      const skillDef = allSkills?.find(s => s.id === skillId)

      // Random advances (0-20)
      const advances = Math.floor(Math.random() * 21)

      characterSkills.push({
        id: skillId,
        name: typeof careerSkill === 'object' ? careerSkill.name : (skillDef?.name || skillId),
        advances,
        characteristic: typeof careerSkill === 'object' ? careerSkill.characteristic : (skillDef?.characteristic || '')
      })
    }
  }

  return characterSkills
}

/**
 * Generate random talents from career talents
 * @param {Object} career - Career object
 * @param {Array} allTalents - All available talents
 * @param {number} probability - Probability (0-1) of including each talent (default: 0.5)
 * @returns {Array} Array of character talents
 */
export function generateRandomTalents(career, allTalents, probability = 0.5) {
  const characterTalents = []

  if (!career || !career.talents || !Array.isArray(career.talents)) {
    return characterTalents
  }

  for (const careerTalent of career.talents) {
    // Random chance to include talent
    if (Math.random() < probability) {
      // Find talent definition
      const talentId = typeof careerTalent === 'string' ? careerTalent : careerTalent.id
      const talentDef = allTalents?.find(t => t.id === talentId)

      // Random times taken (1-3 for talents that can be taken multiple times)
      const maxRank = talentDef?.maxRank || 1
      const times = Math.min(maxRank, Math.floor(Math.random() * 3) + 1)

      characterTalents.push({
        id: talentId,
        name: typeof careerTalent === 'object' ? careerTalent.name : (talentDef?.name || talentId),
        times,
        description: typeof careerTalent === 'object' ? careerTalent.description : (talentDef?.description || '')
      })
    }
  }

  return characterTalents
}

/**
 * Generate random trappings from career trappings
 * @param {Object} career - Career object
 * @param {Array} allTrappings - All available trappings
 * @returns {Array} Array of character trappings
 */
export function generateRandomTrappings(career, allTrappings) {
  const characterTrappings = []

  if (!career || !career.trappings || !Array.isArray(career.trappings)) {
    return characterTrappings
  }

  // Include all career trappings (100% probability as per requirements)
  for (const careerTrapping of career.trappings) {
    // Find trapping definition
    const trappingId = typeof careerTrapping === 'string' ? careerTrapping : careerTrapping.id
    const trappingDef = allTrappings?.find(t => t.id === trappingId)

    characterTrappings.push({
      id: trappingId,
      name: typeof careerTrapping === 'object' ? careerTrapping.name : (trappingDef?.name || trappingId),
      quantity: 1,
      equipped: false,
      encumbrance: trappingDef?.encumbrance || 0
    })
  }

  return characterTrappings
}

/**
 * Generate a complete random character
 * @param {Object} mergedData - Merged game data (species, careers, skills, talents, trappings)
 * @param {Object} options - Generation options
 * @param {Object} options.species - Specific species to use (optional)
 * @param {Object} options.career - Specific career to use (optional)
 * @param {number} options.skillProbability - Probability of including skills (default: 0.5)
 * @param {number} options.talentProbability - Probability of including talents (default: 0.5)
 * @returns {Object} Generated character
 */
export function generateRandomCharacter(mergedData, options = {}) {
  if (!mergedData) {
    throw new Error('Merged data is required for character generation')
  }

  const {
    species: specifiedSpecies = null,
    career: specifiedCareer = null,
    skillProbability = 0.5,
    talentProbability = 0.5
  } = options

  // Select or use specified species
  const species = specifiedSpecies || selectRandomSpecies(mergedData.species)
  if (!species) {
    throw new Error('No species available for character generation')
  }

  // Select or use specified career
  const career = specifiedCareer || selectRandomCareer(mergedData.careers, species)
  if (!career) {
    throw new Error('No career available for character generation')
  }

  // Create base character
  const character = createEmptyCharacter()

  // Set name
  character.name = generateRandomName(species)

  // Set species
  character.species = {
    id: species.id,
    name: species.name
  }

  // Set career
  character.career = {
    id: career.id,
    name: career.name,
    level: 1
  }

  // Generate characteristics
  // Use species modifiers if available
  const speciesModifiers = species.characteristics || {}
  character.characteristics = rollAllCharacteristics(speciesModifiers)

  // Generate skills
  character.skills = generateRandomSkills(career, mergedData.skills, skillProbability)

  // Generate talents
  character.talents = generateRandomTalents(career, mergedData.talents, talentProbability)

  // Generate trappings
  character.trappings = generateRandomTrappings(career, mergedData.trappings)

  // Generate appearance
  character.appearance = generateRandomAppearance()

  // Set experience (starting character)
  character.experience = {
    total: 0,
    spent: 0,
    available: 0
  }

  // Calculate derived stats (wounds, fate, resilience)
  // Use centralized species defaults from characterCalculations
  character.fate.max = calculateDefaultFate(species.name)
  character.fate.current = character.fate.max

  character.resilience.max = calculateDefaultResilience(species.name)
  character.resilience.current = character.resilience.max

  // Calculate wounds
  calculateDerivedStats(character, { talents: mergedData.talents })

  // Set timestamps
  character.created = new Date().toISOString()
  character.updated = new Date().toISOString()
  character.isDraft = false

  return character
}

/**
 * Generate multiple random characters
 * @param {Object} mergedData - Merged game data
 * @param {number} count - Number of characters to generate
 * @param {Object} options - Generation options
 * @returns {Array} Array of generated characters
 */
export function generateRandomCharacters(mergedData, count, options = {}) {
  const characters = []

  for (let i = 0; i < count; i++) {
    try {
      const character = generateRandomCharacter(mergedData, options)
      characters.push(character)
    } catch (error) {
      console.error(`Failed to generate character ${i + 1}:`, error)
    }
  }

  return characters
}

/**
 * Generate a random character with specific species
 * @param {Object} mergedData - Merged game data
 * @param {string|number} speciesId - Species ID
 * @returns {Object} Generated character
 */
export function generateRandomCharacterWithSpecies(mergedData, speciesId) {
  const species = mergedData.species?.find(s => s.id === speciesId)
  if (!species) {
    throw new Error(`Species not found: ${speciesId}`)
  }

  return generateRandomCharacter(mergedData, { species })
}

/**
 * Generate a random character with specific career
 * @param {Object} mergedData - Merged game data
 * @param {string|number} careerId - Career ID
 * @returns {Object} Generated character
 */
export function generateRandomCharacterWithCareer(mergedData, careerId) {
  const career = mergedData.careers?.find(c => c.id === careerId)
  if (!career) {
    throw new Error(`Career not found: ${careerId}`)
  }

  return generateRandomCharacter(mergedData, { career })
}
