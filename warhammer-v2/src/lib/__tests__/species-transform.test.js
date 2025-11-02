/**
 * Test to verify species skills/talents transformation
 */

import { describe, it, expect } from 'vitest';
import { transformData } from '../db-loader.js';

describe('Species Skills/Talents Transformation', () => {
  it('should transform species skills from string to EntityReference array', () => {
    const rawData = {
      specie: [
        {
          label: 'Humains (Test)',
          skills: 'Calme, Charme, Corps à corps (Base)',
          talents: 'Perspicace ou Affable, Destinée',
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

    const { data } = transformData(rawData, { generateReport: false });

    console.log('Transformed species:', data.species[0]);
    console.log('Skills type:', typeof data.species[0].skills);
    console.log('Skills value:', data.species[0].skills);
    console.log('Talents type:', typeof data.species[0].talents);
    console.log('Talents value:', data.species[0].talents);

    // Check that skills is transformed to an array
    expect(data.species[0].skills).toBeDefined();
    expect(Array.isArray(data.species[0].skills)).toBe(true);

    // Check that talents is transformed to an array
    expect(data.species[0].talents).toBeDefined();
    expect(Array.isArray(data.species[0].talents)).toBe(true);
  });

  it('should parse skills with specializations', () => {
    const rawData = {
      specie: [
        {
          label: 'Test Species',
          skills: 'Combat (Épée), Athlétisme',
        },
      ],
      skill: [
        { label: 'Combat', specs: ['Épée'] },
        { label: 'Athlétisme' },
      ],
    };

    const { data } = transformData(rawData, { generateReport: false });

    expect(Array.isArray(data.species[0].skills)).toBe(true);
    expect(data.species[0].skills.length).toBeGreaterThan(0);

    // Check that EntityReference objects have proper structure
    const firstSkill = data.species[0].skills[0];
    expect(firstSkill).toHaveProperty('id');
    expect(firstSkill).toHaveProperty('entityType');
    expect(firstSkill).toHaveProperty('label');
  });
});
