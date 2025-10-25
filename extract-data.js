/**
 * Script pour extraire les données de la Google Spreadsheet
 * et créer des fichiers JSON individuels
 *
 * Usage: node extract-data.js [--verbose]
 * Configuration: Uses .env file or command-line argument
 * Example with CLI: node extract-data.js https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 * Options:
 *   --verbose: Enable verbose logging and detailed error messages
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { fetchWithFallback } = require('./lib/retryFetch');
const { validate, formatReport } = require('./lib/validator');

// Validate configuration
try {
    config.validate();
} catch (error) {
    process.exit(1);
}

// Parse command line arguments for flags
const verbose = process.argv.includes('--verbose');

// Get configuration values
const webAppUrl = config.googleAppsScriptUrl;
const dataDir = path.resolve(__dirname, config.dataDir);

// Créer le dossier data/ s'il n'existe pas
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Mapping des types vers les noms de fichiers
const typeToFileName = {
    'book': 'books.json',
    'career': 'careers.json',
    'careerLevel': 'careerLevels.json',
    'specie': 'species.json',
    'class': 'classes.json',
    'talent': 'talents.json',
    'characteristic': 'characteristics.json',
    'trapping': 'trappings.json',
    'skill': 'skills.json',
    'spell': 'spells.json',
    'creature': 'creatures.json',
    'star': 'stars.json',
    'god': 'gods.json',
    'eye': 'eyes.json',
    'hair': 'hairs.json',
    'detail': 'details.json',
    'trait': 'traits.json',
    'lore': 'lores.json',
    'magick': 'magicks.json',
    'etat': 'etats.json',
    'psychologie': 'psychologies.json',
    'quality': 'qualities.json',
    'tree': 'trees.json'
};

console.log('Starting data extraction...');
console.log(`URL: ${webAppUrl}?json=true`);
if (verbose) {
    console.log('Verbose mode enabled');
}
console.log('');

// Main extraction function
async function extractData() {
    const startTime = Date.now();

    try {
        console.log('Fetching data from Google Apps Script...');
        console.log('');

        // Fetch data with retry logic and fallback to cache
        const { data: allData, fromCache } = await fetchWithFallback(
            webAppUrl,
            dataDir,
            {
                maxRetries: config.retryCount || 3,
                timeout: config.timeout || 30000,
                verbose
            }
        );

        if (fromCache) {
            console.log('');
            console.log('WARNING: Using cached data from previous fetch');
            console.log('Data may not be up to date');
            console.log('');
        } else {
            console.log('Data fetched successfully!');
            console.log('');
        }

        // Validate data
        console.log('Validating data...');
        const validationReport = validate(allData);

        // Display validation report
        console.log(formatReport(validationReport));

        // Check if validation failed critically
        if (!validationReport.valid) {
            console.error('ERROR: Data validation failed');
            if (verbose) {
                console.error('Validation errors:', validationReport.errors);
            }
            console.log('WARNING: Continuing with file creation despite validation errors');
            console.log('');
        }

        // Save data to files
        console.log('Saving data to files...');
        console.log('');

        let filesCreated = 0;
        let totalRecords = 0;
        let totalBytes = 0;

        // Create a JSON file for each data type
        for (const [dataType, fileName] of Object.entries(typeToFileName)) {
            if (allData[dataType] && Array.isArray(allData[dataType])) {
                const filePath = path.join(dataDir, fileName);
                const records = allData[dataType];
                const jsonContent = JSON.stringify(records, null, 2);

                // Write the JSON file with indentation
                fs.writeFileSync(filePath, jsonContent, 'utf8');

                const fileSize = Buffer.byteLength(jsonContent, 'utf8');
                totalBytes += fileSize;

                if (verbose) {
                    const sizeKB = (fileSize / 1024).toFixed(2);
                    console.log(`Created ${fileName.padEnd(25)} - ${records.length.toString().padStart(4)} entries (${sizeKB} KB)`);
                }

                filesCreated++;
                totalRecords += records.length;
            }
        }

        // Also create a file with all combined data
        const allDataPath = path.join(dataDir, 'all-data.json');
        const allDataContent = JSON.stringify(allData, null, 2);
        fs.writeFileSync(allDataPath, allDataContent, 'utf8');
        const allDataSize = Buffer.byteLength(allDataContent, 'utf8');
        totalBytes += allDataSize;

        if (verbose) {
            const sizeKB = (allDataSize / 1024).toFixed(2);
            console.log(`Created all-data.json (combined data, ${sizeKB} KB)`);
        } else {
            console.log('Data files created successfully');
        }

        // Final summary
        const duration = Date.now() - startTime;
        const durationSec = (duration / 1000).toFixed(2);
        const totalSizeMB = (totalBytes / (1024 * 1024)).toFixed(2);

        console.log('');
        console.log('='.repeat(60));
        console.log('EXTRACTION COMPLETE');
        console.log('='.repeat(60));
        console.log(`Files Created:  ${filesCreated + 1}`);
        console.log(`Total Records:  ${totalRecords.toLocaleString()}`);
        console.log(`Total Size:     ${totalSizeMB} MB`);
        console.log(`Duration:       ${durationSec}s`);
        console.log(`Data Source:    ${fromCache ? 'Cache (offline)' : 'Network (online)'}`);
        console.log(`Validation:     ${validationReport.valid ? 'PASSED' : 'FAILED (see above)'}`);
        console.log('='.repeat(60));
        console.log('');

        // Exit with error code if validation failed
        if (!validationReport.valid) {
            process.exit(1);
        }

    } catch (error) {
        console.error('');
        console.error('='.repeat(60));
        console.error('EXTRACTION FAILED');
        console.error('='.repeat(60));
        console.error(`Error: ${error.message}`);

        if (verbose && error.stack) {
            console.error('');
            console.error('Stack trace:');
            console.error(error.stack);
        }

        console.error('');
        console.error('Troubleshooting tips:');
        console.error('  - Check your internet connection');
        console.error('  - Verify the Google Apps Script URL is correct');
        console.error('  - Ensure the Google Apps Script is deployed and accessible');
        console.error('  - Try running with --verbose flag for more details');
        console.error('='.repeat(60));
        console.error('');

        process.exit(1);
    }
}

// Lancer l'extraction
extractData();
