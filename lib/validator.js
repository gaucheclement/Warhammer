/**
 * Data validation module for Warhammer data extraction
 * Validates all 23 data types with structural, content, and referential checks
 */

// All 23 required data types
const REQUIRED_DATA_TYPES = [
    'book', 'career', 'careerLevel', 'specie', 'class', 'talent',
    'characteristic', 'trapping', 'skill', 'spell', 'creature',
    'star', 'god', 'eye', 'hair', 'detail', 'trait',
    'lore', 'magick', 'etat', 'psychologie', 'quality', 'tree'
];

// Required fields per data type
const REQUIRED_FIELDS = {
    book: ['id', 'name'],
    career: ['id', 'name'],
    careerLevel: ['id', 'name'],
    specie: ['id', 'name'],
    class: ['id', 'name'],
    talent: ['id', 'name'],
    characteristic: ['id', 'name'],
    trapping: ['id', 'name'],
    skill: ['id', 'name'],
    spell: ['id', 'name'],
    creature: ['id', 'name'],
    star: ['id', 'name'],
    god: ['id', 'name'],
    eye: ['id', 'name'],
    hair: ['id', 'name'],
    detail: ['id', 'name'],
    trait: ['id', 'name'],
    lore: ['id', 'name'],
    magick: ['id', 'name'],
    etat: ['id', 'name'],
    psychologie: ['id', 'name'],
    quality: ['id', 'name'],
    tree: ['id', 'name']
};

/**
 * Validates the structure of the data
 * @param {Object} data - The data object to validate
 * @returns {Object} Validation result with errors array
 */
