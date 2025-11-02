/**
 * End-to-end test for species description generation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../db.js';
import { transformData, loadIntoIndexedDB } from '../db-loader.js';
import { generateSpeciesDescription } from '../db-descriptions.js';

describe('Species Description Generation - End to End', () => {
  beforeAll(async () => {
    // Clear database
    await db.delete();
    await db.open();

    // Load test data
    const rawData = {
      specie: [
        {
          label: 'Humains (Test)',
          desc: 'Description de test',
          skills: 'Calme, Charme, Corps à corps (Base)',
          talents: 'Perspicace, Affable, Destinée',
        },
      ],
      skill: [
        { label: 'Calme' },
        { label: 'Charme' },
        { label: 'Corps à corps', specs: ['Base'] },
      ],
      talent: [
        { label: 'Perspicace' },
        { label: 'Affable' },
        { label: 'Destinée' },
      ],
    };

    const { data: transformedData } = transformData(rawData);
    await loadIntoIndexedDB(db, transformedData);
  });

  it('should generate species description with skills and talents', async () => {
    const description = await generateSpeciesDescription('humains-test');

    expect(description).toBeDefined();
    expect(description).toHaveProperty('Info');
    expect(description).toHaveProperty('Comps/Talents');

    // Check that skills are listed
    expect(description['Comps/Talents']).toContain('Compétences de race');
    expect(description['Comps/Talents']).toContain('Calme');
    expect(description['Comps/Talents']).toContain('Charme');
    expect(description['Comps/Talents']).toContain('Corps à corps');

    // Check that talents are listed
    expect(description['Comps/Talents']).toContain('Talents de race');
    expect(description['Comps/Talents']).toContain('Perspicace');
    expect(description['Comps/Talents']).toContain('Affable');
    expect(description['Comps/Talents']).toContain('Destinée');

    console.log('Generated description:', description);
  });
});
