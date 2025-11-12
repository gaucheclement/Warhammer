# Index des Tables de Base de Données

Liste de toutes les tables de référence Warhammer.

## Tables Principales

- [species](./species.md) - Espèces jouables (Humain, Nain, Elfe, Halfling, Gnome, Ogre)
- [careers](./careers.md) - Carrières disponibles par espèce
- [careerLevels](./careerLevels.md) - Niveaux de progression de carrière (1-4)
- [skills](./skills.md) - Compétences disponibles
- [characteristics](./characteristics.md) - Caractéristiques de base (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)
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
- [details](./details.md) - Autres détails physiques (âge, taille, poids)

## Tables Équipement

- [trappings](./trappings.md) - Équipement et possessions

---

## Architecture de l'audit

### Patterns Techniques
Voir [patterns/_index.md](../patterns/_index.md)

Patterns centralisent les comportements techniques réutilisables : métadonnées, génération aléatoire, spécialisations, parsing, HTML, validation.

**Principe**: Les tables database/ référencent les patterns au lieu de dupliquer.

### Règles Métier Transverses
Voir [business-rules/_index.md](../business-rules/_index.md)

Règles métier documentent les systèmes impliquant plusieurs tables : calculs cross-table, systèmes de progression, interactions talents.

**Principe**: Règle concernant une seule table → database/
Règle concernant plusieurs tables → business-rules/
