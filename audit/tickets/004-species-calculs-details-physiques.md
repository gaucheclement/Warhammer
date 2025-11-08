---
id: 004
status: DONE
priority: HIGH
domain: database
dependencies: [001]
phase: 1
---

# Species Calculs Details Physiques

## Objectif
Documenter les formules de calcul des détails physiques (âge, taille, poids)

## Périmètre
**DANS le scope:**
- Formules mathématiques par espèce
- Usage de 2d10 dans calculs
- Relations avec table details
- Variations par genre
- Exemples de calculs

**HORS scope:**
- Implémentation des calculs
- Génération UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\details.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepDetail.html

## Livrables
`audit/business-rules/calculs-details-physiques.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
