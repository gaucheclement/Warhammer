# Warhammer Fantasy Roleplay 4e - Version 2

A modern, offline-first Progressive Web Application for Warhammer Fantasy Roleplay 4th edition. Built with Svelte and Vite, this application compiles to a single HTML file with all data embedded, providing a fully functional offline experience.

## Features

- **Single-File Architecture**: Everything bundled into one HTML file (~1.8MB, ~445KB gzipped)
- **Offline-First**: Works completely offline using IndexedDB for data storage
- **Modern Stack**: Built with Svelte 5 and Vite 7
- **Fast Performance**: Optimized build with aggressive minification
- **23 Data Entities**: Complete game data including careers, species, talents, spells, and more
- **Character Creator**: 9-step wizard with draft auto-save and XP tracking
- **Character Management**: Save unlimited characters locally with import/export
- **Custom Content**: Create homebrew rules and modifications with conflict resolution
- **Admin Mode**: Edit official data and manage database
- **Dark Mode**: Toggle between light and dark themes
- **PWA Support**: Install as app on mobile and desktop

## Quick Start

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/warhammer.git
cd warhammer/warhammer-v2

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with hot module replacement
npm run dev
```

The dev server will start at **http://localhost:5173**

#### Development Features:
- **Hot Module Replacement (HMR)**: Instant updates on file changes
- **Fast Refresh**: Preserve component state during updates
- **Source Maps**: Debug with original source code
- **Error Overlay**: Clear error messages in browser

### Production Build

```bash
# Build single-file production bundle
npm run build
```

**Output**: `dist/index.html` - A completely self-contained application

**Build Statistics**:
- Uncompressed: ~1.8MB (includes 1.6MB embedded game data)
- Gzipped: ~445KB (browser transfer size)
- Brotli: ~380KB (if server supports)

**Build Artifacts**:
- `dist/index.html` - Single-file bundle (deploy this)
- `dist/stats.html` - Bundle analysis visualization

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

Opens a local server at **http://localhost:4173** serving the production build.

## Data Management

### Extracting Data from Google Sheets

The application requires game data to be extracted before building:

```bash
# Extract data from Google Apps Script
npm run extract
```

**What it does**:
1. Connects to Google Apps Script web application
2. Downloads all 23 entity types
3. Saves to `../data/all-data.json`
4. Data is then embedded during build process

**Data Location**: `../data/all-data.json` (1.6MB)

**Note**: The `extract` script is located in the parent directory and is shared with the v1 application.

### Data Sources

All game data is sourced from official Warhammer Fantasy Roleplay 4th edition rulebooks and stored in Google Sheets for easy management.

**23 Entity Types**:
- Core: books, careers, careerLevels, species, classes, characteristics
- Skills & Abilities: skills, talents, spells, lores, magicks
- Equipment: trappings, qualities
- World: creatures, traits, gods, stars
- Character Gen: eyes, hairs, details
- Rules: etats, psychologies, trees

## Project Structure

```
warhammer-v2/
├── docs/                      # Comprehensive documentation
│   ├── MIGRATION.md          # v1 to v2 migration guide
│   ├── USER_GUIDE.md         # User manual
│   ├── ADMIN_GUIDE.md        # Admin manual
│   ├── ARCHITECTURE.md       # Technical architecture
│   └── database-schema.md    # Database documentation
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── character/       # Character-specific components
│   │   ├── common/          # Common UI elements
│   │   └── wizard/          # Character creator steps
│   ├── layouts/              # Page layouts (Header, Sidebar, Footer)
│   ├── routes/               # Page components (route targets)
│   ├── stores/               # Svelte stores (state management)
│   ├── lib/                  # Utility libraries
│   │   ├── db.js            # IndexedDB schema (Dexie)
│   │   ├── db-relations.js  # Relationship navigation
│   │   ├── db-transforms.js # Data transformations
│   │   ├── characterModel.js # Character data structure
│   │   ├── characterGenerator.js # Character creation
│   │   └── __tests__/       # Unit tests
│   ├── App.svelte            # Root component
│   ├── main.js               # Application entry point
│   └── app.css               # Global styles
│
├── public/                    # Static assets
├── dist/                      # Production build output
├── vite.config.js            # Vite configuration
├── vitest.config.js          # Test configuration
└── package.json               # Dependencies and scripts
```

## How It Works

### Data Embedding

1. **Source Data**: Game data stored in `../data/all-data.json` (1.6MB)
2. **Build Time**: Vite plugin embeds data as `window.__WARHAMMER_DATA__`
3. **Runtime**: Data loaded from window object into IndexedDB on first run
4. **Storage**: IndexedDB provides fast querying and persistence

### IndexedDB Schema

The application uses **24 tables**:
- **23 game data tables**: books, careers, species, skills, talents, etc.
- **1 user data table**: characters (user-created characters)

**Schema Features**:
- Primary indexes on all tables
- Compound indexes for relationships (e.g., `[career+careerLevel]`)
- Multi-entry indexes for array fields (e.g., `*specs`)
- Rich metadata (book, page, description, folder)

See [docs/database-schema.md](docs/database-schema.md) for complete documentation.

### Build Configuration

The build uses several Vite plugins:

**Core Plugins**:
- **vite-plugin-singlefile**: Inlines all CSS/JS into single HTML
- **vite-plugin-html**: HTML minification
- **Custom embed-data plugin**: Embeds JSON data as JavaScript constant

**PWA Plugin**:
- **vite-plugin-pwa**: Service Worker generation and caching

**Analysis Plugin**:
- **rollup-plugin-visualizer**: Bundle composition analysis

**Build Settings**:
- Target: ES2020 (modern browsers)
- All assets inlined (no external files)
- Dynamic imports inlined
- Aggressive minification (Terser)
- Console logs removed in production

### Offline Support

**Progressive Web App (PWA)**:
- Service Worker caches application shell
- Works completely offline after first load
- Auto-updates when new version available
- Add to home screen on mobile

**Storage Strategy**:
- IndexedDB: Game data and characters (~10MB)
- LocalStorage: Initialization flags and preferences (~1KB)
- SessionStorage: Temporary session data

## Development Guidelines

### Code Style

**Component Structure**:
```svelte
<script>
  // 1. Imports
  import { onMount } from 'svelte'

  // 2. Props
  export let name

  // 3. Local state
  let count = 0

  // 4. Reactive statements
  $: doubled = count * 2

  // 5. Functions
  function handleClick() {
    count++
  }

  // 6. Lifecycle
  onMount(() => {
    console.log('Mounted')
  })
