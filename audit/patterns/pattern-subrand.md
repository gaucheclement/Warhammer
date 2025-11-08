# Pattern: subRand (Sous-catégories aléatoires)

## Contexte
Système de tirage aléatoire à deux niveaux.
Non implémenté actuellement, prévu pour variantes régionales/culturelles.

## Format
Champ `subRand` actuellement toujours vide (`""`).

## Concept

### Tirage à deux niveaux
1. **rand** : Sélectionne entité principale (ex: Humain)
2. **subRand** : Sélectionne variante de l'entité (ex: Reiklander, Middenheimer)

Exemple théorique :
- Tirer "Humain" avec rand
- Puis tirer "Reiklander" avec subRand

## État actuel

### Toujours vide
Dans toutes les tables actuelles, `subRand` vaut `""`.

### Validation
Vérifier que subRand est vide (fonctionnalité non implémentée).

Erreurs possibles :
- `SUBRAND_NOT_IMPLEMENTED` : subRand doit être vide

## Utilisation future possible

### Variantes régionales (Species)
Humain → Reiklander, Middenheimer, Nordlander...
Nain → Karak Azul, Karak Kadrin, Karak Hirn...

### Variantes culturelles (Careers)
Soldat → Infanterie, Cavalerie, Artillerie...
Prêtre → Sigmar, Ulric, Manann...

### Spécialisations (Skills/Talents)
Pourrait remplacer le système specs actuel par un tirage pondéré.

## Avantages théoriques

### Pondération variantes
Certaines variantes plus fréquentes que d'autres.

### Tirage cohérent
Tirage espèce + région en une seule opération.

### Compatibilité backward
Entités sans subRand continuent de fonctionner.

## Inconvénients

### Complexité accrue
Double tirage, gestion de deux niveaux.

### Redondance
Information de variante déjà dans label (ex: "Humain (Reiklander)").

### Maintenance
Synchronisation entre entités et sous-entités.

## Statut actuel
**NON IMPLÉMENTÉ** - Fonctionnalité future potentielle.

Toutes les valeurs `subRand` doivent être `""`.

## Tables concernées
- Species (subRand toujours "")
- Careers (subRand toujours "")
- Potentiellement autres tables à l'avenir

## Voir aussi
- [pattern-generation-aleatoire.md](./pattern-generation-aleatoire.md) - Système rand principal
- [pattern-generation-aleatoire.md](./pattern-generation-aleatoire.md) - Algorithmes de tirage
