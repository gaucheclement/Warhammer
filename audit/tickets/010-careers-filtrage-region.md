---
id: 010
status: DONE
priority: HIGH
domain: database
dependencies: [008]
phase: 1
---

# Careers Filtrage Region

## Objectif
Documenter le filtrage des carrières par région (Middenheim, Nordland, etc.)

## Périmètre
**DANS le scope:**
- Liste des régions
- Carrières spécifiques par région
- Pondération régionale
- Règles métier régionales
- Exemples

**HORS scope:**
- Implémentation filtrage
- Gestion géographique

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCareers.html

## Livrables
`audit/business-rules/filtrage-careers-region.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
