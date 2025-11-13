# Wizard - Sélection Espèce

## Vue d'ensemble

Première étape wizard : choix espèce et variante régionale.

Détermine : caractéristiques base, compétences/talents raciaux, carrières, PB, mouvement.

## Modes sélection

**Choisir** : Sélection manuelle, pas bonus XP.

**Lancer** : Tirage aléatoire 1-100, +20 XP si accepté sans relance.

**Mode Free** : Sélection directe sans contraintes.

## Génération aléatoire

Distribution : Humain 90%, Nain 7%, Haut Elfe 2%, Elfe Sylvain 1%.

Voir [../../patterns/pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md).

Si plusieurs variantes même résultat → choix joueur.

Bonus XP : +20 uniquement si acceptation premier tirage sans relance.

## Sélection région (Humains)

Régions disponibles : Reikland (défaut), Middenheim, Middenland, Nordland.

Région modifie probabilités carrières (ex: Prêtre Ulric favorisé Middenheim).

Optionnel (omis = probabilités standard).

## Application

Espèce choisie → application :
- Caractéristiques base (ex: Humain CC=30, Nain E=40)
- Compétences raciales (parsing, ajout origines)
- Talents raciaux (parsing, ajout origines)
- Mouvement base (Humain 4, Nain 3, Elfe 5, Halfling 3)
- Formule PB selon espèce

Voir [../../database/species.md](../../database/species.md) et [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

## Règles métier

Espèce obligatoire pour continuer wizard.

Choix espèce débloque carrières compatibles.

Variante régionale (Humains) impacte distribution carrières.

## Voir aussi

- [../../database/species.md](../../database/species.md)
- [career.md](./career.md)
- [../../patterns/pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
