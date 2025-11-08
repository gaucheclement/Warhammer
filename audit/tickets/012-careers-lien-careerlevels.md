---
id: 012
status: DONE
priority: HIGH
domain: database
dependencies: [008]
phase: 1
---

# Careers Lien Careerlevels

## Objectif
Documenter la relation careers → careerLevels (1 carrière = 4 niveaux)

## Périmètre
**DANS le scope:**
- Lien label/careerLabel
- Structure 4 niveaux (Bronze/Silver/Gold)
- Navigation entre niveaux
- Progression obligatoire
- Règles métier

**HORS scope:**
- Détails careerLevels (ticket #016)
- Logique progression XP (ticket #021)

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json

## Livrables
`audit/database/careers.md (section relations)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
