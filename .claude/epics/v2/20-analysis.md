---
issue: 20
epic: v2
analyzed: 2025-10-25T07:30:00Z
total_streams: 3
---

# Issue #20 Analysis: Database Import Integration

## Overview

Issue #20 "Database Import Integration" focuses on automating the existing `extract-data.js` script to integrate into the build process. The script already works manually and fetches 23 data types from a Google Apps Script deployment. The main work involves creating npm integration, adding configuration management, implementing validation, and enhancing error handling.

This is a moderate complexity task (2-3 hours) that can be decomposed into 3 parallel work streams with minimal dependencies. The key strategy is to separate infrastructure (build integration), configuration (.env setup), and validation/error handling into independent streams.

## Work Streams

### Stream 1: Build Integration & NPM Scripts
**Agent**: general-purpose
**Can Start**: immediately
**Dependencies**: none

**Scope:**
- Create package.json with npm scripts for data extraction
- Add `npm run extract` command to fetch and save data
- Integrate extraction into `npm run build` workflow
- Add `npm run extract:validate` for validation-only runs
- Configure proper Node.js environment for script execution
- Add documentation for npm commands

**Files:**
- `package.json` (create) - NPM configuration with scripts
- `.npmrc` (create if needed) - NPM configuration
- `README.md` (update or create) - Documentation for npm commands

**Work:**
1. Create `package.json` with scripts section:
   - `extract`: Run data extraction from Google Apps Script
   - `extract:validate`: Validate existing data without fetching
   - `build`: Integrate extraction before build (optional flag)
   - `prebuild`: Hook to run extraction automatically
2. Add node-fetch or similar if needed for Node.js versions < 18
3. Document usage in README:
   - How to set up the web app URL
   - How to run extraction manually
   - How to integrate into build pipeline
4. Add .npmrc if specific npm configuration needed

**Key Tasks:**
- Initialize npm project if not already present
- Define clear script names and purposes
- Ensure script works in CI/CD environments
- Add helpful output messages for developers

**Estimated Effort:** 1 hour

### Stream 2: Configuration Management
**Agent**: general-purpose
**Can Start**: immediately
**Dependencies**: none

**Scope:**
- Implement .env configuration file support
- Store Google Apps Script deployment URL securely
- Support multiple environments (dev, staging, prod)
- Create .env.example template for documentation
- Add environment variable validation
- Update extract-data.js to read from .env

**Files:**
- `.env` (create, gitignored) - Environment configuration
- `.env.example` (create) - Template for developers
- `extract-data.js` (modify) - Update to read from environment
- `.gitignore` (verify) - Ensure .env is ignored
- `config.js` (create) - Configuration loader and validator

