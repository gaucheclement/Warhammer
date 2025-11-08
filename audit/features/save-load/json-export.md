# Save/Load - JSON Export

## Contexte

Export local du personnage complet en fichier JSON téléchargeable. Permet sauvegarde hors Google Sheets, partage, backup, ou import dans d'autres systèmes (Foundry VTT, applications tierces).

## Différence vs Sheets Save

**Sheets Save** :
- Stockage cloud Google Sheets
- Persistance automatique
- Accès via saveName (code unique)
- Données optimisées (champ `data` supprimé)

**JSON Export** :
- Fichier local téléchargeable
- Export manuel (bouton utilisateur)
- Données complètes (champ `data` inclus)
- Format standard portable

## Format d'Export

### Données Incluses

**Option 1 : Export complet avec références**
- Personnage complet (avec champ `data` dans toutes entités)
- Descriptions HTML complètes
- Permet lecture sans tables référence
- Fichier volumineux (~50-100 KB)

**Option 2 : Export léger (même que Sheets Save)**
- Personnage sans champ `data`
- IDs uniquement (nécessite tables référence pour lecture)
- Fichier compact (~5-10 KB)

**V1 actuel** : Non implémenté (code commenté)

### Structure JSON

**Racine** :
```
{
  character: { ... },      // Objet Character complet
  version: "1.0",          // Version format export
  exportDate: "ISO8601",   // Date export
  metadata: { ... }        // Métadonnées optionnelles
}
```

**Métadonnées optionnelles** :
- Application : "Warhammer Character Generator V1"
- Format : "Standard JSON"
- Compatibilité : Versions supportées

## Processus d'Export

### Sérialisation

**Étapes** :
1. Appel `character.save(null)` (pas d'incrémentation stepIndex)
2. Option : Ajout champ `data` pour export complet
3. Création objet racine avec metadata
4. `JSON.stringify(exportData, null, 2)` (formatage pretty-print)

**Pretty-print** : Indentation 2 espaces pour lisibilité humaine

### Téléchargement Fichier

**Méthode Client** :
1. Création Blob : `new Blob([json], {type: "application/json"})`
2. Création URL : `URL.createObjectURL(blob)`
3. Création lien : `<a download="character.json" href=url>`
4. Click programmatique : `link.click()`
5. Nettoyage : `URL.revokeObjectURL(url)`

**Nom fichier** :
- Format : `{nom}_{espece}_{carriere}.json`
- Exemple : `Franz-Gruber_Humain_Agitateur.json`
- Fallback : `character_{timestamp}.json` (si nom vide)

## Cas d'Usage

**Backup local** : Sauvegarde personnelle hors cloud
**Partage** : Envoi personnage à MJ ou autres joueurs
**Migration** : Import dans Foundry VTT ou autre système
**Version control** : Historique Git des personnages
**Analyse** : Parsing stats par scripts externes

## Exemples Concrets

### Exemple 1 : Export Franz Gruber (Agitateur Validé)

**Déclencheur** : Bouton "Exporter JSON" dans Resume
**Données** : Personnage complet stepIndex -1
**Fichier** : `Franz-Gruber_Humain_Agitateur.json` (78 KB avec data)
**Contenu** : JSON formatté, lisible, réimportable

### Exemple 2 : Export Personnage Incomplet

**Déclencheur** : Export à step Characteristics
**Données** : stepIndex 1, specie/careerLevel/characteristics uniquement
**Fichier** : `character_2025-11-08.json` (nom vide → timestamp)
**Utilité** : Backup intermédiaire, reprendre sur autre machine

### Exemple 3 : Export pour Foundry

**Déclencheur** : Bouton "Export Foundry"
**Données** : Format spécifique Foundry (transformation requise)
**Fichier** : `Franz-Gruber_foundry.json`
**Note** : Export Foundry commenté dans V1, mais prévu

## Validation Format

**Obligatoire** :
- JSON valide (JSON.parse sans erreur)
- Champ `stepIndex` présent
- Champ `specie` présent (si stepIndex >= 0)

**Optionnel** :
- Version format compatible
- Metadata présente

## Voir Aussi

- [json-import.md](./json-import.md) - Import JSON
- [sheets-save.md](./sheets-save.md) - Sauvegarde Sheets
- [character-model-save-load.md](../character-model/save-load.md) - Méthodes save/load
