# Save/Load - JSON Import

## Contexte

Import d'un personnage depuis fichier JSON local. Permet restauration backup, partage entre joueurs, migration depuis autres systèmes, ou récupération personnages exportés précédemment.

## Processus d'Import

### Upload Fichier

**Méthode Client** :
1. Input file : `<input type="file" accept=".json">`
2. Lecture : `FileReader.readAsText(file)`
3. Parsing : `JSON.parse(text)`
4. Validation : Vérification structure minimale
5. Chargement : `character.load(data.character || data)`

**Formats supportés** :
- Export JSON complet (avec metadata)
- Export JSON léger (character seul)
- Export Sheets Save (compatible)

### Validation Format

**Validation minimale** :
- JSON valide (pas d'exception parse)
- Champ `stepIndex` présent
- Type object (pas array, string, etc.)

**Validation recommandée** (non V1) :
- Version format compatible
- Champs obligatoires : specie (si stepIndex >= 0), characteristics
- IDs valides (lookup tables référence)
- Cohérence données (advance <= max, etc.)

**Gestion erreurs** :
- JSON invalide → Message "Fichier corrompu"
- Structure invalide → Message "Format non reconnu"
- Version incompatible → Message "Version non supportée"

## Reconstruction Personnage

### Workflow

**Si données complètes** (avec champ `data`) :
1. Utilisation directe champ `data` si présent
2. Sinon lookup tables référence (comme sheets-load)

**Si données légères** (sans champ `data`) :
1. Même process que sheets-load
2. Lookup `CharGen.allSpecies[id]`, etc.
3. Merge données personnage

**Différence vs Sheets Load** :
- Source : Fichier local vs Google Sheets
- Format : Potentiellement complet (avec `data`) vs toujours léger
- Validation : Plus stricte (fichier peut être modifié manuellement)

### Gestion Spécialisations

**Identique sheets-load** :
- Copie explicite `specs`, `spec` avant merge
- Reset `specName` pour recalcul

## Cas d'Usage

**Restauration backup** : Récupération après perte données cloud
**Partage joueur → joueur** : Envoi personnage par email/Discord
**Import depuis V0** : Migration ancienne version (si format compatible)
**Import Foundry** : Conversion personnage Foundry → V1 (transformation requise)
**Batch import** : Chargement multiple personnages (MJ, campagne)

## Gestion Erreurs

**Fichier non JSON** : Extension .txt, .pdf → Erreur parse → Message explicite
**JSON valide mais structure invalide** : `{random: "data"}` → Validation échoue
**IDs invalides** : Specie "unknown" → Lookup null → Crash (validation manquante V1)
**Version incompatible** : Format V2 futur → Parsing partiel possible ou erreur
**Fichier vide** : `""` → JSON.parse échoue → Message erreur

## Sécurité

**Risques** :
- Injection code malveillant (JSON.parse safe mais eval non)
- Fichier volumineux (DoS client)
- Corruption volontaire données

**Mitigations** :
- Pas d'eval (JSON.parse uniquement)
- Limite taille fichier (ex: 10 MB max)
- Validation stricte avant chargement
- Sanitization descriptions HTML (éviter XSS)

## Exemples Concrets

### Exemple 1 : Import Export Complet

**Fichier** : `Franz-Gruber_Humain_Agitateur.json` (78 KB)
**Contenu** : Personnage avec champs `data` complets
**Process** : Parse → Validation → Chargement direct (pas lookup)
**Résultat** : Wizard Resume, Franz Gruber restauré

### Exemple 2 : Import Export Léger

**Fichier** : `backup_character.json` (8 KB)
**Contenu** : Personnage sans champs `data` (IDs uniquement)
**Process** : Parse → Validation → Lookup tables → Merge → Chargement
**Résultat** : Identique sheets-load

### Exemple 3 : Import Fichier Corrompu

**Fichier** : `character_broken.json`
**Contenu** : `{"stepIndex": 1, "specie": { syntax error`
**Erreur** : JSON.parse exception
**Message** : "Fichier JSON invalide. Veuillez vérifier le format."
**Résultat** : Aucun chargement, retour écran import

### Exemple 4 : Import Foundry (Future)

**Fichier** : `foundry_character.json`
**Contenu** : Format Foundry VTT
**Process** : Détection format → Transformation → Chargement
**Note** : Non implémenté V1, nécessite mapping

## Différences vs Sheets Load

| Aspect | Sheets Load | JSON Import |
|--------|-------------|-------------|
| Source | Google Sheets (cloud) | Fichier local |
| Format | Toujours léger | Complet ou léger |
| Validation | Minimale (trust cloud) | Stricte (fichier modifiable) |
| Erreurs | Rares (données contrôlées) | Fréquentes (fichiers utilisateur) |
| Sécurité | Haute (Google trust) | Moyenne (validation requise) |

## Voir Aussi

- [json-export.md](./json-export.md) - Export JSON
- [sheets-load.md](./sheets-load.md) - Chargement Sheets
- [character-model-save-load.md](../character-model/save-load.md) - Méthodes load
- [pattern-validation-references.md](../../patterns/pattern-validation-references.md) - Validation IDs
