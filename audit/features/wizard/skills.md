# Wizard - Compétences

## Vue d'ensemble

Étape compétences : affichage compétences acquises (espèce + carrière + talents), résolution spécialisations "Au choix".

## Compétences affichées

Liste complète compétences :
- Base : Toutes compétences base (avec 0 avances si non acquises)
- Groupées : Compétences avec spécialisations
- Avancées : Compétences avancées

Sources : Espèce + Carrière niveau 1 + Talents.

Parsing : Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

## Spécialisations

Compétences "Au choix" (Langue, Métier, Savoirs, etc.) nécessitent choix joueur.

Popup sélection : Liste options disponibles ou saisie libre.

Obligatoire avant continuer wizard.

Voir [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md).

## Calcul valeurs

Valeur base = Valeur caractéristique liée.

Exemples : Athlétisme → Agilité, Calme → Force Mentale.

Total = Base + Avances.

Voir [../character-model/character-calculations.md](../character-model/character-calculations.md).

## Règles métier

Toutes spécialisations "Au choix" doivent être définies avant finaliser.

Compétences acquises via talents ajoutées automatiquement.

Liste complète (base + acquises) affichée pour info.

## Voir aussi

- [../../database/skills.md](../../database/skills.md)
- [../../patterns/pattern-specialisations.md](../../patterns/pattern-specialisations.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
- [../character-model/character-calculations.md](../character-model/character-calculations.md)
