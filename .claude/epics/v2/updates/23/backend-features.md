# Backend & Core Logic Features Analysis

**Epic**: #23 - Feature Comparison Audit
**Stream**: A - Backend & Core Logic
**Date**: 2025-10-25
**Status**: Complete

---

## Root Project Features (Code.js)

### Google Apps Script Functions

#### 1. HTTP Request Handlers
- **doPost(request)**: Handles POST requests for save operations
  - Action: 'save' - saves character data to spreadsheet
- **doGet(request)**: Handles GET requests for multiple operations
  - Parameter: 'foundryExport' - triggers Foundry VTT export
  - Parameter: 'action=load' - loads saved character data
  - Parameter: 'json' - returns all game data as JSON
  - Parameter: 'generateHelp' - generates embedded data script
  - Parameter: 'debug=skills' - skill system debugging
  - Parameter: 'debug=fulltest' - full character creation test
  - Parameter: 'debug=unittest' - runs unit test suite
  - Parameter: 'debug=deeptest' - deep validation testing
  - Parameter: 'display' - serves HTML interface
  - Parameter: 'admin' - serves admin interface

#### 2. Data Access Functions
- **getAllData(desc, file)**: Fetches all game data from spreadsheet
  - Supports 23 entity types
  - Optional description filtering
  - Selective loading by type
- **getFromSpeedseetApp(name, book, allDescription, afterFunction)**: Generic spreadsheet reader
  - Reads sheet by name
  - Generates key mappings from headers
  - Populates entries with afterFunction hook
- **getFoundry()**: Retrieves Foundry VTT mapping data
- **getAdminData()**: Returns all data including descriptions for admin interface

#### 3. Data Manipulation Functions
- **save(key, save)**: Saves character data to 'Save' sheet
  - Auto-generates key if empty
  - Upserts existing saves
- **load(key)**: Loads character data by key from 'Save' sheet
- **saveData(save)**: Saves entity modifications to spreadsheet
  - Supports insert mode
  - Updates existing rows
  - Returns updated data

#### 4. Character Generation Functions
- **random(code)**: Full character generation pipeline
  - Loads all required modules (30+ HTML files)
  - Initializes CharacterGenerator
  - Creates new character
  - Executes 8 creation steps
  - Returns Foundry VTT export
- **testFullCharacterCreation()**: Comprehensive generation test
  - Tests all 8 creation steps
  - Validates each step
  - Returns detailed test report
- **debugSkills()**: Skill system debugging
  - Tests specie skills
  - Tests career skills
  - Validates skill structure

#### 5. Testing Functions
- **runUnitTests()**: Automated test suite
  - Test 1: Basic character generation
  - Test 2: Multiple generation consistency
  - Test 3: Performance test (5 generations)
  - Test 4: Data validation test
  - Test 5: Stability test (10 generations)
  - Returns pass/fail statistics
- **runDeepValidationTest()**: Advanced validation
  - Step-by-step debugging
  - Character state capture
  - Content validation
  - Heinrich Steinmetz specific validation
- **makeSpecificChoice()**: User-like character creation
  - Manual species selection
  - Manual career selection
  - Custom characteristics assignment
  - Talent selection
  - Skill distribution

#### 6. Helper Functions
- **generateKey(array)**: Creates column index mapping
- **populateEntries(line, result, keys, book, allDescription)**: Parses spreadsheet rows
- **showDescription(condition, description, el, books, allDescription)**: Filters descriptions by language
- **generateHelp(allDescription)**: Generates embedded data JavaScript
- **toId(text)**: Normalizes text to ID format (removes accents, lowercases)
- **include(filename)**: Includes HTML file content
- **loadJSFromHTMLFile(filename)**: Loads and evaluates JS from HTML files
- **validateHeinrichSteinmetz(character)**: Validates specific test character
- **captureCharacterState(character)**: Captures character snapshot
- **validateStepContent(stepName, characterState, expectedRanges)**: Step validation
- **captureDetailedCharacterData(character)**: Full character data capture
- **validateFinalCharacter(characterData, expectedRanges)**: Final validation
- **extractActualValues(characterData)**: Extracts key character values
- **validateDataIntegrity(CharGen)**: Validates data sources
- **loadAllRequiredModules()**: Loads all 40+ required modules

