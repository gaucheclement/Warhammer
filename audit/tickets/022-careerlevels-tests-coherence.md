---
id: 022
status: DONE
priority: HIGH
domain: database
dependencies: [016, 017, 018, 019, 020, 021]
phase: 1
---

# Careerlevels Tests Coherence

## Objectif
Définir les tests de cohérence pour careerLevels

## Périmètre
**DANS le scope:**
- Validation 4 niveaux par carrière
- Tests parsing characteristics
- Tests accumulation
- Vérification coûts XP
- Tests relations careers
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
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json

## Livrables
`audit/database/careerLevels.md (section tests)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
