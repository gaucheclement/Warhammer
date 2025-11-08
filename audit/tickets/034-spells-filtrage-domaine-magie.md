---
id: 034
status: DONE
priority: MEDIUM
domain: database
dependencies: [033]
phase: 3
---

# Spells Filtrage Domaine Magie

## Objectif
Documenter le filtrage des sorts par domaine de magie (lore)

## Périmètre
**DANS le scope:**
- Relation spells → lores
- Types de domaines (Arcane/Divine/Chaos)
- Règles accès par domaine
- Sorts communs vs spécifiques
- Exemples par lore

**HORS scope:**
- Implémentation filtrage
- UI sélection

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\spells.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\lores.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepExperience.html

## Livrables
`audit/business-rules/filtrage-spells-lore.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
