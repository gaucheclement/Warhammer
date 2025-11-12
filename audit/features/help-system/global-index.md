# Help System - Index global

## Vue d'ensemble

L'index global match est la structure centrale du système d'aide. Il contient toutes les relations entre entités, références bibliographiques et métadonnées nécessaires pour l'affichage des liens et la navigation.

## Structure de match

### Organisation hiérarchique

L'index est organisé en trois niveaux principaux:

1. **Type de l'entité cible** (talent, spell, skill, career, etc.)
2. **Label de l'entité cible**
3. **Relations vers cette entité** (type source → label source)

### Exemple de structure complète

```
match = {
  talent: {
    "Affable": {
      specie: {
        "Halfling": {id: "halfling", text: "Halfling"},
        "Humain": {id: "humain", text: "Humain"}
      },
      careerLevel: {
        1: {
          "Artiste": {id: "artiste|1", text: "page 52"}
        },
        2: {
          "Charlatan": {id: "charlatan|2", text: "page 67"}
        }
      }
    }
  },
  spell: {
    "Arme aethyrique": {
      lore: {
        "Lumière": {id: "lumiere", text: "Lumière"}
      },
      talent: {
        "Magie des Arcanes": {id: "magie-arcanes", text: "Magie des Arcanes (Lumière)"}
      }
    }
  },
  book: {
    "LDB": {
      talent: {
        "Affable": {id: "affable", text: "page 124"}
      },
      career: {
        "Agitateur": {id: "agitateur", text: "page 43"}
      }
    }
  }
}
```

## Peuplement de l'index

Construit au démarrage: chargement JSON → initialisation `match = {}` → parcours entités → enregistrement relations/livres

**Par entité:** Parsing description → correspondance labels (via allForHelp) → création entrée cible → ajout relation

## Index allForHelp

Index parallèle: `allForHelp[typeItem][label] = entité complète`

Usage: Recherche rapide par label lors du parsing

**Clés multiples:** Label principal, abréviation (`abr`), label avec spécialisation - Détection flexible

## Types d'entités indexées

### Entités jouables

- **talent:** Talents des personnages
- **spell:** Sorts et bénédictions
- **skill:** Compétences (base et avancées)
- **career:** Carrières (référence globale)
- **careerLevel:** Niveaux de carrière spécifiques (rang 1-4)
- **specie:** Espèces jouables
- **trapping:** Équipement et trappings

### Entités référentielles

- **lore:** Domaines de magie
- **god:** Divinités
- **characteristic:** Caractéristiques (Agilité, Force, etc.)
- **quality:** Qualités (Taille, etc.)
- **book:** Livres sources

### Cas spéciaux

**careerLevel vs career:**
- `career` référence la carrière globalement (4 niveaux)
- `careerLevel` référence un niveau spécifique avec son rang
- Index stocke `careerLevel` avec extra niveau: `match[type][label]['careerLevel'][rang][carriere]`

## Règles métier d'indexation

**Clés:** Type cible normalisé (lowercase), label préserve casse/accents, type source via `typeItem`

**Doublons:** Relation existante → pas de ré-enregistrement, première occurrence conservée

**Texte original:** Champ `text` préserve modificateurs ("+5 en Agilité"), utilisé pour affichage "Utilisé par"

## Organisation des relations par niveau

### Relations simples

Format: `match[typeCible][labelCible][typeSource][labelSource] = {id, text}`

Exemple: Talent "Affable" utilisé par Espèce "Halfling"
```
match['talent']['Affable']['specie']['Halfling'] = {id: "halfling", text: "Halfling"}
```

### Relations multi-niveaux

Format: `match[typeCible][labelCible][typeSource][niveau][labelSource] = {id, text}`

Exemple: Talent "Éloquence" utilisé par Carrière "Charlatan" niveau 2
```
match['talent']['Éloquence']['careerLevel'][2]['Charlatan'] = {id: "charlatan|2", text: "page 67"}
```

Seul `careerLevel` utilise cette structure à 4 niveaux.

## Utilisation de l'index

**Affichage "Utilisé par":** Accès `match[type][label]` → parcours types sources → groupement → tri alphabétique → génération liens HTML

**Navigation:** Clic lien → lecture `data-type`/`data-id` → récupération `data[type].parID[id]` → affichage fiche

**Filtrage livre:** Accès `match['book'][code]` → parcours types → liste avec pages → affichage groupé

## Performance

**Complexité:** Lecture/insertion O(1), parcours O(n relations)
**Mémoire:** ~10-20 relations/entité, 500 entités → ~5000-10000 entrées, acceptable navigateur

## Validation

**Intégrité structurelle:** Tous chemins d'accès valides (pas de clés undefined)
**Cohérence IDs:** Tous ID pointent vers entités existantes dans data
**Complétude:** Chaque relation texte détectée est enregistrée

## Voir aussi

- [inverse-relations.md](./inverse-relations.md) - Utilisation de l'index pour affichage "Utilisé par"
- [rich-descriptions.md](./rich-descriptions.md) - Utilisation de allForHelp pour détection entités
- [book-references.md](./book-references.md) - Structure match['book']
- [bidirectional-navigation.md](./bidirectional-navigation.md) - Navigation via l'index
