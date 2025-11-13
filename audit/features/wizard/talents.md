# Wizard - Talents

## Vue d'ensemble

Étape talents : affichage talents acquis (espèce + carrière + talents auto), résolution spécialisations "Au choix".

## Talents affichés

Sources : Espèce + Carrière niveau 1 + Talents ajoutant autres talents.

Parsing : Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

## Spécialisations

Talents "Au choix" (Béni, Magie Arcanes, Savoirs, etc.) nécessitent choix joueur.

Popup sélection : Liste options disponibles.

Obligatoire avant continuer wizard.

Voir [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md).

## Effets talents

Talents peuvent ajouter automatiquement :
- Compétences (ex: Linguistique → Langue)
- Sorts (ex: Béni Sigmar → 6 bénédictions Sigmar)
- Autres talents (ex: Savoirs Histoire → Lire/Écrire)
- Bonus caractéristiques (ex: Résistant → +5 Endurance/rang)

Voir [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

## Règles métier

Toutes spécialisations "Au choix" doivent être définies avant finaliser.

Effets talents appliqués automatiquement.

Rangs multiples possibles (si acquis plusieurs fois via origines différentes).

## Voir aussi

- [../../database/talents.md](../../database/talents.md)
- [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
- [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)
