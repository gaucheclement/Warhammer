---
id: 003
status: TODO
priority: HIGH
domain: database
dependencies: []
---

# Analyser table Characteristics

## Objectif
Documenter la table characteristics (FM, CC, CT, F, E, I, Ag, Dex, Int, FM, Soc).

## Périmètre
**DANS le scope:**
- Structure de characteristics
- Signification métier de chaque caractéristique
- Rôle dans le jeu
- Relations avec species (modificateurs), careers
- Règles de calcul des bonus

**HORS scope:**
- Formules de calcul techniques
- Code de génération de caractéristiques

## Critères d'acceptance
- [ ] Fichier `audit/database/characteristics.md` créé
- [ ] Fichier < 200 lignes
- [ ] Chaque caractéristique expliquée (rôle métier)
- [ ] Relations avec species et careers
- [ ] Règles de modificateurs
- [ ] Aucun code technique
- [ ] Cross-references OK

## Fichiers à analyser
- `warhammer-v2/data/characteristics.json`

## Livrables
- `audit/database/characteristics.md`

## Validation finale
- Toutes les caractéristiques documentées
- Rôle métier clair
- Format respecté
