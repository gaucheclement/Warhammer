# Admin Guide: Data Management & Administration

## Overview

This guide covers advanced data management features for administrators, power users, and content creators. You'll learn how to edit official data, create custom content, manage database operations, and contribute to the community.

## Table of Contents

1. [Admin Mode](#admin-mode)
2. [Editing Official Data](#editing-official-data)
3. [Creating Custom Content](#creating-custom-content)
4. [Data Import & Export](#data-import--export)
5. [Database Management](#database-management)
6. [Conflict Resolution](#conflict-resolution)
7. [Community Contributions](#community-contributions)
8. [Maintenance & Troubleshooting](#maintenance--troubleshooting)
9. [Advanced Topics](#advanced-topics)

---

## Admin Mode

### What is Admin Mode?

Admin Mode enables advanced data editing features that are hidden from normal users. This includes:
- Direct editing of official game data
- Bulk data operations
- Advanced database management tools
- System diagnostics and testing

### Enabling Admin Mode

**Via Settings**:
1. Go to **Settings** > **Advanced**
2. Toggle **Admin Mode** to ON
3. Confirm the warning dialog
4. Admin features are now available

**Via URL Parameter**:
Add `?admin=true` to the URL:
```
https://your-app-url/#/?admin=true
```

### Admin Mode Features

**Browse Page Enhancements**:
- **Edit Button**: Appears on all entity detail modals
- **Bulk Edit**: Select multiple items for batch operations
- **Delete Option**: Remove entities from database
- **Advanced Filters**: Additional filtering options

**Admin Panel**:
- Access via **Settings** > **Admin Panel**
- Database status and statistics
- Data import/export tools
- System maintenance operations
- Testing and diagnostics

**Safety Features**:
- All destructive operations require confirmation
- Automatic backup before major changes
- Undo capability for recent operations
- Export modifications before applying updates

### Disabling Admin Mode

1. Go to **Settings** > **Advanced**
2. Toggle **Admin Mode** to OFF
3. Admin features are hidden again

**Note**: Your modifications persist even when Admin Mode is disabled.

---

## Editing Official Data

### When to Edit Official Data

**Valid Reasons**:
- Correcting errors or typos in official data
- Updating with errata from official sources
- Translating content to another language
- Adapting for house rules
- Adding missing book references or page numbers

**Avoid**:
- Changing game balance without good reason
- Removing content you don't like (use filters instead)
- Making changes that break character compatibility
- Editing without documenting your changes

### How to Edit Entities

#### Method 1: Via Browse Page

1. **Navigate** to Browse page
2. **Select Category** (e.g., Talents, Skills, Careers)
3. **Find Entity** using search or filters
4. **Click Row** to open detail modal
5. **Click "Edit"** button (Admin Mode required)
6. **Modify Fields** in the form
7. **Save Changes**

#### Method 2: Via Admin Panel

1. **Go to** Settings > Admin Panel
2. **Select** "Data Management" tab
3. **Choose Entity Type** from dropdown
4. **Search or Browse** to find entity
5. **Click "Edit"**
6. **Make Changes**
7. **Save**

### Edit Form Fields

**Common Fields** (all entity types):
- **ID**: Unique identifier (usually not editable)
- **Label/Name**: Display name
- **Description**: Full text description
- **Book**: Source book reference
- **Page**: Page number in book
- **Folder**: Organization category

**Entity-Specific Fields**:

**Skills**:
- Characteristic (Ag, WS, Int, etc.)
- Type (Basic/Advanced)
- Specializations (comma-separated)

**Talents**:
- Max Rank (1, 2, Int Bonus, etc.)
- Test requirements
- Specializations
- Granted skills/talents

**Careers**:
- Class (Warriors, Rogues, etc.)
- Species availability (probability weights)
- Career levels (references)

**Career Levels**:
- Career reference
- Level number (1-4)
- Status (Bronze 1, Silver 3, etc.)
- Skills (array of skill IDs)
- Talents (array of talent IDs)
- Characteristics (array of char IDs)
- Trappings (array of trapping IDs)

**Spells**:
- Casting Number (CN)
- Range
- Target
- Duration
- Lore/type

**Trappings**:
- Type (weapon, armor, container, etc.)
- Price (gold, silver, bronze)
- Encumbrance
- Weapon stats (damage, reach, qualities)
- Armor stats (locations, armor points)

### Validation

The form validates your input before saving:

**Required Fields**:
- ID (must be unique)
- Label/Name (must not be empty)

**Format Validation**:
- IDs: Lowercase, alphanumeric, hyphens only
- Numbers: Must be valid numbers
- Arrays: Properly formatted lists
- References: Must point to existing entities

**Relationship Validation**:
- Skill characteristic must exist
- Career class must exist
- Talent granted skills must exist
- Career level skills/talents must exist

**Error Handling**:
If validation fails:
1. Form shows error messages
2. Invalid fields highlighted in red
3. Save button disabled until fixed
4. Helpful hints provided

### Tracking Modifications

**Modification Metadata**:
Every edit is tracked with:
- Original value
- Modified value
- Timestamp
- User identifier (if available)

**Viewing Modifications**:
1. Admin Panel > Data Management tab
2. Click "View Modifications"
3. See list of all changed entities
4. Filter by entity type, date, or change type

**Reverting Changes**:
1. Find modification in list
2. Click "Revert" button
3. Confirm action
4. Entity restored to original official data

---

## Creating Custom Content

### Custom Content Creator

The Custom Content Creator lets you add entirely new entities to the database.

### Accessing the Creator

**Via Settings**:
1. Settings > Custom Content
2. Click "Create New Content"

**Via Browse Page** (Admin Mode):
1. Browse > Select Category
2. Click "Create New" button

### Creating New Entities

#### Step-by-Step Process

1. **Select Entity Type**: Choose what to create (Talent, Skill, Career, etc.)
2. **Fill Required Fields**: Name, ID, description
3. **Add Optional Fields**: Book reference, page, folder
4. **Set Relationships**: Link to other entities if needed
5. **Validate**: Check for errors
6. **Save**: Add to database

#### Entity Type Guidelines

**Creating a Talent**:
```
Name: "Master Strategist"
ID: "custom-master-strategist"
Max Rank: "1"
Test: "None"
Specs: [] (empty for no specializations)
Description: "You gain +10 to all Leadership tests when commanding a group."
Book: "Homebrew"
Folder: "custom/talents"
```

**Creating a Skill**:
```
Name: "Engineering"
ID: "custom-engineering"
Characteristic: "int" (must match an existing characteristic ID)
Type: "advanced"
Advanced: true
Specs: ["Mechanical", "Chemical", "Structural"]
Description: "Knowledge and application of engineering principles."
Book: "Homebrew"
```

**Creating a Career**:
```
Name: "Engineer"
ID: "custom-engineer"
Class: "academics" (must match existing class ID)
Species Availability: { "human": 100, "dwarf": 120, "halfling": 50 }
Description: "A learned professional who designs and builds structures and machines."
Book: "Homebrew"
```

**Creating a Career Level**:
```
Name: "Apprentice Engineer"
ID: "custom-engineer|apprentice"
Career: "custom-engineer"
Level: 1
Status: "Bronze 3"
Skills: ["engineering", "trade-carpenter", "lore-engineering"]
Talents: ["craftsman-engineer"]
Characteristics: ["int", "dex", "fel"]
Trappings: ["Writing Kit", "Engineering Tools"]
```

**Creating a Spell**:
```
Name: "Ward of Stone"
ID: "custom-ward-stone"
Type: "arcane"
Lore: "earth" (if applicable)
CN: "7"
Range: "Touch"
Target: "1 creature"
Duration: "Willpower Bonus Rounds"
Description: "Target gains +20 to Toughness against physical damage."
```

### ID Conventions

**Best Practices**:
- Prefix with "custom-" or your initials (e.g., "jd-talent-name")
- Use lowercase letters only
- Separate words with hyphens
- Keep it short but descriptive
- Ensure uniqueness

**Examples**:
- `custom-fire-sword` (trapping)
- `homebrew-arcane-sight` (talent)
- `jdoe-shadow-mage` (career)
- `community-lore-dragons` (skill)

### Relationships and References

**Linking Entities**:

When creating custom content that references other entities:

**Existing Entities**: Reference by ID
```javascript
// Custom career level
{
  skills: ["athletics", "climb", "custom-parkour"], // Mix official + custom
  talents: ["strike-mighty"], // Official talent
  characteristics: ["ag", "s", "t"] // Official characteristics
}
```

**Creating Dependencies**:
Create referenced entities first:
1. Create custom skill "Parkour"
2. Then create career level that uses it
3. Then create career that includes that level

**Circular References**:
Avoid circular dependencies:
- Talent A grants Talent B
- Talent B grants Talent A
- This causes infinite loops

### Validation & Testing

**Before Publishing**:
1. **Create**: Add custom content
2. **Test**: Create a character using it
3. **Verify**: Check all calculations work
4. **Adjust**: Fix any issues
5. **Export**: Save for sharing

**Testing Checklist**:
- Entity appears in browse tables
- Search finds it correctly
- Detail view displays properly
- Relationships load correctly
- Character creator includes it
- XP costs calculate properly
- No console errors

---

## Data Import & Export

### Exporting Modifications

**What Gets Exported**:
- All custom-created entities
- All modifications to official entities
- Metadata (author, timestamp, version)

**What's NOT Exported**:
- Unmodified official data (to keep file size small)
- Characters (export separately)
- Settings and preferences

### Export Process

#### Via Admin Panel

1. **Navigate**: Settings > Admin Panel
2. **Select**: "Data Management" tab
3. **Click**: "Export Modifications"
4. **Choose Options**:
   - Author name (optional)
   - Entity types to include
   - Format (JSON)
5. **Download**: Save file

**Export File Format**:
```json
{
  "version": "1.0",
  "exported": "2025-10-25T14:30:00.000Z",
  "author": "John Doe",
  "modifications": {
    "talents": [
      {
        "id": "custom-master-strategist",
        "label": "Master Strategist",
        "max": "1",
        "desc": "...",
        "book": "Homebrew"
      }
    ],
    "skills": [...],
    "careers": [...]
  }
}
```

#### Via Browse Page

1. **Browse** to category
2. **Filter** to show only custom content
3. **Select** entities to export
4. **Click** "Export Selected"
5. **Save** file

### Importing Modifications

**Import Sources**:
- Your own backups
- Community content packages
- Official errata/updates
- Translated content

#### Import Process

1. **Navigate**: Settings > Admin Panel
2. **Select**: "Data Management" tab
3. **Click**: "Import Modifications"
4. **Choose File**: Select JSON file
5. **Review**: Preview what will be imported
6. **Resolve Conflicts**: Handle overlapping IDs
7. **Confirm**: Apply import

**Import Validation**:
The system checks:
- File format is valid JSON
- Version is compatible
- All required fields present
- Referenced entities exist
- No data corruption

**Import Options**:
- **Add Only**: Only import new entities (skip existing)
- **Update Existing**: Overwrite entities with same ID
- **Merge**: Combine with existing (advanced)
- **Replace All**: Clear and replace category

### Conflict Resolution

**When Conflicts Occur**:

**ID Collision**:
- Imported entity has same ID as existing
- Choose: Keep Existing, Replace, Rename Imported

**Name Collision**:
- Different IDs but same display name
- Usually safe to keep both
- Rename one if confusing

**Dependency Missing**:
- Imported entity references non-existent entity
- Options:
  - Import dependency first
  - Remove reference
  - Skip this entity

**Resolution Strategies**:

**Individual Resolution**:
1. System shows conflict
2. Displays both versions side-by-side
3. Choose resolution for each
4. Apply and continue

**Bulk Resolution**:
1. Set rule for category (e.g., "Always keep existing")
2. Apply to all similar conflicts
3. Review summary before applying

**Merge Strategy**:
1. Keep fields from existing
2. Add missing fields from imported
3. Flag conflicting fields for manual review
4. Best for updates from same source

---

## Database Management

### Admin Panel Overview

Access: Settings > Admin Panel

**Four Tabs**:
1. **Database**: Status and statistics
2. **Data Management**: Import/export, bulk operations
3. **Testing**: Diagnostics and validation
4. **Maintenance**: Cleanup and optimization

### Database Tab

**Database Status**:
- Initialization status
- Current schema version
- Data version
- Last updated timestamp

**Statistics**:
Table-by-table record counts:
- Books: 39
- Careers: 220
- Career Levels: 880
- Skills: 174
- Talents: 220
- (etc.)

**Data Stores**:
- Merged data status
- Custom modifications count
- Cache statistics

**Actions**:
- Re-initialize database
- Clear all data
- Reset to defaults
- Export database

### Data Management Tab

**Import/Export Operations**:
- Import modifications
- Export modifications
- Import characters
- Export all data

**Bulk Operations**:
- Delete multiple entities
- Update field across multiple entities
- Re-validate all entities
- Regenerate IDs

**Modification Management**:
- View all modifications
- Filter by type/date
- Revert specific changes
- Export modification log

### Testing Tab

**Data Validation**:
- Run validation on all entities
- Check relationship integrity
- Find broken references
- Detect duplicate IDs

**Test Suite**:
- Unit tests for data layer
- Relationship tests
- Transform tests
- Description generation tests

**Performance Testing**:
- Query speed benchmarks
- Index usage analysis
- Cache hit rates
- Storage size metrics

**Results Display**:
- Pass/fail status per test
- Detailed error messages
- Performance metrics
- Recommendations

### Maintenance Tab

**Database Cleanup**:
- **Remove Orphans**: Delete entities with no references
- **Fix References**: Update broken relationship references
- **Deduplicate**: Find and merge duplicate entries
- **Compact**: Optimize database storage

**Cache Management**:
- **Clear Cache**: Remove all cached data
- **Refresh Cache**: Rebuild cache from database
- **Cache Stats**: View hit/miss rates

**Storage Management**:
- **Check Quota**: See available browser storage
- **Estimate Usage**: Project future storage needs
- **Clean Temp Data**: Remove temporary files

**Backup & Restore**:
- **Create Backup**: Full database snapshot
- **Restore Backup**: Replace database with backup
- **Scheduled Backups**: Automatic backup scheduling (future)

### Re-initializing the Database

**When to Re-initialize**:
- Database corrupted
- Major version upgrade
- Testing fresh install
- Resolving conflicts

**What Happens**:
1. All official data cleared
2. Fresh data loaded from embedded JSON
3. Custom modifications preserved (optional)
4. Characters preserved (optional)
5. Settings reset (optional)

**Process**:
1. **Backup First**: Export characters and modifications
2. **Navigate**: Admin Panel > Database tab
3. **Click**: "Re-initialize Database"
4. **Choose**: What to preserve
5. **Confirm**: Acknowledge warning
6. **Wait**: Process takes 5-10 seconds
7. **Verify**: Check data loads correctly

**Preservation Options**:
- **Keep Characters**: Preserve all saved characters
- **Keep Custom Content**: Preserve modifications
- **Keep Settings**: Preserve user preferences
- **Fresh Start**: Clear everything

---

## Conflict Resolution

### Understanding Conflicts

**Conflict Types**:

1. **ID Conflict**: Two entities with identical IDs
2. **Name Conflict**: Different IDs, same display name
3. **Reference Conflict**: Entity references non-existent entity
4. **Data Conflict**: Same entity with different field values
5. **Version Conflict**: Incompatible data format versions

### ID Conflicts

**Scenario**:
- Official data has talent with ID "ambidextrous"
- You create custom talent with same ID
- Conflict occurs on import or database merge

**Resolution Options**:

**Keep Official** (Recommended for official data updates):
- Discard custom version
- Use official version
- Your modifications are lost

**Keep Custom** (For intentional overrides):
- Discard official version
- Use your custom version
- Official updates won't apply to this entity

**Rename Custom** (Best for accidental collisions):
- Change custom entity ID (e.g., "custom-ambidextrous")
- Keep both versions
- Update references to use new ID

**Merge** (Advanced):
- Combine fields from both
- Keep non-conflicting fields from both
- Manually resolve conflicting fields

### Automatic Conflict Resolution

**Conflict Resolver UI**:

1. **Detection**: System automatically detects conflicts
2. **Display**: Shows both versions side-by-side
3. **Diff View**: Highlights differences
4. **Resolution**: Choose action per conflict
5. **Batch Options**: Apply same action to similar conflicts
6. **Preview**: See result before applying
7. **Apply**: Commit resolution

**Resolver Display**:
```
Conflict: Talent "Ambidextrous"
═══════════════════════════════════════════════════

Official Version         Custom Version
─────────────────        ───────────────────
ID: ambidextrous         ID: ambidextrous
Max: 1                   Max: 2            ← DIFFERENT
Test: None               Test: Ag Test     ← DIFFERENT
Desc: Can use both...    Desc: Master...   ← DIFFERENT

Resolution:
○ Keep Official (recommended)
○ Keep Custom
○ Rename Custom to: [custom-ambidextrous]
○ Merge (advanced)

[Apply]  [Skip]  [Cancel All]
```

### Manual Conflict Resolution

**For Complex Conflicts**:

1. **Export Both**: Save both versions to files
2. **Analyze**: Compare in external tool
3. **Decide**: Determine correct resolution
4. **Edit**: Manually create merged version
5. **Import**: Load merged version
6. **Verify**: Test in application

### Best Practices

**Preventing Conflicts**:
1. **Unique IDs**: Always prefix custom content IDs
2. **Document**: Note source of modifications
3. **Version Control**: Track changes in git
4. **Separate Files**: Keep custom content in separate packages
5. **Regular Exports**: Backup modifications frequently

**Resolving Conflicts**:
1. **Official Priority**: Prefer official data unless intentionally overriding
2. **Document Overrides**: Note why you kept custom version
3. **Test After Resolution**: Ensure characters still work
4. **Communicate**: Share resolutions with team/community

---

## Community Contributions

### Sharing Custom Content

**Creating Content Packages**:

1. **Organize**: Group related custom entities
2. **Document**: Write clear descriptions
3. **Test**: Verify everything works
4. **Export**: Create JSON package
5. **Readme**: Include installation instructions
6. **Share**: Upload to community site or GitHub

**Package Structure**:
```json
{
  "version": "1.0",
  "author": "Your Name",
  "package": "Mercenary Careers",
  "description": "Five new mercenary-themed careers with custom talents and equipment",
  "modifications": {
    "careers": [...],
    "careerLevels": [...],
    "talents": [...],
    "trappings": [...]
  }
}
```

**Include in Readme**:
- What's included
- How to install
- Compatibility requirements
- Known issues
- Credits and sources
- Contact information

### Reviewing Community Content

**Before Importing**:

1. **Source**: Is creator reputable?
2. **Reviews**: What do others say?
3. **Content**: Read the description
4. **Compatibility**: Check version requirements
5. **Backup**: Export your data first

**After Importing**:

1. **Test**: Create test character
2. **Check**: Browse imported entities
3. **Validate**: Run data validation tests
4. **Rollback**: Restore backup if issues

### Contributing to Official Data

**Reporting Errors**:

1. **Verify**: Confirm it's actually an error
2. **Check**: See if already reported
3. **Document**: Note source (book, page)
4. **Screenshot**: Include proof if possible
5. **Submit**: Open GitHub issue or forum post

**Submitting Corrections**:

1. **Make Changes**: Edit entity in app
2. **Export**: Save modification to JSON
3. **Explain**: Document what and why
4. **Submit**: Create pull request or attach to issue
5. **Discuss**: Respond to feedback

**Contribution Guidelines**:

**Acceptable**:
- Fixing typos and errors
- Adding missing official content
- Clarifying ambiguous descriptions
- Improving cross-references
- Adding book/page references

**Not Acceptable**:
- Homebrew content to official data
- Balance changes without justification
- Removing content
- Changing IDs of existing entities
- Personal preferences as "corrections"

### Community Resources

**Official Repositories**:
- Main GitHub repository
- Issue tracker
- Wiki and documentation
- Discussion forums

**Community Sites**:
- Discord server
- Reddit community
- Fan sites and blogs
- Content sharing platforms

**Contributing Code**:
- Fork repository
- Create feature branch
- Make changes with tests
- Submit pull request
- Respond to code review

---

## Maintenance & Troubleshooting

### Regular Maintenance

**Weekly Tasks**:
- Review custom modifications for issues
- Run data validation tests
- Check database statistics
- Clear temporary cache

**Monthly Tasks**:
- Export complete backup
- Audit custom content usage
- Update from official sources
- Optimize database

**Before Major Updates**:
- Export all data
- Document custom modifications
- Test update in separate profile
- Review migration guide

### Common Admin Issues

#### "Cannot edit official data"

**Cause**: Admin Mode not enabled

**Solution**:
1. Go to Settings > Advanced
2. Enable Admin Mode
3. Refresh page

#### "Validation failed" when saving

**Cause**: Invalid data in form fields

**Solution**:
1. Check for red error messages
2. Fix invalid fields
3. Ensure required fields filled
4. Check relationship references exist

#### "Database re-initialization failed"

**Cause**: Corrupted embedded data or insufficient storage

**Solution**:
1. Check available browser storage
2. Close other tabs
3. Clear browser cache
4. Try different browser
5. Check console for specific error

#### "Import failed: Invalid format"

**Cause**: File is corrupted or wrong version

**Solution**:
1. Verify file is valid JSON (open in text editor)
2. Check version matches app version
3. Re-download if downloaded file
4. Try older version of file

#### Custom content not appearing

**Cause**: Not merged into data stores

**Solution**:
1. Go to Admin Panel
2. Check "Data Management" tab
3. Verify custom modifications count
4. Click "Refresh Data Stores"
5. Clear cache and reload

### Diagnostic Tools

**Browser Console**:
- Press F12 to open DevTools
- Check Console tab for errors
- Check Network tab for load failures
- Check Application > IndexedDB for database

**Admin Panel Tests**:
- Run all tests in Testing tab
- Check results for failures
- Review specific error messages
- Run performance benchmarks

**Database Inspector**:
1. Admin Panel > Database tab
2. View record counts
3. Check for anomalies (0 counts, huge counts)
4. Compare to expected values

**Export Diagnostics**:
1. Export modifications
2. Examine JSON in text editor
3. Validate JSON syntax
4. Check for unexpected data

---

## Advanced Topics

### Data Merging Algorithm

**How Official + Custom Data Merges**:

1. **Load Official**: Load embedded official data
2. **Load Custom**: Load custom modifications from store
3. **Merge**: Combine using priority rules
4. **Validate**: Check integrity
5. **Store**: Save merged result

**Merge Priority**:
- Custom modifications override official
- Null/undefined in custom doesn't remove official
- Arrays in custom fully replace official arrays
- Objects in custom merge with official (field by field)

### Relationship Management

**Forward Relations**:
- Stored as ID references
- Resolved at query time
- Cached for performance

**Reverse Relations**:
- Computed on demand
- Not stored in database
- Expensive to calculate
- Heavily cached

**Relationship Cache**:
- 5-minute TTL
- Cleared on data changes
- Manual clear option
- Per-entity-type cache

### Custom Data Transformations

**Transform Pipeline**:

1. **Parse**: Convert raw data to objects
2. **Validate**: Check required fields
3. **Transform**: Apply type-specific transforms
4. **Resolve**: Look up related entities
5. **Enrich**: Add computed fields
6. **Cache**: Store result

**Custom Transformers**:
You can register custom transformers for your entity types:

```javascript
import { registerTransformer } from './lib/db-transforms.js'

registerTransformer('myEntityType', async (db, entity) => {
  // Your custom transform logic
  return transformedEntity
})
```

### Scripting and Automation

**Bulk Operations via Console**:

```javascript
// Example: Add "Homebrew" tag to all custom talents
import { db } from './lib/db.js'

const customTalents = await db.talents
  .where('id').startsWith('custom-')
  .toArray()

for (const talent of customTalents) {
  talent.folder = 'homebrew'
  await db.talents.put(talent)
}

console.log(`Updated ${customTalents.length} talents`)
```

**Batch Import**:

```javascript
// Import multiple JSON files at once
async function batchImport(files) {
  for (const file of files) {
    const data = await loadJSON(file)
    await importModifications(data)
  }
}
```

### Performance Optimization

**Indexing Strategy**:
- Add indexes for frequently queried fields
- Use compound indexes for multi-field queries
- Use multi-entry indexes for array fields

**Query Optimization**:
- Use indexes (where clauses)
- Limit result sets
- Avoid full table scans
- Cache expensive queries

**Storage Optimization**:
- Remove unused fields
- Compress large text fields
- Archive old modifications
- Periodically compact database

---

## Appendix

### Entity Type Reference

Quick reference for all entity types and their key fields:

| Type | Key Fields | Relationships |
|------|-----------|---------------|
| books | id, label, abr | Referenced by all |
| careers | id, label, class, rand | → classes, species |
| careerLevels | id, career, level, skills, talents | → careers, skills, talents |
| species | id, label, refCareer | → careers |
| classes | id, label, trappings | → trappings |
| talents | id, label, max, specs | → skills (addSkill) |
| skills | id, label, characteristic, specs | → characteristics |
| characteristics | id, label, abr | - |
| spells | id, label, cn, lore | → lores |
| trappings | id, label, type, enc | - |
| creatures | id, label, skills, talents | → skills, talents, traits |
| traits | id, label | - |
| lores | id, label, parent | → lores (parent) |
| stars | id, label | - |
| gods | id, label, blessings | → spells |
| eyes | id, label, rand | - |
| hairs | id, label, rand | - |
| details | id, label, type | - |
| magicks | id, label, type | - |
| etats | id, label | - |
| psychologies | id, label | - |
| qualities | id, label, type | - |
| trees | id, label, parent | → trees (parent) |

### File Format Specifications

**Modification Export Format**:
```typescript
interface ModificationExport {
  version: string           // Export format version
  exported: string          // ISO 8601 timestamp
  author?: string          // Optional author name
  modifications: {
    [entityType: string]: EntityObject[]
  }
}
```

**Character Export Format**:
```typescript
interface CharacterExport {
  version: string
  exported: string
  character: Character      // Full character object
  metadata: {
    appVersion: string
    dataVersion: string
  }
}
```

### Glossary

- **Entity**: A single game data object (talent, skill, career, etc.)
- **Modification**: Change to an official entity
- **Custom Content**: User-created entity
- **Official Data**: Original game data from books
- **Merged Data**: Combination of official + custom data
- **Relationship**: Connection between entities (e.g., career → skills)
- **Reference**: ID pointing to another entity
- **Transform**: Process of parsing and enriching raw data
- **Validation**: Checking data meets requirements
- **Conflict**: Multiple entities with same ID or incompatible data

---

## Getting Help

For admin-specific help:

1. **Documentation**: Read [Architecture Guide](ARCHITECTURE.md) for technical details
2. **GitHub Issues**: Report bugs or request features
3. **Discord**: #admin-help channel
4. **Email**: admin@warhammer-app.example.com

**When Asking for Help**:
- Describe what you're trying to do
- What steps you've taken
- What error occurred
- Console errors (F12)
- Your custom content (if relevant)

---

Happy administrating!
