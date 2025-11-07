---
id: 005
status: TODO
priority: MEDIUM
domain: database
dependencies: [002]
---

# Analyser table Career Levels

## Objectif
Documenter les niveaux de progression de carrière.

## Périmètre
**DANS le scope:**
- Structure career-levels
- Niveaux par carrière
- Pré-requis d'avancement
- Gains par niveau (skills, talents, caractéristiques)
- Relations avec careers

**HORS scope:**
- Code de progression
- UI de gestion

## Critères d'acceptance
- [ ] Fichier `audit/database/career-levels.md` créé
- [ ] Fichier < 200 lignes
- [ ] Structure de niveaux documentée
- [ ] Règles d'avancement
- [ ] Gains par niveau
- [ ] Relations careers
- [ ] Aucun code technique
- [ ] Cross-references OK

## Fichiers à analyser
- `warhammer-v2/data/careerLevels.json`

## Livrables
- `audit/database/career-levels.md`

## Validation finale
- Système de niveaux clair
- Règles progression complètes
- Format respecté
