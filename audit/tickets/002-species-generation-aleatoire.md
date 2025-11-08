---
id: 002
status: DONE
priority: HIGH
domain: database
dependencies: [001]
phase: 1
---

# Species Generation Aleatoire

## Objectif
Documenter la logique de génération aléatoire des espèces (champ rand et pondération)

## Périmètre
**DANS le scope:**
- Structure du champ rand
- Logique de sélection aléatoire pondérée
- Gestion des régions/sous-espèces
- Règles métier pour la génération
- Cas génération manuelle vs aléatoire

**HORS scope:**
- Implémentation de l'algorithme
- UI de sélection

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations avec autres tables/features documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\data\species.json
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepSpecies.html
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Helper.html

## Livrables
`audit/database/species.md (section génération)`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome et compréhensible
