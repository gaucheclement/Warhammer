# Character Model - Mutations et Persistance

## Objectif

Règles ajout, modification, suppression et persistance données personnage.

## Ajout d'éléments

### Compétences

Sources : espèce, carrière, talents.

Parsing texte → structure. Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

Gestion doublons : Si existe → ajout origine. Sinon → création.

### Talents

Sources : espèce, carrière, autres talents.

Rangs multiples possibles (origines différentes).

Gestion doublons : Si existe → incrémentation rang OU ajout origine.

### Équipement

Si existe → augmentation quantité. Sinon → ajout.

Encombrement = quantité × enc unitaire.

## Nettoyage

Avant sauvegarde : suppression compétences/talents avec 0 avances.

Gain : ~50% réduction taille.

## Gestion XP

Voir [character-calculations.md](./character-calculations.md) et [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

## Sauvegarde et Chargement

### Préparation sauvegarde

Nettoyage éléments vides → Exclusion données statiques → Génération objet allégé.

Sauvegarde uniquement IDs + valeurs personnalisées.

Optimisation : ~70% réduction espace.

### Reconstruction chargement

Ordre : Propriétés simples → Espèce → Carrière → Caractéristiques → Compétences → Talents → Sorts.

Réhydratation : ID → Lookup table référence → Fusion définition + valeurs personnalisées.

Infrastructure : Voir [../../patterns/pattern-google-sheets-storage.md](../../patterns/pattern-google-sheets-storage.md).

## Gestion Erreurs

### Références invalides

ID inexistant → Blocage chargement, message erreur.

### Données corrompues

Format invalide → Rejet chargement.

## Voir aussi

- [character-structure.md](./character-structure.md)
- [character-calculations.md](./character-calculations.md)
- [character-getters.md](./character-getters.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
- [../../patterns/pattern-google-sheets-storage.md](../../patterns/pattern-google-sheets-storage.md)
