# Pattern: book + page (Références bibliographiques)

## Contexte
Traçabilité des sources dans les livres de règles officiels.
Permet de retrouver l'origine de chaque donnée.

## Format
Chaque entité possède deux champs :
- `book` : Code du livre (2-10 caractères)
- `page` : Numéro de page (1-999)

## Codes de livres courants

### Livres principaux
- `LDB` - Livre de Base
- `EDO` - Ennemis dans l'Ombre
- `AA` - Mort sur le Reik / Archives des Magnus
- `ADE3` - Archives de l'Empire vol. 3

### Suppléments
- `SOC` - Sombre Obscurité à Comédiennes
- `UP` - Un Peuple Sans Pareil (Nains)
- `ZE` - Zenithar Edition (Elfes)

### Extensions régionales
- `MIDDENHEIM` - Guide de Middenheim
- `ALTDORF` - Guide d'Altdorf

## Validation

### Champ book
Vérifier que le code livre est présent, non vide, et a une longueur entre 2 et 10 caractères.

Erreurs possibles :
- `BOOK_MISSING` : Source manquante
- `BOOK_LENGTH` : Code livre invalide

### Champ page
Vérifier que le numéro de page est présent, non nul, de type entier, et dans la plage 1-999.

Erreurs possibles :
- `PAGE_MISSING` : Numéro de page manquant
- `PAGE_TYPE` : Page doit être un entier
- `PAGE_RANGE` : Page hors limites

### Cohérence livre-page
Pour chaque livre, calculer la plage de pages utilisées (min-max).
Avertir si la page maximum dépasse 500 (inhabituellement élevé).

## Affichage
Format standard : `BOOK p.PAGE`

Exemples :
- `LDB p.45`
- `EDO p.128`
- `AA p.67`

## Recherche par source
Permettre de filtrer les entités par code livre, ou par combinaison livre + page.

## Tables concernées
Toutes (métadonnées universelles)

## Voir aussi
- [pattern-index.md](./pattern-index.md) - Identifiant index
- [pattern-label.md](./pattern-label.md) - Identifiant label
