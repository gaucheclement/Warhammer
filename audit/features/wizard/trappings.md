# Wizard - Équipement initial

## Vue d'ensemble

Étape "Possessions" : équipement départ (classe sociale + carrière), résolution choix multiples, calcul encombrement.

## Sources

Trappings classe (table Classes) + Trappings carrière niveau 1 (table CareerLevels).

Cumul niveau 1 = classe + carrière. Pas dédoublonnage (doublons possibles).

Niveaux 2-4 : uniquement trappings propres, pas héritage.

Voir [../../business-rules/accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md).

## Format entrées

Format CSV : "Item1, Item2, 3 Item3".

Quantités : Nombre avant nom (ex: "2 CO", "10 Clous").

Choix multiples : "Item1 ou Item2" → joueur choisit.

Choix imbriqués : Parenthèses sous-groupes (ex: "Armure légère (Cuir ou Mailles)").

Parsing : Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

## Résolution objets

Recherche label exact table Trappings → type, enc, prix, desc.

Si non trouvé → objet générique sans détails.

Argent (CO/PA/SB) : Converti monnaie (1 CO = 20 PA = 240 SB).

## Sélection choix multiples

Si "ou" présent → popup choix joueur.

Sélection enregistrée. Choix non modifiable après validation.

## Encombrement

Calcul temps réel : Σ(quantité × enc unitaire).

Limite = BF + BE.

Avertissement si > limite (état Encombré, malus).

Voir [../character-model/character-calculations.md](../character-model/character-calculations.md).

## Règles métier

Équipement obligatoire pour finaliser personnage.

Choix multiples doivent être résolus avant continuer.

Pas limite encombrement création (avertissement uniquement).

## Voir aussi

- [../../database/trappings.md](../../database/trappings.md)
- [../../database/classes.md](../../database/classes.md)
- [../../database/career-levels.md](../../database/career-levels.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
- [../character-model/character-calculations.md](../character-model/character-calculations.md)
