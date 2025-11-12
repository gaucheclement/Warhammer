# Pattern: Métadonnées de base (index, label, book-page)

## Contexte

Identifiants et sources bibliographiques standardisés pour toutes les entités.
Garantissent unicité, traçabilité et cohérence des données.

---

## 1. Index séquentiel unique

### Description
Identifiant numérique unique pour chaque entité d'une table.
Utilisé pour références directes et ordre de tri.

### Format
Champ "index" contenant un entier positif ou zéro.

### Caractéristiques
- **Unique** : Pas de doublons dans une même table
- **Séquentiel** : 0, 1, 2, 3... sans trous
- **Immuable** : Ne change jamais une fois assigné

### Exemples
- Humain → index 0
- Halfling → index 1
- Nain → index 2

### Validation

#### Unicité
Vérifier qu'aucun index n'est utilisé deux fois dans la même table.

#### Séquence
Vérifier que les index forment une suite 0, 1, 2, 3... sans valeur manquante.

#### Erreurs possibles
- **Doublon** : "Index 5 utilisé par 'Entité A' et 'Entité B'"
- **Trou** : "Séquence rompue : attendu 7, trouvé 9"
- **Type invalide** : "Index doit être un entier, trouvé '5' (string)"

### Tables concernées
Toutes sauf: details, eyes-hairs, books

### Exceptions
- details, eyes-hairs : Pas d'index (listes simples)
- Trous acceptés si suppression d'entité

---

## 2. Label unique

### Description
Identifiant textuel lisible de chaque entité.
Utilisé pour affichage, recherche et références textuelles.

### Format
Champ "label" contenant une chaîne de texte de 3 à 100 caractères.

### Caractéristiques
- **Unique** : Pas de doublons (insensible à la casse)
- **Lisible** : Nom complet en français
- **Stable** : Éviter modifications (brise références)

### Exemples
- "Corps à corps"
- "Lire/Écrire"
- "Agent d'information"

### Validation

#### Unicité
Vérifier qu'aucun label n'est utilisé deux fois dans la même table (en ignorant la casse).

#### Longueur
Chaque label doit contenir entre 3 et 100 caractères.

#### Erreurs possibles
- **Doublon** : "Label 'Agitateur' existe déjà (index 12)"
- **Trop court** : "Label 'AB' trop court (min 3 caractères)"
- **Vide** : "Label obligatoire manquant"

### Normalisation

Les labels doivent être normalisés :
- Supprimer espaces début/fin
- Remplacer espaces multiples par un seul espace
- Première lettre en majuscule

### Tables concernées
Toutes

---

## 3. Références bibliographiques (book + page)

### Description
Traçabilité des sources dans les livres de règles officiels.
Permet de retrouver l'origine de chaque donnée.

### Format
Chaque entité possède deux champs :
- `book` : Code du livre (2-10 caractères)
- `page` : Numéro de page (1-999)

### Codes de livres courants

#### Livres principaux
- `LDB` - Livre de Base
- `EDO` - Ennemis dans l'Ombre
- `AA` - Mort sur le Reik / Archives des Magnus
- `ADE3` - Archives de l'Empire vol. 3

#### Suppléments
- `SOC` - Sombre Obscurité à Comédiennes
- `UP` - Un Peuple Sans Pareil (Nains)
- `ZE` - Zenithar Edition (Elfes)

#### Extensions régionales
- `MIDDENHEIM` - Guide de Middenheim
- `ALTDORF` - Guide d'Altdorf

### Validation

#### Champ book
Vérifier que le code livre est présent, non vide, et a une longueur entre 2 et 10 caractères.

Erreurs possibles :
- `BOOK_MISSING` : Source manquante
- `BOOK_LENGTH` : Code livre invalide

#### Champ page
Vérifier que le numéro de page est présent, non nul, de type entier, et dans la plage 1-999.

Erreurs possibles :
- `PAGE_MISSING` : Numéro de page manquant
- `PAGE_TYPE` : Page doit être un entier
- `PAGE_RANGE` : Page hors limites

#### Cohérence livre-page
Pour chaque livre, calculer la plage de pages utilisées (min-max).
Avertir si la page maximum dépasse 500 (inhabituellement élevé).

### Affichage
Format standard : `BOOK p.PAGE`

Exemples :
- `LDB p.45`
- `EDO p.128`
- `AA p.67`

### Recherche par source
Permettre de filtrer les entités par code livre, ou par combinaison livre + page.

### Tables concernées
Toutes (métadonnées universelles)

---

## Voir aussi

- [pattern-validation-metadonnees.md](./pattern-validation-metadonnees.md) - Tests de validation complets
- [pattern-relation-textuelle.md](./pattern-relation-textuelle.md) - Références par label
