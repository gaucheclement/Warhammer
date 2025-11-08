---
id: 088
status: DONE
priority: HIGH
domain: features
dependencies: [001, 086]
phase: 2
---

# Wizard Species - Génération aléatoire pondérée

## Objectif
Créer `audit/features/wizard/species-random.md` documentant la génération aléatoire d'espèce avec pondération

## Périmètre
**DANS le scope:**
- Table de probabilité par espèce (rand)
- Algorithme de sélection pondérée
- Pondération différente selon contexte de jeu
- Génération aléatoire de sous-espèce si applicable
- Exemples de distributions Warhammer

**HORS scope:**
- Implémentation algorithme
- Code générateur aléatoire

## Critères d'acceptance
- [x] Fichier créé < 200 lignes (192 lignes)
- [x] Cross-refs OK vers species.md
- [x] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [x] Exemples de tables de probabilité
- [x] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepSpecies.html

## Livrables
`audit/features/wizard/species-random.md`

## Validation finale
- [x] Tous critères cochés
- [x] Format template respecté
- [x] Pas de Future Work
- [x] Fichier autonome
