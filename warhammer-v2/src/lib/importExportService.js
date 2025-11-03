/**
 * ImportExportService - Generic service for import/export operations
 *
 * This service provides a unified, configurable approach to handle import/export
 * operations for different data types (characters, modifications, etc.)
 *
 * Common patterns abstracted:
 * - JSON download with blob creation
 * - File validation (size, format)
 * - Metadata management (_version, _exported, _type)
 * - Error handling and reporting
 * - Parse and validate JSON structure
 */

/**
 * Generic service for handling import/export operations
 */
export class ImportExportService {
  /**
   * Create a new ImportExportService
   * @param {Object} config - Service configuration
   * @param {string} config.type - Data type identifier (e.g., 'warhammer-character')
   * @param {string} config.version - Export format version
   * @param {Function} config.validator - Function to validate data: (data, options) => { valid, errors, warnings }
   * @param {Function} config.transformer - Function to transform data for export: (data) => transformedData
   * @param {Function} config.filenameGenerator - Function to generate filename: (data) => filename
   * @param {Function} [config.sanitizer] - Optional function to sanitize imported data: (data) => sanitizedData
   * @param {number} [config.maxFileSizeMB] - Maximum file size in MB (default: 10)
   */
  constructor(config) {
    this.type = config.type
    this.version = config.version
    this.validator = config.validator
    this.transformer = config.transformer
    this.filenameGenerator = config.filenameGenerator
    this.sanitizer = config.sanitizer || (data => data)
    this.maxFileSizeMB = config.maxFileSizeMB || 10
  }

  /**
   * Export data to JSON format
   * @param {any} data - Data to export
   * @param {Object} [options] - Export options
   * @param {Object} [options.metadata] - Additional metadata to include
   * @param {boolean} [options.compact] - Use compact format without pretty printing
   * @returns {Object} Export result with { success, data, filename, json, errors }
   */
  export(data, options = {}) {
    const errors = []
    const warnings = []

    try {
      // Validate data before export
      const validation = this.validator(data, { mode: 'export' })
      if (!validation.valid) {
        return {
          success: false,
          data: null,
          filename: null,
          json: null,
          errors: validation.errors || ['Validation failed'],
          warnings: validation.warnings || []
        }
      }

      if (validation.warnings && validation.warnings.length > 0) {
        warnings.push(...validation.warnings)
      }

      // Transform data for export
      const transformedData = this.transformer(data)

      // Create export data with standard metadata
      const exportData = {
        _exported: new Date().toISOString(),
        _version: this.version,
        _type: this.type,
        ...transformedData,
        ...(options.metadata || {})
      }

      // Generate filename
      const filename = this.filenameGenerator(data)

      // Convert to JSON
      const json = JSON.stringify(exportData, null, options.compact ? 0 : 2)

      return {
        success: true,
        data: exportData,
        filename,
        json,
        errors: [],
        warnings
      }
    } catch (error) {
      errors.push(`Export failed: ${error.message}`)
      return {
        success: false,
        data: null,
        filename: null,
        json: null,
        errors,
        warnings
      }
    }
  }

  /**
   * Import data from JSON string
   * @param {string} jsonString - JSON string to import
   * @param {Object} [options] - Import options
   * @param {boolean} [options.validate] - Whether to validate (default: true)
   * @param {boolean} [options.sanitize] - Whether to sanitize (default: true)
   * @param {any} [options.context] - Additional context for validation (e.g., existing data)
   * @returns {Object} Import result with { success, data, metadata, errors, warnings }
   */
  import(jsonString, options = {}) {
    const {
      validate = true,
      sanitize = true,
      context = null
    } = options

    const errors = []
    const warnings = []

    try {
      // Parse JSON
      let parsed
      try {
        parsed = JSON.parse(jsonString)
      } catch (parseError) {
        return {
          success: false,
          data: null,
          metadata: null,
          errors: [`Invalid JSON: ${parseError.message}`],
          warnings: []
        }
      }

      // Extract metadata
      const metadata = {
        exported: parsed._exported,
        version: parsed._version,
        type: parsed._type
      }

      // Check version compatibility
      if (parsed._version && parsed._version !== this.version) {
        warnings.push(`Version mismatch: expected ${this.version}, got ${parsed._version}`)
      }

      // Check type compatibility
      if (parsed._type && !parsed._type.includes(this.type)) {
        errors.push(`Type mismatch: expected ${this.type}, got ${parsed._type}`)
        return {
          success: false,
          data: null,
          metadata,
          errors,
          warnings
        }
      }

      // Extract actual data (remove metadata fields)
      const data = Object.keys(parsed)
        .filter(key => !key.startsWith('_'))
        .reduce((obj, key) => {
          obj[key] = parsed[key]
          return obj
        }, {})

      // Sanitize if requested
      let finalData = sanitize ? this.sanitizer(data) : data

      // Validate if requested
      if (validate) {
        const validation = this.validator(finalData, {
          mode: 'import',
          context
        })

        if (!validation.valid) {
          return {
            success: false,
            data: null,
            metadata,
            errors: validation.errors || ['Validation failed'],
            warnings: [...warnings, ...(validation.warnings || [])]
          }
        }

        if (validation.warnings && validation.warnings.length > 0) {
          warnings.push(...validation.warnings)
        }
      }

      return {
        success: true,
        data: finalData,
        metadata,
        errors: [],
        warnings
      }
    } catch (error) {
      errors.push(`Import failed: ${error.message}`)
      return {
        success: false,
        data: null,
        metadata: null,
        errors,
        warnings
      }
    }
  }