### Entity Types Managed
The root system manages **23 entity types**:
1. book - Source books
2. career - Career definitions
3. careerLevel - Career tier levels
4. specie - Species/races
5. class - Career classes
6. talent - Character talents
7. characteristic - Base characteristics (10 stats)
8. trapping - Equipment/trappings
9. skill - Character skills
10. spell - Magic spells
11. creature - NPCs/monsters
12. star - Birth stars
13. god - Deities
14. eye - Eye color options
15. hair - Hair color options
16. detail - Character detail options
17. trait - Creature traits
18. lore - Magic lores
19. magick - Magic domains
20. etat - Conditions
21. psychologie - Psychological traits
22. quality - Item qualities
23. tree - Career progression trees

### Character Creation Pipeline
**8-Step Process**:
1. **StepSpecies**: Select species/race
2. **StepCareers**: Select career
3. **StepCharacteristics**: Roll/assign characteristics
4. **StepStars**: Assign birth star
5. **StepTalents**: Select talents
6. **StepSkills**: Distribute skill advances
7. **StepTrappings**: Select starting equipment
8. **StepDetail**: Set character details
9. **StepExperience**: Spend experience (if applicable)
10. **StepResume**: Character summary

---

## Data Processing Logic (extract-data.js)

### Purpose
Node.js script to extract game data from Google Apps Script web app and save as local JSON files.

### Core Functions
- **fetchData(url)**: Downloads JSON from web app
  - Handles HTTPS redirects
  - 30-second timeout
  - Parses JSON response
- **extractData()**: Main extraction pipeline
  - Fetches all data
  - Creates individual JSON files per entity type
  - Creates combined all-data.json
  - Reports statistics

### Features
- **23 entity type mappings**: Maps internal types to filenames
- **Automatic retry**: Follows redirects
- **Progress reporting**: Console output with counts
- **Directory creation**: Auto-creates data/ folder
- **Error handling**: Comprehensive error messages

### Output Format
- Individual files: `data/books.json`, `data/careers.json`, etc.
- Combined file: `data/all-data.json`
- Pretty-printed JSON with 2-space indentation

---

## V2 Project Features

### lib/ Modules

#### lib/retryFetch.js - Network Resilience
**Purpose**: Robust HTTP fetching with retry logic

**Functions**:
- **retryFetch(url, options)**: Main fetch with exponential backoff
  - Default 3 retries
  - 30-second timeout per attempt
  - Exponential backoff: 1s, 2s, 4s
  - Only retries transient errors
- **fetchWithFallback(url, dataDir, options)**: Fetch with cache fallback
  - Attempts network fetch
  - Falls back to cached data on failure
  - Continues operation with stale data
- **loadCachedData(dataDir)**: Loads previous successful fetch
- **isRetryableError(error)**: Determines if error is transient
  - Network errors: ECONNRESET, ETIMEDOUT, etc.
  - HTTP errors: 408, 429, 500, 502, 503, 504

**New Capabilities**:
- Resilient network operations
- Offline capability with cache
- Automatic retry with backoff
- Error classification

#### lib/validator.js - Data Validation
**Purpose**: Comprehensive validation for all 23 entity types

**Functions**:
- **validate(data)**: Main validation orchestrator
  - Structure validation
  - Content validation
  - Returns detailed report
- **validateStructure(data)**: Checks data shape
  - Verifies object structure
  - Checks for missing types
  - Validates array types
- **validateContent(data)**: Validates entries
  - Checks required fields (id/index, name/label)
  - Validates all 23 entity types
  - Reports invalid records
- **formatReport(report)**: Console-friendly output
  - Type-by-type summary
  - Error and warning lists
  - Statistics

**Required Fields**: All entity types must have:
- `id` or `index`
- `name` or `label`

**New Capabilities**:
- Structural validation
- Content validation
- Comprehensive reporting
- Type-specific validation

#### config.js - Configuration Management
**Purpose**: Environment and CLI configuration

**Functions**:
- **loadEnv()**: Loads .env file variables
- **validate()**: Validates required config
- **toObject()**: Returns config object

**Configuration Options**:
- `GOOGLE_APPS_SCRIPT_URL`: Web app endpoint
- `GOOGLE_APPS_SCRIPT_ID`: Script ID (reference)
- `DATA_DIR`: Local data directory
- `NODE_ENV`: Environment

**New Capabilities**:
- Environment variable support
- .env file parsing
- Configuration validation
- Flexible URL sources (env or CLI)

### warhammer-v2/src/lib/ - Frontend Logic

#### dataOperations.js - CRUD Operations
**Purpose**: High-level data operations for UI

