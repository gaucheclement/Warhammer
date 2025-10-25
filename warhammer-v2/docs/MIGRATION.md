# Migration Guide: v1 to v2

## Welcome to Warhammer Fantasy 4e v2

This guide will help you transition from the Google Apps Script-based v1 application to the modern v2 Progressive Web Application (PWA).

## Table of Contents

- [Why Upgrade?](#why-upgrade)
- [What's New in v2?](#whats-new-in-v2)
- [What Changed?](#what-changed)
- [Migration Steps](#migration-steps)
- [Feature Comparison](#feature-comparison)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Why Upgrade?

Version 2 is a complete rebuild of the Warhammer Fantasy 4e character generator with modern web technologies. Here's why you should upgrade:

### Performance Improvements
- **100x faster** data browsing with IndexedDB instead of Google Sheets API calls
- **Instant offline access** - no internet connection required after first load
- **Single HTML file** (~445KB gzipped) that loads in seconds
- **No loading spinners** waiting for Google Sheets responses

### Better User Experience
- **Modern, responsive design** that works beautifully on mobile devices
- **Dark mode support** for comfortable viewing at night
- **Intuitive navigation** with clear visual hierarchy
- **Real-time search** with fuzzy matching across all data types
- **Keyboard shortcuts** for power users

### Enhanced Features
- **Character management** - save unlimited characters locally
- **Import/Export** - share characters with friends or backup to file
- **Custom content** - add your own homebrew rules and modifications
- **Advanced search** - find anything across 23 data types instantly
- **Draft system** - auto-save character creation progress

### Technical Advantages
- **No Google account required** - fully standalone application
- **Works offline** - no internet needed after initial load
- **Privacy focused** - all data stored locally in your browser
- **Open source** - inspect and modify the code as you wish
- **Future-proof** - modern architecture built for long-term maintenance

## What's New in v2?

### New Features

#### 1. Modern Character Creator
- **9-step wizard** with progress tracking and validation
- **Random generation** with "dice roll" button for quick characters
- **XP tracking** from character creation with detailed logs
- **Equipment management** with encumbrance calculation
- **Spell selection** for magic-using careers
- **Draft auto-save** - never lose your work in progress

#### 2. Character Management
- **Character List** - view all your saved characters at once
- **Character Sheets** - full-featured character display with all stats
- **Import/Export** - backup characters or share with others
- **Advancement System** - track XP spending and character progression
- **Notes and Combat Tracker** - manage game sessions

#### 3. Enhanced Data Browser
- **23 entity types** organized by category
- **Real-time search** with fuzzy matching (finds "Athlétisme" when typing "athle")
- **Advanced filtering** by book, species, class, type, and more
- **Rich descriptions** with automatic cross-references and links
- **Access information** - see where skills/talents are available

#### 4. Custom Content System
- **Create custom entities** - add homebrew careers, talents, spells, etc.
- **Modify official data** - customize existing content without breaking updates
- **Conflict resolution** - smart merging when custom content overlaps with official
- **Import/Export packages** - share homebrew content with community

#### 5. Admin Mode
- **Data editing** - modify official data directly in the browser
- **Bulk operations** - update multiple entities at once
- **Export modifications** - save changes for rebuilding the app
- **Database management** - backup, restore, and reset data

### Improved Features from v1

#### Character Creation
- **v1**: Multi-step process with page reloads, limited to online use
- **v2**: Smooth single-page wizard with instant validation and offline support

#### Data Browsing
- **v1**: Slow table loads from Google Sheets, limited search
- **v2**: Instant filtering and search across all data with rich descriptions

#### Character Storage
- **v1**: No built-in storage (manual export to file)
- **v2**: Automatic local storage with import/export functionality

## What Changed?

### User Interface
- **Navigation**: Moved from top menu bar to modern sidebar with icons
- **Layout**: Switched from multi-page HTML to single-page application (SPA)
- **Styling**: New design system with dark mode and improved accessibility
- **Mobile**: Fully responsive design optimized for phones and tablets

### Character Creation Process
The wizard steps have been reordered for better flow:

1. **Species** (unchanged)
2. **Career** (unchanged)
3. **Characteristics** (unchanged)
4. **Skills** (unchanged)
5. **Talents** (unchanged)
6. **Equipment** (was "Trappings")
7. **Details** (name, appearance, etc.)
8. **Experience** (XP allocation - new!)
9. **Review** (final summary)

### Data Structure
- All data now stored in **IndexedDB** (browser database) instead of Google Sheets
- Richer metadata: every entity includes book reference, page number, and description
- Better relationships: automatic linking between related entities
- Specializations: better support for talents/skills with multiple specs

### Removed Features
The following v1 features are not in v2 (may be added in future updates):

- **Multi-language support**: v2 is French-only currently
- **Random career progression**: v2 focuses on manual career selection
- **PDF export**: Use browser's print-to-PDF for now
- **Online collaboration**: v2 is offline-first, single-user

## Migration Steps

### Step 1: Access v2

#### Option A: Use Hosted Version (Recommended)
Visit: `https://your-domain.com/warhammer-v2/` (URL will be provided after deployment)

#### Option B: Run Locally
```bash
# Clone the repository
git clone https://github.com/your-username/warhammer.git
cd warhammer/warhammer-v2

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

#### Option C: Download Single File
1. Download `index.html` from the releases page
2. Open directly in your browser (works offline!)

### Step 2: First Launch

When you first open v2:

1. **Initial data load**: The app will initialize the database (takes 2-3 seconds)
2. **Confirmation**: You'll see "Database initialized successfully"
3. **Ready to use**: Navigate to any page and start using the app

No account creation or login required!

### Step 3: Migrate Your Characters (Optional)

If you have characters saved from v1:

#### v1 Character Export
Unfortunately, v1 didn't have a built-in export feature. If you have characters:

1. **Screenshot method**: Take screenshots of your v1 character sheets
2. **Manual recreation**: Use the screenshots to recreate characters in v2
3. **Copy data**: Copy and paste text from v1 to v2 character notes

#### Future Import Tool
A v1-to-v2 character import tool is planned for a future update.

### Step 4: Explore New Features

Take a tour of the new interface:

1. **Home Page**: Quick access to recent characters and quick actions
2. **Browse Data**: Explore all 23 entity types with advanced search
3. **Character Creator**: Try creating a test character to learn the wizard
4. **Settings**: Configure language, theme, and data management options

### Step 5: Bookmark for Offline Use

For best offline experience:

1. **Desktop**: Bookmark the page or save as a desktop shortcut
2. **Mobile**: Use "Add to Home Screen" in your browser menu
3. **Progressive Web App**: The app will work offline automatically

## Feature Comparison

| Feature | v1 (Google Apps Script) | v2 (PWA) |
|---------|------------------------|----------|
| **Platform** | Google Sheets + HTML | Single HTML file |
| **Internet Required** | Yes, always | Only first visit |
| **Google Account** | Required | Not required |
| **Load Time** | 5-10 seconds | <1 second |
| **Data Browsing** | Slow (API calls) | Instant (local DB) |
| **Search** | Basic text match | Fuzzy search |
| **Character Creator** | 10+ steps | 9 streamlined steps |
| **Character Storage** | None (manual save) | Automatic local storage |
| **Import/Export** | Manual file handling | Built-in with validation |
| **Custom Content** | Manual editing | GUI editor with conflict resolution |
| **Mobile Support** | Limited | Fully responsive |
| **Dark Mode** | No | Yes |
| **Offline Mode** | No | Yes |
| **Admin Mode** | Google Sheets only | In-app data editor |

## Troubleshooting

### "Database initialization failed"

**Cause**: Browser doesn't support IndexedDB or storage is disabled

**Solutions**:
1. Update your browser to the latest version
2. Enable cookies/storage in browser settings
3. Try a different browser (Chrome, Firefox, Edge, or Safari)
4. Disable browser extensions that block storage

### "Data not loading" or empty tables

**Cause**: Database not initialized or corrupted

**Solutions**:
1. Go to **Settings** > **Data Management**
2. Click **Re-initialize Database**
3. Wait for confirmation message
4. Refresh the page

### Characters not saving

**Cause**: Browser storage quota exceeded or private browsing mode

**Solutions**:
1. Check if you're in private/incognito mode (storage is temporary)
2. Free up browser storage (delete old site data)
3. Export characters to file as backup
4. Use a different browser with more storage

### Slow performance or lag

**Cause**: Large number of characters or browser extensions

**Solutions**:
1. Export old characters and delete from database
2. Disable browser extensions temporarily
3. Close other browser tabs
4. Clear browser cache (Settings > Clear Cache)

### Import fails with "Invalid format"

**Cause**: File format not recognized or corrupted

**Solutions**:
1. Ensure you're importing a `.json` file exported from v2
2. Check the file isn't corrupted (open in text editor)
3. Try exporting and re-importing to verify file structure
4. Contact support with error details

### App not working offline

**Cause**: Service Worker not registered or data not cached

**Solutions**:
1. Visit the app while online first (to cache resources)
2. Check browser supports Service Workers (all modern browsers do)
3. Look for "Available offline" indicator in the app
4. Check browser console for Service Worker errors

## FAQ

### Do I need to keep v1 running?

No, v2 is completely independent. Once you've migrated your characters, you can stop using v1.

However, we recommend keeping v1 bookmarked for a few weeks until you're comfortable with v2.

### Can I use both v1 and v2 simultaneously?

Yes! They don't interfere with each other. Use v1 for your current campaigns while learning v2.

### Will v1 continue to receive updates?

No, all future development focuses on v2. Critical bugs in v1 may be fixed, but no new features.

### Is my data secure?

Yes! All data is stored locally in your browser using IndexedDB. Nothing is sent to external servers.

**Backups**: Export your characters regularly to have file backups.

### Can I access v2 from multiple devices?

Each device has its own local database. To sync characters:

1. **Export** from device A (Settings > Export All Characters)
2. **Import** to device B (Settings > Import Characters)
3. Repeat when you want to sync changes

### What browsers are supported?

**Fully Supported**:
- Chrome 80+ (Windows, Mac, Linux, Android)
- Firefox 74+ (Windows, Mac, Linux, Android)
- Safari 13.1+ (Mac, iOS, iPadOS)
- Edge 80+ (Windows, Mac)

**Not Supported**:
- Internet Explorer (any version)
- Browsers with JavaScript disabled
- Very old mobile browsers (pre-2019)

### Does v2 work on mobile?

Yes! v2 is fully responsive and optimized for mobile:
- Touch-friendly interface with large tap targets
- Adapts to portrait and landscape modes
- Works on phones (320px+) and tablets
- Add to home screen for app-like experience

### How do I update v2 when new versions are released?

**Hosted version**: Automatic updates when you refresh the page

**Downloaded file**: Replace your `index.html` with the new version

**Local development**: `git pull` and `npm run build`

Your characters and data are preserved during updates!

### Can I contribute custom content to the official data?

Yes! Use Admin Mode to:
1. Create or modify content
2. Export your changes
3. Submit via GitHub issue or pull request
4. Community-approved content may be included in future releases

### How do I report bugs or request features?

Visit our GitHub repository:
- **Bug reports**: [Issues](https://github.com/your-username/warhammer/issues)
- **Feature requests**: [Discussions](https://github.com/your-username/warhammer/discussions)
- **Questions**: [Discord/Forum link]

### Where's the source code?

v2 is open source: [GitHub Repository](https://github.com/your-username/warhammer)

Feel free to inspect, modify, or contribute!

---

## Need Help?

If you're stuck or have questions not covered in this guide:

1. Check the **[User Guide](USER_GUIDE.md)** for detailed feature documentation
2. Check the **[Admin Guide](ADMIN_GUIDE.md)** for data management help
3. Visit our **GitHub Discussions** for community support
4. Open an **Issue** for bug reports

Welcome to v2, and happy gaming!
