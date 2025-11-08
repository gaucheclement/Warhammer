---
id: 003
status: DONE
priority: HIGH
domain: database
dependencies: [001]
phase: 1
---

# Species Parsing Skills Talents

## Objectif
Documenter le parsing complexe des skills et talents dans species (strings avec "ou", "Au choix", "X aléatoire")

## Périmètre
**DANS le scope:**
- Formats de strings skills/talents
- Opérateurs: "ou", "Au choix", "X aléatoire"
- Parsing spécialisations entre parenthèses
- Gestion choix utilisateur vs aléatoire
- Exemples concrets par espèce

**HORS scope:**
- Code de parsing
- UI de sélection

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Helper.html
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html

## Livrables
`audit/business-rules/parsing-skills-talents.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
