# Help System - Système d'aide

## Vue d'ensemble

Système aide contextuelle : descriptions riches, références livres, navigation bidirectionnelle, index global, relations inverses.

## Descriptions riches

Format HTML : Balises b/i/u/br/p/ul/ol/li, inline CSS.

Contenu : Règles métier, effets mécaniques, exemples usage, cas spéciaux.

Affichage : Popup modale ou panneau contextuel, clic élément ou survol.

## Références livres

Format : Book (source), Page (numéro).

Sources : LDB (Livre De Base), SOC (Shades of Empire), AA (Archives of the Empire), etc.

Affichage : "Source: LDB p.54" cliquable.

## Navigation bidirectionnelle

Liens : Élément → Éléments liés (skills → talents, talents → skills, etc.).

Types relations : Compétences ↔ Talents, Talents ↔ Sorts, Carrières ↔ Compétences/Talents, Espèces ↔ Compétences/Talents.

Affichage : Liste cliquable éléments liés, navigation rapide contexte.

## Relations inverses

Principle : Élément référencé montre "où utilisé".

Exemples : Talent montre carrières/espèces qui l'incluent, Compétence montre carrières qui l'enseignent, Sort montre talents requis.

Calcul : Parcours toutes tables, détection références, agrégation.

## Index global

Organisation : Alphabétique, par catégorie (Caractéristiques, Compétences, Talents, Sorts, Carrières, Espèces, Équipement).

Recherche : Filtre texte, recherche partielle, suggestions.

Affichage : Liste résultats, clic → détails élément.

## Voir aussi

- [../../database/](../../database/)
- [../../patterns/pattern-descriptions-html.md](../../patterns/pattern-descriptions-html.md)
