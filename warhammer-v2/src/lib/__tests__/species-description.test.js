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

    // Check structured data format
    expect(description).toBeDefined();
    expect(description).toHaveProperty('sections');
    expect(Array.isArray(description.sections)).toBe(true);
    expect(description.sections.length).toBeGreaterThan(0);

    // Find skills tab
    const skillsTab = description.sections.find(s =>
      s.type === 'tab' && s.sections &&
      s.sections.some(ss => ss.label === 'Compétences de race')
    );
    expect(skillsTab).toBeDefined();

    // Check that skills section has the expected skills
    const skillsSection = skillsTab.sections.find(s => s.label === 'Compétences de race');
    expect(skillsSection).toBeDefined();
    expect(skillsSection.items).toBeDefined();
    expect(Array.isArray(skillsSection.items)).toBe(true);

    const skillLabels = skillsSection.items.map(item => item.label);
    expect(skillLabels).toContain('Calme');
    expect(skillLabels).toContain('Charme');
    expect(skillLabels.some(label => label.includes('Corps à corps'))).toBe(true);

    // Find talents section
    const talentsSection = skillsTab.sections.find(s => s.label === 'Talents de race');
    expect(talentsSection).toBeDefined();
    expect(talentsSection.items).toBeDefined();
    expect(Array.isArray(talentsSection.items)).toBe(true);

    const talentLabels = talentsSection.items.map(item => item.label);
    expect(talentLabels).toContain('Perspicace');
    expect(talentLabels).toContain('Affable');
    expect(talentLabels).toContain('Destinée');
  });
});
