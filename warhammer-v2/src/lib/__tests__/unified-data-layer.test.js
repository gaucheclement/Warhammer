/**
 * Integration tests for the unified data layer (Issue #48)
 * Tests the integration of transformData pipeline, EntityReference parsing,
 * and data quality validation in the unified data.js store.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { transformData } from '../db-loader.js';
import { generateIdsForEntities } from '../db-id-generator.js';

describe('Unified Data Layer - Issue #48', () => {
  describe('transformData Pipeline Integration', () => {
    it('should transform raw data with EntityReference parsing', () => {
      const rawData = {
        specie: [
          { label: 'Humains', id: 'humains' },
        ],
        career: [
          {
            label: 'Agitateur',
            species: 'humains',
          },
        ],
      };

      const result = transformData(rawData, { generateReport: true });

      expect(result.data).toBeDefined();
      expect(result.report).toBeDefined();
      expect(result.data.species).toHaveLength(1);
      expect(result.data.careers).toHaveLength(1);
    });

    it('should generate validation report', () => {
      const rawData = {
        specie: [{ label: 'Humains' }],
        career: [{ label: 'Agitateur', species: 'humains' }],
      };

      const { report } = transformData(rawData, { generateReport: true });

      expect(report).toBeDefined();
      expect(report.stats).toBeDefined();
      expect(report.totalEntities).toBeDefined();
      expect(report.totalReferences).toBeDefined();
    });
  });

  describe('EntityReference Object Creation', () => {
    it('should keep simple ID references as strings', () => {
      const rawData = {
        specie: [{ label: 'Humains', id: 'humains' }],
        career: [
          {
            label: 'Agitateur',
            species: 'humains',  // Simple ID reference
          },
        ],
      };

      const { data } = transformData(rawData);
      const career = data.careers[0];

      // Simple references stay as strings
      expect(career.species).toBeDefined();
      expect(typeof career.species).toBe('string');
      expect(career.species).toBe('humains');
    });

    it('should validate references and track statistics', () => {
      const rawData = {
        specie: [{ label: 'Humains', id: 'humains' }],
        career: [
          {
            label: 'Agitateur',
            species: 'humains',
          },
        ],
      };

      const { data, report } = transformData(rawData, { generateReport: true });

      // Data should be transformed
      expect(data.careers[0].species).toBe('humains');

      // Report should have statistics
      expect(report.stats).toBeDefined();
      expect(report.totalEntities).toBe(2); // 1 species + 1 career
    });
  });

  describe('Entity ID Generation', () => {
    it('should generate string IDs, not numbers', () => {
      const entities = [
        { label: 'Humains' },
        { label: 'Halflings' },
      ];

      const result = generateIdsForEntities(entities, 'species');

      result.forEach((entity) => {
        expect(typeof entity.id).toBe('string');
        // IDs are generated from labels, not prefixed with entity type
        expect(entity.id).toBeTruthy();
      });
    });

    it('should use existing IDs when present', () => {
      const entities = [
        { label: 'Humains', id: 'humains' },
        { label: 'Halflings' },
      ];

      const result = generateIdsForEntities(entities, 'species');

      expect(result[0].id).toBe('humains');
      expect(typeof result[1].id).toBe('string');
    });
  });

  describe('Data Validation and Reporting', () => {
    it('should report statistics', () => {
      const rawData = {
        specie: [{ label: 'Humains', id: 'humains' }],
        career: [
          {
            label: 'Agitateur',
            species: 'humains',
          },
        ],
      };

      const { report } = transformData(rawData, { generateReport: true });

      expect(report.stats).toBeDefined();
      expect(report.totalEntities).toBeGreaterThan(0);
      expect(report.stats.species).toBeDefined();
      expect(report.stats.careers).toBeDefined();
    });

    it('should report unresolved references', () => {
      const rawData = {
        specie: [],
        career: [
          {
            label: 'Agitateur',
            species: 'missing',
          },
        ],
      };

      const { report } = transformData(rawData, { generateReport: true });

      expect(report.unresolvedReferences).toBeDefined();
      expect(Array.isArray(report.unresolvedReferences)).toBe(true);
    });

    it('should track total references', () => {
      const rawData = {
        specie: [{ label: 'Humains', id: 'humains' }],
        career: [
          { label: 'Agitateur', species: 'humains' },
          { label: 'Artisan', species: 'humains' },
        ],
      };

      const { report } = transformData(rawData, { generateReport: true });

      expect(report.totalReferences).toBeDefined();
      expect(typeof report.totalReferences).toBe('number');
    });
  });

  describe('Data Layer Integrity', () => {
    it('should preserve entity structure after transformation', () => {
      const rawData = {
        specie: [
          {
            label: 'Humains',
            id: 'humains',
            description: 'The most common species',
          },
        ],
      };

      const { data } = transformData(rawData);
      const species = data.species[0];

      expect(species.label).toBe('Humains');
      expect(species.id).toBe('humains');
      expect(species.description).toBe('The most common species');
    });

    it('should handle all entity types', () => {
      const rawData = {
        specie: [{ label: 'Humains' }],
        career: [{ label: 'Agitateur' }],
        skill: [{ label: 'Athlétisme' }],
        talent: [{ label: 'Acuité auditive' }],
      };

      const { data } = transformData(rawData);

      expect(data.species).toBeDefined();
      expect(data.careers).toBeDefined();
      expect(data.skills).toBeDefined();
      expect(data.talents).toBeDefined();
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain array structure for all entity types', () => {
      const rawData = {
        specie: [{ label: 'Humains' }],
        career: [{ label: 'Agitateur' }],
      };

      const { data } = transformData(rawData);

      expect(Array.isArray(data.species)).toBe(true);
      expect(Array.isArray(data.careers)).toBe(true);
    });

    it('should preserve all original properties', () => {
      const originalEntity = {
        label: 'Test Entity',
        customProp: 'custom value',
        nested: { data: 'nested value' },
      };

      const rawData = { specie: [originalEntity] };
      const { data } = transformData(rawData);
      const transformed = data.species[0];

      expect(transformed.label).toBe(originalEntity.label);
      expect(transformed.customProp).toBe(originalEntity.customProp);
      expect(transformed.nested).toEqual(originalEntity.nested);
    });
  });
});
