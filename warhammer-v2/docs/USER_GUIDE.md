# Warhammer Fantasy 4e - User Guide

## Welcome

Welcome to the Warhammer Fantasy Roleplay 4th Edition Progressive Web Application! This comprehensive guide will help you master all features of the application, from browsing game data to creating and managing characters.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Browsing Game Data](#browsing-game-data)
4. [Character Creation](#character-creation)
5. [Character Management](#character-management)
6. [Character Sheet](#character-sheet)
7. [Custom Content](#custom-content)
8. [Import & Export](#import--export)
9. [Settings](#settings)
10. [Tips & Tricks](#tips--tricks)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Offline Usage](#offline-usage)
13. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

When you first open the application:

1. **Database Initialization**: The app automatically loads all game data into your browser's local database. This takes 2-3 seconds.
2. **Confirmation**: Look for "Database initialized successfully" message
3. **Ready**: Once initialized, you can use the app offline!

### System Requirements

- **Modern Browser**: Chrome 80+, Firefox 74+, Safari 13.1+, or Edge 80+
- **Storage**: ~10MB of free browser storage
- **Internet**: Only required for first visit (then works offline)

### Adding to Home Screen (Mobile)

For the best mobile experience:

**iOS/iPadOS**:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

**Android**:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"
4. Tap "Add"

---

## Interface Overview

### Navigation

The app uses a **sidebar navigation** (desktop) or **bottom navigation** (mobile):

- **Home** - Dashboard with quick actions
- **Browse** - Explore all game data
- **Characters** - View all your characters
- **Creator** - Character creation wizard
- **Settings** - App configuration

### Header

- **Title**: Current page name
- **Search**: Global search (on Browse page)
- **Theme Toggle**: Switch between light and dark mode
- **Offline Indicator**: Shows when app is offline

### Footer

- Version information
- Quick links to documentation

---

## Browsing Game Data

The Browse page lets you explore all 23 game data types from the Warhammer 4e rulebooks.

### Data Categories

#### Character Options
- **Species** (5): Human, Dwarf, Halfling, High Elf, Wood Elf
- **Careers** (220+): All professions and career paths
- **Career Levels** (880+): 4 levels for each career
- **Classes** (4): Social status groups (Academics, Burghers, Courtiers, Rangers, Riverfolk, Rogues, Warriors)

#### Skills & Abilities
- **Skills** (174): All skills with specializations
- **Talents** (220+): Special abilities and perks
- **Spells** (350+): Arcane, divine, and chaos magic
- **Lores** (20+): Magic traditions and domains

#### Equipment
- **Trappings** (500+): Weapons, armor, gear, and items
- **Qualities** (40+): Weapon and armor properties

#### World & Lore
- **Books** (39): Source books and references
- **Gods** (25+): Deities and their domains
- **Stars** (12): Astrological signs
- **Creatures** (200+): NPCs, monsters, and animals

#### Character Generation
- **Eyes** (11): Eye color options
- **Hair** (11): Hair color options
- **Details** (100+): Physical traits and distinguishing features
- **Characteristics** (11): M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel

#### Rules
- **Traits** (100+): Creature and NPC special abilities
- **Etats** (Conditions): Status effects like Bleeding, Stunned, etc.
- **Psychologies**: Mental conditions and effects
- **Magicks**: Magic types and traditions

### Using the Data Browser

#### Selecting a Category

1. Open the **Browse** page
2. Click a category button (e.g., "Careers", "Skills", "Spells")
3. The data table loads instantly

#### Search

Use the search bar to find specific items:

- **Basic search**: Type any text (e.g., "sword")
- **Fuzzy search**: Finds partial matches (e.g., "athle" finds "Athlétisme")
- **Multi-word**: Searches all words (e.g., "combat melee")
- **Case-insensitive**: Capitalization doesn't matter

**Search Tips**:
- Search works across name, description, and related fields
- Use specific terms for better results
- Clear search to reset the table

#### Filtering

Advanced filters available for each data type:

**Careers**:
- By Class (Warriors, Rogues, etc.)
- By Species (Human, Dwarf, etc.)
- By Book (Core Rulebook, expansions, etc.)

**Skills**:
- By Type (Basic/Advanced)
- By Characteristic (Agility, Weapon Skill, etc.)
- By Specialization

**Spells**:
- By Lore (Fire, Beasts, Shadows, etc.)
- By Casting Number
- By Type (Arcane/Divine/Chaos)

**Trappings**:
- By Type (Weapon, Armor, Container, etc.)
- By Availability (Common, Scarce, Rare, Exotic)
- By Price Range

#### Sorting

Click column headers to sort:
- **First click**: Sort ascending (A-Z, 0-9)
- **Second click**: Sort descending (Z-A, 9-0)
- **Third click**: Remove sort

Multi-column sorting: Hold Shift and click multiple headers

#### Viewing Details

Click any row to open a detail modal with:

- **Full description** with formatted text and references
- **Statistics** and game mechanics
- **Book references** (source book and page number)
- **Relationships** (where this item is used or available)
- **Cross-references** as clickable links

**Entity Linking**: Descriptions automatically link related items. Click blue underlined text to view that entity.

Example: In a career description, clicking a skill name opens that skill's details.

---

## Character Creation

The **Creator** page provides a 9-step wizard for creating characters.

### Overview of Steps

1. **Species** - Choose your race
2. **Career** - Select your profession
3. **Characteristics** - Roll or assign attributes
4. **Skills** - Allocate skill advances
5. **Talents** - Choose special abilities
6. **Equipment** - Select starting gear
7. **Details** - Name and appearance
8. **Experience** - Allocate bonus XP
9. **Review** - Final summary and save

### Step 1: Species

**Choose from 5 species**:
- Human
- Dwarf
- Halfling
- High Elf
- Wood Elf

**Each species provides**:
- Base characteristics
- Species skills
- Species talents
- Physical traits

**Random Option**: Click the dice icon to randomly select a species

**Tips**:
- Hover over species cards for quick preview
- Click "Learn More" to view full species details
- Consider your desired career when choosing

### Step 2: Career

**Select a career** from available options for your species.

**Career Display**:
- **Name and Class**: e.g., "Soldier (Warrior)"
- **Description**: Brief overview of the career
- **Starting Career Level**: e.g., "Recruit"

**Career Filtering**:
- **By Class**: Filter by social status group
- **By Species**: Shows only careers available to your species
- **Random**: Click dice to roll a random appropriate career

**Career Preview**: Click a career to see:
- All 4 career levels
- Skills, talents, and characteristics per level
- Starting trappings

**Tips**:
- Some careers are restricted by species
- Read the career path (4 levels) before choosing
- Consider if you want combat, social, or magical focus

### Step 3: Characteristics

**Assign your 11 characteristics**:

| Abbr | Name | Description |
|------|------|-------------|
| M | Movement | Speed in yards per round |
| WS | Weapon Skill | Melee combat ability |
| BS | Ballistic Skill | Ranged combat ability |
| S | Strength | Physical power |
| T | Toughness | Resilience and hardiness |
| I | Initiative | Reflexes and reaction time |
| Ag | Agility | Coordination and grace |
| Dex | Dexterity | Manual dexterity and precision |
| Int | Intelligence | Mental acuity and learning |
| WP | Willpower | Mental fortitude and discipline |
| Fel | Fellowship | Charisma and social skills |

**Methods**:

1. **Random Roll**:
   - Click "Roll All" to roll 2d10+Species Base for each characteristic
   - Click individual dice icons to reroll single characteristics
   - Pure random method as per rulebook

2. **Point Buy** (Optional):
   - Assign values manually
   - Respect species minimums and career requirements

**Career Bonuses**:
- Your starting career level provides advances to certain characteristics
- These are shown as "+X" next to the base value
- Example: Soldier gets +5 WS, +5 S, +5 T

**Tips**:
- Higher is better for all characteristics
- Focus on characteristics your career advances
- Balance combat and non-combat stats
- Keep some XP for later advancement

### Step 4: Skills

**Select and advance skills** from:
- **Species skills**: Granted by your species
- **Career skills**: Granted by your starting career level

**Skill Selection**:
- **Basic skills**: Available to everyone (e.g., Athletics, Charm)
- **Advanced skills**: Require training (e.g., Language, Lore)
- **Specializations**: Some skills require choosing a specialization (e.g., "Melee (Basic)" or "Melee (Brawling)")

**Advancing Skills**:
- **Free advances**: Your career provides starting advances
- **Bonus advances**: Spend XP to improve further (5 XP per advance)
- **Maximum**: 60 advances total per skill

**Skill Test Calculation**:
- **Test Value** = Characteristic + Advances
- Example: Athletics (Ag 35) with +10 advances = 45%

**Tips**:
- Take all free career skills (no XP cost)
- Choose specializations for specialized skills
- Balance combat and non-combat skills
- Save some XP for talents

### Step 5: Talents

**Choose talents** from:
- **Species talents**: Granted by your species
- **Career talents**: Available from your career level
- **General talents**: Purchased with XP

**Talent Properties**:
- **Name**: Talent name
- **Max Rank**: How many times you can take it (1, 2, or calculated like "Int Bonus")
- **Tests**: Required tests or conditions
- **Description**: What the talent does

**Specializations**:
Some talents require specialization:
- Example: "Weapon Master (Swords)" or "Weapon Master (Bows)"
- Choose when selecting the talent

**XP Cost**:
- Career talents: 100 XP
- Non-career talents: 200 XP
- Each rank costs the full amount again

**Tips**:
- Prioritize career talents (cheaper)
- Choose talents that complement your skills
- Some talents grant new skills or other talents
- Read descriptions carefully for synergies

### Step 6: Equipment

**Select starting equipment** (trappings):

**Sources**:
1. **Class trappings**: Basic gear from your social class
2. **Career trappings**: Starting equipment from career
3. **Custom additions**: Add additional items manually

**Equipment Types**:
- **Weapons**: Melee and ranged
- **Armor**: Protection for body locations
- **Containers**: Backpacks, pouches, bags
- **Tools**: Professional equipment
- **Clothing**: Basic attire
- **Miscellaneous**: Other items

**Equipment Properties**:
- **Encumbrance**: Weight carried (affects movement)
- **Price**: Gold, silver, bronze cost
- **Qualities**: Special properties (Defensive, Penetrating, etc.)

**Managing Equipment**:
- Check boxes to include/exclude items
- Add custom items with "Add Trapping" button
- Adjust quantities for stackable items

**Tips**:
- Take all free starting equipment
- Balance carried weight (encumbrance)
- Ensure you have at least one weapon
- Consider armor for dangerous careers

### Step 7: Details

**Define your character's identity**:

**Required**:
- **Name**: Character name (3-30 characters)

**Optional Appearance**:
- **Eye Color**: Choose from 11 options or random
- **Hair Color**: Choose from 11 options or random
- **Height**: Character height
- **Distinguishing Features**: Scars, tattoos, birthmarks, etc.

**Biographical Information**:
- **Age**: Character age
- **Motivation**: What drives your character
- **Short-term Goal**: Immediate objective
- **Long-term Goal**: Ultimate ambition

**Random Options**:
- Click dice icons to randomly generate eye color, hair color, or physical details
- Random details add flavor and inspiration

**Tips**:
- Names should fit the Warhammer setting
- Physical details help you roleplay
- Goals provide character direction
- You can edit these later

### Step 8: Experience

**Allocate experience points (XP)**:

**Starting XP**:
- **Random method**: Roll 2d10 × 10 XP (20-200 XP)
- **Fixed method**: 120 XP (optional house rule)

**XP Spending**:
Review and adjust your XP spending from previous steps:

**Costs**:
- **Characteristics**: 25 XP per advance
- **Skills**: 5 XP per advance (career), 10 XP (non-career)
- **Talents**: 100 XP (career), 200 XP (non-career)

**XP Tracking**:
- **Total XP**: Total experience earned
- **Spent XP**: Experience already allocated
- **Available XP**: Remaining to spend

**Advancement Options**:
- Add more skill advances
- Purchase additional talents
- Improve characteristics
- Save for later advancement

**Tips**:
- Track all XP spending in the log
- Career skills and talents are cheaper
- Balance immediate power vs. future flexibility
- Keep some XP for emergencies

### Step 9: Review

**Final review and save**:

**Review Sections**:
1. **Core Identity**: Species, career, name
2. **Characteristics**: All 11 attributes with advances
3. **Skills**: Complete skill list with test values
4. **Talents**: All talents with descriptions
5. **Equipment**: Full inventory with encumbrance
6. **Details**: Appearance and biography
7. **Experience**: XP allocation summary

**Actions**:
- **Edit**: Click any section header to jump back to that step
- **Save**: Create the character
- **Cancel**: Discard and start over

**After Saving**:
- Character is saved to local database
- Redirects to character sheet view
- Draft is automatically cleared

### Auto-Save & Drafts

**Automatic Draft Saving**:
- Saves every 30 seconds while creating
- Stored in browser's localStorage
- Survives page reloads and browser restarts

**Loading Drafts**:
- If a draft exists, you'll see "Restore Draft" option on Creator page
- Shows last saved time
- Choose to restore or start fresh

**Manual Draft Management**:
- **Save Draft**: Manually save current progress
- **Clear Draft**: Delete saved draft
- **Restore**: Load previously saved draft

**Tips**:
- Don't worry about losing progress
- Finish character creation when ready
- One draft at a time (new draft overwrites old)

---

## Character Management

The **Characters** page displays all your saved characters.

### Character List View

**Display Options**:

1. **Card View** (Default):
   - Visual cards with avatar and key stats
   - Quick overview of each character
   - Click card to open character sheet

2. **Table View**:
   - Compact table with sortable columns
   - Shows: Name, Species, Career, Level, XP
   - Click row to open character sheet

### Sorting Characters

Click column headers to sort by:
- **Name** (alphabetical)
- **Species**
- **Career**
- **Created Date** (newest/oldest first)
- **Updated Date** (recently modified)

### Filtering Characters

Use filters to find characters:
- **By Species**: Show only specific species
- **By Career**: Show only specific careers
- **By Status**: Active, Retired, Deceased

### Character Actions

**Quick Actions** (from list):
- **View**: Open character sheet
- **Edit**: Modify character details
- **Duplicate**: Create a copy
- **Export**: Save to file
- **Delete**: Remove character (with confirmation)

**Bulk Actions**:
- **Select Multiple**: Check boxes to select characters
- **Bulk Export**: Export multiple characters at once
- **Bulk Delete**: Delete multiple characters

---

## Character Sheet

The character sheet displays all character information in an organized, readable format.

### Sheet Sections

#### 1. Header

**Top Section** displays:
- **Portrait**: Character avatar (if uploaded)
- **Name**: Character name
- **Species and Career**: e.g., "Human Soldier"
- **Career Level**: Current rank (1-4)
- **Status**: Active, Retired, Deceased

**Quick Actions**:
- **Edit**: Modify character
- **Advance**: Spend XP for advancement
- **Export**: Save to file
- **Print**: Print character sheet

#### 2. Characteristics Block

**11 characteristics** displayed as:
- **Current Value**: After all advances
- **Base Value**: Starting value from species
- **Advances**: Number of advances purchased
- **Bonus**: Derived bonus (value divided by 10, rounded down)

**Example**:
- Weapon Skill: 40 (Base: 30, Advances: +10, Bonus: 4)

#### 3. Skills Block

**All Skills** with:
- **Skill Name**: With specialization if applicable
- **Test Value**: Characteristic + Advances
- **Advances**: Number of advances (0-60)
- **Characteristic**: Governing attribute

**Grouped By**:
- Career skills first
- Non-career skills second
- Alphabetical within groups

**Skill Tests**:
- Roll d100 and compare to test value
- Success if roll ≤ test value
- Degrees of success/failure calculated

#### 4. Talents Block

**Talent List** showing:
- **Talent Name**: With specialization if applicable
- **Times Taken**: For multi-rank talents
- **Description**: Full talent text
- **Source**: Career, Species, or Purchased

**Talent Effects**:
Some talents automatically modify other stats:
- Bonus skills appear in skills list
- Stat modifications applied automatically

#### 5. Spells Block

**For magic-using careers**:

**Spell List** with:
- **Spell Name**
- **Casting Number (CN)**: Difficulty to cast
- **Range**: Spell reach
- **Target**: Who/what can be targeted
- **Duration**: How long spell lasts
- **Description**: Full spell effect

**Lore Organization**: Spells grouped by magic lore

#### 6. Equipment Block

**Inventory Management**:

**Equipment Categories**:
- **Weapons**: Melee and ranged weapons
- **Armor**: Body protection
- **Containers**: Storage items
- **Tools & Supplies**: Professional equipment
- **Clothing**: Attire
- **Miscellaneous**: Other items

**Item Properties**:
- **Name**: Item name
- **Quantity**: Number owned
- **Equipped**: Currently worn/wielded
- **Encumbrance**: Weight (individual and total)
- **Properties**: Special qualities

**Encumbrance Tracking**:
- **Total Encumbrance**: Sum of all carried items
- **Encumbrance Limit**: Based on Strength and Toughness
- **Status**: Unburdened, Encumbered, or Overburdened

**Managing Equipment**:
- **Add Item**: Add new equipment from database or custom
- **Remove Item**: Delete from inventory
- **Equip/Unequip**: Toggle equipped status
- **Adjust Quantity**: Change number of items

#### 7. Advancement Block

**Experience Tracking**:
- **Total XP**: All experience earned (from creation + adventures)
- **Spent XP**: Experience already used
- **Available XP**: Ready to spend

**Advancement Options**:

**Characteristics** (25 XP per advance):
- Increase any characteristic by +1
- Maximum: Current career cap

**Skills** (5-10 XP per advance):
- Increase skill by +1 advance
- Career skills: 5 XP
- Non-career skills: 10 XP
- Maximum: 60 advances

**Talents** (100-200 XP per talent):
- Learn new talents
- Career talents: 100 XP
- Non-career talents: 200 XP
- Multi-rank talents: Full cost per rank

**Career Progression**:
- Advance to next career level: varies by level
- Complete current level before advancing
- Must have all required advances

**Advancement Dialog**:
1. Click "Advance Character"
2. Choose advancement type
3. Select specific advancement
4. Confirm XP spend
5. See changes reflected immediately

**XP Log**:
- Detailed history of all XP gains and spending
- Sortable and filterable
- Export for record-keeping

#### 8. Notes Block

**Free-Form Notes**:
- **Session Notes**: Track what happened each game
- **Goals**: Character objectives and plans
- **Relationships**: NPCs, allies, enemies
- **Background**: Backstory and history
- **Reminders**: Things to remember

**Rich Text Editor**:
- Basic formatting (bold, italic, lists)
- No complex formatting (keeps data simple)
- Auto-saves on change

---

## Custom Content

The **Custom Content** feature lets you create homebrew game data.

### What You Can Create

All 23 entity types:
- Species, Careers, Career Levels
- Skills, Talents, Spells
- Trappings (weapons, armor, items)
- Creatures, Traits
- And more!

### Creating Custom Content

1. **Navigate**: Settings > Custom Content Creator
2. **Select Type**: Choose what to create (e.g., "Talent")
3. **Fill Form**: Enter all required fields
4. **Relationships**: Link to existing entities if needed
5. **Save**: Add to database

**Required Fields** (vary by type):
- **ID**: Unique identifier (auto-generated from name)
- **Name/Label**: Display name
- **Description**: Full text description

**Optional Fields**:
- **Book**: Source book reference
- **Page**: Page number reference
- **Folder**: Organization category

### Editing Official Data

**Admin Mode** required (see Admin Guide):

1. Enable Admin Mode in Settings
2. Navigate to Browse page
3. Click "Edit" on any entity
4. Modify fields
5. Save changes

**Warning**: Editing official data may cause conflicts with future updates.

### Conflict Resolution

**When Custom Content Conflicts with Official Data**:

**Conflict Types**:
1. **ID Collision**: Custom and official entity share the same ID
2. **Name Collision**: Different IDs but same display name

**Resolution Options**:
1. **Keep Official**: Discard custom, use official data
2. **Keep Custom**: Override official with custom version
3. **Keep Both**: Rename custom to avoid conflict
4. **Merge**: Combine fields (advanced)

**Conflict Resolver**:
- Automatic detection on data load
- Visual diff showing differences
- Choose resolution for each conflict
- Bulk resolution options

**Best Practices**:
- Use descriptive custom IDs (e.g., "homebrew-talent-name")
- Prefix custom content (e.g., "Custom: Talent Name")
- Document your changes in description field
- Export custom content regularly for backup

---

## Import & Export

### Exporting Data

**Export Characters**:

1. **Single Character**:
   - Open character sheet
   - Click "Export" button
   - Choose location to save JSON file

2. **Multiple Characters**:
   - Go to Characters page
   - Select characters to export
   - Click "Export Selected"
   - Save JSON file

3. **All Characters**:
   - Go to Settings
   - Click "Export All Characters"
   - Save JSON file

**Export Custom Content**:

1. Go to Settings > Data Management
2. Click "Export Custom Content"
3. Saves all custom entities to JSON file

**Export Format**: Standard JSON format with:
- Character data
- All relationships (skills, talents, equipment)
- Metadata (created date, version)
- Validation info

### Importing Data

**Import Characters**:

1. **From File**:
   - Go to Characters page
   - Click "Import" button
   - Select JSON file
   - Review character preview
   - Confirm import

2. **Conflict Resolution**:
   - If character ID exists, choose:
     - **Replace**: Overwrite existing character
     - **Keep Both**: Import as new character with different ID
     - **Skip**: Don't import this character

**Import Custom Content**:

1. Go to Settings > Data Management
2. Click "Import Custom Content"
3. Select JSON file
4. Review content preview
5. Handle any conflicts
6. Confirm import

**Import Validation**:
- Checks file format
- Validates all required fields
- Verifies relationships exist
- Reports errors before importing

**Supported Formats**:
- v2 JSON format (current)
- v1 format (partial support, may require manual fixes)

### Sharing Content

**With Other Users**:

1. Export characters or custom content
2. Share the JSON file
3. Recipient imports into their app

**Community Contributions**:

1. Create custom content package
2. Export to JSON
3. Submit to GitHub repository or community site
4. Include description and credits

**Tips**:
- Test imports on a backup/test profile first
- Include README with custom content packages
- Version your custom content files
- Backup before importing unknown files

---

## Settings

### General Settings

**Language** (Future):
- Interface language selection
- Currently French only

**Theme**:
- **Light Mode**: Bright, high contrast
- **Dark Mode**: Dark background, easier on eyes
- **Auto**: Follow system preference

**Default View**:
- Choose default character list view (cards or table)

### Data Management

**Database Operations**:

**Re-initialize Database**:
- Reloads all official data from embedded JSON
- **Warning**: Resets all data to defaults
- **Preserves**: Characters and custom content (if selected)

**Clear All Data**:
- Complete reset to factory defaults
- **Deletes**: ALL characters, custom content, settings
- **Requires confirmation**: Can't be undone
- **Use when**: Database corrupted or starting fresh

**Export Backups**:
- **Characters**: Save all characters to file
- **Custom Content**: Save homebrew to file
- **Settings**: Save preferences to file
- **Complete Backup**: Everything in one file

**Import Backups**:
- Restore from previously exported files
- Choose what to import (characters, content, settings)
- Handle conflicts if data exists

### Privacy Settings

**Data Storage**:
- All data stored locally in browser
- No data sent to external servers
- Clear browser data to remove app data

**Analytics** (If Implemented):
- Toggle usage analytics
- Help improve the app

### Advanced Settings

**Developer Mode**:
- Show technical IDs
- Display debug information
- Access to advanced tools

**Database Stats**:
- View record counts per table
- Check database size
- Performance metrics

**Cache Management**:
- Clear cached data
- Force reload of assets

---

## Tips & Tricks

### Efficient Character Creation

1. **Use Random Generation**: Speed up creation with random options
2. **Draft Auto-Save**: Don't worry about losing progress
3. **Jump Between Steps**: Click progress bar to move quickly
4. **Preview Before Choosing**: Hover over options for quick info
5. **Read Descriptions**: Understand mechanics before deciding

### Maximizing Characters

1. **Focus Career Advances**: Career skills/talents are cheaper
2. **Balance Stats**: Don't min-max, round out your character
3. **Take Utility Skills**: Not just combat skills
4. **Plan Career Path**: Look ahead to future career levels
5. **Save Some XP**: Keep emergency XP for important rolls

### Organizing Characters

1. **Descriptive Names**: Easy to identify at a glance
2. **Status Tracking**: Mark retired or deceased characters
3. **Regular Exports**: Backup important characters
4. **Notes for Context**: Track where you left off
5. **Group by Campaign**: Use naming conventions for campaigns

### Custom Content Best Practices

1. **Prefix Custom Items**: e.g., "Homebrew: Fire Sword"
2. **Document Sources**: Note where you got the idea
3. **Balance Testing**: Playtest before finalizing
4. **Export Regularly**: Don't lose your work
5. **Share with Community**: Contribute your creations

### Data Browsing Power User

1. **Learn Fuzzy Search**: Type partial words for faster finds
2. **Use Filters**: Narrow down large lists quickly
3. **Sort Multi-Column**: Shift+click for complex sorting
4. **Entity Linking**: Click blue links in descriptions
5. **Keyboard Navigation**: Arrow keys, Tab, Enter

---

## Keyboard Shortcuts

### Global Shortcuts

- **Ctrl/Cmd + K**: Focus search bar
- **Ctrl/Cmd + /**: Open keyboard shortcuts help
- **Esc**: Close modal/dialog
- **Ctrl/Cmd + ,**: Open settings

### Navigation Shortcuts

- **Alt + 1**: Home page
- **Alt + 2**: Browse page
- **Alt + 3**: Characters page
- **Alt + 4**: Creator page
- **Alt + 5**: Settings page

### Data Table Shortcuts

- **Arrow Keys**: Navigate cells
- **Enter**: Open selected row details
- **Ctrl/Cmd + F**: Focus search
- **Ctrl/Cmd + A**: Select all rows
- **Delete**: Delete selected rows (with confirmation)

### Character Creator Shortcuts

- **Alt + →**: Next step
- **Alt + ←**: Previous step
- **Ctrl/Cmd + S**: Save draft
- **Ctrl/Cmd + Enter**: Complete and save character

### Character Sheet Shortcuts

- **E**: Enter edit mode
- **A**: Open advancement dialog
- **P**: Print character sheet
- **X**: Export character

---

## Offline Usage

### How Offline Mode Works

**First Visit** (Online):
1. App loads from server
2. Downloads all assets and data
3. Stores in browser cache and IndexedDB
4. Service Worker registers

**Subsequent Visits** (Offline):
1. Service Worker intercepts requests
2. Serves cached assets
3. Data loads from IndexedDB
4. App works normally

### What Works Offline

**Fully Functional**:
- Browse all game data
- Create characters
- Edit characters
- View character sheets
- Import/export (to local files)
- Custom content creation
- Settings management

**Requires Online**:
- Initial first load
- App updates (auto-applies when online)
- External links (documentation, community)

### Offline Indicators

**Status Display**:
- **Green dot**: Online, connected
- **Orange dot**: Offline, using cached data
- **Red dot**: Offline, some features unavailable

**Update Notifications**:
- When online, checks for updates
- Prompts to refresh for new version
- Updates in background, applies on next refresh

### Managing Offline Data

**Storage Limits**:
- Typical browser limit: 50MB - 500MB
- App uses ~10MB for full database
- Characters: ~5KB each
- Custom content: varies

**Clearing Offline Data**:
1. Browser Settings > Privacy > Clear Browsing Data
2. Select "Cached images and files"
3. Select "Site data"
4. Clear for this site only

**Re-enabling Offline**:
1. Visit app while online
2. Service Worker re-registers
3. Data re-caches automatically

---

## Troubleshooting

### Common Issues

#### App Won't Load

**Symptoms**: Blank page, endless loading spinner

**Solutions**:
1. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check browser console for errors (F12)
4. Try different browser
5. Ensure JavaScript is enabled

#### Database Initialization Failed

**Symptoms**: "Failed to initialize database" error

**Solutions**:
1. Check browser supports IndexedDB (all modern browsers do)
2. Check available storage space
3. Disable private/incognito mode (temporary storage only)
4. Clear site data and try again
5. Check browser extensions aren't blocking storage

#### Character Not Saving

**Symptoms**: Save button doesn't work, changes lost on refresh

**Solutions**:
1. Check you're not in private browsing mode
2. Check browser storage isn't full
3. Check for JavaScript errors (F12 console)
4. Export character to file as backup
5. Try creating new character to test

#### Import Failed

**Symptoms**: "Invalid format" or "Import failed" error

**Solutions**:
1. Verify file is valid JSON (open in text editor)
2. Verify file is from v2 (check version field)
3. Check file isn't corrupted (re-export if possible)
4. Try importing one character at a time
5. Check console for specific error details

#### Slow Performance

**Symptoms**: Lag, freezing, slow response

**Solutions**:
1. Close unused browser tabs
2. Disable browser extensions temporarily
3. Clear browser cache
4. Reduce number of saved characters (export and delete old ones)
5. Update browser to latest version
6. Check system resources (CPU, memory)

#### Data Missing or Incorrect

**Symptoms**: Empty tables, missing entities, wrong information

**Solutions**:
1. Re-initialize database (Settings > Data Management)
2. Check filters aren't hiding data
3. Check search bar is empty
4. Clear cache and hard refresh
5. Report bug if data is consistently wrong

#### Offline Mode Not Working

**Symptoms**: App requires internet despite claiming offline support

**Solutions**:
1. Visit app while online first (to cache data)
2. Check Service Worker is registered (F12 > Application > Service Workers)
3. Clear cache and re-cache by visiting while online
4. Check browser supports Service Workers
5. Disable browser extensions that might interfere

### Getting Help

If you're still stuck:

1. **Check Documentation**: This guide, Admin Guide, Architecture docs
2. **Search GitHub Issues**: See if others had same problem
3. **Ask Community**: Discord, forums, or GitHub Discussions
4. **Report Bug**: Open GitHub Issue with details
5. **Contact Developer**: Via GitHub or email

**When Reporting Bugs**:
- Browser name and version
- Operating system
- Steps to reproduce
- Error messages (from console, F12)
- Screenshots if relevant

---

## What's Next?

Now that you've mastered the basics, explore advanced features:

- **Admin Guide**: Learn to edit data and manage community contributions
- **Architecture Documentation**: Understand how the app works under the hood
- **Community**: Share your creations and get involved

Happy adventuring in the Old World!
