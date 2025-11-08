---
id: 005
status: DONE
priority: HIGH
domain: database
dependencies: [001]
phase: 1
---

# Species Migration Descriptions Html

## Objectif
Documenter la structure des descriptions HTML et leur stratégie de migration

## Périmètre
**DANS le scope:**
- Format HTML actuel des descriptions
- Balises utilisées
- Liens internes entre entités
- Stratégie markdown/HTML pour V2
- Préservation sémantique

**HORS scope:**
- Code de conversion
- Rendu UI final

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataSpecie.html
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DescriptionHelper.html

## Livrables
`audit/business-rules/migration-descriptions-html.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