**Create Operations**:
- **createEntry(entityType, data)**: Creates custom entry
  - Validates entry
  - Generates unique ID
  - Updates store
- **bulkCreateEntries(entityType, entries)**: Batch create

**Read Operations**:
- **getEntryById(entityType, id, mergedData)**: Fetch by ID
- **getAllEntries(entityType, mergedData)**: Fetch all
- **filterEntries(entityType, mergedData, predicate)**: Filter
- **getEntriesByIds(entityType, ids, mergedData)**: Batch fetch

**Update Operations**:
- **updateEntry(entityType, id, updates, mergedData)**: Modify entry
  - Creates custom modification
  - Validates changes
  - Updates store
- **bulkUpdateEntries(entityType, updates, mergedData)**: Batch update

**Delete Operations**:
- **deleteEntry(entityType, id, mergedData)**: Remove entry
  - Soft delete for official entries
  - Hard delete for custom entries
- **bulkDeleteEntries(entityType, ids, mergedData)**: Batch delete
- **restoreEntry(entityType, id)**: Restore deleted entry

**Special Operations**:
- **revertEntry(entityType, id)**: Restore to original
- **duplicateEntry(entityType, id, mergedData, modifications)**: Copy entry

**Character Operations**:
- **createCharacter(characterData)**: Create character
- **updateCharacter(id, updates)**: Update character
- **deleteCharacter(id)**: Remove character
- **duplicateCharacter(id, newName)**: Copy character

**New Capabilities**:
- Complete CRUD API
- Bulk operations
- Soft delete support
- Character management
- IndexedDB integration

#### dataMerger.js - Data Layer
**Purpose**: Merges official and custom data

**Core Functions**:
- **mergeData(official, custom)**: Merge all entity types
  - Processes all 23 types
  - Returns merged object
- **mergeEntityType(officialEntries, customEntries)**: Merge single type
  - Custom overrides official
  - Flags entries (isOfficial, isCustom, isModified)
  - Preserves original for reset
  - Filters deleted entries

**Entry Management**:
- **createModification(officialEntry, modifications)**: Create custom version
- **createCustomEntry(entityType, data)**: Create new entry
- **markAsDeleted(entry)**: Soft delete
- **restoreDeleted(entry)**: Undelete
- **revertToOriginal(modifiedEntry)**: Reset to official
- **generateCustomId(entityType)**: Unique ID generation

**Query Functions**:
- **isOfficialEntry(entry)**: Check if official
- **isCustomEntry(entry)**: Check if custom
- **isModifiedEntry(entry)**: Check if modified
- **getModifiedEntries(mergedData)**: Get all modifications
- **getCustomEntries(mergedData)**: Get all custom
- **getMergeStats(mergedData)**: Statistics

**Conflict Management**:
- **detectConflicts(official, custom)**: Find differences
- **resolveConflict(conflict, resolution, mergedFields)**: Handle conflicts
  - Resolution strategies: official, custom, merge

**New Capabilities**:
- Sophisticated merge strategy
- Custom data override system
- Soft delete support
- Conflict detection
- Original preservation
- Statistics and reporting

#### search.js - Search Engine
**Purpose**: High-performance fuzzy search

**Core Features**:
- **Fuse.js integration**: Fuzzy matching
- **Performance target**: <300ms for 1000+ entries
- **Caching**: Results and Fuse instances
- **Debouncing**: Real-time search support

**Functions**:
- **search(entityType, data, query, options)**: Search single type
  - Configurable threshold
  - Result limiting
  - Score and match indices
- **searchAll(mergedData, query, options)**: Search all types
- **getAutocompleteSuggestions(entityType, data, query, limit)**: Autocomplete
- **createDebouncedSearch(searchFn, delay)**: Debounced wrapper
- **highlightMatches(text, matches)**: HTML highlighting
- **filterResults(results, filterFn)**: Post-filter
- **sortResults(results, field, order)**: Sort results
- **groupResults(results, field)**: Group by field
- **clearSearchCache()**: Clear result cache
- **clearFuseCache()**: Clear Fuse instances
- **getSearchStats()**: Cache statistics

**Search Configuration**: Entity-specific keys
- books: name, abbreviation, description
- careers: name, class, species, status, description
- skills: name, characteristic, type, description
- spells: name, description, lore, cn, range, target, duration
- (23 types total, each with optimized keys)

