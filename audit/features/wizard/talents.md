# Wizard - Talents

## Vue d'ensemble

Gestion complète talents wizard création: acquisition espèce/signe/carrière, choix exclusifs, tirages aléatoires, spécialisations, rangs multiples, validation pré-requis, effets automatiques.

**Sources**: `species.talents`, `stars.talent`, `careerLevel.talents` niveau 1
**Organisation**: 3 sections (raciaux, astrologique, carrière)

## Talents d'espèce

**Origine**: `species.talents`, parsing [pattern-parsing.md](../../patterns/pattern-parsing.md)

**Types**: Automatiques (acquis direct), Choix (sélection 1/" ou "), Aléatoires (génération pool)

**Exemples**: Humains "Perspicace ou Affable, Destinée, 3 Talent aléatoire", Nains "Costaud, Déterminé ou Obstiné"

## Talents de carrière

**Origine**: `careerLevel.talents` niveau 1 (4 talents), ~30% carrières ont ≥1 choix

**Exemples**: Pamphlétaire "Baratiner, Lire/Écrire, Sociable", Apprenti "Ambidextre ou Maître artisan, Résistance (Au choix)"

**Talent astrologique**: `stars.talent` (0-1), Ex: "Chanceux", "Maître artisan (Au choix)"

## Gestion des choix

### Choix exclusifs " ou "

**Pattern**: Séparateur " ou " → Options mutuellement exclusives, exactement 1 sélection obligatoire

**Exemples**: "Perspicace ou Affable", "Déterminé ou Obstiné"

**Interface**: Radio buttons, nom/description/effets, état visuel (fond coloré, ✓), verrouillage post-validation

**Workflow**: Parsing " ou " → Options → Affichage → Sélection → Vérif pré-requis → Validation → Effets

### Talents aléatoires

**Pattern**: "N Talent aléatoire" (N=1-5), Ex: "3 Talent aléatoire" Humains

**Pool**: Tous talents - Possédés - max=1 atteints - pré-requis KO

**Algorithme**: Pool filtré → Tirage N sans répétition → Présentation

**Options**: Accepter (validation), Relance individuelle (1 talent), Relance globale (N complets), Manuel (checkboxes max N)

**Workflow**: Parsing "N Talent aléatoire" → Pool → Tirage → Interface → Accepter/Relancer/Manuel → Validation

## Spécialisations

**Types**: Fermée (`specs` valeurs→dropdown), Ouverte (`specs` "(Au choix)"→texte libre), Sans (`specs` vide)

**Catégories**: Art (Peinture, Sculpture), Terrain (Littoral, Déserts), Divins (Sigmar, Ulric), Résistances (Maladie, Poison)

**Interface**: Fermée (valeur EXACTE specs), Ouverte (≥1 car, max 50)

**Format**: "Talent (Spé)", Ex: "Artiste (Peinture)", "Résistance (Maladie)"

**Déclenchement**: Après sélection talent, sous-interface si `specs` rempli

## Rangs multiples

**Types**: Unique (max=1), Fixes (max=nombre), Dynamiques (max=formule Bonus carac), Illimités (max="Aucun")

**Formules**: Bonus = floor(carac/10), Ex: "Artiste" max Bonus Dex, "Chanceux" max Bonus Chance

**Création**: Rang 1 uniquement, sauf doublons espèce+carrière → Cumul

**Affichage**: "Talent (Rang 1)" ou "1/3", badge "×2"

**Doublons**: Max=1 (dédup 1 affiché), Rangs multiples (cumul "Rang 2" ou "2/X")

**Spécialisations**: Spés différentes = rangs distincts, total ≤ max global

**Cumul effets**: Additif (bonus × rangs), Progressif (amélioration/rang), Seuil (déblocage/rang)

## Affichage

**Regroupement**: 3 sections (Raciaux, Astrologique, Carrière)

**Informations**: Minimal (nom, spé, source), Enrichi (description, rangs max, effets)

