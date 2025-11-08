---
id: 037
status: DONE
priority: MEDIUM
domain: database
dependencies: [033, 005]
phase: 3
---

# Spells Migration Descriptions Html

## Objectif
Documenter la migration des descriptions HTML longues des sorts

## Périmètre
**DANS le scope:**
- Format descriptions sorts (très longues)
- Balises spécifiques
- Tables de résultats
- Stratégie migration
- Préservation formatage

**HORS scope:**
- Code de conversion
- Rendu UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\spells.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataSpell.html

## Livrables
`audit/business-rules/migration-descriptions-html.md (section spells)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