</script>

<!-- 7. Template -->
<div class="container">
  <h1>{name}</h1>
</div>

<!-- 8. Styles (scoped) -->
<style>
  .container {
    padding: 1rem;
  }
</style>
```

**Best Practices**:
- Follow existing patterns in the codebase
- Use async/await for database operations
- Keep components small and focused
- Comment complex logic
- Add JSDoc comments for functions
- Write tests for business logic

### Testing

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Coverage report
npm test -- --coverage
```

**Test Coverage Goals**:
- Business logic: 80%+
- Utilities: 90%+
- Components: 60%+

**What to Test**:
- Data transformations
- Calculations (characteristics, XP, encumbrance)
- Validators
- Database operations
- Character creation logic

**What Not to Test**:
- Third-party libraries
- Svelte framework internals
- UI styling details

### Before Committing

**Checklist**:
- [ ] Code follows style guide
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in dev mode
- [ ] No console.log statements (removed or behind flag)
- [ ] Documentation updated (if needed)
- [ ] Commit message follows format

**Commit Message Format**:
```
Issue #XX: Stream X - Brief description

- Specific change 1
- Specific change 2
- Specific change 3
```

## Deployment

### Static File Hosting

**Recommended Platforms**:
- **Netlify**: Drop `dist/index.html` in deploy folder
- **Vercel**: Deploy from git repository
- **GitHub Pages**: Configure to serve from `dist/`
- **Cloudflare Pages**: Direct git integration

**Steps**:
1. Build production bundle: `npm run build`
2. Upload `dist/index.html` to hosting platform
3. Configure custom domain (optional)
4. Enable HTTPS (automatic on most platforms)

### GitHub Pages

```bash
# Build
npm run build

# Commit build output
git add dist/index.html
git commit -m "Deploy: Production build"
git push origin main

# Configure GitHub Pages
# Settings > Pages > Source: main branch > /dist folder
```

### Self-Hosting

**Requirements**:
- Any web server (Apache, Nginx, Caddy, etc.)
- No server-side logic required
- HTTPS recommended for PWA features

**Configuration**:
```nginx
# Nginx example
server {
  listen 80;
  server_name warhammer.example.com;

  root /var/www/warhammer;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Enable gzip compression
  gzip on;
  gzip_types text/html text/css application/javascript;
}
```

### Local File Usage

