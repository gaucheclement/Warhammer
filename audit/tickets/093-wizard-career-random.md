---
id: 093
status: TODO
priority: HIGH
domain: features
dependencies: [002, 091]
phase: 2
---

# Wizard Career - Génération aléatoire pondérée

## Objectif
Créer `audit/features/wizard/career-random.md` documentant la génération aléatoire de carrière avec pondération par espèce

## Périmètre
**DANS le scope:**
- Table de probabilité par espèce (rand dans careers.json)
- Pondération différente selon l'espèce
- Carrières courantes vs rares
- Génération aléatoire respectant restrictions
- Exemples de distributions Warhammer

**HORS scope:**
- Implémentation algorithme
- Code générateur

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers careers.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de tables de probabilité
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCareers.html

## Livrables
`audit/features/wizard/career-random.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
