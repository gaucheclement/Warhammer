---
id: 022
status: TODO
priority: HIGH
domain: database
dependencies: []
phase: 1
---

# Species - Schéma et Relations

## Objectif
Documenter le schéma complet de la table Species et toutes ses relations avec les autres tables.

## Périmètre
**DANS le scope:**
- Structure complète des champs Species
- Relations explicites (refChar, refCareer, refDetail)
- Relations implicites via strings
- Type de données et contraintes
- Exemples de valeurs par champ

**HORS scope:**
- Logique de génération aléatoire (ticket séparé)
- Parsing des compétences/talents (ticket séparé)
- Code d'implémentation

## Critères d'acceptance
- [ ] Fichier audit\database\species-schema.md créé
- [ ] Fichier < 200 lignes
- [ ] Tous champs documentés avec usage métier
- [ ] Relations vers Careers, Characteristics, Details identifiées
- [ ] Exemples concrets pour chaque type de champ
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Cross-references vérifiées

## Fichiers à analyser
- warhammer-v2\src\data\species.json
- warhammer-v2\src\data\DataSpecie.html

## Livrables
Chemin exact: audit\database\species-schema.md

## Validation finale
- [ ] Tous critères cochés
- [ ] Fichier conforme au template
- [ ] Pas de Future Work
- [ ] Relations documentées complètement
