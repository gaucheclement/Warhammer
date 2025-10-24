# Warhammer Fantasy Roleplay 4e - Version 2

A modern, offline-first Progressive Web Application for Warhammer Fantasy Roleplay 4th edition. Built with Svelte and Vite, this application compiles to a single HTML file with all data embedded, providing a fully functional offline experience.

## Features

- **Single-File Architecture**: Everything bundled into one HTML file (~1.8MB, ~445KB gzipped)
- **Offline-First**: Works completely offline using IndexedDB for data storage
- **Modern Stack**: Built with Svelte 5 and Vite 7
- **Fast Performance**: Optimized build with aggressive minification
- **23 Data Entities**: Complete game data including careers, species, talents, spells, and more

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server with hot module replacement
npm run dev
```

The dev server will start at http://localhost:5173

### Production Build

```bash
# Build single-file production bundle
npm run build
```

This creates `dist/index.html` - a completely self-contained application.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Project Structure

```
warhammer-v2/
├── src/
│   ├── lib/
│   │   ├── db.js           # IndexedDB schema (Dexie.js)
│   │   └── initData.js     # Data initialization logic
│   ├── App.svelte          # Root component
│   ├── main.js             # Application entry point
│   └── app.css             # Global styles
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── dist/                   # Production build output
    └── index.html          # Single-file bundle
```

## How It Works

### Data Embedding

1. **Source Data**: Game data is stored in `../data/all-data.json` (1.6MB)
2. **Build Time**: Vite plugin embeds data as `window.__WARHAMMER_DATA__`
3. **Runtime**: Data is loaded from window object into IndexedDB on first run
4. **Storage**: IndexedDB provides fast querying and persistence

### IndexedDB Schema

The application uses 24 tables (23 game data + 1 user data):

**Game Data Tables:**
- books, careers, careerLevels, species, classes
- talents, characteristics, trappings, skills, spells
- creatures, stars, gods, eyes, hairs, details
- traits, lores, magicks, etats, psychologies
- qualities, trees

**User Data Tables:**
- characters (user-created characters)
- settings (application preferences)

### Build Configuration

The build process uses several Vite plugins:

- **vite-plugin-singlefile**: Inlines all CSS/JS into single HTML
- **vite-plugin-html**: HTML minification
- **Custom embed-data plugin**: Embeds JSON data as JavaScript constant

Build settings:
- Target: ES2020
- All assets inlined (no separate files)
- Dynamic imports inlined
- Aggressive minification enabled

## Data Management

### Extract Data from Google Sheets

```bash
npm run extract <WEBAPP_URL>
```

This runs the `../extract-data.js` script to fetch fresh data from Google Sheets and update the `../data/` directory.

### Database Initialization

The database is initialized automatically on first app load:

1. Checks localStorage for initialization flag
2. If not initialized, loads data from `window.__WARHAMMER_DATA__`
3. Bulk inserts data into IndexedDB tables
4. Sets initialization flag to prevent duplicate loads

### Force Re-initialization

If you need to reload data:

1. Open the app in browser
2. Use the "Re-initialize Data" button in the UI
3. Or manually clear localStorage key: `warhammer_data_initialized`

## Development Guidelines

### Code Style

- Follow existing patterns in the codebase
- Use async/await for database operations
- Keep components small and focused
- Comment complex logic

### Testing

Before committing changes:

```bash
# Test dev server
npm run dev

# Test production build
npm run build
npm run preview
```

Verify:
- No console errors
- Database initializes correctly
- All data loads properly
- UI renders as expected

## Build Output

Production build statistics:

- **Uncompressed**: ~1.8MB (includes all game data)
- **Gzipped**: ~445KB
- **Application code** (without data): ~50KB
- **Embedded data**: ~1.6MB (JSON)

The entire application is contained in a single `index.html` file that can be:
- Served from any web server
- Opened directly in browser (file:// protocol)
- Deployed to GitHub Pages, Netlify, etc.
- Shared as a single file

## Dependencies

### Runtime Dependencies
- **dexie**: ^4.2.1 - IndexedDB wrapper (~20KB)

### Dev Dependencies
- **@sveltejs/vite-plugin-svelte**: ^6.2.1
- **svelte**: ^5.39.6
- **vite**: ^7.1.7
- **vite-plugin-html**: ^3.2.2
- **vite-plugin-singlefile**: ^2.3.0

Total bundle size (minified + gzipped): ~445KB

## Browser Support

Modern browsers with ES2020+ support:
- Chrome 80+
- Firefox 74+
- Safari 13.1+
- Edge 80+

IndexedDB support required (all modern browsers).

## Architecture Decisions

### Why Svelte?
- Compiles to vanilla JS (no runtime overhead)
- Smallest bundle size among modern frameworks
- Excellent developer experience
- Built-in reactive state management

### Why Single-File?
- Simplifies deployment (drag-and-drop anywhere)
- Works offline without complex setup
- Eliminates CORS issues
- No server configuration needed

### Why IndexedDB?
- Fast querying of large datasets
- Persistent storage (survives page reloads)
- Supports complex queries and indexes
- Works offline

## Next Steps

This is the foundational build. Future tasks will add:

1. **Data browsing UI**: Tables, filters, search
2. **Character creator**: Multi-step character generation
3. **Character sheets**: Full character display and management
4. **Custom content**: User modifications and additions
5. **Admin mode**: Data editing and contribution review
6. **Service Worker**: Offline caching and updates

## Contributing

This is a personal project, but contributions are welcome! Please:

1. Follow the existing code style
2. Test thoroughly before committing
3. Update documentation for new features
4. Use clear, descriptive commit messages

## License

This project is for personal use. Warhammer Fantasy Roleplay is copyright Games Workshop.

## Version History

### v2.0.0 (2025-10-24)
- Initial foundation: Vite + Svelte + IndexedDB
- Single-file build system
- Data embedding and initialization
- 23 entity types supported
- Development and production builds working
