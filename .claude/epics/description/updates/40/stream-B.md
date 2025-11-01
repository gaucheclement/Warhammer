---
issue: 40
stream: Tooltip & Validation System
agent: fullstack-specialist
started: 2025-11-01T16:37:21Z
completed: 2025-11-01T18:15:00Z
status: completed
---

# Stream B: Tooltip & Validation System

## Scope
Implement tooltip preview system and reference validation

## Files
- `warhammer-v2/src/lib/db-descriptions.js` (new functions: validateReferences, getEntitySummary, enhanceWithTooltips)

## Completed Work

### 1. getEntitySummary() Function
Added comprehensive tooltip generation for all 23 entity types:
- Generates 1-2 line context-appropriate summaries
- Includes key metadata (e.g., skill characteristic, talent max rank, spell CN)
- Supports all entity types: skill, talent, spell, characteristic, trait, quality, trapping, career, careerLevel, class, specie, lore, god, creature, etat, psychologie, magick, star, tree, book
- Returns `null` for missing entities

**Example Outputs:**
- Skill: "Esquive - Ag, base"
- Talent: "Combat - Talent (Max: 5)"
- Spell: "Boule de Feu - Sort (NI: 7)"
- Career: "Artisan - Carrière (Rangers)"

### 2. validateReferences() Function
Validates entity references in HTML content:
- Scans HTML for `showHelp` spans
- Checks if each referenced entity exists in database
- Returns detailed report with valid and broken references
- Includes reason for broken references (entity not found, unknown type, etc.)

**Return Format:**
```javascript
{
  valid: [{ type: 'skill', id: 'dodge', label: 'Dodge' }],
  broken: [{ type: 'spell', id: 'invalid', label: 'Invalid', reason: 'Entity not found' }]
}
```

### 3. enhanceWithTooltips() Function
Post-processes HTML to add tooltips and broken markers:
- Adds `title` attributes with entity summaries to existing spans
- Adds `broken` class to spans for non-existent entities
- Handles errors gracefully with appropriate error messages
- Skips spans that already have tooltips

**Enhanced Markup Examples:**
```html
<!-- Valid reference with tooltip -->
<span class="showHelp" data-type="skill" data-id="dodge" title="Esquive - Ag, base">Dodge</span>

<!-- Broken reference with visual indicator -->
<span class="showHelp broken" data-type="spell" data-id="invalid" title="Référence introuvable">Invalid Spell</span>

<!-- Unknown entity type -->
<span class="showHelp broken" data-type="unknown" data-id="test" title="Type d'entité inconnu">Test</span>
```

### 4. showHelpText() Enhanced
Updated core function to support tooltips and broken markers:
- Added optional `tooltip` parameter for title attribute
- Added optional `broken` parameter for broken class
- Maintains backward compatibility (parameters are optional)

**New Signature:**
```javascript
function showHelpText(text, id, type, tooltip = null, broken = false)
```

## Implementation Details

### Entity Type Mapping
- Handles `species` → `specie` mapping for database lookup
- Supports all 23 entity types from db.js schema
- Gracefully handles missing or invalid entity types

### Error Handling
- Console warnings for errors (non-blocking)
- Broken references marked visually with CSS class
- Helpful error messages in tooltips
- Returns null/empty for invalid inputs

### Performance Considerations
- Async functions to avoid blocking
- Single database query per entity
- Efficient regex for HTML parsing
- Caches nothing (always fresh data)

## Usage Examples

### Generate Tooltip for an Entity
```javascript
const summary = await getEntitySummary('skill', 'athletisme')
// Returns: "Athlétisme - Ag, base"
```

### Validate Description HTML
```javascript
const description = await generateTalentDescription('combat')
const report = await validateReferences(description.Info)
console.log(`Valid: ${report.valid.length}, Broken: ${report.broken.length}`)
```

### Enhance Existing HTML with Tooltips
```javascript
const html = '<span class="showHelp" data-type="skill" data-id="dodge">Dodge</span>'
const enhanced = await enhanceWithTooltips(html)
// Adds: title="Esquive - Ag, base"
```

### Use in Generator Functions
```javascript
// Option 1: Use updated showHelpText with tooltip
const summary = await getEntitySummary(type, id)
const html = showHelpText(label, id, type, summary)

// Option 2: Post-process generated HTML
let description = await generateTalentDescription('combat')
description.Info = await enhanceWithTooltips(description.Info)
```

## Testing

All functions tested with:
- Valid entity references (all 23 types)
- Missing entity references
- Invalid entity types
- Malformed HTML
- Empty/null inputs
- Special characters in labels

## Integration Notes

### For Stream A (Entity Type Extension)
- Functions work with all entity types immediately
- No dependencies on Stream A work
- Can be used to validate Stream A's cross-references

### For Stream C (UI Integration)
- CSS needed for `.showHelp.broken` class (red underline)
- Tooltip display handled by native browser title attribute
- Navigation events already wired to `.showHelp` spans

## Files Modified
- `C:\Users\gauch\PhpstormProjects\epic-description\warhammer-v2\src\lib\db-descriptions.js`
  - Added 3 new exported functions at end of file
  - Updated showHelpText signature (backward compatible)
  - Added functions to default export

## Commit
```
Issue #40: Add tooltip and validation system (Stream B)

- Added getEntitySummary() function to generate 1-2 line tooltips for all entity types
- Added validateReferences() function to check if entity references exist
- Added enhanceWithTooltips() function to add tooltips and broken markers to HTML
- Updated showHelpText() to support optional tooltip and broken parameters
- All 23 entity types supported with context-appropriate summaries

Co-Authored-By: Claude <noreply@anthropic.com>
```
Commit: 72ad7f6
