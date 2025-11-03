/**
 * Debug script to inspect species data structure
 */

import Dexie from 'dexie';

const db = new Dexie('WarhammerDB');

// Use the current schema
db.version(2).stores({
  species: 'id, label, refCareer, refDetail, refChar, book, page, folder',
});

async function debugSpecies() {
  try {
    // Get all species
    const allSpecies = await db.species.toArray();

    console.log(`\n=== Found ${allSpecies.length} species ===\n`);

    // Show first species structure
    if (allSpecies.length > 0) {
      console.log('First species structure:');
      console.log(JSON.stringify(allSpecies[0], null, 2));

      // Check for skills/talents fields
      console.log('\n=== Checking for skills/talents ===');
      allSpecies.forEach(s => {
        console.log(`\n${s.label || s.id}:`);
        console.log(`  - has skills field: ${!!s.skills}`);
        console.log(`  - has talents field: ${!!s.talents}`);
        if (s.skills) {
          console.log(`  - skills type: ${typeof s.skills}`);
          console.log(`  - skills value:`, s.skills);
        }
        if (s.talents) {
          console.log(`  - talents type: ${typeof s.talents}`);
          console.log(`  - talents value:`, s.talents);
        }

        // Check all fields
        const fields = Object.keys(s);
        console.log(`  - All fields:`, fields.join(', '));
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSpecies();
