---
id: 001
status: TODO
priority: HIGH
domain: database
dependencies: []
---

# Analyser table Species

## Objectif
Documenter la table species (espèces jouables) avec toutes ses règles métier.

## Périmètre
**DANS le scope:**
- Structure de la table species
- Tous les champs et leur usage métier
- Relations avec autres tables (careers, characteristics, skills, etc.)
- Règles spécifiques par espèce
- Modificateurs raciaux
- Restrictions et capacités spéciales

**HORS scope:**
- Implémentation technique actuelle
- Code des composants utilisant species

## Critères d'acceptance
- [ ] Fichier `audit/database/species.md` créé
- [ ] Fichier < 200 lignes
- [ ] Tous les champs documentés avec usage métier
- [ ] Relations vers autres tables identifiées
- [ ] Patterns d'utilisation expliqués
- [ ] Exemples concrets pour clarifier
- [ ] Aucune information technique du code source
- [ ] Cross-references vérifiées

## Fichiers à analyser
- `warhammer-v2/data/species.json`
- Éventuellement composants lisant species pour comprendre l'usage

## Livrables
- `audit/database/species.md`

## Validation finale
- Toutes les règles métier des espèces sont documentées
- Format template database respecté
- Pas de code technique
- Fichier autonome et compréhensible
