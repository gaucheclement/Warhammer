# Pattern: Index séquentiel unique

## Contexte
Identifiant numérique unique pour chaque entité d'une table.
Utilisé pour références directes et ordre de tri.

## Format
Champ "index" contenant un entier positif ou zéro.

## Caractéristiques
- **Unique** : Pas de doublons dans une même table
- **Séquentiel** : 0, 1, 2, 3... sans trous
- **Immuable** : Ne change jamais une fois assigné

## Exemples
- Humain → index 0
- Halfling → index 1
- Nain → index 2

## Validation

### Unicité
Vérifier qu'aucun index n'est utilisé deux fois dans la même table.

### Séquence
Vérifier que les index forment une suite 0, 1, 2, 3... sans valeur manquante.

### Erreurs possibles
- **Doublon** : "Index 5 utilisé par 'Entité A' et 'Entité B'"
- **Trou** : "Séquence rompue : attendu 7, trouvé 9"
- **Type invalide** : "Index doit être un entier, trouvé '5' (string)"

## Tables concernées
Toutes sauf: details, eyes-hairs, books

## Exceptions
- details, eyes-hairs : Pas d'index (listes simples)
- Trous acceptés si suppression d'entité

## Voir aussi
- [pattern-label.md](./pattern-label.md) - Identifiant textuel
