# Export Foundry VTT - Vue d'ensemble

## Contexte

Export d'un personnage Warhammer depuis l'application vers Foundry Virtual Tabletop au format JSON compatible. Permet utilisation du personnage créé dans l'environnement de jeu virtuel Foundry VTT avec le système Warhammer Fantasy Roleplay.

## Différence vs JSON Export Standard

**JSON Export Standard** :
- Format application interne
- Données complètes ou légères (avec/sans champ `data`)
- Réimport direct dans l'application
- Structure optimisée pour sauvegarde/restauration

**Export Foundry** :
- Format spécifique API Foundry VTT
- Transformation mapping obligatoire
- Import dans Foundry via glisser-déposer
- Structure conforme schéma Actor Foundry

## État Actuel (V1)

**Code commenté** : Fonction `FoundryHelper.fullExport()` désactivée dans StepResume.html (lignes 57-66)

**Raisons probables désactivation** :
- Incompatibilité version Foundry
- Mapping incomplet
- Tests insuffisants
- Simplification V1

**Traces code** :
- MainMenu.html ligne 120 : `FoundryHelper.import()` (import commenté)
- StepResume.html ligne 61 : `FoundryHelper.fullExport()` (export commenté)
- Code.js ligne 99, 149 : Chargement module FoundryHelper
- Code.js ligne 169-189 : Fonction `getFoundry()` table mapping

## Architecture

### Modules

**FoundryHelper** (script HTML chargé séparément) :
- `FoundryHelper.export(CharGen, character)` : Transformation données → format Foundry
- `FoundryHelper.import(CharGen, jsonString)` : Parsing Foundry → Character interne

**FoundryCharacterData** (module complémentaire) :
- Structure données Actor Foundry
- Templates caractéristiques/compétences/talents

**Table Foundry** (Google Sheets) :
- Mapping IDs internes ↔ noms Foundry
- Colonnes : type, subtype, label, foundryName
- Résolution conflits nomenclature

### Workflow Export

1. **Déclenchement** : Bouton "Export Foundry" dans Résumé
2. **Validation** : Personnage complet (stepIndex >= 8)
3. **Transformation** : `FoundryHelper.fullExport(CharGen, character)`
4. **Génération** : JSON selon schéma Foundry Actor
5. **Téléchargement** : Blob → fichier `[nom].json`
6. **Import manuel** : Glisser-déposer dans Foundry

## Format Foundry VTT

### Structure Actor

**Racine** :
```
{
  name: "Nom Personnage",
  type: "character",
  data: { ... },              // Caractéristiques et données
  items: [ ... ],             // Compétences, talents, équipement, sorts
  flags: { ... }              // Métadonnées application
}
```

**Champ `data`** : Caractéristiques (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc), dérivées (Blessures, Points de Destin, etc.), détails (espèce, carrière, statut)

**Array `items`** : Objets {name, type, data} pour skills, talents, trappings, spells

### Compatibilité Versions

**Foundry VTT** : Compatible version 0.8.x - 11.x (système WFRP)
**Système WFRP** : Module officiel Warhammer Fantasy Roleplay 4e édition
**Format** : Évolution entre versions nécessite adaptation mapping

## Cas d'Usage

**Import dans Foundry** : Créer personnage dans app → exporter → importer dans partie Foundry
**Partage MJ-Joueurs** : MJ crée PNJ → export → envoi joueurs → import dans leur Foundry
**Backup externe** : Sauv egarde hors app dans format utilisable ailleurs
**Migration** : Transfert personnages entre plateformes (Roll20, Fantasy Grounds via conversion)

## Exemples Concrets

### Exemple 1 : Export Agitateur Humain

**Personnage** : Johann Schmidt, Humain Reiklander, Agitateur niveau 1
**Déclencheur** : Clic bouton "Export Foundry"
**Génération** : `FoundryHelper.fullExport()` transforme:
- Specie "Humain (Reiklander)" → Foundry species "human"
- Career "Agitateur|1" → Foundry career "Agitator"
- Characteristics array → Foundry characteristics object
- Skills array → Foundry items type "skill"
- Talents array → Foundry items type "talent"
**Fichier** : `Johann-Schmidt.json` (~30 KB)
**Import Foundry** : Glisser fichier → Actor créé avec toutes données

### Exemple 2 : Export Sorcier avec Sorts

**Personnage** : Elara Windcaller, Elfe, Apprenti Sorcier
**Spécificité** : 8 sorts domaine Céleste
**Transformation** : Sorts → Foundry items type "spell" avec CN, portée, durée, ingrédients
**Résultat** : Sorts affichés onglet Foundry, utilisables avec jet automatique
**Utilité** : Lanceurs sorts bénéficient automation Foundry (gestion ingrédients, dégâts, etc.)

### Exemple 3 : Export Nain Tueur

**Personnage** : Gotrek Gurnisson, Nain, Tueur de Trolls
**Spécificité** : Équipement lourd (hache runique +10%, armure lourde)
**Transformation** : Trappings → Foundry items type "weapon"/"armour" avec propriétés (dégâts, qualités)
**Import** : Armes/armures directement équipables dans Foundry, bonus auto-calculés

## Limitations V1

**Export désactivé** : Fonctionnalité commentée, non accessible utilisateur
**Mapping incomplet** : Certains talents/compétences sans équivalent Foundry
**Pas de validation** : Export sans vérification cohérence données
**Import unidirectionnel** : Foundry → App non implémenté
**Dépendance version** : Changements API Foundry nécessitent mise à jour

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Mapping IDs entités
- [foundry-format.md](./foundry-format.md) - Format JSON complet
- [json-export.md](./json-export.md) - Export JSON standard
- [../save-load/json-export.md](../save-load/json-export.md) - Export sauvegarde interne