**Statuts**: Acquis (✓ grisés), Action requise (liste "À choisir")

**Exemple Nain Artisan**: Raciaux (✓ Costaud, ? Déterminé OU Obstiné, ? Lire/Écrire OU Impitoyable, ✓ Résistance magie), Astrologique (? Maître artisan Au choix), Carrière (? Ambidextre OU Maître artisan, ✓ Méticuleux, ? Résistance Au choix) → 5 acquis, 4 choix

**Validation**: Blocage si choix non résolus, spécialisations manquantes, aléatoires non validés

## Validation pré-requis

**Types**: Caractéristiques (seuil), Talents (possédé), Compétences (rare création), Exclusions (incompatibilités)

**Application**: Aléatoires (exclusion pool KO), Choix (options grisées tooltip)

**Messages**: "[Talent] nécessite [Pré-requis]", Ex: "Magie Arcanes nécessite FM ≥ 35"

**Recalcul dynamique**: Sélection/effets → Modifs → Recalcul carac → Re-vérif → MAJ UI

**Workflow**: Chargement pré-requis → Éval personnage (carac, talents, skills) → Vérif conditions → Filtrage

## Application effets

**Types**:
- **addCharacteristic**: PB (+Bonus End×rangs), Mvt/Chance/Dét/Corr (+1×rangs), Autres (+5×rangs). Ex: "Affable" +5 Soc
- **addSkill**: Simple "Calme", Spé fixe "Art (Peinture)", Spé choix héritage. Ex: "Artiste (Peinture)" → "Art (Peinture)"
- **addMagic**: Béni/mineure/Arcanes/Chaos/Invocation. "Béni (Sigmar)" → Auto bénédictions Sigmar
- **addTalent**: Talent secondaire liste achetables. Ex: "Flagellant" → "Frénésie" liste

**Ordre**: addCharacteristic → addMagic → addSkill → addTalent → Recalcul dérivées (PB, Mvt, Bonus)

**Déclenchement**: Automatiques (post-parsing), Choix (post-sélection), Aléatoires (post-acceptation), Spés (post-spé)

**Formule création**: Total = base + star + talent, Bonus = floor(Total/10)

**Cumul**: Rangs multiples (effets×rangs), Talents différents (bonus additionnent)

## Exemples concrets

**Humain "Perspicace ou Affable"**: Parsing " ou " → Options A/B → Radio buttons descriptions → Joueur "Affable" → Validation → addCharacteristic="Sociabilité" +5 → Soc 25+5=30 Bonus 3

**Humain "3 Talent aléatoire"**: Parsing N=3 → Pool (tous - possédés - max=1 - pré-requis) → Tirage "Chanceux, Athlétisme naturel, Résistance (Maladie)" → Interface (Accepter/Relancer/Manuel) → Relance talent 2 "Acuité auditive" → Validation "Chanceux, Acuité auditive, Résistance (Maladie)" → Effets appliqués

**Nain "Artiste (Peinture)"**: Choix "Ambidextre ou Maître artisan" + Signe "Maître artisan (Au choix)" → Spé texte+suggestions → Saisie "Peinture" → Validation "Maître artisan (Peinture)" → addSkill="Art (Au choix)" héritage → "Art (Peinture)" origine talent

**Nain doublons "Lire/Écrire"**: Racial "Lire/Écrire ou Impitoyable" sélection "Lire/Écrire" + Carrière "Lire/Écrire" → Max >1 cumul 2 rangs → "Lire/Écrire (Rang 2)"

## Voir aussi

- [species.md](../../database/species.md), [stars.md](../../database/stars.md), [careerLevels.md](../../database/careerLevels.md)
- [talents.md](../../database/talents.md), [parsing-wizard-data.md](../../business-rules/parsing-wizard-data.md)
- [pattern-parsing.md](../../patterns/pattern-parsing.md), [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md)
- [talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)
- [application-effets-talents.md](../../business-rules/application-effets-talents.md)
