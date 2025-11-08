---
id: 016
status: DONE
priority: HIGH
domain: database
dependencies: []
phase: 1
---

# Careerlevels Schema Relations

## Objectif
Créer le fichier KB `audit/database/careerLevels.md` documentant la structure de la table CareerLevels

## Périmètre
**DANS le scope:**
- Structure complète careerLevels.json (198 KB)
- Relation careerLabel → careers
- Champs level, status, standing
- Structure characteristics advances
- Listes skills, talents, trappings
- Types de données

**HORS scope:**
- 4 niveaux progression (ticket #017)
- Parsing avances (ticket #018)
- Parsing lists (ticket #019)

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataCareerLevel.html

## Livrables
`audit/database/careerLevels.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
