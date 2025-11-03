/**
 * Tests for db-relations utility functions
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../db.js';
import { transformData, loadIntoIndexedDB } from '../db-loader.js';
import { resolveEntityReference } from '../db-relations.js';

describe('resolveEntityReference', () => {
  beforeAll(async () => {
    // Clear database
    await db.delete();
    await db.open();

    // Load test data with entities that have specializations
    const rawData = {
      skill: [
        {
          label: 'Athlétisme',
          desc: 'Compétence d\'athlétisme'
        },
        {
          label: 'Corps à corps',
          specs: ['Base', 'À deux mains', 'Armes d\'hast', 'Bagarre', 'Cavalerie', 'Escrime', 'Fléau', 'Parade']
        },
        {
          label: 'Langue',
          specs: ['Albionais', 'Bataille', 'Bretonnien', 'Classique', 'Elthárin', 'Estalien', 'Ghassalli', 'Gospodarin']
        },
        {
          label: 'Métier',
          specs: ['Artillerie', 'Armurie', 'Brasseur', 'Charpentier']
        },
        {
          label: 'Sens aiguisé',
          specs: ['Ouïe', 'Odorat', 'Goût', 'Toucher', 'Vue']
        }
      ],
      talent: [
        {
          label: 'Combat au contact',
          specs: ['Base', 'Arme lourde']
        },
        {
          label: 'Tireur d\'élite',
          desc: 'Talent de tir'
        }
      ],
      trapping: [
        {
          label: 'Arme courante',
          desc: 'Une arme courante'
        },
        {
          label: 'Bouclier',
          specs: ['Petit', 'Grand']
        }
      ]
    };

    const { data: transformedData } = transformData(rawData);
    await loadIntoIndexedDB(db, transformedData);
  });

  describe('null/undefined handling', () => {
    it('should return null for null reference', async () => {
      const result = await resolveEntityReference(null, db.skills);
      expect(result).toBeNull();
    });

    it('should return null for undefined reference', async () => {
      const result = await resolveEntityReference(undefined, db.skills);
      expect(result).toBeNull();
    });

    it('should return null for reference with no id', async () => {
      const result = await resolveEntityReference({}, db.skills);
      expect(result).toBeNull();
    });

    it('should return null for reference with non-existent id', async () => {
      const result = await resolveEntityReference('non-existent-skill', db.skills);
      expect(result).toBeNull();
    });

    it('should return null for object reference with non-existent id', async () => {
      const result = await resolveEntityReference({ id: 'non-existent-skill', spec: 'Base' }, db.skills);
      expect(result).toBeNull();
    });
  });

  describe('string reference (no specific specialization)', () => {
    it('should return entity as-is for string reference without specs', async () => {
      const result = await resolveEntityReference('athletisme', db.skills);

      expect(result).toBeDefined();
      expect(result.id).toBe('athletisme');
      expect(result.label).toBe('Athlétisme');
      // Should not have specs modified
      expect(result.specs).toBeUndefined();
    });

    it('should return entity with all specs for string reference with specs', async () => {
      const result = await resolveEntityReference('corps-a-corps', db.skills);

      expect(result).toBeDefined();
      expect(result.id).toBe('corps-a-corps');
      expect(result.label).toBe('Corps à corps');
      // Should return ALL possible specs from database
      expect(result.specs).toEqual(['Base', 'À deux mains', 'Armes d\'hast', 'Bagarre', 'Cavalerie', 'Escrime', 'Fléau', 'Parade']);
    });
  });

  describe('object reference with single spec', () => {
    it('should apply single spec from reference.spec', async () => {
      const result = await resolveEntityReference(
        { id: 'corps-a-corps', spec: 'Base' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('corps-a-corps');
      expect(result.label).toBe('Corps à corps');
      // Should have ONLY the specified spec
      expect(result.specs).toEqual(['Base']);
      expect(result.spec).toBe('Base');
    });

    it('should apply single spec from reference.spec for different skill', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', spec: 'Elthárin' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('langue');
      expect(result.label).toBe('Langue');
      expect(result.specs).toEqual(['Elthárin']);
      expect(result.spec).toBe('Elthárin');
    });

    it('should work with talents too', async () => {
      const result = await resolveEntityReference(
        { id: 'combat-au-contact', spec: 'Base' },
        db.talents
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('combat-au-contact');
      expect(result.specs).toEqual(['Base']);
      expect(result.spec).toBe('Base');
    });

    it('should work with trappings', async () => {
      const result = await resolveEntityReference(
        { id: 'bouclier', spec: 'Grand' },
        db.trappings
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('bouclier');
      expect(result.specs).toEqual(['Grand']);
      expect(result.spec).toBe('Grand');
    });
  });

  describe('object reference with multiple specs (array)', () => {
    it('should apply multiple specs from reference.specs array', async () => {
      const result = await resolveEntityReference(
        { id: 'metier', specs: ['Artillerie', 'Armurie'] },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('metier');
      expect(result.label).toBe('Métier');
      // Should have ONLY the specified specs
      expect(result.specs).toEqual(['Artillerie', 'Armurie']);
      // spec should be the first one
      expect(result.spec).toBe('Artillerie');
    });

    it('should handle single element array in specs', async () => {
      const result = await resolveEntityReference(
        { id: 'sens-aiguise', specs: ['Vue'] },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('sens-aiguise');
      expect(result.specs).toEqual(['Vue']);
      expect(result.spec).toBe('Vue');
    });

    it('should handle three or more specs', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', specs: ['Elthárin', 'Bretonnien', 'Classique'] },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('langue');
      expect(result.specs).toEqual(['Elthárin', 'Bretonnien', 'Classique']);
      expect(result.spec).toBe('Elthárin');
    });
  });

  describe('object reference with specs as string (not array)', () => {
    it('should convert string specs to array', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', specs: 'Elthárin' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('langue');
      // Should convert string to array
      expect(result.specs).toEqual(['Elthárin']);
      expect(result.spec).toBe('Elthárin');
    });

    it('should handle empty string in specs', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', specs: '' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('langue');
      // Empty string converts to [''] array
      expect(result.specs).toEqual(['']);
      expect(result.spec).toBe('');
    });
  });

  describe('object reference with no spec/specs (preserve original)', () => {
    it('should keep entity original specs when reference has no spec/specs', async () => {
      const result = await resolveEntityReference(
        { id: 'corps-a-corps' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('corps-a-corps');
      // Should keep the original specs from entity
      expect(result.specs).toEqual(['Base', 'À deux mains', 'Armes d\'hast', 'Bagarre', 'Cavalerie', 'Escrime', 'Fléau', 'Parade']);
    });

    it('should keep entity without specs as-is', async () => {
      const result = await resolveEntityReference(
        { id: 'athletisme' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('athletisme');
      // Should not have specs if entity didn't have them
      expect(result.specs).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should not mutate original entity', async () => {
      // First, get the original entity
      const original = await db.skills.get('corps-a-corps');
      const originalSpecs = [...original.specs];

      // Resolve with specific spec
      await resolveEntityReference(
        { id: 'corps-a-corps', spec: 'Base' },
        db.skills
      );

      // Check original is unchanged
      const afterOriginal = await db.skills.get('corps-a-corps');
      expect(afterOriginal.specs).toEqual(originalSpecs);
    });

    it('should handle empty array in specs', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', specs: [] },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('langue');
      expect(result.specs).toEqual([]);
      expect(result.spec).toBe('');
    });

    it('should work with different database collections', async () => {
      // Test with skills
      const skill = await resolveEntityReference(
        { id: 'athletisme' },
        db.skills
      );
      expect(skill).toBeDefined();
      expect(skill.id).toBe('athletisme');

      // Test with talents
      const talent = await resolveEntityReference(
        { id: 'tireur-d-elite' },
        db.talents
      );
      expect(talent).toBeDefined();
      expect(talent.id).toBe('tireur-d-elite');

      // Test with trappings
      const trapping = await resolveEntityReference(
        { id: 'arme-courante' },
        db.trappings
      );
      expect(trapping).toBeDefined();
      expect(trapping.id).toBe('arme-courante');
    });
  });

  describe('integration: typical use cases', () => {
    it('should handle Wood Elf "Corps à corps (Base)" case', async () => {
      const result = await resolveEntityReference(
        { id: 'corps-a-corps', spec: 'Base' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.label).toBe('Corps à corps');
      expect(result.specs).toEqual(['Base']);
      // When displayed with getEntityLabel, this should show "Corps à corps (Base)"
    });

    it('should handle Wood Elf "Langue (Elthárin)" case', async () => {
      const result = await resolveEntityReference(
        { id: 'langue', spec: 'Elthárin' },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.label).toBe('Langue');
      expect(result.specs).toEqual(['Elthárin']);
      // When displayed with getEntityLabel, this should show "Langue (Elthárin)"
    });

    it('should handle "Métier (Artillerie ou Armurie)" case with multiple specs', async () => {
      const result = await resolveEntityReference(
        { id: 'metier', specs: ['Artillerie', 'Armurie'] },
        db.skills
      );

      expect(result).toBeDefined();
      expect(result.label).toBe('Métier');
      expect(result.specs).toEqual(['Artillerie', 'Armurie']);
      // When displayed with getEntityLabel, this should show "Métier (Artillerie ou Armurie)"
    });

    it('should handle simple skill without specialization', async () => {
      const result = await resolveEntityReference('athletisme', db.skills);

      expect(result).toBeDefined();
      expect(result.label).toBe('Athlétisme');
      expect(result.specs).toBeUndefined();
      // When displayed with getEntityLabel, this should show "Athlétisme" (no parentheses)
    });
  });
});
