/**
 * Form Schemas - Dynamic form definitions for all entity types
 *
 * This module provides form schemas for creating custom content.
 * Each schema defines the fields, their types, validation requirements,
 * and UI organization (required vs optional, collapsible sections).
 *
 * Schema Structure:
 * - label: Human-readable name for the entity type
 * - description: Brief description of the entity type
 * - icon: Icon identifier for the entity type
 * - fields: Array of field definitions
 *   - name: Field name (property key)
 *   - label: Display label
 *   - type: Input type (text, textarea, number, select, checkbox, etc.)
 *   - required: Whether the field is required
 *   - placeholder: Placeholder text
 *   - helpText: Additional help text
 *   - options: For select fields, array of {label, value} objects
 *   - section: Optional section grouping (e.g., 'optional')
 *   - min/max: For number fields
 *   - rows: For textarea fields
 */

/**
 * All entity types supported by the custom content creator
 */
export const ENTITY_TYPES = [
  'books', 'careers', 'careerLevels', 'species', 'classes',
  'talents', 'characteristics', 'trappings', 'skills', 'spells',
  'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
  'traits', 'lores', 'magicks', 'etats', 'psychologies',
  'qualities', 'trees'
];

/**
 * Form schemas for each entity type
 */
export const FORM_SCHEMAS = {
  talents: {
    label: 'Talent',
    description: 'A talent that provides special abilities or bonuses to characters',
    icon: 'star',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-talent-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Talent Name',
        helpText: 'Display name of the talent'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what this talent does...',
        helpText: 'Full description of the talent effect',
        rows: 4
      },
      {
        name: 'maxRank',
        label: 'Max Rank',
        type: 'number',
        required: false,
        placeholder: '1',
        helpText: 'Maximum times this talent can be taken (leave empty for unlimited)',
        min: 1,
        max: 10,
        section: 'optional'
      },
      {
        name: 'tests',
        label: 'Tests',
        type: 'text',
        required: false,
        placeholder: 'Skill tests this talent applies to',
        helpText: 'What tests or situations this talent affects',
        section: 'optional'
      },
      {
        name: 'specs',
        label: 'Specializations',
        type: 'text',
        required: false,
        placeholder: 'Melee, Ranged (comma-separated)',
        helpText: 'Available specializations for this talent',
        section: 'optional'
      },
      {
        name: 'addSkill',
        label: 'Grants Skill',
        type: 'text',
        required: false,
        placeholder: 'Skill granted by this talent',
        helpText: 'Skill automatically gained when taking this talent',
        section: 'optional'
      },
      {
        name: 'addTalent',
        label: 'Grants Talent',
        type: 'text',
        required: false,
        placeholder: 'Talent granted by this talent',
        helpText: 'Talent automatically gained when taking this talent',
        section: 'optional'
      }
    ]
  },

  careers: {
    label: 'Career',
    description: 'A professional path that characters can follow',
    icon: 'briefcase',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-career-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Career Name',
        type: 'text',
        required: true,
        placeholder: 'Career Name',
        helpText: 'Display name of the career'
      },
      {
        name: 'class',
        label: 'Class',
        type: 'text',
        required: true,
        placeholder: 'Warriors, Academics, etc.',
        helpText: 'Career class category'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this career...',
        helpText: 'Background and flavor text for the career',
        rows: 4
      },
      {
        name: 'species',
        label: 'Available Species',
        type: 'text',
        required: false,
        placeholder: 'Human, Dwarf, Elf (comma-separated)',
        helpText: 'Species that can take this career',
        section: 'optional'
      },
      {
        name: 'status',
        label: 'Status',
        type: 'text',
        required: false,
        placeholder: 'Brass, Silver, Gold',
        helpText: 'Social status tier',
        section: 'optional'
      }
    ]
  },

  skills: {
    label: 'Skill',
    description: 'A trained ability that characters can use',
    icon: 'tool',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-skill-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Skill Name',
        type: 'text',
        required: true,
        placeholder: 'Skill Name',
        helpText: 'Display name of the skill'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what this skill does...',
        helpText: 'Full description of the skill',
        rows: 4
      },
      {
        name: 'characteristic',
        label: 'Characteristic',
        type: 'select',
        required: true,
        options: [
          { label: 'Weapon Skill (WS)', value: 'ws' },
          { label: 'Ballistic Skill (BS)', value: 'bs' },
          { label: 'Strength (S)', value: 's' },
          { label: 'Toughness (T)', value: 't' },
          { label: 'Initiative (I)', value: 'i' },
          { label: 'Agility (Ag)', value: 'ag' },
          { label: 'Dexterity (Dex)', value: 'dex' },
          { label: 'Intelligence (Int)', value: 'int' },
          { label: 'Willpower (WP)', value: 'wp' },
          { label: 'Fellowship (Fel)', value: 'fel' }
        ],
        helpText: 'Which characteristic is used for skill tests'
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: false,
        options: [
          { label: 'Basic', value: 'basic' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Grouped', value: 'grouped' }
        ],
        helpText: 'Basic skills or advanced skills',
        section: 'optional'
      },
      {
        name: 'advanced',
        label: 'Is Advanced',
        type: 'checkbox',
        required: false,
        helpText: 'Whether this is an advanced skill',
        section: 'optional'
      },
      {
        name: 'specs',
        label: 'Specializations',
        type: 'text',
        required: false,
        placeholder: 'Melee, Ranged (comma-separated)',
        helpText: 'Available specializations for this skill',
        section: 'optional'
      }
    ]
  },

  spells: {
    label: 'Spell',
    description: 'A magical spell or miracle that can be cast',
    icon: 'sparkles',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-spell-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Spell Name',
        type: 'text',
        required: true,
        placeholder: 'Spell Name',
        helpText: 'Display name of the spell'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what this spell does...',
        helpText: 'Full description of the spell effect',
        rows: 4
      },
      {
        name: 'type',
        label: 'Magic Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Arcane Magic', value: 'Magie des Arcanes' },
          { label: 'Chaos Magic', value: 'Magie du Chaos' },
          { label: 'Minor Magic', value: 'Magie mineure' },
          { label: 'Invocation', value: 'Invocation' }
        ],
        helpText: 'Type of magic system'
      },
      {
        name: 'cn',
        label: 'Casting Number',
        type: 'number',
        required: false,
        placeholder: '5',
        helpText: 'Difficulty to cast the spell',
        min: 0,
        max: 30,
        section: 'optional'
      },
      {
        name: 'range',
        label: 'Range',
        type: 'text',
        required: false,
        placeholder: 'Touch, Willpower yards, etc.',
        helpText: 'Maximum range of the spell',
        section: 'optional'
      },
      {
        name: 'target',
        label: 'Target',
        type: 'text',
        required: false,
        placeholder: 'Self, 1 creature, area, etc.',
        helpText: 'What can be targeted by the spell',
        section: 'optional'
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'text',
        required: false,
        placeholder: 'Instant, Willpower rounds, etc.',
        helpText: 'How long the spell lasts',
        section: 'optional'
      },
      {
        name: 'subType',
        label: 'Lore/Domain',
        type: 'text',
        required: false,
        placeholder: 'Fire, Life, Shadow, etc.',
        helpText: 'Specific lore or domain of magic',
        section: 'optional'
      }
    ]
  },

  trappings: {
    label: 'Trapping',
    description: 'Equipment, weapons, armor, or general items',
    icon: 'package',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-trapping-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Item Name',
        type: 'text',
        required: true,
        placeholder: 'Item Name',
        helpText: 'Display name of the item'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this item...',
        helpText: 'Full description of the item',
        rows: 4
      },
      {
        name: 'type',
        label: 'Item Type',
        type: 'select',
        required: false,
        options: [
          { label: 'Weapon', value: 'weapon' },
          { label: 'Armor', value: 'armor' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Tool', value: 'tool' },
          { label: 'Food & Drink', value: 'food' },
          { label: 'Container', value: 'container' },
          { label: 'Miscellaneous', value: 'misc' }
        ],
        helpText: 'Category of item',
        section: 'optional'
      },
      {
        name: 'encumbrance',
        label: 'Encumbrance',
        type: 'number',
        required: false,
        placeholder: '0',
        helpText: 'Weight/bulk of the item',
        min: 0,
        max: 100,
        section: 'optional'
      },
      {
        name: 'price',
        label: 'Price',
        type: 'text',
        required: false,
        placeholder: '10 brass, 5 silver, etc.',
        helpText: 'Cost to purchase this item',
        section: 'optional'
      },
      {
        name: 'availability',
        label: 'Availability',
        type: 'select',
        required: false,
        options: [
          { label: 'Common', value: 'common' },
          { label: 'Scarce', value: 'scarce' },
          { label: 'Rare', value: 'rare' },
          { label: 'Exotic', value: 'exotic' }
        ],
        helpText: 'How easy it is to find this item',
        section: 'optional'
      }
    ]
  },

  species: {
    label: 'Species',
    description: 'A playable race or species',
    icon: 'users',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-species-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Species Name',
        type: 'text',
        required: true,
        placeholder: 'Species Name',
        helpText: 'Display name of the species'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this species...',
        helpText: 'Background and characteristics of the species',
        rows: 4
      }
    ]
  },

  creatures: {
    label: 'Creature',
    description: 'A monster, animal, or NPC stat block',
    icon: 'dragon',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-creature-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Creature Name',
        type: 'text',
        required: true,
        placeholder: 'Creature Name',
        helpText: 'Display name of the creature'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this creature...',
        helpText: 'Background and behavior of the creature',
        rows: 4
      }
    ]
  },

  traits: {
    label: 'Trait',
    description: 'A creature trait or special ability',
    icon: 'shield',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-trait-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Trait Name',
        type: 'text',
        required: true,
        placeholder: 'Trait Name',
        helpText: 'Display name of the trait'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what this trait does...',
        helpText: 'Full description of the trait effect',
        rows: 4
      }
    ]
  },

  // Simpler entity types with basic fields
  books: {
    label: 'Book',
    description: 'A source book or supplement',
    icon: 'book',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-book-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Book Name',
        type: 'text',
        required: true,
        placeholder: 'Book Name',
        helpText: 'Full title of the book'
      },
      {
        name: 'abbreviation',
        label: 'Abbreviation',
        type: 'text',
        required: false,
        placeholder: 'CRPG',
        helpText: 'Short abbreviation for the book',
        section: 'optional'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe this book...',
        helpText: 'Brief description of the book contents',
        rows: 3,
        section: 'optional'
      }
    ]
  },

  lores: {
    label: 'Lore',
    description: 'A magical lore or domain',
    icon: 'book-open',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-lore-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Lore Name',
        type: 'text',
        required: true,
        placeholder: 'Lore of Fire, Lore of Life, etc.',
        helpText: 'Display name of the lore'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this lore...',
        helpText: 'Background and flavor for this magical lore',
        rows: 4
      }
    ]
  },

  gods: {
    label: 'God',
    description: 'A deity or divine power',
    icon: 'sun',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-god-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'God Name',
        type: 'text',
        required: true,
        placeholder: 'God Name',
        helpText: 'Display name of the deity'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this deity...',
        helpText: 'Background, domains, and worship practices',
        rows: 4
      }
    ]
  },

  // Simple reference data types
  characteristics: {
    label: 'Characteristic',
    description: 'A character statistic (WS, BS, S, T, etc.)',
    icon: 'stats',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-characteristic-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Characteristic Name',
        type: 'text',
        required: true,
        placeholder: 'Characteristic Name',
        helpText: 'Display name of the characteristic'
      },
      {
        name: 'abbreviation',
        label: 'Abbreviation',
        type: 'text',
        required: false,
        placeholder: 'WS, BS, S, etc.',
        helpText: 'Short form',
        section: 'optional'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe what this characteristic represents...',
        helpText: 'What this characteristic measures',
        rows: 3,
        section: 'optional'
      }
    ]
  },

  classes: {
    label: 'Class',
    description: 'A career class category',
    icon: 'folder',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-class-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Class Name',
        type: 'text',
        required: true,
        placeholder: 'Warriors, Academics, etc.',
        helpText: 'Display name of the class'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe this class...',
        helpText: 'General description of careers in this class',
        rows: 3,
        section: 'optional'
      }
    ]
  },

  // Character details
  eyes: {
    label: 'Eye Color',
    description: 'Physical description option for characters',
    icon: 'eye',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-eye-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Eye Color',
        type: 'text',
        required: true,
        placeholder: 'Blue, Green, Brown, etc.',
        helpText: 'Description of eye color'
      }
    ]
  },

  hairs: {
    label: 'Hair Color',
    description: 'Physical description option for characters',
    icon: 'user',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-hair-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Hair Color',
        type: 'text',
        required: true,
        placeholder: 'Blonde, Brown, Black, etc.',
        helpText: 'Description of hair color'
      }
    ]
  },

  details: {
    label: 'Distinguishing Feature',
    description: 'Physical or personality trait for characters',
    icon: 'star',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-detail-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Feature',
        type: 'text',
        required: true,
        placeholder: 'Scar, Tattoo, Mannerism, etc.',
        helpText: 'Distinguishing feature or detail'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Additional details...',
        helpText: 'More detailed description',
        rows: 2,
        section: 'optional'
      }
    ]
  },

  stars: {
    label: 'Star Sign',
    description: 'Zodiac sign for character birth',
    icon: 'stars',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-star-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Star Sign',
        type: 'text',
        required: true,
        placeholder: 'The Witchling Star, etc.',
        helpText: 'Name of the star sign'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Meaning and significance...',
        helpText: 'What being born under this sign means',
        rows: 3,
        section: 'optional'
      }
    ]
  },

  // Game mechanics
  psychologies: {
    label: 'Psychology',
    description: 'Mental state or behavioral trait',
    icon: 'brain',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-psychology-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Psychology Name',
        type: 'text',
        required: true,
        placeholder: 'Fear, Frenzy, Hatred, etc.',
        helpText: 'Name of the psychology'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the mechanical effects...',
        helpText: 'Game effects of this psychology',
        rows: 4
      }
    ]
  },

  qualities: {
    label: 'Quality',
    description: 'Item or weapon quality/flaw',
    icon: 'award',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-quality-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Quality Name',
        type: 'text',
        required: true,
        placeholder: 'Damaging, Defensive, etc.',
        helpText: 'Name of the quality'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what this quality does...',
        helpText: 'Mechanical effect of the quality',
        rows: 4
      }
    ]
  },

  etats: {
    label: 'Condition',
    description: 'Status condition affecting a character',
    icon: 'alert',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-condition-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Condition Name',
        type: 'text',
        required: true,
        placeholder: 'Stunned, Prone, Bleeding, etc.',
        helpText: 'Name of the condition'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the effects of this condition...',
        helpText: 'Mechanical effects and how to remove',
        rows: 4
      }
    ]
  },

  magicks: {
    label: 'Magic Domain',
    description: 'A domain or wind of magic',
    icon: 'wand',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-magick-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Domain Name',
        type: 'text',
        required: true,
        placeholder: 'Wind of Fire, etc.',
        helpText: 'Name of the magical domain'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe this domain of magic...',
        helpText: 'Background and characteristics',
        rows: 4
      }
    ]
  },

  trees: {
    label: 'Talent Tree',
    description: 'A progression tree for talents',
    icon: 'tree',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-tree-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Tree Name',
        type: 'text',
        required: true,
        placeholder: 'Tree Name',
        helpText: 'Name of the talent tree'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe this talent tree...',
        helpText: 'What this tree represents',
        rows: 3,
        section: 'optional'
      }
    ]
  },

  careerLevels: {
    label: 'Career Level',
    description: 'A specific tier within a career path',
    icon: 'arrow-up',
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: true,
        placeholder: 'unique-career-level-id',
        helpText: 'Unique identifier (lowercase, hyphenated)',
        pattern: '^[a-z0-9-]+$'
      },
      {
        name: 'name',
        label: 'Level Name',
        type: 'text',
        required: true,
        placeholder: 'Apprentice, Journeyman, etc.',
        helpText: 'Name of this career level'
      },
      {
        name: 'career',
        label: 'Career',
        type: 'text',
        required: true,
        placeholder: 'Career ID this level belongs to',
        helpText: 'The parent career for this level'
      },
      {
        name: 'level',
        label: 'Level Number',
        type: 'number',
        required: true,
        placeholder: '1',
        helpText: 'Tier number (1-4)',
        min: 1,
        max: 4
      },
      {
        name: 'status',
        label: 'Status',
        type: 'text',
        required: false,
        placeholder: 'Brass 3, Silver 1, etc.',
        helpText: 'Social status at this level',
        section: 'optional'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe this career level...',
        helpText: 'What characters achieve at this level',
        rows: 3,
        section: 'optional'
      }
    ]
  }
};