**Work:**
1. Install dotenv package: `npm install dotenv`
2. Create `.env.example` with template:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   GOOGLE_APPS_SCRIPT_ID=AKfycbwMRbK8i_M-os8c279diiKxeoze7JWJTKsLA511bTBJDkjxYY3GRE8tfWucuBOeh0x6Hg
   DATA_DIR=./data
   NODE_ENV=development
   ```
3. Create actual `.env` file with working URL (gitignored)
4. Create `config.js` module to load and validate environment variables
5. Modify `extract-data.js` to use environment variables instead of CLI args:
   - Replace `process.argv[2]` with config values
   - Add fallback to CLI arg for backward compatibility
   - Validate configuration before running
6. Verify `.gitignore` includes `.env` files

**Key Tasks:**
- Secure configuration management
- Clear documentation of required variables
- Validation of configuration values
- Support for different environments

**Estimated Effort:** 1 hour

### Stream 3: Data Validation & Error Handling
**Agent**: general-purpose
**Can Start**: immediately
**Dependencies**: none (enhances existing extract-data.js)

**Scope:**
- Implement comprehensive data validation for all 23 types
- Add retry logic for network failures (3 retries with exponential backoff)
- Create detailed error messages with troubleshooting guidance
- Implement fallback to cached data on fetch failure
- Add extraction statistics logging (counts, timing, data size)
- Validate data structure and required fields
- Create validation report output

**Files:**
- `extract-data.js` (modify) - Enhance with validation and error handling
- `lib/validator.js` (create) - Data validation functions
- `lib/retryFetch.js` (create) - Network retry logic with backoff

**Work:**
1. Create `lib/validator.js` with validation functions:
   - Validate all 23 data types are present
   - Check each type is an array with length > 0
   - Validate required fields per data type (id, name, etc.)
   - Report missing or invalid data with details
   - Return validation summary (pass/fail counts)

2. Create `lib/retryFetch.js` with retry logic:
   - Implement exponential backoff (1s, 2s, 4s delays)
   - Maximum 3 retry attempts
   - Distinguish transient vs. permanent errors
   - Log retry attempts with helpful messages

3. Enhance `extract-data.js`:
   - Integrate retry logic into fetchData()
   - Add try-catch blocks with specific error handling
   - Implement fallback: if fetch fails, check for existing data/all-data.json
   - Add extraction statistics:
     - Total records fetched per type
     - Total time taken
     - File sizes created
     - Validation results
   - Create detailed error messages:
     - Network errors: "Unable to connect. Check URL and internet."
     - Parse errors: "Invalid JSON response. Check Apps Script."
     - Validation errors: "Missing data types: X, Y, Z"
   - Add verbose mode flag for debugging

4. Add validation report output:
   - Console output with color-coded status
   - Optional JSON report file for CI/CD integration
   - Summary statistics at end of run

**Key Tasks:**
- Robust error handling for all failure scenarios
- Clear, actionable error messages
- Data integrity validation
- Performance metrics and logging
- Graceful degradation (use cache if available)

**Estimated Effort:** 1.5 hours

## Technical Approach

### NPM Scripts Strategy
```json
{
  "scripts": {
    "extract": "node extract-data.js",
    "extract:validate": "node lib/validator.js data/all-data.json",
    "extract:verbose": "node extract-data.js --verbose",
    "prebuild": "npm run extract",
    "build": "vite build",
    "build:skip-extract": "vite build"
  }
}
```

### Configuration Strategy
**Environment Variables (.env):**
- `GOOGLE_APPS_SCRIPT_URL`: Full deployment URL
- `GOOGLE_APPS_SCRIPT_ID`: App ID for reference
- `DATA_DIR`: Output directory (default: ./data)
- `NODE_ENV`: Environment (development/production)
- `EXTRACT_RETRY_COUNT`: Number of retries (default: 3)
- `EXTRACT_TIMEOUT`: Timeout in ms (default: 30000)

**Configuration Loading:**
```javascript
// config.js
require('dotenv').config();

