# Wizard - Effets signe astrologique

## Vue d'ensemble

Application effets signe : modificateurs caractéristiques + talent gratuit.

## Effets

### Modificateurs caractéristiques

Format : Chaîne texte (ex: "+2 Force, -3 Initiative").

Parsing → ajout valeurs caractéristiques.

Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

### Talent gratuit

12 talents possibles : Chanceux, Maître artisan (Au choix), Ferveur ardente, Noctambule, Sixième sens, Résistance (Maladie), Affinité avec les animaux, Volonté de fer, Négociateur, Seconde vue, Magie mineure, Sorcier !

Ajout rang 1 avec origine "Signe astrologique".

Effets talents appliqués automatiquement.

Voir [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

## Application

Séquence :
1. Validation signe sélectionné
2. Application modificateurs caractéristiques
3. Ajout talent si présent
4. Marquer étape validée
5. Attribution +25 XP si aléatoire

Ordre étapes : Espèce + Carrière + Jets AVANT signe.

## Règles métier

Signe non modifiable après validation (mode guidé).

Modificateurs tracés avec origine "Signe astrologique".

Spécialisations talents "Au choix" obligatoires.

## Voir aussi

- [star-selection.md](./star-selection.md)
- [../../database/stars.md](../../database/stars.md)
- [../../database/talents.md](../../database/talents.md)
- [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)
