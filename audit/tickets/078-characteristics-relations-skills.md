---
id: 078
status: DONE
priority: MEDIUM
domain: database
dependencies: [077, 038]
phase: 3
---

# Characteristics Relations Skills

## Objectif
Documenter les relations entre characteristics et skills

## Périmètre
**DANS le scope:**
- Lien skill → characteristic
- Calcul valeur skill (carac + avances)
- Exemples par skill

**HORS scope:**
- Code calcul
- UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\characteristics.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\skills.json

## Livrables
`audit/database/characteristics.md (section relations)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