The single-file build works directly with the `file://` protocol:

1. Build: `npm run build`
2. Open `dist/index.html` in browser
3. All features work offline!

**Share the file**:
- Email attachment
- USB drive
- Cloud storage (Dropbox, Google Drive, etc.)
- File sharing services

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production bundle (single file) |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run extract` | Extract data from Google Sheets |

## Browser Support

### Fully Supported

- **Chrome 80+** (Windows, Mac, Linux, Android)
- **Firefox 74+** (Windows, Mac, Linux, Android)
- **Safari 13.1+** (Mac, iOS, iPadOS)
- **Edge 80+** (Windows, Mac)

### Required Features

- **ES2020** JavaScript support
- **IndexedDB** (all modern browsers)
- **Service Workers** (for PWA features)
- **CSS Grid & Flexbox**

### Not Supported

- **Internet Explorer** (any version)
- **Very old mobile browsers** (pre-2019)
- **Browsers with JavaScript disabled**

## Documentation

### For Users

- **[User Guide](docs/USER_GUIDE.md)**: Complete user manual covering all features
- **[Migration Guide](docs/MIGRATION.md)**: How to upgrade from v1 to v2

### For Admins

- **[Admin Guide](docs/ADMIN_GUIDE.md)**: Data management and administration
- **[Database Schema](docs/database-schema.md)**: Database structure and relationships

### For Developers

- **[Architecture](docs/ARCHITECTURE.md)**: Technical architecture and design decisions

## Troubleshooting

### Database initialization failed

**Cause**: Browser doesn't support IndexedDB or storage is disabled

**Solutions**:
1. Update browser to latest version
2. Enable cookies/storage in browser settings
3. Disable private browsing mode
4. Try different browser

### Data not loading

**Cause**: Database not initialized or corrupted

**Solutions**:
1. Settings > Data Management > Re-initialize Database
2. Wait for confirmation
3. Refresh page

### Slow performance

**Cause**: Large number of characters or browser extensions

**Solutions**:
1. Export old characters and delete from database
2. Disable browser extensions temporarily
3. Clear browser cache
4. Close other tabs

### App won't load

**Cause**: Build issue or cache problem

**Solutions**:
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try different browser
4. Check browser console for errors (F12)

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes with tests
4. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

**Before submitting**:
- Ensure all tests pass
- Follow code style guidelines
- Update documentation
- Add JSDoc comments for new functions

## Roadmap

### Completed (v2.0.0)

- [x] Single-file PWA build system
- [x] IndexedDB data layer with relationships
- [x] Data browser with search and filters
- [x] Character creator wizard (9 steps)
- [x] Character management (CRUD)
- [x] Character sheets with full display
- [x] Custom content creation
- [x] Import/export functionality
- [x] Admin mode for data editing
- [x] Offline support with Service Worker
- [x] Dark mode theme
- [x] Comprehensive documentation

### Upcoming (v2.1.0)

- [ ] Unit test coverage > 70%
- [ ] Integration tests for key flows
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] Lighthouse scores > 90
- [ ] Bundle size optimization

### Future (v2.2.0+)

- [ ] Advanced search with multiple filters
- [ ] Character advancement tracking
- [ ] Combat tracker
- [ ] Initiative tracker
- [ ] NPC generator
- [ ] Dice roller
- [ ] Character portraits
- [ ] Session notes
- [ ] Campaign management
- [ ] Multi-language support

## License

This project is for personal use. Warhammer Fantasy Roleplay is copyright Games Workshop.

## Acknowledgments

- **Games Workshop**: For creating Warhammer Fantasy Roleplay
- **Cubicle 7**: For publishing WFRP 4th edition
- **Community**: For feedback and contributions
- **Open Source**: Svelte, Vite, Dexie.js, and all dependencies

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/warhammer/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/your-username/warhammer/discussions)
- **Discord**: [Join the community](#) (link to be added)

## Version History

### v2.0.0 (2025-10-24)

**Foundation Release**

- Initial v2 architecture with Svelte + Vite + IndexedDB
- Single-file build system
- Complete data embedding (23 entity types)
- Character creator with 9-step wizard
- Character management and sheets
- Custom content system
- Admin mode and data editing
- Offline-first PWA
- Dark mode support
- Comprehensive documentation

**Statistics**:
- 66 Svelte components
- 24 database tables
- 2,847 data entries
- ~445KB gzipped bundle
- 100% offline capable

---

**Happy adventuring in the Old World!**
