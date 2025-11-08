---
id: 007
status: DONE
priority: HIGH
domain: database
dependencies: [001, 006]
phase: 1
---

# Species Validation Donnees

## Objectif
Documenter les règles de validation des données species

## Périmètre
**DANS le scope:**
- Contraintes par champ
- Règles inter-champs
- Valeurs obligatoires vs optionnelles
- Formats acceptés
- Messages d'erreur métier

**HORS scope:**
- Code de validation
- UI de validation

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html

## Livrables
`audit/database/species.md (section validation)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
