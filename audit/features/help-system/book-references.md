# Help System - Références bibliographiques

## Vue d'ensemble

Le système de références bibliographiques permet d'afficher pour chaque élément du jeu les numéros de pages des livres sources où il est décrit. Chaque entité peut avoir une ou plusieurs références vers différents livres (LDB, ADE1, VDLM, SOC, etc.).

## Indexation des références

Chaque entité avec `book` et `page` est indexée dans `match['book'][nomLivre][typeEntite][labelEntite]`

Métadonnées stockées: ID, texte "page X", statut actif/inactif

**Structure:**
```
match['book']['LDB']['talent']['Affable'] = {id: "affable", text: "page 124"}
match['book']['ADE1']['career']['Agitateur'] = {id: "agitateur", text: "page 67"}
```

## Affichage des références

**Fiches:** Référence en haut (coin droit, classe `paging`) - Ex: "LDB p124"
**Listes:** Références visibles directement - Ex: "Affable: page 124"

## Filtrage par livre

Sélection livre → filtre entités ayant référence vers ce livre

**Éléments inactifs (`inactive: 1`):** Gris, pas de lien, texte non enrichi

## Exemples concrets

### Talent "Affable"

**Référence unique:**
- Livre: LDB
- Page: 124
- Affichage: "LDB p124"

### Carrière "Agitateur"

**Références multiples:**
- LDB page 43 (description de base)
- ADE1 page 67 (règles additionnelles)
- Affichage: "LDB p43" dans la fiche principale, liens vers autres références en section "Voir aussi"

### Sort "Arme aethyrique"

**Référence avec livre spécialisé:**
- Livre: VDLM (Vent de la Magie)
- Page: 89
- Affichage: "VDLM p89"

### Espèce "Halfling"

**Références dans livres généraux et suppléments:**
- LDB page 28 (règles de base)
- SOC page 12 (supplément Shades of Empire)
- Affichage: "LDB p28" principal, "SOC p12" en complément

## Organisation par livre

| Code | Titre | Contenu |
|------|-------|---------|
| LDB | Livre de Base | Règles base, espèces, carrières |
| ADE1 | Archives Empire Vol. 1 | Carrières additionnelles |
| VDLM | Vent de la Magie | Domaines magiques, sorts |
| SOC | Shades of Empire | Suppléments espèces/carrières |

**Index par livre:** Éléments regroupés par type (Espèces, Carrières, Talents...) avec pages

## Liens bidirectionnels

**Livre → Éléments:** Page livre affiche tous éléments avec liens vers fiches
**Élément → Livres:** Fiche affiche tous livres référençant avec pages

## Règles métier

**Enregistrement:** `book` et `page` obligatoires, `book` code valide, `page` entier positif, texte "page X"

**Doublons:** Première occurrence indexée, autres ignorées

**Actif/Inactif:**
- Actif: Lien cliquable, fiche accessible
- Inactif: Texte gris sans lien, éléments obsolètes

## Validation

**Intégrité:** Codes livres existants, pages valides, pas de références orphelines
**Cohérence:** Une référence minimum, livres différents si multiples, pages croissantes

## Voir aussi

- [inverse-relations.md](./inverse-relations.md) - Relations inverses "Utilisé par"
- [rich-descriptions.md](./rich-descriptions.md) - Liens vers références bibliographiques dans les descriptions
- [global-index.md](./global-index.md) - Structure de match incluant l'index livres
