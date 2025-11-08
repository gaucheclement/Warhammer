---
id: 118
status: TODO
priority: HIGH
domain: features
dependencies: [005, 018, 117]
phase: 2
---

# Wizard Skills - Calcul valeurs finales

## Objectif
Créer `audit/features/wizard/skills-values.md` documentant le calcul des valeurs finales de compétences (Carac + Avances)

## Périmètre
**DANS le scope:**
- Formule: Valeur = Caractéristique liée + Avances
- Mise à jour temps réel si carac change
- Affichage Valeur et Bonus (+X/10)
- Calculs pour toutes compétences acquises
- Exemples de calculs Warhammer

**HORS scope:**
- Implémentation technique
- Code UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepSkills.html

## Livrables
`audit/features/wizard/skills-values.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
