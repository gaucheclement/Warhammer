/**
 * Configuration loader for data extraction
 * Loads environment variables from .env file and provides validation
 */

const path = require('path');
const fs = require('fs');

// Load environment variables from .env file if it exists
function loadEnv() {
    const envPath = path.join(__dirname, '.env');

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');

        envContent.split('\n').forEach(line => {
            // Remove any trailing carriage return (Windows line endings)
            line = line.replace(/\r$/, '');

            // Skip comments and empty lines
            if (line.trim().startsWith('#') || !line.trim()) {
                return;
            }

            // Parse KEY=VALUE format
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();

                // Only set if not already defined
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

// Load environment variables
loadEnv();

// Configuration object
const config = {
    // Google Apps Script URL - can be from env or CLI argument
    googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || process.argv[2],

    // Google Apps Script ID (for reference)
    googleAppsScriptId: process.env.GOOGLE_APPS_SCRIPT_ID,

    // Data directory path
    dataDir: process.env.DATA_DIR || './data',

    // Environment
    nodeEnv: process.env.NODE_ENV || 'development',

    /**
     * Validate configuration
     * Throws an error if required configuration is missing
     */
    validate() {
        if (!this.googleAppsScriptUrl) {
            console.error('\n❌ Configuration Error: GOOGLE_APPS_SCRIPT_URL is not configured\n');
            console.error('Please configure the Google Apps Script URL using one of these methods:');
            console.error('  1. Create a .env file with GOOGLE_APPS_SCRIPT_URL (recommended)');
            console.error('     Copy .env.example to .env and update with your URL\n');
            console.error('  2. Pass the URL as a command-line argument:');
            console.error('     node extract-data.js <WEB_APP_URL>\n');
            console.error('Example URL:');
            console.error('  https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec\n');

            throw new Error('Missing GOOGLE_APPS_SCRIPT_URL configuration');
        }

        // Validate URL format
        if (!this.googleAppsScriptUrl.startsWith('http://') &&
            !this.googleAppsScriptUrl.startsWith('https://')) {
            throw new Error('GOOGLE_APPS_SCRIPT_URL must be a valid HTTP/HTTPS URL');
        }
    },

    /**
     * Get the full configuration as an object
     */
    toObject() {
        return {
            googleAppsScriptUrl: this.googleAppsScriptUrl,
            googleAppsScriptId: this.googleAppsScriptId,
            dataDir: this.dataDir,
            nodeEnv: this.nodeEnv
        };
    }
};

module.exports = config;
