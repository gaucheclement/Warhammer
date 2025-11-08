---
id: 017
status: DONE
priority: HIGH
domain: database
dependencies: [016, 012]
phase: 1
---

# Careerlevels 4 Niveaux Progression

## Objectif
Documenter le système de 4 niveaux de progression par carrière (Bronze/Silver/Gold)

## Périmètre
**DANS le scope:**
- Structure 4 niveaux (1-4)
- Nomenclature Bronze/Silver/Gold
- Progression linéaire vs changement
- Status par niveau
- Standing social
- Règles métier progression

**HORS scope:**
- Calculs XP (ticket #021)
- UI progression

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepExperience.html

## Livrables
`audit/business-rules/progression-careerlevels.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
