---
id: 254
status: DONE
priority: MEDIUM
domain: features
dependencies: [251, 252]
phase: 7
---

# Help System - Navigation bidirectionnelle

## Objectif
Créer `audit/features/help-system/bidirectional-navigation.md` documentant la navigation aller-retour entre entités liées

## Périmètre
**DANS le scope:**
- Flux navigation utilisateur
- Liens cliquables dans descriptions
- Affichage contexte origine
- Historique navigation (optionnel)
- Exemples parcours utilisateur Warhammer

**HORS scope:**
- Implémentation technique navigation
- Code UI routing
- Breadcrumbs

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\DescriptionHelper.html
- C:\Users\gauch\PhpstormProjects\Warhammer\Helper.html (generateListWithHelp)

## Livrables
`audit/features/help-system/bidirectional-navigation.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Exemple parcours utilisateur
1. Utilisateur consulte Carrière "Agitateur"
2. Voit talent "Éloquence" dans liste
3. Clique sur "Éloquence" → Description talent s'affiche
4. Voit section "Utilisé par" → Autres carrières: Charlatan, Diplomate
5. Clique "Charlatan" → Fiche carrière Charlatan
6. Retour "Agitateur" possible
