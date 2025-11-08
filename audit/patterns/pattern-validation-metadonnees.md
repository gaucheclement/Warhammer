# Pattern: Validation des métadonnées

## Contexte
Tests de validation pour les identifiants de base (index et labels).
Garantit unicité, séquence cohérente et format correct.

---

## 1. Validation Index

### Tests à effectuer

**1. Unicité**
Vérifier qu'aucun index n'est utilisé deux fois dans la table.

**Erreurs possibles :**
- `INDEX_DUPLICATE` : Index utilisé par plusieurs entités

**2. Séquence**
Vérifier que les index sont consécutifs sans trous (0, 1, 2, 3...).

Trier les entités par index et vérifier que chaque index = position attendue.

**Erreurs possibles :**
- `INDEX_GAP` : Trou dans la séquence

**3. Type**
Vérifier que l'index est un entier (Number.isInteger).

**Erreurs possibles :**
- `INDEX_TYPE` : Type incorrect

**4. Plage**
Vérifier que l'index est >= 0.

**Erreurs possibles :**
- `INDEX_NEGATIVE` : Index négatif

### Suite de tests complète
Exécuter tous les tests (individuels puis globaux) et retourner la liste des erreurs.

### Messages d'erreur
- `INDEX_DUPLICATE` : "Index {index} utilisé par: {entities}"
- `INDEX_GAP` : "Trou dans séquence: attendu {expected}, trouvé {found} ({entity})"
- `INDEX_TYPE` : "Index invalide pour {entity}: type {actualType} au lieu de number"
- `INDEX_NEGATIVE` : "Index négatif pour {entity}: {index}"

### Exceptions

**Tables sans index :**
Certaines tables n'ont pas de champ index :
- details
- eyes-hairs
- books (parfois)

**Trous autorisés :**
Si une entité est supprimée, le trou peut rester.
Utiliser flag `allowGaps: true` pour skip le test de séquence.

---

## 2. Validation Labels

### Tests à effectuer

**1. Présence**
Vérifier que le label est présent et non vide.

**Erreurs possibles :**
- `LABEL_MISSING` : Label manquant

**2. Unicité**
Vérifier qu'aucun label n'est utilisé deux fois (comparaison case-insensitive).

**Erreurs possibles :**
- `LABEL_DUPLICATE` : Label en doublon

**3. Longueur**
Vérifier que le label a entre 3 et 100 caractères.

**Erreurs possibles :**
- `LABEL_TOO_SHORT` : Moins de 3 caractères
- `LABEL_TOO_LONG` : Plus de 100 caractères

**4. Caractères invalides**
Vérifier l'absence de caractères de contrôle (tab, newline, etc.).

**Erreurs possibles :**
- `LABEL_INVALID_CHARS` : Caractères de contrôle détectés

**5. Espaces**
Vérifier l'absence d'espaces en début/fin et d'espaces multiples.

**Erreurs possibles :**
- `LABEL_WHITESPACE` : Espaces début/fin ou espaces multiples

### Suite de tests complète
Exécuter tous les tests (individuels puis globaux) et retourner la liste des erreurs.

### Messages d'erreur
- `LABEL_MISSING` : "Label manquant pour entité index {index}"
- `LABEL_DUPLICATE` : "Label \"{label}\" utilisé aux index {indices}"
- `LABEL_TOO_SHORT` : "Label \"{label}\" trop court ({length} car, min {minimum})"
- `LABEL_TOO_LONG` : "Label \"{label}\" trop long ({length} car, max {maximum})"
- `LABEL_INVALID_CHARS` : "Label \"{label}\" contient caractères invalides"
- `LABEL_WHITESPACE` : "Label \"{label}\": {issue}"

### Normalisation
Avant validation, normaliser le label :
- Trim (retirer espaces début/fin)
- Remplacer espaces multiples par un seul espace

---

## Tables concernées

**Index :** Toutes sauf details, eyes-hairs
**Labels :** Toutes

---

## Voir aussi

- [pattern-index.md](./pattern-index.md) - Définition du pattern index
- [pattern-label.md](./pattern-label.md) - Définition du pattern label