/**
 * Get schema for a specific entity type
 * @param {string} entityType - The entity type to get schema for
 * @returns {Object|null} Schema object or null if not found
 */
export function getSchema(entityType) {
  return FORM_SCHEMAS[entityType] || null;
}

/**
 * Get all available entity types with their labels
 * @returns {Array} Array of {value, label, description, icon} objects
 */
export function getEntityTypeOptions() {
  return Object.entries(FORM_SCHEMAS).map(([value, schema]) => ({
    value,
    label: schema.label,
    description: schema.description,
    icon: schema.icon
  })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Get fields for a specific entity type
 * @param {string} entityType - The entity type
 * @returns {Array} Array of field definitions
 */
export function getFields(entityType) {
  const schema = getSchema(entityType);
  return schema ? schema.fields : [];
}

/**
 * Get required fields for a specific entity type
 * @param {string} entityType - The entity type
 * @returns {Array} Array of required field definitions
 */
export function getRequiredFields(entityType) {
  return getFields(entityType).filter(field => field.required);
}

/**
 * Get optional fields for a specific entity type
 * @param {string} entityType - The entity type
 * @returns {Array} Array of optional field definitions
 */
export function getOptionalFields(entityType) {
  return getFields(entityType).filter(field => !field.required);
}

/**
 * Check if an entity type has optional fields
 * @param {string} entityType - The entity type
 * @returns {boolean} True if the entity type has optional fields
 */
export function hasOptionalFields(entityType) {
  return getOptionalFields(entityType).length > 0;
}
