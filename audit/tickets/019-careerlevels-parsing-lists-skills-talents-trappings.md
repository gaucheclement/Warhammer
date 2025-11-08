---
id: 019
status: DONE
priority: HIGH
domain: database
dependencies: [016, 003]
phase: 1
---

# Careerlevels Parsing Lists Skills Talents Trappings

## Objectif
Documenter le parsing des listes skills/talents/trappings dans careerLevels

## Périmètre
**DANS le scope:**
- Format listes (virgules, "ou", "Au choix")
- Parsing spécialisations
- Gestion quantités trappings
- Choix utilisateur vs aléatoire
- Exemples par niveau

**HORS scope:**
- Code parsing
- UI de sélection

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
`audit/business-rules/parsing-skills-talents.md (section careerLevels)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
