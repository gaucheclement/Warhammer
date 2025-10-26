# Warhammer Character Generator - Data Extractor

This project includes an automated data extraction system that pulls Warhammer character creation data from Google Apps Script and saves it locally for use in the application.

## Overview

The data extraction script (`extract-data.js`) connects to a Google Apps Script web application to fetch 23 different types of Warhammer game data and saves them as JSON files in the `data/` directory.

### Data Types Extracted (23 total)

- **Core Character Data**: books, careers, careerLevels, species, classes, talents, characteristics
- **Skills & Equipment**: skills, spells, trappings
- **Creatures & NPCs**: creatures
- **Character Details**: stars, gods, eyes, hair, details, traits
- **Game Mechanics**: lores, magicks, etats, psychologies, qualities, trees

## Prerequisites

- **Node.js**: Version 14.0.0 or higher
- **Google Apps Script URL**: Access to the deployed web app endpoint
- **Network Access**: Internet connection to reach Google Apps Script

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the environment (see Configuration section below)

## Configuration

The extraction script can be configured using environment variables or command-line arguments.

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root (this will be set up by Stream 2):

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
DATA_DIR=./data
NODE_ENV=development
```

### Option 2: Command Line Arguments

Pass the web app URL directly as an argument:

```bash
npm run extract -- https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Current Google Apps Script Deployment

The current deployment URL is:
```
https://script.google.com/macros/s/AKfycbwMRbK8i_M-os8c279diiKxeoze7JWJTKsLA511bTBJDkjxYY3GRE8tfWucuBOeh0x6Hg/exec
```

Application ID: `AKfycbwMRbK8i_M-os8c279diiKxeoze7JWJTKsLA511bTBJDkjxYY3GRE8tfWucuBOeh0x6Hg`

## Usage

### Extract Data

Run the extraction script to fetch the latest data from Google Sheets:

```bash
npm run extract
```

This will:
- Connect to the Google Apps Script web application
- Download all 23 data types
- Save individual JSON files to `data/` directory (e.g., `books.json`, `careers.json`)
- Create a combined `all-data.json` file with all data
- Display extraction statistics

### Extract with Validation

Run extraction with validation checks (to be implemented in Stream 3):

```bash
npm run extract:validate
```

### Extract with Verbose Logging

Get detailed logging information during extraction:

```bash
npm run extract:verbose
```

### Build with Automatic Extraction

The build process automatically runs data extraction first:

```bash
npm run build
```

This runs `npm run extract` before the build process (via the `prebuild` hook).

### Build Without Extraction

To skip extraction and use cached data:

```bash
npm run build:skip-extract
```

## Output

### Directory Structure

After running extraction, your project will have:

```
project-root/
├── data/
│   ├── all-data.json              # Combined data file
│   ├── books.json                 # Individual type files
│   ├── careers.json
│   ├── careerLevels.json
│   ├── species.json
│   ├── classes.json
│   ├── talents.json
│   ├── characteristics.json
│   ├── trappings.json
│   ├── skills.json
│   ├── spells.json
│   ├── creatures.json
│   ├── stars.json
│   ├── gods.json
│   ├── eyes.json
│   ├── hairs.json
│   ├── details.json
│   ├── traits.json
│   ├── lores.json
│   ├── magicks.json
│   ├── etats.json
│   ├── psychologies.json
│   ├── qualities.json
│   └── trees.json
├── extract-data.js
├── package.json
└── README.md
```

### Extraction Output Example

```
🚀 Démarrage de l'extraction des données...
📡 URL: https://script.google.com/macros/s/.../exec?json=true
⏳ Téléchargement des données...
✅ Données téléchargées avec succès!
✅ books.json                  -   39 entrées
✅ careers.json                -  220 entrées
✅ careerLevels.json           -  201 entrées
...
✅ all-data.json créé (toutes les données combinées)
============================================================
🎉 Extraction terminée!
📁 23 fichiers créés dans le dossier 'data/'
📊 Total: 2,847 entrées extraites
============================================================
```

## Error Handling

The current version provides basic error handling:

- **Missing URL**: Displays usage instructions
- **Network Errors**: Shows connection error message
- **Parse Errors**: Displays JSON parsing error details

Enhanced error handling with retry logic and fallback mechanisms will be added in Stream 3.

## Integration with Build Pipeline

The extraction process is integrated into the build pipeline via npm hooks:

1. **Automatic Extraction**: The `prebuild` hook ensures data is extracted before every build
2. **Manual Control**: Use `build:skip-extract` to bypass extraction when needed
3. **CI/CD Compatible**: All scripts work in automated environments

## Development Workflow

### Initial Setup
```bash
# Install dependencies
npm install

# Extract data for the first time
npm run extract
```

### Regular Development
```bash
# Refresh data from Google Sheets
npm run extract

# Build with fresh data
npm run build
```

### Using Cached Data
```bash
# Build without fetching new data
npm run build:skip-extract
```

## Troubleshooting

### Issue: "Veuillez fournir l'URL de votre web app"

**Solution**: Either set `GOOGLE_APPS_SCRIPT_URL` in `.env` file or pass the URL as an argument:
```bash
npm run extract -- https://script.google.com/macros/s/YOUR_ID/exec
```

### Issue: Network timeout or connection errors

**Solution**:
- Check your internet connection
- Verify the Google Apps Script URL is correct
- Ensure the web app is deployed and publicly accessible

### Issue: JSON parsing errors

**Solution**:
- Check that the Google Apps Script is returning valid JSON
- Verify the `?json=true` parameter is being appended to the URL
- Test the URL directly in a browser to see the response

## Future Enhancements

The following features will be added in subsequent streams:

- **Stream 2**: Environment configuration with `.env` file support
- **Stream 3**: Data validation, retry logic, and fallback mechanisms

## Technical Details

- **Node.js Native HTTPS**: Uses built-in `https` module (no external fetch libraries)
- **Cross-Platform**: Scripts work on Windows, macOS, and Linux
- **JSON Format**: All data files use pretty-printed JSON with 2-space indentation
- **Redirect Handling**: Automatically follows HTTP redirects (301, 302, 307)

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run extract` | Fetch data from Google Apps Script |
| `npm run extract:validate` | Validate existing data without fetching |
| `npm run extract:verbose` | Extract with detailed logging |
| `npm run build` | Build project (includes automatic extraction) |
| `npm run build:skip-extract` | Build without extracting data |

## License

ISC

## Support

For issues related to the Google Apps Script deployment or data structure, please refer to the main Warhammer project documentation.
