---
id: 002
status: TODO
priority: HIGH
domain: database
dependencies: [001]
---

# Analyser table Careers

## Objectif
Documenter la table careers (carrières) avec règles métier et relations.

## Périmètre
**DANS le scope:**
- Structure de la table careers
- Champs et usage métier
- Relations avec species, classes, career-levels
- Restrictions par espèce
- Avancement de carrière
- Pré-requis et conditions

**HORS scope:**
- Code technique de gestion des carrières
- UI des composants

## Critères d'acceptance
- [ ] Fichier `audit/database/careers.md` créé
- [ ] Fichier < 200 lignes
- [ ] Tous les champs documentés
- [ ] Relations documentées (species, career-levels, classes)
- [ ] Règles de sélection et restrictions
- [ ] Aucun code technique
- [ ] Cross-references OK

## Fichiers à analyser
- `warhammer-v2/data/careers.json`
- `warhammer-v2/data/species.json` (pour comprendre restrictions)

## Livrables
- `audit/database/careers.md`

## Validation finale
- Règles métier complètes
- Relations species claires
- Format template respecté
