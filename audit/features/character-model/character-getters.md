# Character Model - Consultation et Recherche

## Objectif

Règles consultation et recherche éléments personnage.

## Consultation Compétences

Liste toutes compétences, triées alphabétiquement.

Filtres : base/avancées, avec/sans avances, par origine, par caractéristique.

Recherche par : ID, spécialisation, origine.

## Consultation Talents

Liste tous talents, ordre acquisition.

Filtres : actifs (rang > 0), par origine.

Recherche par : ID, spécialisation, origine.

## Consultation Sorts

Liste tous sorts appris.

Filtres : par type (arcane/divin/petty), par domaine.

Recherche par : ID, domaine.

## Consultation Équipement

Liste tout équipement inventaire.

Filtres : par type (Arme, Armure, Général).

## Règles Filtrage

### Origine

Origine espèce, origine carrière (avec niveau), origine talent.

Un élément peut avoir origines multiples → fusion en objet unique.

### Spécialisations

Spécialisation fixe : définie dans table référence.

Spécialisation "Au choix" : choix utilisateur obligatoire avant finalisation.

Voir [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md).

## Talents avec Effets

Talents ajoutant automatiquement compétences/sorts/talents.

Consultation : quelle compétence/sort/talent sera ajouté par talent donné.

Voir [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

## Voir aussi

- [character-structure.md](./character-structure.md)
- [character-mutations.md](./character-mutations.md)
- [../../database/skills.md](../../database/skills.md)
- [../../database/talents.md](../../database/talents.md)
- [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md)
