---
id: 014
status: DONE
priority: HIGH
domain: database
dependencies: [008, 009, 010, 011, 012]
phase: 1
---

# Careers Tests Coherence

## Objectif
Définir les tests de cohérence pour careers

## Périmètre
**DANS le scope:**
- Validation relations species
- Validation rand objects
- Tests filtrage espèce/région
- Vérification liens careerLevels
- Cas limites

**HORS scope:**
- Code tests
- Framework

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json

## Livrables
`audit/database/careers.md (section tests)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
