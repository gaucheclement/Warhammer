---
id: 257
status: DONE
priority: LOW
domain: features
dependencies: [256]
phase: 7
---

# Navigation - Arborescence dynamique

## Objectif
Créer `audit/features/navigation/tree-navigation.md` documentant la navigation par arborescence avec filtrage dynamique

## Périmètre
**DANS le scope:**
- Sélection nœud arborescence
- Affichage enfants dynamique
- Filtrage par type (species, careers, spells, etc.)
- Organisation hiérarchique (root → categories → items)
- Règles métier navigation
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique DataHelper.flattenElemIteratively
- Code UI select/dropdown
- Animations transitions

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers trees.md, compendium.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\Glossaire.html
- C:\Users\gauch\PhpstormProjects\Warhammer\DataHelper.html (flattenElemIteratively)

## Livrables
`audit/features/navigation/tree-navigation.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Exemple navigation
1. Utilisateur sélectionne "Sorts" dans dropdown
2. Arbre s'affiche :
   - Sorts → Domaines Arcanes → Feu → Liste 15 sorts
   - Sorts → Magie Mineure → Liste 12 petits sorts
   - Sorts → Bénédictions → Par Dieu → Sigmar, Ulric, etc.
3. Clic "Feu" → Affiche 15 sorts domaine avec descriptions
4. Changement dropdown "Carrières" → Nouvelle arborescence
