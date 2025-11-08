---
id: 253
status: DONE
priority: LOW
domain: features
dependencies: [251]
phase: 7
---

# Help System - Références bibliographiques

## Objectif
Créer `audit/features/help-system/book-references.md` documentant l'affichage des références pages livres sources

## Périmètre
**DANS le scope:**
- Affichage numéros de page par élément
- Organisation par livre source
- Liens bidirectionnels livre ↔ éléments
- Filtrage par livre actif
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique addToBook
- Code UI
- Scan PDF automatique

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB (books.md)
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\DescriptionHelper.html (addToBook, match['book'])

## Livrables
`audit/features/help-system/book-references.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Exemples références attendues
- Talent "Affable" → LDB page 124
- Carrière "Agitateur" → LDB page 43, ADE1 page 67
- Sort "Arme aethyrique" → VDLM page 89
- Espèce "Halfling" → LDB page 28, SOC page 12