**Cache Management**:
- LRU cache (50 entries)
- 1-minute TTL
- Separate Fuse instance cache

**New Capabilities**:
- Fuzzy search across all data
- High performance (300ms target)
- Intelligent caching
- Autocomplete support
- Result highlighting
- Debouncing
- Cross-entity search

#### importExport.js - Data Portability
**Purpose**: Import/export custom modifications

**Import Functions**:
- **importCustomModifications(jsonString, existingData, options)**: Import JSON
  - Validation
  - Sanitization
  - Conflict detection
  - Merge strategies
- **importFromFile(file, existingData, options)**: Import from file
  - File size validation
  - Async file reading
- **validateImport(jsonString, existingData)**: Pre-import validation
- **previewImport(jsonString, existingData)**: Preview changes

**Export Functions**:
- **exportCustomModifications(customData, options)**: Export to JSON
  - Selective entity types
  - Metadata inclusion
  - Pretty print option
- **exportToFile(customData, filename, options)**: Download file
- **exportCharacters(characters, includeMetadata)**: Export characters
- **exportCharactersToFile(characters, filename)**: Download characters
- **generateJSONPatch(customModifications, officialData)**: Diff export
  - Only exports changes
  - Patch format

**Options**:
- **Import**: merge, overwrite, validate, sanitize, entityTypes
- **Export**: entityTypes, includeCharacters, includeMetadata, prettyPrint

**New Capabilities**:
- JSON import/export
- File handling
- Validation before import
- Preview system
- Conflict detection
- Merge strategies
- Patch format
- Character portability
- Metadata tracking

---

## Comparison Matrix

| Feature | Root | V2 | Status | Notes |
|---------|------|----|----|-------|
| **Data Access** |
| Spreadsheet data loading | ✓ | ✗ | Missing | V2 fetches from web app, not direct spreadsheet |
| JSON data loading | ✓ | ✓ | Same | Both support JSON |
| 23 entity type support | ✓ | ✓ | Same | Both handle all entity types |
| Data caching | ✗ | ✓ | New | V2 adds cache with TTL |
| Offline capability | ✗ | ✓ | New | V2 can work with stale cache |
| **Character Generation** |
| Full 8-step pipeline | ✓ | ? | Unknown | Not visible in V2 backend files |
| Random generation | ✓ | ? | Unknown | Not analyzed yet |
| Foundry VTT export | ✓ | ? | Unknown | Need to check V2 |
| Character save/load | ✓ | ✓ | Enhanced | V2 uses IndexedDB |
| **Data Validation** |
| Basic data checks | ✓ | ✓ | Enhanced | V2 has comprehensive validator |
| Structure validation | Partial | ✓ | Enhanced | V2 validates all 23 types |
| Content validation | Partial | ✓ | Enhanced | V2 checks required fields |
| Detailed reports | ✗ | ✓ | New | V2 generates formatted reports |
| **Error Handling** |
| HTTP request retry | ✗ | ✓ | New | V2 has exponential backoff |
| Transient error detection | ✗ | ✓ | New | V2 classifies errors |
| Fallback to cache | ✗ | ✓ | New | V2 uses stale data on failure |
| **CRUD Operations** |
| Create entries | ✓ | ✓ | Enhanced | V2 has validation & bulk ops |
| Read entries | ✓ | ✓ | Enhanced | V2 has query functions |
| Update entries | ✓ | ✓ | Enhanced | V2 has modification tracking |
| Delete entries | ✓ | ✓ | Enhanced | V2 has soft delete |
| Bulk operations | ✗ | ✓ | New | V2 supports batch CRUD |
| **Data Merging** |
| Official data priority | N/A | ✓ | New | V2 manages official/custom split |
| Custom overrides | N/A | ✓ | New | V2 allows user modifications |
| Modification tracking | ✗ | ✓ | New | V2 flags isModified |
| Revert to original | ✗ | ✓ | New | V2 preserves originals |
| Conflict detection | ✗ | ✓ | New | V2 detects data conflicts |
| Merge statistics | ✗ | ✓ | New | V2 tracks counts by type |
| **Search** |
| Text search | ✗ | ✓ | New | V2 has fuzzy search |
| Fuzzy matching | ✗ | ✓ | New | V2 uses Fuse.js |
| Autocomplete | ✗ | ✓ | New | V2 has suggestions |
| Search caching | ✗ | ✓ | New | V2 caches results |
| Cross-entity search | ✗ | ✓ | New | V2 searches all types |
| Result highlighting | ✗ | ✓ | New | V2 highlights matches |
| Performance monitoring | ✗ | ✓ | New | V2 tracks search time |
| **Import/Export** |
| JSON export | ✓ | ✓ | Enhanced | Both support JSON |
| JSON import | ✗ | ✓ | New | V2 has import |
| File download | ✗ | ✓ | New | V2 downloads files |
| File upload | ✗ | ✓ | New | V2 reads files |
| Import validation | ✗ | ✓ | New | V2 validates before import |
| Import preview | ✗ | ✓ | New | V2 shows changes |
| Selective export | ✗ | ✓ | New | V2 filters by type |
| Patch format | ✗ | ✓ | New | V2 exports diffs |
| Metadata tracking | ✗ | ✓ | New | V2 adds timestamps |
| **Testing** |
| Unit tests | ✓ | ? | Unknown | Root has 5 tests |
| Character generation tests | ✓ | ? | Unknown | Root has fulltest |
| Deep validation tests | ✓ | ? | Unknown | Root has deeptest |
| Performance tests | ✓ | ? | Unknown | Root tests 5 generations |
| Stability tests | ✓ | ? | Unknown | Root tests 10 generations |
| **Configuration** |
| Environment variables | ✗ | ✓ | New | V2 has .env support |
| Config validation | ✗ | ✓ | New | V2 validates config |
| Multiple sources | ✗ | ✓ | New | V2 accepts env or CLI |
| **Storage** |
| Google Spreadsheet | ✓ | ✗ | Changed | Root uses Sheets directly |
| Web App API | ✓ | ✓ | Same | Both can use web app |
| IndexedDB | ✗ | ✓ | New | V2 uses client-side DB |
| LocalStorage | ✗ | ? | Unknown | Need to check V2 |

