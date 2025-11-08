---
id: 149
status: TODO
priority: HIGH
domain: features
dependencies: [005, 145]
phase: 2
---

# Character Model - Méthodes skills

## Objectif
Créer `audit/features/character-model/skills-methods.md` documentant les méthodes de gestion des compétences dans le modèle Character

## Périmètre
**DANS le scope:**
- addSkills(skills, source): ajouter compétences
- getSkills(): récupérer toutes compétences
- Parsing skills (specs, avances)
- Merge sources multiples
- Calcul valeurs finales
- Exemples concrets Warhammer

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
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html

## Livrables
`audit/features/character-model/skills-methods.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
