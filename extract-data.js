/**
 * Script pour extraire les données de la Google Spreadsheet
 * et créer des fichiers JSON individuels
 *
 * Usage: node extract-data.js <WEB_APP_URL>
 * Exemple: node extract-data.js https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// URL de votre web app (à passer en argument)
const webAppUrl = process.argv[2];

if (!webAppUrl) {
    console.error('❌ Erreur: Veuillez fournir l\'URL de votre web app');
    console.error('Usage: node extract-data.js <WEB_APP_URL>');
    console.error('Exemple: node extract-data.js https://script.google.com/macros/s/YOUR_ID/exec');
    process.exit(1);
}

// Créer le dossier data/ s'il n'existe pas
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Mapping des types vers les noms de fichiers
const typeToFileName = {
    'book': 'books.json',
    'career': 'careers.json',
    'careerLevel': 'careerLevels.json',
    'specie': 'species.json',
    'class': 'classes.json',
    'talent': 'talents.json',
    'characteristic': 'characteristics.json',
    'trapping': 'trappings.json',
    'skill': 'skills.json',
    'spell': 'spells.json',
    'creature': 'creatures.json',
    'star': 'stars.json',
    'god': 'gods.json',
    'eye': 'eyes.json',
    'hair': 'hairs.json',
    'detail': 'details.json',
    'trait': 'traits.json',
    'lore': 'lores.json',
    'magick': 'magicks.json',
    'etat': 'etats.json',
    'psychologie': 'psychologies.json',
    'quality': 'qualities.json',
    'tree': 'trees.json'
};

console.log('🚀 Démarrage de l\'extraction des données...');
console.log(`📡 URL: ${webAppUrl}?json=true`);

// Fonction pour télécharger les données
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const urlWithParam = url.includes('?') ? `${url}&json=true` : `${url}?json=true`;

        // Suivre les redirections
        const request = https.get(urlWithParam, {
            headers: { 'User-Agent': 'Node.js' }
        }, (res) => {
            // Gérer les redirections
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
                https.get(res.headers.location, (redirectRes) => {
                    let data = '';
                    redirectRes.on('data', (chunk) => { data += chunk; });
                    redirectRes.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (error) {
                            reject(new Error(`Erreur parsing: ${error.message}`));
                        }
                    });
                }).on('error', reject);
                return;
            }

            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`Erreur parsing: ${error.message}`));
                }
            });
        }).on('error', reject);
    });
}

// Fonction principale
async function extractData() {
    try {
        console.log('⏳ Téléchargement des données...');
        const allData = await fetchData(webAppUrl);

        console.log('✅ Données téléchargées avec succès!');
        let filesCreated = 0;
        let totalRecords = 0;

        // Créer un fichier JSON pour chaque type de données
        for (const [dataType, fileName] of Object.entries(typeToFileName)) {
            if (allData[dataType] && Array.isArray(allData[dataType])) {
                const filePath = path.join(dataDir, fileName);
                const records = allData[dataType];

                // Écrire le fichier JSON avec indentation
                fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf8');

                console.log(`✅ ${fileName.padEnd(25)} - ${records.length.toString().padStart(4)} entrées`);
                filesCreated++;
                totalRecords += records.length;
            }
        }

        // Créer aussi un fichier avec toutes les données combinées
        const allDataPath = path.join(dataDir, 'all-data.json');
        fs.writeFileSync(allDataPath, JSON.stringify(allData, null, 2), 'utf8');
        console.log(`✅ all-data.json créé (toutes les données combinées)`);

        console.log('\n' + '='.repeat(60));
        console.log(`🎉 Extraction terminée!`);
        console.log(`📁 ${filesCreated} fichiers créés dans le dossier 'data/'`);
        console.log(`📊 Total: ${totalRecords} entrées extraites`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Erreur lors de l\'extraction:', error.message);
        process.exit(1);
    }
}

// Lancer l'extraction
extractData();
