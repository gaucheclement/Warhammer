---
id: 251
status: DONE
priority: MEDIUM
domain: features
dependencies: []
phase: 7
---

# Help System - Relations inverses

## Objectif
Créer `audit/features/help-system/inverse-relations.md` documentant le système de relations inverses "Utilisé par"

## Périmètre
**DANS le scope:**
- Indexation relations inverses globale
- Affichage "Utilisé par" pour chaque entité
- Relations multi-types (espèce→carrière, carrière→talents, etc.)
- Structure index CharGen.match
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique DescriptionHelper
- Code UI
- Performance indexation

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\DescriptionHelper.html
- C:\Users\gauch\PhpstormProjects\Warhammer\DataHelper.html
- C:\Users\gauch\PhpstormProjects\Warhammer\Character.html

## Livrables
`audit/features/help-system/inverse-relations.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Exemples de relations inverses attendues
- Talent "Affable" → Espèces: Halfling, Humain | Carrières: Artiste, Charlatan
- Sort "Arme aethyrique" → Domaine: Lumière | Talents requis: Magie des Arcanes
- Compétence "Art (Calligraphie)" → Carrières: Scribe, Érudit
- Trapping "Hallebarde" → Carrières: Soldat, Répurgateur
