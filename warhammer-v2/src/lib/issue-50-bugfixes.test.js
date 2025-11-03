/**
 * Issue #50 Bug Fixes Tests
 *
 * Tests for all 5 remaining bugs:
 * - Bug #1: Career ranks don't display
 * - Bug #4: Quality "devastatrice" not found
 * - Bug #5: Species "Détails" tab shows placeholder
 * - Bug #6: Species "Caractéristiques" tab shows placeholder
 * - Bug #7: CareerLevel shows no description
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db.js'
import {
  generateCareerDescription,
  generateCareerLevelDescription,
  generateSpeciesDescription,
  generateTrappingDescription,
  generateQualityDescription
} from './db-descriptions.js'

describe('Issue #50 Bug Fixes', () => {
  beforeEach(async () => {
    // Clear database
    await db.careers.clear()
    await db.careerLevels.clear()
    await db.species.clear()
    await db.classes.clear()
    await db.characteristics.clear()
    await db.skills.clear()
    await db.talents.clear()
    await db.trappings.clear()
    await db.qualities.clear()

    // Add test data
    await db.classes.add({ id: 'warriors', label: 'Guerriers', name: 'Guerriers' })

    await db.characteristics.bulkAdd([
      { id: 'ws', label: 'Capacité de Combat', abr: 'CC', type: 'Combat' },
      { id: 'bs', label: 'Capacité de Tir', abr: 'CT', type: 'Combat' },
      { id: 's', label: 'Force', abr: 'F', type: 'Physique' },
      { id: 't', label: 'Endurance', abr: 'E', type: 'Physique' },
      { id: 'i', label: 'Initiative', abr: 'I', type: 'Mental' },
      { id: 'ag', label: 'Agilité', abr: 'Ag', type: 'Physique' },
      { id: 'dex', label: 'Dextérité', abr: 'Dex', type: 'Physique' },
      { id: 'int', label: 'Intelligence', abr: 'Int', type: 'Mental' },
      { id: 'wp', label: 'Force Mentale', abr: 'FM', type: 'Mental' },
      { id: 'fel', label: 'Sociabilité', abr: 'Soc', type: 'Social' }
    ])

    await db.skills.bulkAdd([
      { id: 'athleticism', label: 'Athlétisme', name: 'Athlétisme', characteristic: 'ag' },
      { id: 'melee', label: 'Combat au contact', name: 'Combat au contact', characteristic: 'ws' }
    ])

    await db.talents.bulkAdd([
      { id: 'combat-master', label: 'Maître combattant', name: 'Maître combattant', max: 1 },
      { id: 'strike-mighty', label: 'Frappe puissante', name: 'Frappe puissante', max: 3 }
    ])

    await db.qualities.bulkAdd([
      { id: 'devastating', label: 'Devastatrice', name: 'Devastatrice', type: 'quality', desc: 'This weapon is particularly devastating' },
      { id: 'fast', label: 'Rapide', name: 'Rapide', type: 'quality', desc: 'This weapon is fast' }
    ])

    await db.trappings.bulkAdd([
      {
        id: 'longsword',
        label: 'Épée longue',
        name: 'Épée longue',
        type: 'melee',
        damage: '+7',
        qualities: ['devastating', 'fast'],
        desc: 'A long sword'
      },
      {
        id: 'broken-sword',
        label: 'Épée cassée',
        name: 'Épée cassée',
        type: 'melee',
        damage: '+2',
        qualities: ['nonexistent-quality'], // This quality doesn't exist
        desc: 'A broken sword'
      }
    ])

    // Add career with levels (linked to human species)
    await db.careers.add({
      id: 'soldier',
      label: 'Soldat',
      name: 'Soldat',
      class: 'warriors',
      species: ['human'], // Link to human species
      desc: 'A professional warrior'
    })

    await db.careerLevels.bulkAdd([
      {
        id: 'soldier|recruit',
        label: 'Recrue',
        name: 'Recrue',
        career: 'soldier',
        careerLevel: 1,
        level: 1,
        status: 'Bronze 3',
        characteristics: ['ws', 'bs', 's'],
        skills: ['athleticism', 'melee'],
        talents: ['combat-master'],
        trappings: ['longsword']
      },
      {
        id: 'soldier|soldier',
        label: 'Soldat',
        name: 'Soldat',
        career: 'soldier',
        careerLevel: 2,
        level: 2,
        status: 'Silver 1',
        characteristics: ['ws', 'bs', 't'],
        skills: ['melee'],
        talents: ['strike-mighty'],
        trappings: []
      },
      {
        id: 'soldier|sergeant',
        label: 'Sergent',
        name: 'Sergent',
        career: 'soldier',
        careerLevel: 3,
        level: 3,
        status: 'Gold 2',
        characteristics: ['ws', 'fel'],
        skills: ['melee'],
        talents: ['strike-mighty'],
        trappings: []
      },
      {
        id: 'soldier|captain',
        label: 'Capitaine',
        name: 'Capitaine',
        career: 'soldier',
        careerLevel: 4,
        level: 4,
        status: 'Gold 4',
        characteristics: ['ws', 'fel'],
        skills: ['melee'],
        talents: ['combat-master', 'strike-mighty'],
        trappings: []
      }
    ])

    // Add species with data
    await db.species.add({
      id: 'human',
      label: 'Humain',
      name: 'Humain',
      desc: 'Humans are the most common species',
      skills: ['athleticism'],
      talents: ['combat-master'],
      // Add characteristic modifiers for the characteristics tab
      characteristics: {
        ws: 20,
        bs: 20,
        s: 20,
        t: 20,
        i: 20,
        ag: 20,
        dex: 20,
        int: 20,
        wp: 20,
        fel: 20
      },
      // Add age and size for details tab
      age: { min: 16, max: 80 },
      height: { min: 150, max: 190 },
      eyes: ['Bleus', 'Verts', 'Marrons', 'Noirs'],
      hair: ['Blonds', 'Bruns', 'Roux', 'Noirs']
    })
  })

  afterEach(async () => {
    await db.careers.clear()
    await db.careerLevels.clear()
    await db.species.clear()
    await db.classes.clear()
    await db.characteristics.clear()
    await db.skills.clear()
    await db.talents.clear()
    await db.trappings.clear()
    await db.qualities.clear()
  })

  describe('Bug #1: Career ranks display', () => {
    it('should generate career description with rank information for each level', async () => {
      const desc = await generateCareerDescription('soldier')

      expect(desc).toBeTruthy()
      expect(desc.sections).toBeTruthy()
      expect(Array.isArray(desc.sections)).toBe(true)

      // Find level tabs (should be 4 levels)
      const levelTabs = desc.sections.filter(s => s.type === 'tab' && s.rank)

      expect(levelTabs.length).toBe(4)

      // Check each level has correct rank
      expect(levelTabs[0].rank).toBe(1)
      expect(levelTabs[0].tabLabel).toBe('Niveau 1')

      expect(levelTabs[1].rank).toBe(2)
      expect(levelTabs[1].tabLabel).toBe('Niveau 2')

      expect(levelTabs[2].rank).toBe(3)
      expect(levelTabs[2].tabLabel).toBe('Niveau 3')

      expect(levelTabs[3].rank).toBe(4)
      expect(levelTabs[3].tabLabel).toBe('Niveau 4')
    })

    it('should include rank in tab metadata for proper icon display', async () => {
      const desc = await generateCareerDescription('soldier')

      const levelTabs = desc.sections.filter(s => s.type === 'tab' && s.rank)

      // Each level tab should have rank property for RankIcon component
      levelTabs.forEach((tab, index) => {
        expect(tab.rank).toBe(index + 1)
        expect(tab.tabKey).toBe(`level-${index + 1}`)
      })
    })
  })

  describe('Bug #4: Quality entity not found', () => {
    it('should handle missing qualities gracefully without throwing errors', async () => {
      // This trapping references a non-existent quality
      const desc = await generateTrappingDescription('broken-sword')

      expect(desc).toBeTruthy()
      expect(desc.sections).toBeTruthy()

      // Should still generate description even with missing quality
      // The qualities section should filter out invalid references
      const qualitiesSection = desc.sections.find(s => s.label === 'Atouts et Défauts')

      // If no valid qualities, section shouldn't exist OR should be empty
      if (qualitiesSection) {
        expect(qualitiesSection.items).toEqual([])
      }
    })

    it('should successfully load valid qualities', async () => {
      const desc = await generateTrappingDescription('longsword')

      expect(desc).toBeTruthy()

      const qualitiesSection = desc.sections.find(s => s.label === 'Atouts et Défauts')

      expect(qualitiesSection).toBeTruthy()
      expect(qualitiesSection.items).toHaveLength(2)
      expect(qualitiesSection.items[0].id).toBe('devastating')
      expect(qualitiesSection.items[1].id).toBe('fast')
    })

    it('should generate quality description when quality exists', async () => {
      const desc = await generateQualityDescription('devastating')

      expect(desc).toBeTruthy()
      expect(desc.sections).toBeTruthy()
      expect(desc.sections.length).toBeGreaterThan(0)

      // Should have type section
      const typeSection = desc.sections.find(s => s.label === 'Type')
      expect(typeSection).toBeTruthy()

      // Should have description
      const descSection = desc.sections.find(s => s.type === 'text' && !s.label)
      expect(descSection).toBeTruthy()
      expect(descSection.content).toContain('devastating')
    })

    it('should return null for non-existent quality', async () => {
      const desc = await generateQualityDescription('nonexistent-quality')

      expect(desc).toBeNull()
    })
  })

  describe('Bug #5 & #6: Species tabs show placeholder', () => {
    it('should generate species description with real data in Détails tab', async () => {
      const desc = await generateSpeciesDescription('human')

      expect(desc).toBeTruthy()
      expect(desc.sections).toBeTruthy()

      const detailsTab = desc.sections.find(s => s.tabKey === 'Détails')

      expect(detailsTab).toBeTruthy()
      expect(detailsTab.sections).toBeTruthy()
      expect(detailsTab.sections.length).toBeGreaterThan(0)

      // Should NOT be placeholder text
      const hasPlaceholder = detailsTab.sections.some(s =>
        s.content && s.content.includes('Détails de la race (âge, taille, etc.)')
      )
      expect(hasPlaceholder).toBe(false)

      // Should have actual data sections for age, height, etc.
      const hasRealData = detailsTab.sections.some(s =>
        s.type === 'text' && (
          (s.label && s.label.includes('âge')) ||
          (s.label && s.label.includes('taille')) ||
          (s.content && (s.content.includes('16') || s.content.includes('150')))
        )
      )
      expect(hasRealData).toBe(true)
    })

    it('should generate species description with real data in Caractéristiques tab', async () => {
      const desc = await generateSpeciesDescription('human')

      expect(desc).toBeTruthy()

      const charTab = desc.sections.find(s => s.tabKey === 'Caractéristiques')

      expect(charTab).toBeTruthy()
      expect(charTab.sections).toBeTruthy()
      expect(charTab.sections.length).toBeGreaterThan(0)

      // Should NOT be placeholder text
      const hasPlaceholder = charTab.sections.some(s =>
        s.content && s.content.includes('Table des caractéristiques de race')
      )
      expect(hasPlaceholder).toBe(false)

      // Should have table or list of characteristics
      const hasCharData = charTab.sections.some(s =>
        s.type === 'table' || s.type === 'stats' || s.type === 'list'
      )
      expect(hasCharData).toBe(true)
    })

    it('should include accessible careers in species description', async () => {
      const desc = await generateSpeciesDescription('human')

      expect(desc).toBeTruthy()

      // Should have a Carrières tab
      const careersTab = desc.sections.find(s => s.tabKey === 'Carrières')

      expect(careersTab).toBeTruthy()
      expect(careersTab.sections).toBeTruthy()

      // Should list soldier career (via careers linking to species)
      const careersList = careersTab.sections.find(s => s.type === 'list')
      expect(careersList).toBeTruthy()
    })
  })

  describe('Bug #7: CareerLevel shows no description', () => {
    it('should generate career level description with metadata pointing to parent career', async () => {
      const desc = await generateCareerLevelDescription('soldier|recruit')

      expect(desc).toBeTruthy()
      expect(desc.metadata).toBeTruthy()

      // Should have metadata indicating which tab to activate
      expect(desc.metadata.careerLevel).toBe(1)

      // Should have tab_actif to indicate which career tab to show
      expect(typeof desc.metadata.tab_actif).toBe('number')
    })

    it('should calculate correct tab offset for career levels', async () => {
      // Level 1 (recruit)
      const desc1 = await generateCareerLevelDescription('soldier|recruit')
      expect(desc1.metadata.careerLevel).toBe(1)

      // Level 2 (soldier)
      const desc2 = await generateCareerLevelDescription('soldier|soldier')
      expect(desc2.metadata.careerLevel).toBe(2)

      // Level 3 (sergeant)
      const desc3 = await generateCareerLevelDescription('soldier|sergeant')
      expect(desc3.metadata.careerLevel).toBe(3)

      // Level 4 (captain)
      const desc4 = await generateCareerLevelDescription('soldier|captain')
      expect(desc4.metadata.careerLevel).toBe(4)
    })

    it('should return null for non-existent career level', async () => {
      const desc = await generateCareerLevelDescription('nonexistent|level')

      expect(desc).toBeNull()
    })
  })
})
