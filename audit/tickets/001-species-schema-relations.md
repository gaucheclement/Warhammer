---
id: 001
status: DONE
priority: HIGH
domain: database
dependencies: []
phase: 1
---

# Species Schema Relations

## Objectif
Créer le fichier KB `audit/database/species.md` documentant la structure de la table Species et ses relations

## Périmètre
**DANS le scope:**
- Structure complète species.json
- Relations avec careers (refCareer)
- Relations avec characteristics (refChar)
- Relations avec details physiques (refDetail)
- Relations avec skills/talents (parsing requis)
- Types de données et contraintes

**HORS scope:**
- Logique génération aléatoire (ticket #002)
- Parsing complexe skills/talents (ticket #003)
- Calculs formules (ticket #004)

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\DataSpecie.html

## Livrables
`audit/database/species.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
