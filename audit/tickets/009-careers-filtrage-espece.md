---
id: 009
status: DONE
priority: HIGH
domain: database
dependencies: [008, 001]
phase: 1
---

# Careers Filtrage Espece

## Objectif
Documenter la logique de filtrage des carrières par espèce

## Périmètre
**DANS le scope:**
- Règles compatibilité espèce-carrière
- Champ species dans careers
- Gestion carrières multi-espèces
- Carrières exclusives
- Exemples par espèce

**HORS scope:**
- Implémentation filtrage
- UI de sélection

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
`audit/business-rules/filtrage-careers-espece.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
