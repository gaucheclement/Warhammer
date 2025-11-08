---
id: 023
status: DONE
priority: HIGH
domain: database
dependencies: [016, 022]
phase: 1
---

# Careerlevels Validation Donnees

## Objectif
Documenter les règles de validation des données careerLevels

## Périmètre
**DANS le scope:**
- Contraintes par champ
- Validation formats strings
- Règles intégrité 4 niveaux
- Validation relations careers
- Messages erreur métier

**HORS scope:**
- Code validation
- UI validation

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json

## Livrables
`audit/database/careerLevels.md (section validation)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