---

## Gaps Identified

### Features in Root NOT in V2

1. **Direct Spreadsheet Integration**
   - Root accesses Google Spreadsheet directly via SpreadsheetApp
   - V2 only fetches from web app endpoint
   - Impact: V2 cannot update spreadsheet directly

2. **Character Generation Pipeline**
   - Root has complete 8-step character creation
   - V2 backend files don't show generation logic
   - Need to analyze V2 frontend for this

3. **Module Loading System**
   - Root dynamically loads 40+ HTML/JS modules
   - V2 uses modern ES6 imports
   - Different architecture, not a gap

4. **Foundry VTT Integration**
   - Root has FoundryHelper for export
   - Not visible in V2 backend analysis
   - Need to check V2 frontend

5. **Testing Framework**
   - Root has 5 comprehensive tests
   - V2 testing not analyzed yet
   - Need to check V2 test directory

6. **Admin Interface**
   - Root serves admin interface via doGet
   - V2 admin not analyzed yet

### Features Modified/Improved in V2

1. **Data Validation** (Root: Basic → V2: Comprehensive)
   - Root checks data exists
   - V2 validates structure, content, required fields
   - V2 generates detailed reports

2. **Error Handling** (Root: None → V2: Robust)
   - Root has no retry logic
   - V2 has exponential backoff
   - V2 classifies errors
   - V2 falls back to cache

3. **CRUD Operations** (Root: Basic → V2: Advanced)
   - Root updates spreadsheet rows
   - V2 has full CRUD API
   - V2 supports bulk operations
   - V2 has soft delete

4. **Data Architecture** (Root: Single source → V2: Dual layer)
   - Root uses spreadsheet as single truth
   - V2 separates official and custom
   - V2 allows user modifications without breaking official data

5. **Storage** (Root: Server → V2: Client)
   - Root stores in Google Spreadsheet
   - V2 stores in IndexedDB (client-side)
   - V2 is offline-capable

### Entirely New Features in V2

1. **Fuzzy Search Engine**
   - Fuse.js integration
   - Performance optimized (<300ms)
   - Caching and debouncing
   - Autocomplete support
   - Cross-entity search

2. **Data Merging System**
   - Official/custom separation
   - Custom overrides
   - Modification tracking
   - Revert capability
   - Conflict detection

3. **Import/Export System**
   - JSON import with validation
   - Preview before import
   - Conflict handling
   - Selective export
   - Patch format
   - Metadata tracking

4. **Cache System**
   - Network response caching
   - Search result caching
   - Fuse instance caching
   - TTL management
   - LRU eviction

5. **Configuration Management**
   - .env file support
   - Environment variables
   - Config validation
   - Multiple config sources

