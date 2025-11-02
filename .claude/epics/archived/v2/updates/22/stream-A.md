# Issue #22 - Stream A: Schema Enhancement

## Stream Information
- **Stream**: A (Schema Enhancement)
- **Status**: completed
- **Started**: 2025-10-25
- **Completed**: 2025-10-25
- **Assigned Files**: `../epic-v2/warhammer-v2/src/lib/db.js` (schema section only)

## Objective
Update Dexie schema with all missing fields from HTML data definitions.

## Work Completed

### 1. Analysis Phase
- Analyzed 23 Data*.html files from main project
- Extracted complete field definitions for each entity type
- Identified relationships between entities
- Documented field usage patterns

### 2. Schema Enhancement
Updated schema from v1 to v2 with the following improvements:

#### Added Missing Fields
All tables now include complete field sets from HTML definitions:
- **Common fields**: `desc`, `book`, `page`, `folder` (hierarchical organization)
- **Books**: `label`, `abr`, `language`, `folder`
- **Careers**: `label`, `class`, `rand`, `subRand`
- **Career Levels**: `careerLevel`, `status` (e.g., "Bronze 1")
- **Talents**: `max`, `test`, `specs` (array), `addSkill`, `addTalent`
- **Skills**: `characteristic`, `type`, `advanced`, `specs` (array), `example`
- **Spells**: `type`, `subType`, `cn`, `range`, `target`, `duration`
- **Trappings**: `type`, `subType`, `gold`, `silver`, `bronze`, `availability`, `enc`, `reach`, `damage`, `loc`, `pa`, `carry`, `mode`, `toughness`, `wounds`
- **Creatures**: `char` (characteristics object), arrays for skills, talents, traits, optionals, trappings, spells
- **Species**: `refCareer`, `refDetail`, `refChar` (reference keys)
- **Lores**: `suffix`, `parent` (hierarchical)
- **Traits**: `suffix`, `prefix`
- And similar enhancements for all other tables

#### Added Compound Indexes
- **careerLevels**: `[career+careerLevel]` - Enables efficient queries like:
  ```javascript
  db.careerLevels.where('[career+careerLevel]').equals([careerId, 1])
  ```

#### Added Multi-Entry Indexes
Multi-entry indexes (prefix `*`) allow queries on individual array elements:
- **talents**: `*specs` - Query talents by specific specialization
- **skills**: `*specs` - Query skills by specific specialization

These enable queries like:
```javascript
db.talents.where('specs').equals('Arme à une main')
db.skills.where('specs').equals('Savoir')
```

### 3. Documentation
- Added comprehensive comments for each table explaining:
  - All fields stored in the table
  - Relationships to other tables
  - Usage examples for compound and multi-entry indexes
- Added schema changelog documenting v1 to v2 migration

### 4. Migration Strategy
Implemented Dexie's version migration system:
- v1 schema preserved for backward compatibility
- v2 schema with full enhancements
- Automatic migration when database is opened

## Key Changes Summary

### Field Naming Convention
Changed from mixed conventions to consistent `label` for names:
- `name` → `label` (consistent with HTML data structure)
- `abbreviation` → `abr` (books)
- Other fields maintain HTML naming

### Schema Version Management
```javascript
// v1 - Initial minimal schema (deprecated)
db.version(1).stores({ ... })

// v2 - Enhanced schema with full field support
db.version(2).stores({ ... })
```

### Index Enhancements
1. **Compound indexes**: `[field1+field2]` for relationship queries
2. **Multi-entry indexes**: `*arrayField` for querying array contents
3. **Standard indexes**: All foreign keys and commonly queried fields

## Files Modified
- `C:\Users\gauch\PhpstormProjects\epic-v2\warhammer-v2\src\lib\db.js`

## Testing Notes
- Schema defines structure only; no breaking changes to helper functions
- V1 databases will automatically upgrade to v2 on next open
- All existing queries remain compatible
- New compound and multi-entry indexes provide additional query capabilities

## Coordination Notes
- **Stream B** (Data Loading): Can now use all enhanced fields when loading data
- **Stream C** (Helper Functions): Can implement relationship helpers using new compound indexes

## Next Steps for Other Streams
1. Stream B should update data loading to include all new fields
2. Stream C can implement relationship helpers like:
   - `getCareerWithLevels(careerId)` using `[career+careerLevel]` index
   - `getTalentsBySpec(spec)` using `*specs` multi-entry index
   - `getSkillsByCharacteristic(charId)` using characteristic index

## Completion Status
- [x] Analyze all 23 Data*.html files
- [x] Document field mappings for all tables
- [x] Add missing fields to schema
- [x] Add compound indexes
- [x] Add multi-entry indexes
- [x] Update to schema v2 with migration
- [x] Add comprehensive documentation

## References
- Issue: #22
- Main Epic: `.claude/epics/v2/22.md`
- HTML Source Files: `DataFunctions.html`, `DataCareer.html`, `DataTalent.html`, etc.
