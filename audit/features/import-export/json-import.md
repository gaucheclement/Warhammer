# Import JSON Standard

## Contexte

Import personnage depuis fichier JSON format application interne. Restauration backup, partage personnages, récupération données.

## Différence vs Foundry Import

**Foundry Import** : Transformation Actor Foundry → Character application (mapping inverse complexe)
**JSON Import** : Chargement direct JSON application (format natif, pas transformation)

**Avantage** : Pas perte information, réimport exact état export

## Process Import

1. **Upload** : Input file `<input type="file" accept=".json">`
2. **Lecture** : `FileReader.readAsText(file)`
3. **Parsing** : `JSON.parse(text)`
4. **Validation** : Vérification structure minimale
5. **Extraction** : `data.character || data` (support wrapper ou direct)
6. **Chargement** : `character.load(characterData)`
7. **Affichage** : Redirection wizard écran approprié (stepIndex)

## Formats Supportés

**Export JSON wrapper** : `{character: {...}, version, metadata}`
**Export JSON direct** : `{stepIndex, specie, career, ...}` (character seul)
**Sheets Save** : Compatible (même format character.save())

## Validation Import

### Validation Minimale

- JSON valide (pas exception parse)
- Type object (pas array, string, etc.)
- Champ stepIndex présent

### Validation Recommandée (V1 non implémentée)

- Version format compatible
- Champs obligatoires : specie (si stepIndex >= 0), characteristics
- IDs valides (lookup tables référence)
- Cohérence données (advances <= max, etc.)

### Messages Erreur

**Fichier corrompu** : "Fichier JSON invalide. Vérifiez format."
**Structure invalide** : "Format non reconnu. Utilisez export application."
**Version incompatible** : "Version non supportée. Mettez à jour application."

## Reconstruction Personnage

### Données Complètes (avec champ `data`)

Si champ `data` présent dans entités :
- Utilisation directe (pas lookup tables)
- Réimport identique export
- Indépendant tables référence actuelles

### Données Légères (sans champ `data`)

Si seulement IDs :
- Lookup tables référence CharGen.data
- Merge données personnage
- Identique process sheets-load

## Gestion Erreurs

**Fichier non JSON** : Extension .txt, .pdf → Parse exception → Message explicite
**JSON invalide** : `{random: syntax error` → Parse exception
**IDs invalides** : Specie "unknown-id" → Lookup null → Crash (validation manquante V1)
**Fichier vide** : `""` → Parse exception
**Version incompatible** : Format V2 → Parsing partiel ou erreur

## Sécurité

**Risques** :
- Injection code malveillant (JSON.parse safe, eval interdit)
- Fichier volumineux (DoS client)
- Corruption volontaire données

**Mitigations** :
- Pas eval (JSON.parse uniquement)
- Limite taille fichier (ex: 10 MB max)
- Validation stricte avant chargement
- Sanitization descriptions HTML (éviter XSS)

## Exemples Concrets

### Import Export Complet

**Fichier** : `Franz-Gruber.json` (78 KB, avec champs `data`)
**Process** : Parse → Validation → Chargement direct
**Résultat** : Wizard Resume, personnage restauré exactement

### Import Export Léger

**Fichier** : `backup.json` (8 KB, IDs uniquement)
**Process** : Parse → Validation → Lookup tables → Merge → Chargement
**Résultat** : Identique sheets-load

### Import Fichier Corrompu

**Fichier** : Syntax error JSON
**Erreur** : JSON.parse exception
**Message** : "Fichier JSON invalide..."
**Résultat** : Pas chargement, retour écran import

## Cas d'Usage

**Restauration backup** : Récupération après perte cloud
**Partage joueur-joueur** : Envoi personnage email/Discord
**Migration V0→V1** : Import anciens exports (si format compatible)
**Batch import** : Chargement multiples personnages (MJ campagne)

## Voir Aussi

- [json-export.md](./json-export.md) - Export JSON
- [foundry-import.md](./foundry-import.md) - Import Foundry (alternatif)
- [../save-load/json-import.md](../save-load/json-import.md) - Documentation import détaillée