  /**
   * Import data from a file
   * @param {File} file - File to import
   * @param {Object} [options] - Import options (passed to import())
   * @returns {Promise<Object>} Import result
   */
  async importFromFile(file, options = {}) {
    const errors = []

    try {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        return {
          success: false,
          data: null,
          metadata: null,
          errors: ['Le fichier doit être un fichier JSON (.json)'],
          warnings: []
        }
      }

      // Validate file size
      const maxSize = this.maxFileSizeMB * 1024 * 1024
      if (file.size > maxSize) {
        return {
          success: false,
          data: null,
          metadata: null,
          errors: [`La taille du fichier dépasse la limite de ${this.maxFileSizeMB}MB`],
          warnings: []
        }
      }

      // Read file content
      const content = await this._readFileAsText(file)

      // Import from JSON string
      return this.import(content, options)
    } catch (error) {
      errors.push(`Échec de la lecture du fichier: ${error.message}`)
      return {
        success: false,
        data: null,
        metadata: null,
        errors,
        warnings: []
      }
    }
  }

  /**
   * Export and trigger browser download
   * @param {any} data - Data to export
   * @param {Object} [options] - Export options (passed to export())
   * @returns {Object} Export result
   */
  exportAndDownload(data, options = {}) {
    const result = this.export(data, options)

    if (result.success) {
      this.downloadJSON(result.json, result.filename)
    }

    return result
  }

  /**
   * Download JSON data as a file
   * @param {string} jsonString - JSON string to download
   * @param {string} filename - Filename for download
   */
  downloadJSON(jsonString, filename) {
    try {
      // Create blob from JSON string
      const blob = new Blob([jsonString], { type: 'application/json' })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      throw new Error(`Échec du téléchargement du fichier: ${error.message}`)
    }
  }

  /**
   * Read a file as text
   * @private
   * @param {File} file - File to read
   * @returns {Promise<string>} File content
   */
  _readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        resolve(event.target.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsText(file)
    })
  }
}

/**
 * Helper function to create a basic validator
 * @param {Function} validationFn - Validation function: (data, options) => { valid, errors, warnings }
 * @returns {Function} Validator function
 */
export function createValidator(validationFn) {
  return (data, options = {}) => {
    try {
      return validationFn(data, options)
    } catch (error) {
      return {
        valid: false,
        errors: [`Validation error: ${error.message}`],
        warnings: []
      }
    }
  }
}

/**
 * Helper function to create a basic transformer
 * @param {Function} transformFn - Transform function: (data) => transformedData
 * @returns {Function} Transformer function
 */
export function createTransformer(transformFn) {
  return (data) => {
    try {
      return transformFn(data)
    } catch (error) {
      throw new Error(`Transform error: ${error.message}`)
    }
  }
}

/**
 * Helper function to create a basic filename generator
 * @param {string} prefix - Filename prefix
 * @param {Function} [extractName] - Optional function to extract name from data
 * @returns {Function} Filename generator function
 */
export function createFilenameGenerator(prefix, extractName = null) {
  return (data) => {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, '')
      .replace('T', '-')

    let name = prefix
    if (extractName) {
      const extracted = extractName(data)
      if (extracted) {
        // Sanitize name for filename
        const sanitized = extracted
          .replace(/[^a-z0-9\-_]/gi, '_')
          .replace(/_+/g, '_')
          .toLowerCase()
        name = `${prefix}-${sanitized}`
      }
    }

    return `${name}-${timestamp}.json`
  }
}
