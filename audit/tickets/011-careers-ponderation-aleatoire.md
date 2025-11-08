---
id: 011
status: DONE
priority: HIGH
domain: database
dependencies: [008, 009]
phase: 1
---

# Careers Ponderation Aleatoire

## Objectif
Documenter la pondération aléatoire des carrières (objet rand)

## Périmètre
**DANS le scope:**
- Structure objet rand par espèce
- Calcul probabilités
- Influence région
- Règles génération aléatoire
- Exemples calculs

**HORS scope:**
- Algorithme de tirage
- Code génération

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Helper.html

## Livrables
`audit/database/careers.md (section génération)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
