# Import/Export - Compatibilité Versions

## Contexte

Gestion évolution formats import/export entre versions application. Garantit imports anciens exports fonctionnent malgré changements structure.

## Versioning Format

**Version actuelle** : "1.0" (V1 application)
**Champ version** : metadata.version ou version racine JSON export

**Stockage** : Version enregistrée lors export, vérifiée lors import

## Évolutions Format

### Changements Mineurs (1.0 → 1.1)

**Exemples** : Ajout champs optionnels, nouveaux types talents, skills additionnels
**Compatibilité** : Ascendante (imports anciens fonctionnent)
**Stratégie** : Fallback valeurs par défaut champs absents

### Changements Majeurs (1.0 → 2.0)

**Exemples** : Restructuration caractéristiques, changement IDs, nouveau format spells
**Compatibilité** : Non garantie, transformation nécessaire
**Stratégie** : Migration script convertissant V1 → V2

## Migration Données

### Process Migration

1. **Détection** : Lecture champ version JSON import
2. **Comparaison** : version < versionActuelle → Migration requise
3. **Transformation** : Application migrations séquentielles (1.0→1.1→1.2→2.0)
4. **Validation** : Vérification cohérence post-migration
5. **Chargement** : Import données migrées

### Migrations Possibles

**1.0 → 1.1** :
- Ajout champ character.background (default "")
- Ajout champ talents.tier (default 1)

**1.0 → 2.0** (hypothétique) :
- Refonte IDs : string → numeric
- Séparation skills base vs advanced
- Nouveau format spells lore → school

## Compatibilité Ascendante

**Principe** : Nouveaux exports importables dans anciennes versions (avec perte features récentes)

**Stratégie** :
- Champs nouveaux marqués optionnels
- Anciennes versions ignorent champs inconnus
- Fonctionnalités core préservées

### Exemple

**Export V1.2** : Inclut character.motivation (nouveau)
**Import V1.0** : Ignore motivation, charge reste normalement
**Résultat** : Personnage fonctionnel V1.0 (sans motivation)

## Compatibilité Descendante

**Principe** : Anciens exports importables dans nouvelles versions

**Stratégie** :
- Nouvelles versions détectent version export
- Application migrations automatiques
- Fallback valeurs par défaut manquantes

### Exemple

**Export V1.0** : Pas champ background
**Import V1.2** : Détecte version 1.0, applique migration, ajoute background=""
**Résultat** : Personnage compatible V1.2

## Messages Version

**Version trop ancienne** : "Fichier version {version} trop ancien. Migration disponible jusqu'à version {minSupported}."
**Version trop récente** : "Fichier version {version} créé avec version plus récente. Mettez à jour application."
**Migration réussie** : "Fichier migré de version {old} vers {new}."

### Warnings

**Perte fonctionnalités** : "Import V{version} dans V{current}: certaines données récentes seront ignorées."
**Migration partielle** : "Migration réussie avec warnings: 3 champs inconnus ignorés."

## Gestion Foundry VTT

**Versions Foundry** : 0.8.x, 9.x, 10.x, 11.x (évolutions API)
**Système WFRP** : 6.x, 7.x (changements schéma Actor)

**Stratégie** :
- Détection version Foundry dans JSON (flags.core.version)
- Mapping adaptatif selon version
- Fallback formats anciens

### Exemple

**Export Foundry 0.8** : characteristics structure legacy
**Import App** : Détecte version, applique mapping 0.8
**Résultat** : Caractéristiques converties correctement

## Tests Compatibilité

**Suite tests** : Imports exports V1.0, V1.1, V1.2 vérifiés
**Régression** : Nouveaux exports testés import anciennes versions
**Edge cases** : Fichiers corrompus partiellement, versions exotiques

## Exemples Concrets

### Migration 1.0 → 1.2

**Export** : V1.0, pas champ background ni motivation
**Import** : V1.2 détecte version
**Migration** : Ajout background="", motivation="", tier=1 tous talents
**Résultat** : Personnage compatible V1.2, éditable normalement

### Import Version Future

**Export** : V2.5 (application future)
**Import** : V1.2 (actuelle)
**Erreur** : "Version 2.5 non supportée. Version actuelle: 1.2. Mettez à jour."
**Résultat** : Import bloqué, utilisateur doit upgrader app

### Compatibilité Foundry

**Export** : Foundry VTT 11.x, système WFRP 7.2
**Import** : App V1.2 supporte jusqu'à WFRP 7.x
**Process** : Mapping adaptatif détecte 7.2, applique transformations correctes
**Résultat** : Personnage importé, quelques warnings champs nouveaux ignorés

## Voir Aussi

- [json-export.md](./json-export.md) - Export JSON avec versioning
- [json-import.md](./json-import.md) - Import et validation version
- [foundry-format.md](./foundry-format.md) - Évolutions format Foundry
