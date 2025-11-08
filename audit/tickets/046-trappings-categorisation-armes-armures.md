---
id: 046
status: DONE
priority: MEDIUM
domain: database
dependencies: [043]
phase: 3
---

# Trappings Categorisation Armes Armures

## Objectif
Documenter la catégorisation de l'équipement (armes/armures/divers)

## Périmètre
**DANS le scope:**
- Types d'équipement
- Propriétés armes (dégâts, allonge, qualités)
- Propriétés armures (PA par zone, qualités)
- Équipement divers
- Exemples par catégorie

**HORS scope:**
- Code catégorisation
- UI affichage

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\trappings.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\qualities.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataTrapping.html

## Livrables
`audit/business-rules/categorisation-trappings.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
