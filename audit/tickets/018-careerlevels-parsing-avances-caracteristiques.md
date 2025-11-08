---
id: 018
status: DONE
priority: HIGH
domain: database
dependencies: [016]
phase: 1
---

# Careerlevels Parsing Avances Caracteristiques

## Objectif
Documenter le parsing des avances de caractéristiques (format "+5 CC, +10 E")

## Périmètre
**DANS le scope:**
- Format strings characteristics
- Parsing valeurs numériques
- Mapping codes caractéristiques
- Gestion multi-avances
- Exemples par niveau

**HORS scope:**
- Code parsing
- Application avances (ticket #020)

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careerLevels.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Helper.html

## Livrables
`audit/business-rules/parsing-avances-caracteristiques.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
