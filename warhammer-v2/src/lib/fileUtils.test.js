/**
 * Tests pour fileUtils.js
 * Vérifie la génération de noms de fichiers et les utilitaires associés
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateTimestamp,
  generateDatestampISO,
  sanitizeFilename,
  generateFilename,
  generateFilenameWithDate,
  formatFileSize,
  isValidFilename,
  getFilenameWithoutExtension,
  getFileExtension
} from './fileUtils.js'

describe('fileUtils', () => {
  // Mock la date pour des tests déterministes
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-31T14:30:25'))
  })

  describe('generateTimestamp', () => {
    it('génère un timestamp au format YYYYMMDD-HHMMSS', () => {
      const timestamp = generateTimestamp()
      expect(timestamp).toBe('20250131-143025')
    })

    it('pad correctement les valeurs à un chiffre', () => {
      vi.setSystemTime(new Date('2025-03-05T09:05:03'))
      const timestamp = generateTimestamp()
      expect(timestamp).toBe('20250305-090503')
    })
  })

  describe('generateDatestampISO', () => {
    it('génère un datestamp au format ISO (YYYY-MM-DD)', () => {
      const datestamp = generateDatestampISO()
      expect(datestamp).toBe('2025-01-31')
    })
  })

  describe('sanitizeFilename', () => {
    it('nettoie les caractères spéciaux', () => {
      expect(sanitizeFilename('Mon Fichier!@#$%')).toBe('mon-fichier')
    })

    it('remplace les espaces par des tirets', () => {
      expect(sanitizeFilename('Jean Dupont')).toBe('jean-dupont')
    })

    it('retire les tirets en début et fin', () => {
      expect(sanitizeFilename('---test---')).toBe('test')
    })

    it('limite la longueur à 50 caractères', () => {
      const longName = 'a'.repeat(100)
      const result = sanitizeFilename(longName)
      expect(result.length).toBe(50)
    })

    it('gère les caractères accentués', () => {
      expect(sanitizeFilename('Élève François')).toBe('l-ve-fran-ois')
    })

    it('retourne "unnamed" pour une chaîne vide', () => {
      expect(sanitizeFilename('')).toBe('unnamed')
      expect(sanitizeFilename('   ')).toBe('unnamed')
    })

    it('retourne "unnamed" pour null ou undefined', () => {
      expect(sanitizeFilename(null)).toBe('unnamed')
      expect(sanitizeFilename(undefined)).toBe('unnamed')
    })

    it('retourne "unnamed" pour un type non-string', () => {
      expect(sanitizeFilename(123)).toBe('unnamed')
      expect(sanitizeFilename({})).toBe('unnamed')
    })
  })

  describe('generateFilename', () => {
    it('génère un nom de fichier avec préfixe uniquement', () => {
      const filename = generateFilename('warhammer-mods')
      expect(filename).toBe('warhammer-mods-20250131-143025.json')
    })

    it('génère un nom de fichier avec préfixe et identifiant', () => {
      const filename = generateFilename('character', 'Jean Dupont')
      expect(filename).toBe('character-jean-dupont-20250131-143025.json')
    })

    it('supporte une extension personnalisée', () => {
      const filename = generateFilename('data', 'export', 'xml')
      expect(filename).toBe('data-export-20250131-143025.xml')
    })

    it('nettoie automatiquement l\'identifiant', () => {
      const filename = generateFilename('character', 'Jean@#$ Dupont!!!')
      expect(filename).toBe('character-jean-dupont-20250131-143025.json')
    })

    it('gère un identifiant vide', () => {
      const filename = generateFilename('prefix', '')
      expect(filename).toBe('prefix-20250131-143025.json')
    })
  })

  describe('generateFilenameWithDate', () => {
    it('génère un nom avec datestamp ISO', () => {
      const filename = generateFilenameWithDate('character', 'Jean')
      expect(filename).toBe('character-jean-2025-01-31.json')
    })

    it('génère un nom sans identifiant', () => {
      const filename = generateFilenameWithDate('characters')
      expect(filename).toBe('characters-2025-01-31.json')
    })

    it('supporte une extension personnalisée', () => {
      const filename = generateFilenameWithDate('backup', 'data', 'zip')
      expect(filename).toBe('backup-data-2025-01-31.zip')
    })
  })

  describe('formatFileSize', () => {
    it('formate les octets', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(512)).toBe('512 B')
      expect(formatFileSize(1023)).toBe('1023 B')
    })

    it('formate les kilooctets', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(10240)).toBe('10 KB')
    })

    it('formate les mégaoctets', () => {
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1572864)).toBe('1.5 MB')
      expect(formatFileSize(5242880)).toBe('5 MB')
    })

    it('formate les gigaoctets', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB')
      expect(formatFileSize(2147483648)).toBe('2 GB')
    })

    it('respecte le nombre de décimales', () => {
      expect(formatFileSize(1536, 0)).toBe('2 KB')
      expect(formatFileSize(1536, 1)).toBe('1.5 KB')
      expect(formatFileSize(1536, 3)).toBe('1.5 KB')
    })

    it('gère les valeurs invalides', () => {
      expect(formatFileSize(null)).toBe('N/A')
      expect(formatFileSize(undefined)).toBe('N/A')
      expect(formatFileSize('invalid')).toBe('N/A')
    })
  })

  describe('isValidFilename', () => {
    it('valide les noms de fichiers corrects', () => {
      expect(isValidFilename('document.pdf')).toBe(true)
      expect(isValidFilename('my-file_2025.json')).toBe(true)
      expect(isValidFilename('data.backup.tar.gz')).toBe(true)
    })

    it('rejette les caractères dangereux', () => {
      expect(isValidFilename('file<test>.txt')).toBe(false)
      expect(isValidFilename('file:test.txt')).toBe(false)
      expect(isValidFilename('file|test.txt')).toBe(false)
      expect(isValidFilename('file"test.txt')).toBe(false)
      expect(isValidFilename('file?test.txt')).toBe(false)
      expect(isValidFilename('file*test.txt')).toBe(false)
    })

    it('rejette les tentatives de path traversal', () => {
      expect(isValidFilename('../../../etc/passwd')).toBe(false)
      expect(isValidFilename('..\\..\\windows\\system32')).toBe(false)
    })

    it('rejette les valeurs invalides', () => {
      expect(isValidFilename(null)).toBe(false)
      expect(isValidFilename(undefined)).toBe(false)
      expect(isValidFilename('')).toBe(false)
      expect(isValidFilename(123)).toBe(false)
    })
  })

  describe('getFilenameWithoutExtension', () => {
    it('retire l\'extension d\'un fichier', () => {
      expect(getFilenameWithoutExtension('document.pdf')).toBe('document')
      expect(getFilenameWithoutExtension('character-jean-2025.json')).toBe('character-jean-2025')
    })

    it('gère les extensions multiples', () => {
      expect(getFilenameWithoutExtension('data.backup.tar.gz')).toBe('data.backup.tar')
    })

    it('gère les fichiers sans extension', () => {
      expect(getFilenameWithoutExtension('README')).toBe('README')
    })

    it('gère les valeurs invalides', () => {
      expect(getFilenameWithoutExtension(null)).toBe('')
      expect(getFilenameWithoutExtension(undefined)).toBe('')
      expect(getFilenameWithoutExtension('')).toBe('')
    })
  })

  describe('getFileExtension', () => {
    it('extrait l\'extension d\'un fichier', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('data.json')).toBe('json')
    })

    it('extrait uniquement la dernière extension', () => {
      expect(getFileExtension('data.backup.tar.gz')).toBe('gz')
    })

    it('retourne une chaîne vide pour les fichiers sans extension', () => {
      expect(getFileExtension('README')).toBe('')
    })

    it('gère les valeurs invalides', () => {
      expect(getFileExtension(null)).toBe('')
      expect(getFileExtension(undefined)).toBe('')
      expect(getFileExtension('')).toBe('')
    })
  })

  describe('Compatibilité avec exportModifications.js', () => {
    it('génère le même format de filename que l\'ancienne implémentation', () => {
      // Ancienne implémentation: warhammer-mods-YYYYMMDD-HHMMSS.json
      const filename = generateFilename('warhammer-mods')
      expect(filename).toMatch(/^warhammer-mods-\d{8}-\d{6}\.json$/)
      expect(filename).toBe('warhammer-mods-20250131-143025.json')
    })
  })

  describe('Compatibilité avec characterExport.js', () => {
    it('génère le même format de filename que l\'ancienne implémentation', () => {
      // Ancienne implémentation: character-{sanitized-name}-YYYY-MM-DD.json
      const filename = generateFilenameWithDate('character', 'Jean Dupont')
      expect(filename).toMatch(/^character-jean-dupont-\d{4}-\d{2}-\d{2}\.json$/)
      expect(filename).toBe('character-jean-dupont-2025-01-31.json')
    })

    it('nettoie les noms de la même manière', () => {
      const oldSanitize = (name) => name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50)
        || 'character'

      const testCases = [
        'Jean Dupont',
        'Test@#$%',
        '---test---',
        'Élève François',
        'a'.repeat(100)
      ]

      for (const testCase of testCases) {
        expect(sanitizeFilename(testCase)).toBe(oldSanitize(testCase))
      }
    })
  })
})
