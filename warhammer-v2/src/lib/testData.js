/**
 * Test Data Generator
 *
 * Generates mock data for testing the DataTable component with large datasets.
 */

/**
 * Generate mock Warhammer data items
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of mock data items
 */
export function generateMockData(count = 1000) {
  const names = [
    'Gotrek', 'Felix', 'Mannfred', 'Vlad', 'Isabella', 'Balthasar', 'Magnus',
    'Teclis', 'Tyrion', 'Malekith', 'Morathi', 'Grimgor', 'Thorgrim', 'Ungrim',
    'Queek', 'Thanquol', 'Sigmar', 'Nagash', 'Settra', 'Khazrak', 'Morghur',
    'Archaon', 'Kholek', 'Malus', 'Lokhir', 'Imrik', 'Alarielle', 'Orion',
    'Durthu', 'Malagor', 'Wulfrik', 'Throgg', 'Azhag', 'Wurrzag', 'Skarsnik',
    'Belegar', 'Grombrindal', 'Hellebron', 'Rakarth', 'Khatep', 'Khalida',
    'Arkhan', 'Kemmler', 'Ghorst', 'Alberic', 'Louen', 'Fay', 'Repanse'
  ];

  const titles = [
    'the Slayer', 'the Vampire', 'the Wise', 'the Brave', 'the Cunning',
    'the Strong', 'the Swift', 'the Bold', 'the Mighty', 'the Eternal',
    'Ironfist', 'Bloodhand', 'Skullcrusher', 'Doombringer', 'Nightbane',
    'Stormborn', 'Flameheart', 'Darkblade', 'Ironclaw', 'Bonecrusher'
  ];

  const careers = [
    'Warrior Priest', 'Witch Hunter', 'Bright Wizard', 'Battle Wizard',
    'Captain', 'Knight', 'Mercenary', 'Soldier', 'Scout', 'Outlaw',
    'Burgher', 'Merchant', 'Scholar', 'Physician', 'Apothecary',
    'Charlatan', 'Entertainer', 'Gambler', 'Thief', 'Fence',
    'Rat Catcher', 'Boatman', 'Coachman', 'Grave Robber', 'Roadwarden'
  ];

  const species = ['Human', 'Dwarf', 'High Elf', 'Wood Elf', 'Halfling'];

  const statuses = ['Active', 'Retired', 'Deceased', 'Missing', 'Legendary'];

  const books = [
    'Core Rulebook',
    'Archives of the Empire Vol. I',
    'Archives of the Empire Vol. II',
    'Archives of the Empire Vol. III',
    'Middenheim: City of the White Wolf',
    'Ubersreik Adventures',
    'Enemy in Shadows',
    'Death on the Reik',
    'Power Behind the Throne',
    'The Horned Rat'
  ];

  const data = [];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];

    data.push({
      id: i + 1,
      name: `${name} ${title}`,
      career: careers[Math.floor(Math.random() * careers.length)],
      species: species[Math.floor(Math.random() * species.length)],
      level: Math.floor(Math.random() * 4) + 1,
      experience: Math.floor(Math.random() * 10000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: books[Math.floor(Math.random() * books.length)],
      ws: Math.floor(Math.random() * 50) + 20, // Weapon Skill
      bs: Math.floor(Math.random() * 50) + 20, // Ballistic Skill
      s: Math.floor(Math.random() * 50) + 20,  // Strength
      t: Math.floor(Math.random() * 50) + 20,  // Toughness
      i: Math.floor(Math.random() * 50) + 20,  // Initiative
      ag: Math.floor(Math.random() * 50) + 20, // Agility
      dex: Math.floor(Math.random() * 50) + 20, // Dexterity
      int: Math.floor(Math.random() * 50) + 20, // Intelligence
      wp: Math.floor(Math.random() * 50) + 20,  // Willpower
      fel: Math.floor(Math.random() * 50) + 20, // Fellowship
      wounds: Math.floor(Math.random() * 20) + 10,
      fate: Math.floor(Math.random() * 5),
      fortune: Math.floor(Math.random() * 5),
      resilience: Math.floor(Math.random() * 5),
      resolve: Math.floor(Math.random() * 5),
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7776000000).toISOString()
    });
  }

  return data;
}

/**
 * Generate simple test data
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of simple test items
 */
export function generateSimpleData(count = 100) {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      active: Math.random() > 0.5,
      date: new Date(Date.now() - Math.random() * 31536000000).toISOString().split('T')[0]
    });
  }

  return data;
}

/**
 * Define columns for mock character data
 */
export const mockCharacterColumns = [
  { key: 'id', label: 'ID', sortable: true, width: '60px' },
  { key: 'name', label: 'Name', sortable: true, width: '200px' },
  { key: 'career', label: 'Career', sortable: true, width: '150px' },
  { key: 'species', label: 'Species', sortable: true, width: '100px' },
  { key: 'level', label: 'Level', sortable: true, width: '80px' },
  { key: 'experience', label: 'XP', sortable: true, width: '100px' },
  { key: 'status', label: 'Status', sortable: true, width: '100px' },
  { key: 'source', label: 'Source', sortable: true, width: '180px' }
];

/**
 * Define columns for detailed character stats
 */
export const detailedCharacterColumns = [
  { key: 'id', label: 'ID', sortable: true, width: '60px' },
  { key: 'name', label: 'Name', sortable: true, width: '180px' },
  { key: 'career', label: 'Career', sortable: true, width: '130px' },
  { key: 'ws', label: 'WS', sortable: true, width: '60px' },
  { key: 'bs', label: 'BS', sortable: true, width: '60px' },
  { key: 's', label: 'S', sortable: true, width: '60px' },
  { key: 't', label: 'T', sortable: true, width: '60px' },
  { key: 'i', label: 'I', sortable: true, width: '60px' },
  { key: 'ag', label: 'Ag', sortable: true, width: '60px' },
  { key: 'dex', label: 'Dex', sortable: true, width: '60px' },
  { key: 'int', label: 'Int', sortable: true, width: '60px' },
  { key: 'wp', label: 'WP', sortable: true, width: '60px' },
  { key: 'fel', label: 'Fel', sortable: true, width: '60px' },
  { key: 'wounds', label: 'W', sortable: true, width: '60px' }
];

/**
 * Define columns for simple test data
 */
export const simpleColumns = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Name', sortable: true, width: '200px' },
  { key: 'value', label: 'Value', sortable: true, width: '120px' },
  { key: 'category', label: 'Category', sortable: true, width: '120px' },
  { key: 'active', label: 'Active', sortable: true, width: '100px', formatter: (val) => val ? 'Yes' : 'No' },
  { key: 'date', label: 'Date', sortable: true, width: '140px' }
];

/**
 * Sort data by a key
 * @param {Array} data - Data to sort
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted data
 */
export function sortData(data, key, direction = 'asc') {
  const sorted = [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal;
    }

    // Handle strings
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return aStr.localeCompare(bStr);
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}
