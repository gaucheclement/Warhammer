# Wizard - Caractéristiques

## Vue d'ensemble

Étape caractéristiques : tirage bonus 2d10 pour chaque caractéristique principale.

## Tirage

10 caractéristiques principales : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc.

Tirage 2d10 par caractéristique : bonus +0 à +20 (moyenne ~11).

Reproductibilité : Seeds conservés dans randomState.

Voir [../character-model/random-state.md](../character-model/random-state.md).

## Calcul valeurs

Valeur initiale = Base espèce + Roll 2d10 + Bonus signe astral + Bonus talents.

Exemple : Humain CC = 30 (espèce) + 12 (roll) + 0 (signe) + 0 (talents) = 42.

Voir [../character-model/character-calculations.md](../character-model/character-calculations.md).

## Affichage

Tableau : Nom, Valeur initiale, Bonus.

Bonus = Valeur ÷ 10 arrondi bas.

## Règles métier

Tirages automatiques au chargement étape.

Reproductibilité garantie via seeds (même seed → même résultat).

Pas modification manuelle rolls (sauf impositions debug).

## Voir aussi

- [../../database/characteristics.md](../../database/characteristics.md)
- [../character-model/character-calculations.md](../character-model/character-calculations.md)
- [../character-model/random-state.md](../character-model/random-state.md)
