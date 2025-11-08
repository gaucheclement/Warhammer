---
id: 107
status: TODO
priority: HIGH
domain: features
dependencies: [004, 106]
phase: 2
---

# Wizard Talents - Sélection talents "Au choix"

## Objectif
Créer `audit/features/wizard/talents-choice.md` documentant la sélection des talents marqués "Au choix" dans la carrière

## Périmètre
**DANS le scope:**
- Parsing "Au choix" dans talents carrière (ex: "Talent 1 ou Talent 2")
- Interface de sélection parmi les options
- Validation nombre de choix
- Restrictions et pré-requis
- Exemples Warhammer (ex: "Acuité auditive ou Acuité visuelle")

**HORS scope:**
- Implémentation parsing
- Code UI sélection

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers talents.md et career-levels.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de choix
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepTalents.html

## Livrables
`audit/features/wizard/talents-choice.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
