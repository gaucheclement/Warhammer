---
id: 025
status: DONE
priority: HIGH
domain: database
dependencies: [024]
phase: 1
---

# Talents Rangs Multiples

## Objectif
Documenter la gestion des rangs multiples des talents (champ max avec formules)

## Périmètre
**DANS le scope:**
- Champ max et valeurs
- Talents à rang unique
- Talents à rangs multiples
- Formules max (ex: "I" pour Initiative)
- Règles d'acquisition rangs
- Exemples

**HORS scope:**
- Code gestion rangs
- UI affichage rangs

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\talents.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html

## Livrables
`audit/business-rules/talents-rangs-multiples.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
