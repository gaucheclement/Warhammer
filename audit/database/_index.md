# Index des Tables de Base de Données

Liste de toutes les tables de référence Warhammer analysées.

## Tables Principales

- [species](./species.md) - Espèces jouables (Humain, Nain, Elfe, etc.)
- [careers](./careers.md) - Carrières disponibles par espèce
- [careerLevels](./careerLevels.md) - Niveaux de progression de carrière
- [skills](./skills.md) - Compétences disponibles
- [characteristics](./characteristics.md) - Caractéristiques de base (FM, CC, CT, etc.)
- [classes](./classes.md) - Classes de carrières
- [talents](./talents.md) - Talents et capacités

## Tables Magiques

- [spells](./spells.md) - Sorts disponibles
- [lores](./lores.md) - Domaines de magie
- [magicks](./magicks.md) - Systèmes de magie

## Tables Créatures & Traits

- [creatures](./creatures.md) - Créatures et monstres
- [qualities](./qualities.md) - Qualités et défauts
- [psychologies](./psychologies.md) - Traits psychologiques
- [etats](./etats.md) - États et conditions
- [traits](./traits.md) - Traits de créatures

## Tables Descriptives

- [gods](./gods.md) - Dieux et panthéon
- [stars](./stars.md) - Signes astrologiques
- [books](./books.md) - Sources et références
- [trees](./trees.md) - Arborescence de navigation

## Tables Détails Physiques

- [eyes-hairs](./eyes-hairs.md) - Couleurs d'yeux et cheveux
- [details](./details.md) - Autres détails physiques

## Tables Équipement

- [trappings](./trappings.md) - Équipement et possessions

---

## Architecture de l'audit

### Patterns Techniques
**→ Voir [patterns/_index.md](../patterns/_index.md)**

Les patterns centralisent les comportements techniques réutilisables:
- Métadonnées (index, label, book/page)
- Génération aléatoire (rand, tirage)
- Spécialisations (specs, Au choix)
- Parsing (virgule, parenthèses, quantités)
- HTML et descriptions
- Validation (index, labels, références)

**Principe**: Les tables database/ référencent les patterns au lieu de dupliquer.

### Règles Métier Transverses
**→ Voir [business-rules/_index.md](../business-rules/_index.md)**

Les règles métier documentent les systèmes impliquant plusieurs tables:
- Calculs cross-table (XP, encombrement, détails physiques)
- Systèmes de progression (skills, talents)
- Interactions talents (effets, déblocages)

**Principe**: Si la règle concerne UNE seule table → database/
Si la règle concerne PLUSIEURS tables → business-rules/

---

## Notes

- Fichier `all-data` est un agrégateur - voir tables individuelles pour détails
- Chaque table contient des règles métier spécifiques au domaine Warhammer
- Relations entre tables souvent encodées en strings (à documenter par table)
- **Max 200 lignes par fichier** : Les détails techniques sont dans patterns/
