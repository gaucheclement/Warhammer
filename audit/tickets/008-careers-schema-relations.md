---
id: 008
status: DONE
priority: HIGH
domain: database
dependencies: []
phase: 1
---

# Careers Schema Relations

## Objectif
Créer le fichier KB `audit/database/careers.md` documentant la structure de la table Careers

## Périmètre
**DANS le scope:**
- Structure complète careers.json (216 KB)
- Relations avec classes
- Relations avec careerLevels
- Relations avec species (filtrage)
- Structure objet rand par espèce
- Types de données et contraintes

**HORS scope:**
- Logique filtrage (ticket #009)
- Logique régions (ticket #010)
- Pondération aléatoire (ticket #011)

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\careers.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataCareer.html

## Livrables
`audit/database/careers.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
