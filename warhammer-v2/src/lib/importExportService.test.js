/**
 * Tests for ImportExportService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ImportExportService,
  createValidator,
  createTransformer,
  createFilenameGenerator
} from './importExportService.js'

describe('ImportExportService', () => {
  let service

  // Mock validator
  const mockValidator = vi.fn((data, options = {}) => {
    if (options.mode === 'export' && !data) {
      return {
        valid: false,
        errors: ['Data is required'],
        warnings: []
      }
    }

    if (options.mode === 'import' && !data.testField) {
      return {
        valid: false,
        errors: ['testField is required'],
        warnings: []
      }
    }

    return {
      valid: true,
      errors: [],
      warnings: []
    }
  })

  // Mock transformer
  const mockTransformer = vi.fn((data) => {
    return {
      testField: data.testField,
      transformed: true
    }
  })

  // Mock filename generator
  const mockFilenameGenerator = vi.fn((data) => {
    return `test-${data.testField}-20250101-120000.json`
  })

  // Mock sanitizer
  const mockSanitizer = vi.fn((data) => {
    return {
      ...data,
      sanitized: true
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()

    service = new ImportExportService({
      type: 'test-type',
      version: '1.0',
      validator: mockValidator,
      transformer: mockTransformer,
      filenameGenerator: mockFilenameGenerator,
      sanitizer: mockSanitizer,
      maxFileSizeMB: 5
    })
  })

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(service.type).toBe('test-type')
      expect(service.version).toBe('1.0')
      expect(service.validator).toBe(mockValidator)
      expect(service.transformer).toBe(mockTransformer)
      expect(service.filenameGenerator).toBe(mockFilenameGenerator)
      expect(service.sanitizer).toBe(mockSanitizer)
      expect(service.maxFileSizeMB).toBe(5)
    })

    it('should use default sanitizer if not provided', () => {
      const serviceWithoutSanitizer = new ImportExportService({
        type: 'test-type',
        version: '1.0',
        validator: mockValidator,
        transformer: mockTransformer,
        filenameGenerator: mockFilenameGenerator
      })

      const testData = { test: 'data' }
      expect(serviceWithoutSanitizer.sanitizer(testData)).toEqual(testData)
    })

    it('should use default maxFileSizeMB if not provided', () => {
      const serviceWithoutMaxSize = new ImportExportService({
        type: 'test-type',
        version: '1.0',
        validator: mockValidator,
        transformer: mockTransformer,
        filenameGenerator: mockFilenameGenerator
      })

      expect(serviceWithoutMaxSize.maxFileSizeMB).toBe(10)
    })
  })

  describe('export', () => {
    it('should successfully export valid data', () => {
      const testData = { testField: 'test-value' }
      const result = service.export(testData)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data._exported).toBeDefined()
      expect(result.data._version).toBe('1.0')
      expect(result.data._type).toBe('test-type')
      expect(result.data.testField).toBe('test-value')
      expect(result.data.transformed).toBe(true)
      expect(result.filename).toBe('test-test-value-20250101-120000.json')
      expect(result.json).toContain('"testField": "test-value"')
      expect(result.errors).toEqual([])
      expect(mockValidator).toHaveBeenCalledWith(testData, { mode: 'export' })
      expect(mockTransformer).toHaveBeenCalledWith(testData)
      expect(mockFilenameGenerator).toHaveBeenCalledWith(testData)
    })

    it('should fail export for invalid data', () => {
      const result = service.export(null)

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.filename).toBeNull()
      expect(result.json).toBeNull()
      expect(result.errors).toEqual(['Data is required'])
      expect(mockValidator).toHaveBeenCalledWith(null, { mode: 'export' })
      expect(mockTransformer).not.toHaveBeenCalled()
      expect(mockFilenameGenerator).not.toHaveBeenCalled()
    })

    it('should include additional metadata', () => {
      const testData = { testField: 'test-value' }
      const result = service.export(testData, {
        metadata: { author: 'Test Author' }
      })

      expect(result.success).toBe(true)
      expect(result.data.author).toBe('Test Author')
    })

    it('should support compact format', () => {
      const testData = { testField: 'test-value' }
      const result = service.export(testData, { compact: true })

      expect(result.success).toBe(true)
      expect(result.json).not.toContain('\n')
    })

    it('should include warnings in result', () => {
      const warningValidator = vi.fn(() => ({
        valid: true,
        errors: [],
        warnings: ['This is a warning']
      }))

      const serviceWithWarnings = new ImportExportService({
        type: 'test-type',
        version: '1.0',
        validator: warningValidator,
        transformer: mockTransformer,
        filenameGenerator: mockFilenameGenerator
      })

      const result = serviceWithWarnings.export({ testField: 'test' })

      expect(result.success).toBe(true)
      expect(result.warnings).toEqual(['This is a warning'])
    })

    it('should handle transformer errors', () => {
      const errorTransformer = vi.fn(() => {
        throw new Error('Transform failed')
      })

      const serviceWithErrorTransformer = new ImportExportService({
        type: 'test-type',
        version: '1.0',
        validator: mockValidator,
        transformer: errorTransformer,
        filenameGenerator: mockFilenameGenerator
      })

      const result = serviceWithErrorTransformer.export({ testField: 'test' })

      expect(result.success).toBe(false)
      expect(result.errors).toEqual(['Export failed: Transform failed'])
    })
  })

  describe('import', () => {
    it('should successfully import valid JSON', () => {
      const importData = {
        _exported: '2025-01-01T12:00:00.000Z',
        _version: '1.0',
        _type: 'test-type',
        testField: 'test-value'
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString)

      expect(result.success).toBe(true)
      expect(result.data.testField).toBe('test-value')
      expect(result.data.sanitized).toBe(true)
      expect(result.data._exported).toBeUndefined() // Metadata should be removed
      expect(result.metadata.exported).toBe('2025-01-01T12:00:00.000Z')
      expect(result.metadata.version).toBe('1.0')
      expect(result.metadata.type).toBe('test-type')
      expect(result.errors).toEqual([])
      expect(mockSanitizer).toHaveBeenCalled()
      expect(mockValidator).toHaveBeenCalled()
    })

    it('should fail import for invalid JSON', () => {
      const result = service.import('invalid json {')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.metadata).toBeNull()
      expect(result.errors[0]).toContain('Invalid JSON')
    })

    it('should warn on version mismatch', () => {
      const importData = {
        _version: '2.0',
        _type: 'test-type',
        testField: 'test-value'
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString)

      expect(result.success).toBe(true)
      expect(result.warnings).toContain('Version mismatch: expected 1.0, got 2.0')
    })

    it('should fail on type mismatch', () => {
      const importData = {
        _version: '1.0',
        _type: 'wrong-type',
        testField: 'test-value'
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString)

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Type mismatch: expected test-type, got wrong-type')
    })

    it('should skip sanitization when option is false', () => {
      const importData = {
        _version: '1.0',
        _type: 'test-type',
        testField: 'test-value'
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString, { sanitize: false })

      expect(result.success).toBe(true)
      expect(result.data.sanitized).toBeUndefined()
      expect(mockSanitizer).not.toHaveBeenCalled()
    })

    it('should skip validation when option is false', () => {
      const importData = {
        _version: '1.0',
        _type: 'test-type',
        // Missing testField - would normally fail validation
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString, { validate: false })

      expect(result.success).toBe(true)
      expect(mockValidator).not.toHaveBeenCalled()
    })

    it('should fail validation for invalid data', () => {
      const importData = {
        _version: '1.0',
        _type: 'test-type',
        // Missing testField
      }
      const jsonString = JSON.stringify(importData)

      const result = service.import(jsonString)

      expect(result.success).toBe(false)
      expect(result.errors).toContain('testField is required')
    })

    it('should pass context to validator', () => {
      const importData = {
        _version: '1.0',
        _type: 'test-type',
        testField: 'test-value'
      }
      const jsonString = JSON.stringify(importData)
      const context = { existingData: [] }

      service.import(jsonString, { context })

      expect(mockValidator).toHaveBeenCalledWith(
        expect.objectContaining({ testField: 'test-value', sanitized: true }),
        expect.objectContaining({ mode: 'import', context })
      )
    })
  })

  describe('importFromFile', () => {
    it('should successfully import from valid file', async () => {
      const fileContent = JSON.stringify({
        _version: '1.0',
        _type: 'test-type',
        testField: 'test-value'
      })

      const mockFile = new File([fileContent], 'test.json', { type: 'application/json' })

      const result = await service.importFromFile(mockFile)

      expect(result.success).toBe(true)
      expect(result.data.testField).toBe('test-value')
    })

    it('should reject non-JSON files', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })

      const result = await service.importFromFile(mockFile)

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Le fichier doit être un fichier JSON (.json)')
    })

    it('should reject files exceeding size limit', async () => {
      // Create a file larger than 5MB (our test config)
      const largeContent = 'x'.repeat(6 * 1024 * 1024)
      const mockFile = new File([largeContent], 'test.json', { type: 'application/json' })

      const result = await service.importFromFile(mockFile)

      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('dépasse la limite de 5MB')
    })

    it('should handle file read errors', async () => {
      const mockFile = {
        name: 'test.json',
        size: 100
      }

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader
      global.FileReader = vi.fn(() => ({
        readAsText: vi.fn(function() {
          // Simulate async error
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Read failed'))
            }
          }, 0)
        })
      }))

      const result = await service.importFromFile(mockFile)

      expect(result.success).toBe(false)

      global.FileReader = originalFileReader
    })
  })

  describe('exportAndDownload', () => {
    it('should export and trigger download for valid data', () => {
      // Mock DOM methods
      const mockCreateElement = vi.fn(() => ({
        click: vi.fn(),
        style: {}
      }))
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
      const mockRevokeObjectURL = vi.fn()

      global.document = {
        createElement: mockCreateElement,
        body: {
          appendChild: mockAppendChild,
          removeChild: mockRemoveChild
        }
      }
      global.URL = {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL
      }

      const testData = { testField: 'test-value' }
      const result = service.exportAndDownload(testData)

      expect(result.success).toBe(true)
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()

      // Cleanup mocks
      delete global.document
      delete global.URL
    })

    it('should not trigger download for invalid data', () => {
      const mockCreateObjectURL = vi.fn()
      global.URL = {
        createObjectURL: mockCreateObjectURL
      }

      const result = service.exportAndDownload(null)

      expect(result.success).toBe(false)
      expect(mockCreateObjectURL).not.toHaveBeenCalled()

      delete global.URL
    })
  })

  describe('downloadJSON', () => {
    it('should create download link and trigger download', () => {
      const mockClick = vi.fn()
      const mockLink = {
        click: mockClick,
        style: {}
      }
      const mockCreateElement = vi.fn(() => mockLink)
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
      const mockRevokeObjectURL = vi.fn()

      global.document = {
        createElement: mockCreateElement,
        body: {
          appendChild: mockAppendChild,
          removeChild: mockRemoveChild
        }
      }
      global.URL = {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL
      }
      global.Blob = vi.fn()

      service.downloadJSON('{"test": "data"}', 'test.json')

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockLink.href).toBe('blob:mock-url')
      expect(mockLink.download).toBe('test.json')
      expect(mockClick).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)

      // Cleanup
      delete global.document
      delete global.URL
      delete global.Blob
    })

    it('should handle download errors', () => {
      global.document = {
        createElement: vi.fn(() => {
          throw new Error('DOM error')
        })
      }

      expect(() => {
        service.downloadJSON('{"test": "data"}', 'test.json')
      }).toThrow('Échec du téléchargement du fichier')

      delete global.document
    })
  })
})

describe('Helper Functions', () => {
  describe('createValidator', () => {
    it('should create a validator that wraps validation function', () => {
      const validationFn = vi.fn((data) => {
        if (!data.name) {
          return { valid: false, errors: ['Name required'], warnings: [] }
        }
        return { valid: true, errors: [], warnings: [] }
      })

      const validator = createValidator(validationFn)

      const result1 = validator({ name: 'Test' })
      expect(result1.valid).toBe(true)

      const result2 = validator({})
      expect(result2.valid).toBe(false)
      expect(result2.errors).toContain('Name required')
    })

    it('should catch and wrap validation errors', () => {
      const errorValidationFn = vi.fn(() => {
        throw new Error('Validation error')
      })

      const validator = createValidator(errorValidationFn)
      const result = validator({ test: 'data' })

      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('Validation error')
    })
  })

  describe('createTransformer', () => {
    it('should create a transformer that wraps transform function', () => {
      const transformFn = vi.fn((data) => ({
        ...data,
        transformed: true
      }))

      const transformer = createTransformer(transformFn)
      const result = transformer({ test: 'data' })

      expect(result.test).toBe('data')
      expect(result.transformed).toBe(true)
    })

    it('should propagate transform errors', () => {
      const errorTransformFn = vi.fn(() => {
        throw new Error('Transform error')
      })

      const transformer = createTransformer(errorTransformFn)

      expect(() => {
        transformer({ test: 'data' })
      }).toThrow('Transform error')
    })
  })

  describe('createFilenameGenerator', () => {
    it('should create filename with prefix and timestamp', () => {
      const generator = createFilenameGenerator('test')
      const filename = generator({})

      expect(filename).toMatch(/^test-\d{8}-\d{6}\.json$/)
    })

    it('should include extracted name in filename', () => {
      const extractName = (data) => data.name
      const generator = createFilenameGenerator('test', extractName)
      const filename = generator({ name: 'My Test' })

      expect(filename).toMatch(/^test-my_test-\d{8}-\d{6}\.json$/)
    })

    it('should sanitize extracted name', () => {
      const extractName = (data) => data.name
      const generator = createFilenameGenerator('test', extractName)
      const filename = generator({ name: 'Test@Name#123!' })

      expect(filename).toMatch(/^test-test_name_123_-\d{8}-\d{6}\.json$/)
    })

    it('should handle missing extracted name', () => {
      const extractName = (data) => data.name
      const generator = createFilenameGenerator('test', extractName)
      const filename = generator({ other: 'field' })

      expect(filename).toMatch(/^test-\d{8}-\d{6}\.json$/)
    })
  })
})
