---
id: 013
status: DONE
priority: HIGH
domain: database
dependencies: [008, 005]
phase: 1
---

# Careers Migration Descriptions

## Objectif
Documenter la migration des descriptions HTML des carrières

## Périmètre
**DANS le scope:**
- Format descriptions carrières
- Liens vers classes
- Stratégie migration
- Préservation contenu

**HORS scope:**
- Code conversion
- Rendu UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataCareer.html

## Livrables
`audit/business-rules/migration-descriptions-html.md (section careers)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
