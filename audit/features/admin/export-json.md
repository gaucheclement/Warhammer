# Export Données JSON

## Objectif

Export des données Google Sheets au format JSON pour backup, partage communautaire ou migration vers autres systèmes.

## Fonctionnalités

**Export sélectif**: Choix tables à exporter (species, careers, talents, etc.)

**Export complet**: Toutes tables en un seul fichier JSON

**Format**: JSON structuré, compatible import

**Téléchargement**: Fichier .json téléchargé localement

## Modes d'Export

**Export table unique**: Ex: "Exporter uniquement talents" → talents.json

**Export multi-tables**: Sélection multiple → warhammer_data.json

**Export complet**: Toutes tables → warhammer_full_backup.json

## Format JSON Généré

**Structure**:
```
{
  "species": [...142 entrées...],
  "careers": [...117 entrées...],
  "talents": [...389 entrées...],
  "skills": [...82 entrées...],
  "spells": [...234 entrées...],
  "trappings": [...156 entrées...],
  ...autres tables...
}
```

**Par entrée**: Tous champs (index, label, book, page, desc, etc.)

**Préservation**: Format identique données Google Sheets

## Processus d'Export

**Étape 1: Sélection**
- Interface checkboxes pour sélectionner tables
- Ou bouton "Export complet"

**Étape 2: Génération**
- Lecture données Google Sheets
- Conversion en JSON
- Formatage (indentation, pretty print)

**Étape 3: Téléchargement**
- Génération fichier .json
- Téléchargement navigateur
- Nom fichier: warhammer_export_YYYYMMDD.json

## Cas d'Usage

**Backup régulier**: Export complet hebdomadaire pour sauvegarde

**Partage homebrew**: Export talents personnalisés pour partage communauté

**Migration**: Export pour réimport dans autre instance ou système

**Versionning externe**: Export avant modifications majeures

## Exemples Concrets Warhammer

**Exemple 1: Backup complet**
1. Cliquer "Export complet"
2. Génération warhammer_backup_20250108.json
3. Téléchargement fichier (2.5 MB)
4. Contient toutes tables complètes

**Exemple 2: Partage talents homebrew**
1. Sélectionner uniquement table "talents"
2. Export → custom_talents.json
3. Fichier contient uniquement les 389 talents
4. Partageable avec autres utilisateurs pour import

**Exemple 3: Migration vers Foundry VTT**
1. Export complet
2. Fichier JSON utilisé pour conversion Foundry
3. Voir [import-export-foundry-overview.md](../../import-export-foundry/overview.md)

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/*.md](../../database/) - Schémas tables exportées

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [import-json.md](./import-json.md) - Import complémentaire
- [save.md](./save.md) - Lecture Google Sheets

## Limites et Contraintes

**Pas de compression**: Fichiers volumineux (MB) si export complet

**Pas de filtrage avancé**: Export table entière, pas de sélection par critères

**Pas de transformation**: Export brut, pas de conversion format
