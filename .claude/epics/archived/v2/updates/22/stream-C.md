---
issue: 22
stream: Transformation Layer
agent: general-purpose
started: 2025-10-25T06:12:41Z
completed: 2025-10-25T11:45:00Z
status: completed
---

# Stream C: Transformation Layer

## Scope
Port DataHelper transformation and parsing logic

## Files
- ../epic-v2/warhammer-v2/src/lib/db-transforms.js (new file)
- ../epic-v2/warhammer-v2/src/lib/db-transforms.test.js (test file)

## Work Completed

### 1. Analysis Phase
Analyzed source files from main project:
- **DataHelper.html** - Core transformation patterns (stringToElems, bindElem, formatComplexElem)
- **DataFunctions.html** - Framework patterns (createElem, getLabelForElem, getLabelForData)
- **DataCareer.html** - Career-specific transformations
- **DataTalent.html** - Talent-specific transformations with specs handling
- **DataSkill.html** - Skill-specific transformations with characteristic binding
- **DataSpell.html** - Spell-specific transformations with type/subType handling

### 2. Core Utilities Implementation
Created db-transforms.js with the following utilities:

#### String Parsing
- **toId()** - Converts strings to normalized IDs (handles accents, special chars)
- **createElem()** - Creates empty element structure
- **stringToElems()** - Complex string parser handling:
  - Specializations in parentheses: "Talent (Spec1 ou Spec2)"
  - Multiple elements: "Talent1, Talent2"
  - Numeric modifiers: "+2 Talent" or "Talent +2"
  - Alternatives: "Talent1 ou Talent2"

#### Data Binding
- **bindElem()** - Binds elements to database data
- **formatComplexElem()** - Resolves labels to IDs and looks up in database
- Supports automatic ID resolution with and without specs
- Tracks origins for relationship mapping

#### Label Generation
- **getLabelForElem()** - Generates display labels for parsed elements
- **getLabelForData()** - Generates display labels for database objects
- Handles specs (array or string), suffix, prefix, title, abbreviations

#### Spec Handling
- **parseSpecs()** - Splits comma-separated spec strings into arrays
- Handles "Savoir, Métier, Artisanat" → ["Savoir", "Métier", "Artisanat"]
- Returns empty array for empty/null input
- Pass-through for already-parsed arrays

### 3. Type-Specific Transformations
Implemented transformation functions for each entity type:

#### transformCareer()
- Parses class reference (string → object)
- Resolves class data from database
- Example: "Académicien" → classData object

#### transformTalent()
- Parses specs field into array
- Sets canHaveSpec flag
- Resolves addSkill reference
- Resolves addTalent reference
- Initializes spec/origins fields

#### transformSkill()
- Parses specs field into array
- Sets specName to "Au choix" if grouped
- Resolves characteristic reference
- Sets canHaveSpec flag
- Initializes spec/origins fields

#### transformSpell()
- Determines spell vs miracle based on type
- Sets labelItem appropriately
- Resolves talent reference from type+subType
- Handles arcane, chaos, and minor magic types

#### transformCareerLevel()
- Resolves career reference
- Prepares for skill/talent/trapping relations

#### transform() - Master Function
Routes to appropriate type-specific transformer

### 4. Validation
Implemented comprehensive validation:
- **validate()** - Validates transformed data
- Checks required fields (id, label)
- Type-specific validations:
  - Career: requires class
  - Talent: specs must be array
  - Skill: requires characteristic, specs must be array
  - Spell: requires cn (except Invocation)
  - CareerLevel: requires career and careerLevel
- Returns { valid: boolean, errors: Array<string> }

### 5. Utility Functions
Additional helper functions:
- **eachElem()** - Iterates over elements/arrays with callback
- **flattenElemIteratively()** - Flattens hierarchical trees with level tracking

### 6. Documentation
- Comprehensive JSDoc comments for all functions
- Module-level documentation explaining key features
- Parameter and return type documentation
- Usage examples in comments

