---
id: 004
status: TODO
priority: HIGH
domain: database
dependencies: [003]
---

# Analyser table Skills

## Objectif
Documenter la table skills (compétences) avec règles et catégories.

## Périmètre
**DANS le scope:**
- Structure de skills
- Catégories de compétences
- Relations avec careers, characteristics
- Règles d'acquisition et avancement
- Spécialisations

**HORS scope:**
- Code de gestion des compétences
- UI skill blocks

## Critères d'acceptance
- [ ] Fichier `audit/database/skills.md` créé
- [ ] Fichier < 200 lignes
- [ ] Catégories de skills documentées
- [ ] Relations characteristics et careers
- [ ] Règles d'acquisition
- [ ] Système de spécialisation
- [ ] Aucun code technique
- [ ] Cross-references OK

## Fichiers à analyser
- `warhammer-v2/data/skills.json`

## Livrables
- `audit/database/skills.md`

## Validation finale
- Toutes catégories de skills documentées
- Règles métier complètes
- Format respecté
