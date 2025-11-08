# Pattern: Label unique

## Contexte
Identifiant textuel lisible de chaque entité.
Utilisé pour affichage, recherche et références textuelles.

## Format
Champ "label" contenant une chaîne de texte de 3 à 100 caractères.

## Caractéristiques
- **Unique** : Pas de doublons (insensible à la casse)
- **Lisible** : Nom complet en français
- **Stable** : Éviter modifications (brise références)

## Exemples
- "Corps à corps"
- "Lire/Écrire"
- "Agent d'information"

## Validation

### Unicité
Vérifier qu'aucun label n'est utilisé deux fois dans la même table (en ignorant la casse).

### Longueur
Chaque label doit contenir entre 3 et 100 caractères.

### Erreurs possibles
- **Doublon** : "Label 'Agitateur' existe déjà (index 12)"
- **Trop court** : "Label 'AB' trop court (min 3 caractères)"
- **Vide** : "Label obligatoire manquant"

## Normalisation

Les labels doivent être normalisés :
- Supprimer espaces début/fin
- Remplacer espaces multiples par un seul espace
- Première lettre en majuscule

## Tables concernées
Toutes

## Voir aussi
- [pattern-index.md](./pattern-index.md) - Identifiant numérique
- [pattern-relation-textuelle.md](./pattern-relation-textuelle.md) - Références par label