### 7. Testing
Created db-transforms.test.js with smoke tests:
- toId conversion tests (accents, special chars, spaces)
- createElem structure tests
- getLabelForElem format tests (specs, suffix, prefix)
- getLabelForData format tests
- parseSpecs parsing tests
- validate validation tests (valid/invalid cases)
- flattenElemIteratively tree flattening tests

All tests pass successfully:
```
✓ toId: "magie-mineure", "cavalier-nain", "equitation"
✓ createElem: proper structure with specs/suffix
✓ getLabelForElem: "+2 Combat (Arme à une main)"
✓ getLabelForData: "Arcane Magie (MA)"
✓ parseSpecs: ["Savoir", "Métier", "Artisanat"]
✓ validate: detects missing required fields
✓ flattenElemIteratively: correct level tracking
```

## Key Implementation Details

### String Parsing Algorithm
The stringToElems() function implements a state machine parser:
1. Split input by operators: `([+|-]?\d+[d\-+\d]*| ou |, | \(|\))`
2. Track mode: 'label' or 'specs'
3. Track affix position: 'suffix' or 'prefix'
4. Handle parentheses for spec groups
5. Handle "ou" (or) and "," (comma) separators
6. Reconstruct original string for display

### Data Resolution Strategy
1. Generate test IDs from label + specs combinations
2. Try each combination in order (most specific first)
3. Look up in appropriate database table
4. Cache result in elem.data
5. Preserve original label and specs

### Spec Normalization
- Database: "Savoir, Métier" (comma-separated string)
- After transform: ["Savoir", "Métier"] (array)
- For display: "Savoir ou Métier" (ou-separated)

## Integration with Stream A
Successfully integrates with enhanced schema from Stream A:
- Uses compound indexes for relationships
- Leverages multi-entry indexes for specs
- Works with all enhanced fields (desc, book, page, etc.)
- Compatible with v2 schema structure

## Usage Examples

```javascript
import { db } from './db.js'
import { transform, stringToElems, validate } from './db-transforms.js'

// Transform a talent from database
const talent = await db.talents.get('ambidextre')
const transformed = await transform(db, talent, 'talent')
// transformed.specs is now array, addSkillData is resolved

// Parse a complex string
const elems = await stringToElems(db, 'Combat (Arme à une main) +2', null, 'skill')
// Returns structured element with label, specs, suffix

// Validate data
const validation = validate(talent, 'talent')
if (!validation.valid) {
  console.error(validation.errors)
}
```

## Files Modified
- `C:\Users\gauch\PhpstormProjects\epic-v2\warhammer-v2\src\lib\db-transforms.js` (created)
- `C:\Users\gauch\PhpstormProjects\epic-v2\warhammer-v2\src\lib\db-transforms.test.js` (created)

## Coordination Notes
- **Stream A** (Schema): Completed, provides enhanced schema
- **Stream B** (Data Loading): Can use transform() functions when loading data
- **Stream D** (Relations): Can use resolved references (classData, characteristicData, etc.)

## Acceptance Criteria
- [x] Core stringToElems() logic ported from DataHelper.html
- [x] parseElems() implemented for data transformation
- [x] Spec parsing (splitting "spec1, spec2" into arrays)
- [x] Data binding (ID strings → object references)
- [x] Type-specific transformations (careers, talents, skills, spells, career levels)
- [x] Validation for transformed data
- [x] Comprehensive JSDoc documentation
- [x] Working test suite
- [x] Compatible with Stream A's enhanced schema
- [x] Export all utilities for use by other modules

## Next Steps for Other Streams
1. **Stream B** (Data Loading): Use transform() when loading data from JSON
2. **Stream D** (Relations): Build on *Data fields (classData, characteristicData, etc.)
3. **Stream E** (Descriptions): Use getLabelForElem() and getLabelForData() for display

## Notes
- All transformation functions are async to support database lookups
- Original HTML logic preserved, adapted for modern JavaScript
- No external dependencies beyond db.js
- Tree flattening function ready for folder/hierarchy support
- Validation can be extended as needed per type
