---
id: 050
status: DONE
priority: MEDIUM
domain: database
dependencies: [049, 033]
phase: 3
---

# Lores Relations Spells Magicks

## Objectif
Documenter les relations entre lores, spells et magicks

## Périmètre
**DANS le scope:**
- Lien lore → spells
- Lien lore → magicks
- Règles accès sorts par domaine
- Exemples par lore

**HORS scope:**
- Implémentation
- UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\lores.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\spells.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\magicks.json

## Livrables
`audit/database/lores.md (section relations)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