module.exports = {
  googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || process.argv[2],
  dataDir: process.env.DATA_DIR || './data',
  retryCount: parseInt(process.env.EXTRACT_RETRY_COUNT || '3'),
  timeout: parseInt(process.env.EXTRACT_TIMEOUT || '30000'),
  validate() {
    if (!this.googleAppsScriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not configured');
    }
  }
};
```

### Data Validation Approach
**Three-tier validation:**

1. **Structural Validation**: All 23 data types present and are arrays
2. **Content Validation**: Each type has minimum required fields (id, name, etc.)
3. **Referential Validation**: Check foreign key relationships if applicable

**Expected Data Types (23 total):**
```javascript
const REQUIRED_DATA_TYPES = [
  'book', 'career', 'careerLevel', 'specie', 'class', 'talent',
  'characteristic', 'trapping', 'skill', 'spell', 'creature',
  'star', 'god', 'eye', 'hair', 'detail', 'trait',
  'lore', 'magick', 'etat', 'psychologie', 'quality', 'tree'
];
```

**Validation Output:**
```
✅ Data Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ books              39 entries  [OK]
✓ careers           220 entries  [OK]
✓ careerLevels      201 entries  [OK]
...
✗ spells              0 entries  [MISSING DATA]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary: 22/23 types valid, 1 warning
Total Records: 2,847
```

### Error Handling Strategy

**Error Categories:**

1. **Configuration Errors** (exit immediately):
   - Missing GOOGLE_APPS_SCRIPT_URL
   - Invalid configuration values
   - Message: "Configuration error: [details]. Check .env file."

2. **Network Errors** (retry with backoff):
   - Connection timeout
   - DNS resolution failure
   - Message: "Network error: [details]. Retrying in Xs... (attempt Y/3)"

3. **Data Errors** (retry or fail):
   - Invalid JSON response
   - HTTP error status (404, 500, etc.)
   - Message: "Data error: [details]. Check Google Apps Script deployment."

4. **Validation Errors** (warn, don't fail):
   - Missing data types
   - Invalid data structure
   - Message: "Validation warning: [details]. Data may be incomplete."

5. **File System Errors** (fail):
   - Cannot create data directory
   - Cannot write files
   - Message: "File system error: [details]. Check permissions."

**Retry Logic:**
```javascript
async function retryFetch(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchData(url);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      if (!isRetryable(error)) throw error;

      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      console.log(`⚠️  Retry ${attempt}/${maxRetries} in ${delay/1000}s...`);
      await sleep(delay);
    }
  }
}
```

**Fallback Strategy:**
```javascript
async function extractDataWithFallback() {
  try {
    const data = await retryFetch(config.googleAppsScriptUrl);
    await saveData(data);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch data:', error.message);

    // Try to load cached data
    const cachedData = await loadCachedData();
    if (cachedData) {
      console.log('ℹ️  Using cached data from previous successful fetch');
      return cachedData;
    }

    console.error('❌ No cached data available. Build cannot continue.');
    process.exit(1);
  }
}
```

## Coordination Notes

### Stream Dependencies
All three streams are independent and can run in parallel:
- **Stream 1** works on package.json and documentation
- **Stream 2** works on .env and configuration loading
- **Stream 3** works on validation and error handling logic

### Integration Points
1. **Stream 1 + Stream 2**: package.json scripts will use config.js from Stream 2
2. **Stream 2 + Stream 3**: extract-data.js modified by both streams:
   - Stream 2: Update to read from .env (top of file, config loading)
   - Stream 3: Update with validation and error handling (main logic)
   - Coordination: Stream 3 should use config module from Stream 2
3. **All Streams**: Should test integration together after individual completion

### File Modification Coordination
**Shared file: `extract-data.js`**
- **Stream 2** modifies: Lines 1-30 (imports, config loading)
- **Stream 3** modifies: Lines 60-140 (fetchData, extractData, error handling)
- Low conflict risk due to separate sections

**Merge strategy:**
1. Stream 2 completes configuration changes first
2. Stream 3 pulls latest and adds validation/error handling
3. Final integration test with all changes

### Testing Strategy
**Per-Stream Testing:**
- Stream 1: Test npm scripts execute correctly
- Stream 2: Test .env loading and configuration validation
- Stream 3: Test validation logic with sample data, simulate network errors

**Integration Testing:**
1. Run `npm run extract` with valid configuration → should succeed
2. Run with invalid URL → should show clear error and retry
3. Run with missing .env → should show configuration error
4. Run validation on existing data → should report statistics
5. Test fallback by disconnecting network → should use cache
6. Run in CI environment → should work without manual intervention

**Acceptance Testing:**
- [ ] `npm run extract` successfully fetches data from Google Apps Script
- [ ] All 23 data types are extracted and saved to data/ directory
- [ ] Data validation runs and reports any issues clearly
- [ ] Network errors trigger retry with exponential backoff
- [ ] Clear error messages for common failure scenarios (no URL, bad network, etc.)
- [ ] Fallback to cached data works when fetch fails
- [ ] Configuration loaded from .env file
- [ ] Documentation updated with setup instructions
- [ ] Can be integrated into build pipeline (`npm run build`)

## Risks & Mitigations

### Risk 1: Network Reliability
**Impact**: Medium
**Likelihood**: Medium

Google Apps Script deployments can be slow or timeout occasionally.

**Mitigation:**
- Implement retry logic with exponential backoff (Stream 3)
- Increase default timeout to 30 seconds
- Add fallback to cached data
- Log detailed network diagnostics for troubleshooting

### Risk 2: Environment Configuration
**Impact**: High
**Likelihood**: Low

Missing or incorrect .env configuration could break extraction.

**Mitigation:**
- Provide clear .env.example template (Stream 2)
- Add configuration validation that fails fast with helpful messages
- Support fallback to CLI argument for backward compatibility
- Document configuration in README with examples

### Risk 3: Data Schema Changes
**Impact**: Medium
**Likelihood**: Low

Google Apps Script might change data structure or add/remove types.

**Mitigation:**
- Implement flexible validation that warns but doesn't fail (Stream 3)
- Log unexpected data types found
- Version the expected schema in code for tracking
- Add validation report to help identify changes

### Risk 4: CI/CD Integration
**Impact**: Medium
**Likelihood**: Low

Build servers might have different environment or network restrictions.

**Mitigation:**
- Test in CI environment early
- Document environment variable requirements
- Provide option to skip extraction in build (--skip-extract flag)
- Cache data as build artifact for reuse

### Risk 5: File Conflicts in extract-data.js
**Impact**: Low
**Likelihood**: Low

Streams 2 and 3 both modify extract-data.js.

**Mitigation:**
- Clearly define which sections each stream modifies
- Stream 3 waits for Stream 2 to complete config changes
- Use version control to track changes
- Test integration after both complete

## Technical Specifications

### Required Dependencies
```json
{
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
```

**Note:** Node.js native `https` module is already used, so no additional fetch libraries needed.

### Directory Structure After Implementation
```
Warhammer/
├── .env                      # Environment configuration (gitignored)
├── .env.example             # Template for developers
├── package.json             # NPM scripts and dependencies
├── config.js                # Configuration loader
├── extract-data.js          # Enhanced extraction script
├── lib/
│   ├── validator.js         # Data validation functions
│   └── retryFetch.js        # Network retry logic
├── data/                    # Output directory (gitignored)
│   ├── all-data.json        # Combined data
│   ├── books.json           # Individual type files
│   └── ...                  # 22 more type files
└── README.md                # Updated documentation
```

### Command Examples
```bash
# Initial setup
npm install
cp .env.example .env
# Edit .env with your Google Apps Script URL

# Extract data manually
npm run extract

# Extract with verbose logging
npm run extract:verbose

# Validate existing data without fetching
npm run extract:validate

# Build with automatic extraction
npm run build

# Build without extraction (use cached data)
npm run build:skip-extract
```

### Configuration File Format
**.env:**
```bash
# Google Apps Script Configuration
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwMRbK8i_M-os8c279diiKxeoze7JWJTKsLA511bTBJDkjxYY3GRE8tfWucuBOeh0x6Hg/exec
GOOGLE_APPS_SCRIPT_ID=AKfycbwMRbK8i_M-os8c279diiKxeoze7JWJTKsLA511bTBJDkjxYY3GRE8tfWucuBOeh0x6Hg

# Data Extraction Settings
DATA_DIR=./data
EXTRACT_RETRY_COUNT=3
EXTRACT_TIMEOUT=30000

# Environment
NODE_ENV=development
```

## Estimated Total Effort

**Sum of individual streams:** 3.5 hours
**With parallelization (3 streams):** ~1.5 hours wall-clock time (assuming 3 agents)
**Integration and testing:** +0.5 hours
**Total project time with parallelization:** ~2 hours wall-clock time

This aligns with the 2-3 hour estimate from the issue.

## Recommended Agent Assignment

Given that all streams can start immediately with minimal dependencies:

1. **Assign 3 general-purpose agents** to streams 1-3 simultaneously
2. Each agent works independently on their stream
3. After ~1.5 hours (when longest stream completes), coordinate:
   - Stream 3 integrates with Stream 2's config module
   - Test all components together
4. Final integration testing with 1 agent (~30 min)

This parallelization reduces the 3.5-hour sequential timeline to approximately 2 hours wall-clock time, achieving ~43% time savings through concurrent work.

## Success Criteria

All acceptance criteria from Issue #20 must be met:
- ✅ `npm run extract` successfully fetches data from Google Apps Script
- ✅ All 23 data types are extracted and saved
- ✅ Data validation reports any issues with clear messages
- ✅ Retry logic handles network failures (3 attempts with backoff)
- ✅ Clear error messages for common failure scenarios
- ✅ Fallback to cached data if fetch fails
- ✅ Configuration stored in .env file
- ✅ Support for different environments (dev, prod)
- ✅ Documentation updated with setup instructions
- ✅ Can be integrated into build pipeline (`npm run build`)
- ✅ Extraction statistics logged (counts, timing)
- ✅ Works in CI/CD environment without manual intervention
