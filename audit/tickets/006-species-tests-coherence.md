---
id: 006
status: DONE
priority: HIGH
domain: database
dependencies: [001, 002, 003, 004]
phase: 1
---

# Species Tests Coherence

## Objectif
Définir les tests de cohérence pour les données species

## Périmètre
**DANS le scope:**
- Validations intégrité référentielle
- Tests formules calculs
- Vérification parsing skills/talents
- Tests génération aléatoire
- Cas limites identifiés

**HORS scope:**
- Code des tests
- Framework de test

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json

## Livrables
`audit/database/species.md (section tests)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