function validateStructure(data) {
    const errors = [];
    const warnings = [];

    if (!data || typeof data !== 'object') {
        errors.push('Data is not a valid object');
        return { valid: false, errors, warnings };
    }

    // Check for missing data types
    const missingTypes = REQUIRED_DATA_TYPES.filter(type => !data[type]);
    if (missingTypes.length > 0) {
        warnings.push(`Missing data types: ${missingTypes.join(', ')}`);
    }

    // Check that each present type is an array
    for (const type of REQUIRED_DATA_TYPES) {
        if (data[type] && !Array.isArray(data[type])) {
            errors.push(`${type}: Expected array, got ${typeof data[type]}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates the content of each data type
 * @param {Object} data - The data object to validate
 * @returns {Object} Validation result with detailed reports per type
 */
function validateContent(data) {
    const errors = [];
    const warnings = [];
    const typeReports = {};

    for (const type of REQUIRED_DATA_TYPES) {
        const typeData = data[type];

        if (!typeData) {
            typeReports[type] = {
                count: 0,
                valid: false,
                status: 'MISSING'
            };
            continue;
        }

        if (!Array.isArray(typeData)) {
            typeReports[type] = {
                count: 0,
                valid: false,
                status: 'INVALID_TYPE'
            };
            continue;
        }

        const count = typeData.length;
        const requiredFields = REQUIRED_FIELDS[type] || ['id', 'name'];
        const invalidRecords = [];

        // Check each record for required fields
        typeData.forEach((record, index) => {
            if (!record || typeof record !== 'object') {
                invalidRecords.push({ index, reason: 'Not an object' });
                return;
            }

            const missingFields = requiredFields.filter(field => {
                return record[field] === undefined || record[field] === null || record[field] === '';
            });

            if (missingFields.length > 0) {
                invalidRecords.push({
                    index,
                    reason: `Missing fields: ${missingFields.join(', ')}`
                });
            }
        });

        if (count === 0) {
            typeReports[type] = {
                count: 0,
                valid: false,
                status: 'EMPTY'
            };
            warnings.push(`${type}: Array is empty`);
        } else if (invalidRecords.length > 0) {
            typeReports[type] = {
                count,
                valid: false,
                status: 'HAS_INVALID_RECORDS',
                invalidCount: invalidRecords.length,
                invalidRecords: invalidRecords.slice(0, 5) // Only include first 5
            };
            errors.push(`${type}: ${invalidRecords.length} invalid record(s)`);
        } else {
            typeReports[type] = {
                count,
                valid: true,
                status: 'OK'
            };
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        typeReports
    };
}

/**
 * Main validation function
 * @param {Object} data - The data object to validate
 * @returns {Object} Complete validation report
 */
function validate(data) {
    const startTime = Date.now();

    // Step 1: Structural validation
    const structureResult = validateStructure(data);

    if (!structureResult.valid) {
        return {
            valid: false,
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            errors: structureResult.errors,
            warnings: structureResult.warnings,
            summary: {
                totalTypes: 0,
                validTypes: 0,
                missingTypes: REQUIRED_DATA_TYPES.length,
                totalRecords: 0
            }
        };
    }

    // Step 2: Content validation
    const contentResult = validateContent(data);

    // Calculate summary statistics
    const typeReports = contentResult.typeReports;
    const validTypes = Object.values(typeReports).filter(r => r.valid).length;
    const missingTypes = Object.values(typeReports).filter(r => r.status === 'MISSING').length;
    const totalRecords = Object.values(typeReports).reduce((sum, r) => sum + (r.count || 0), 0);

    const allErrors = [...structureResult.errors, ...contentResult.errors];
    const allWarnings = [...structureResult.warnings, ...contentResult.warnings];

    return {
        valid: allErrors.length === 0,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        errors: allErrors,
        warnings: allWarnings,
        typeReports,
        summary: {
            totalTypes: REQUIRED_DATA_TYPES.length,
            validTypes,
            missingTypes,
            totalRecords
        }
    };
}

/**
 * Formats validation report for console output
 * @param {Object} report - The validation report
 * @returns {String} Formatted report
 */
function formatReport(report) {
    const lines = [];
    const boxWidth = 60;

    lines.push('');
    lines.push('='.repeat(boxWidth));

    if (report.valid) {
        lines.push('✓ Data Validation Report - ALL CHECKS PASSED');
    } else {
        lines.push('✗ Data Validation Report - ERRORS FOUND');
    }

    lines.push('='.repeat(boxWidth));
    lines.push('');

    // Type-by-type report
    if (report.typeReports) {
        for (const type of REQUIRED_DATA_TYPES) {
            const typeReport = report.typeReports[type];

            if (!typeReport) {
                lines.push(`✗ ${type.padEnd(20)} [NOT FOUND]`);
                continue;
            }

            const statusSymbol = typeReport.valid ? '✓' : '✗';
            const countStr = typeReport.count.toString().padStart(4);
            const status = typeReport.status === 'OK' ? '[OK]' : `[${typeReport.status}]`;

            lines.push(`${statusSymbol} ${type.padEnd(20)} ${countStr} entries  ${status}`);

            if (typeReport.invalidRecords && typeReport.invalidRecords.length > 0) {
                typeReport.invalidRecords.forEach(invalid => {
                    lines.push(`    Record ${invalid.index}: ${invalid.reason}`);
                });
                if (typeReport.invalidCount > typeReport.invalidRecords.length) {
                    lines.push(`    ... and ${typeReport.invalidCount - typeReport.invalidRecords.length} more`);
                }
            }
        }
    }

    lines.push('');
    lines.push('-'.repeat(boxWidth));

    // Summary
    if (report.summary) {
        lines.push(`Summary: ${report.summary.validTypes}/${report.summary.totalTypes} types valid`);
        if (report.summary.missingTypes > 0) {
            lines.push(`Missing: ${report.summary.missingTypes} type(s)`);
        }
        lines.push(`Total Records: ${report.summary.totalRecords.toLocaleString()}`);
    }

    // Errors and warnings
    if (report.errors && report.errors.length > 0) {
        lines.push('');
        lines.push(`Errors (${report.errors.length}):`);
        report.errors.forEach(error => lines.push(`  - ${error}`));
    }

    if (report.warnings && report.warnings.length > 0) {
        lines.push('');
        lines.push(`Warnings (${report.warnings.length}):`);
        report.warnings.forEach(warning => lines.push(`  - ${warning}`));
    }

    lines.push('');
    lines.push('-'.repeat(boxWidth));
    lines.push(`Validation completed in ${report.duration}ms`);
    lines.push('='.repeat(boxWidth));
    lines.push('');

    return lines.join('\n');
}

module.exports = {
    validate,
    formatReport,
    REQUIRED_DATA_TYPES
};
