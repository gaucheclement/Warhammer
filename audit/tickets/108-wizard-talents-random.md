---
id: 108
status: TODO
priority: HIGH
domain: features
dependencies: [004, 106]
phase: 2
---

# Wizard Talents - Sélection talents "X aléatoire"

## Objectif
Créer `audit/features/wizard/talents-random.md` documentant la sélection des talents marqués "X aléatoire" dans la carrière

## Périmètre
**DANS le scope:**
- Parsing "X aléatoire" dans talents carrière (ex: "3 talents aléatoires")
- Génération aléatoire parmi liste talents
- Sélection manuelle vs aléatoire
- Relance possible
- Validation nombre requis
- Exemples Warhammer

**HORS scope:**
- Implémentation génération aléatoire
- Code parsing

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers talents.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de génération
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepTalents.html

## Livrables
`audit/features/wizard/talents-random.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
