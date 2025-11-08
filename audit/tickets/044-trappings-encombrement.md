---
id: 044
status: DONE
priority: MEDIUM
domain: database
dependencies: [043]
phase: 3
---

# Trappings Encombrement

## Objectif
Documenter le système d'encombrement de l'équipement

## Périmètre
**DANS le scope:**
- Champ enc structure
- Calcul encombrement total
- Règles transport
- Limites portage
- Exemples calculs

**HORS scope:**
- Code calcul
- UI encombrement

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\trappings.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Helper.html

## Livrables
`audit/business-rules/calcul-encombrement.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
