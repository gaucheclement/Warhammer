# Pattern: Validation références

## Contexte
Validation de l'intégrité référentielle entre tables.
Garantit que toutes les références pointent vers des entités existantes.

## Types de références

### 1. Référence textuelle simple
Champ string → label d'une autre table.

Algorithme :
- Construire ensemble des labels de la table cible
- Pour chaque entité source, vérifier que la référence est dans cet ensemble

Erreurs possibles :
- `REF_NOT_FOUND` : Référence introuvable

Exemple : Careers.class → Classes.label

### 2. Référence dans liste parsée
Liste CSV → labels d'une autre table.

Algorithme :
- Parser la liste (virgules, parenthèses, etc.)
- Pour chaque item, vérifier qu'il existe dans la table cible

Exemple : Species.skills → Skills.label

### 3. Référence dans objet
Clés d'objet → champ d'une autre table.

Algorithme :
- Extraire toutes les clés de l'objet
- Vérifier que chaque clé existe dans la table cible

Erreurs possibles :
- `REF_KEY_INVALID` : Clé invalide

Exemple : Careers.rand (clés) → Species.refCareer

## Tests de complétude

### Références orphelines
Trouver les entités de la table cible qui ne sont jamais référencées.

Utile pour détecter :
- Talents jamais utilisés
- Compétences obsolètes
- Données inutiles

## Messages d'erreur
- `REF_NOT_FOUND` : "{source}: {field} référence \"{reference}\" introuvable"
- `REF_KEY_INVALID` : "{source}: {field} clé \"{key}\" invalide. Valides: {validKeys}"

## Cas spéciaux

### Références optionnelles
Si le champ est vide ou null, ne pas valider (référence optionnelle).

### Références avec "(Au choix)"
Si la référence est exactement "Au choix", skip la validation (choix libre).

## Tables concernées
Toutes les tables avec références

## Voir aussi
- [pattern-relation-textuelle.md](./pattern-relation-textuelle.md) - Types de relations
- [pattern-parsing.md](./pattern-parsing.md) - Parsing listes