6. **Offline Capability**
   - Fallback to cached data
   - Continue with stale data
   - Client-side storage (IndexedDB)

7. **Bulk Operations**
   - Batch create
   - Batch update
   - Batch delete
   - Performance optimized

---

## Recommendations

### Priority Features to Port from Root to V2

1. **HIGH PRIORITY - Character Generation Pipeline**
   - Port 8-step creation process
   - Include randomization logic
   - Add character validation
   - Estimated effort: 3-5 days

2. **HIGH PRIORITY - Testing Framework**
   - Port unit tests
   - Port character generation tests
   - Add performance tests
   - Adapt for V2 architecture
   - Estimated effort: 2-3 days

3. **MEDIUM PRIORITY - Foundry VTT Export**
   - Port FoundryHelper module
   - Add export validation
   - Test compatibility
   - Estimated effort: 1-2 days

4. **MEDIUM PRIORITY - Admin Interface**
   - Port admin functionality
   - Adapt to V2 architecture
   - Add modern UI
   - Estimated effort: 2-3 days

5. **LOW PRIORITY - Direct Spreadsheet Integration**
   - Only needed if V2 should update spreadsheet
   - Could use web app endpoint instead
   - Decision: Determine if needed
   - Estimated effort: 1-2 days

### Architectural Improvements Noted in V2

1. **Separation of Concerns**
   - Root mixes data access, business logic, UI
   - V2 cleanly separates: lib/, stores/, components
   - Recommendation: Continue V2 pattern

2. **Modern JavaScript**
   - Root uses Google Apps Script (ES5)
   - V2 uses ES6 modules, async/await, classes
   - Recommendation: Continue V2 pattern

3. **Client-Side Architecture**
   - Root is server-centric (Google Apps Script)
   - V2 is client-centric (browser app)
   - Recommendation: V2 enables offline, faster UX

4. **Data Immutability**
   - Root mutates spreadsheet directly
   - V2 preserves official data, tracks changes
   - Recommendation: V2 pattern is safer

5. **Error Resilience**
   - Root fails immediately on errors
   - V2 retries, falls back, continues
   - Recommendation: V2 pattern is production-ready

6. **Testing Strategy**
   - Root has integration tests (full pipeline)
   - V2 should add: unit tests, integration tests, E2E tests
   - Recommendation: Adopt multi-layer testing

7. **Performance Optimization**
   - Root loads all data synchronously
   - V2 should add: lazy loading, code splitting, web workers
   - Recommendation: Optimize for large datasets

### Features That Should Be Enhanced

1. **Search Performance**
   - Current target: 300ms for 1000+ entries
   - Recommend: Add web worker for search
   - Estimate: 50-100ms possible

2. **Cache Invalidation**
   - Current: Simple TTL
   - Recommend: Smart invalidation on data change
   - Estimate: More reliable caching

3. **Import Validation**
   - Current: Basic structure checks
   - Recommend: Schema validation (JSON Schema)
   - Estimate: Stricter validation

4. **Conflict Resolution**
   - Current: Manual resolution only
   - Recommend: Auto-merge strategies
   - Estimate: Smarter conflict handling

---

## Summary

### Root Project Strengths
- Complete character generation pipeline
- Comprehensive testing framework
- Foundry VTT integration
- Admin interface
- 23 entity types fully supported

### V2 Project Strengths
- Modern architecture (ES6, modular)
- Robust error handling (retry, fallback)
- Advanced data management (merge, track, revert)
- High-performance search (Fuse.js)
- Complete CRUD API
- Import/export system
- Offline capability
- Client-side storage (IndexedDB)

### Key Architectural Differences
- **Root**: Server-centric, Google Apps Script, direct spreadsheet access
- **V2**: Client-centric, browser app, web API, IndexedDB storage

### Migration Status
- **Data Layer**: V2 superior (merge, track, validate)
- **CRUD Operations**: V2 superior (bulk, soft delete, validation)
- **Search**: V2 new capability (fuzzy, cache, autocomplete)
- **Import/Export**: V2 new capability (validate, preview, patch)
- **Character Generation**: Root only (needs porting)
- **Testing**: Root only (needs porting)
- **Foundry Export**: Root only (needs porting)

### Next Steps
1. Analyze V2 frontend for character generation
2. Check V2 test coverage
3. Evaluate Foundry VTT support in V2
4. Review admin interface in V2
5. Plan migration of missing features
