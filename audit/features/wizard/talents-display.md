# Wizard Talents - Affichage talents espèce et carrière

## Vue d'ensemble

Étape wizard affichant talents acquis via espèce, signe astrologique et niveau 1 carrière. Regroupe par source, distingue possédés des choix requis.

## Sources de talents

### Talents raciaux

**Origine**: `species.talents`, parsing [pattern-parsing.md](../../patterns/pattern-parsing.md)

**Exemples**:
- Humains: "Perspicace ou Affable, Destinée, 3 Talent aléatoire"
- Nains: "Costaud, Déterminé ou Obstiné, Lire/Écrire ou Impitoyable"

**Voir**: [species.md](../../database/species.md)

### Talent astrologique

**Origine**: `stars.talent` (1 max, peut être vide)

**Exemples**: "Chanceux", "Maître artisan (Au choix)", "Ferveur ardente"

**Voir**: [stars.md](../../database/stars.md)

### Talents carrière niveau 1

**Origine**: `careerLevel.talents` niveau 1 (4 talents)

**Exemples**:
- Pamphlétaire: "Baratiner, Faire la manche, Lire/Écrire, Sociable"
- Apprenti: "Ambidextre ou Maître artisan, Méticuleux, Résistance (Au choix)"

**Voir**: [careerLevels.md](../../database/careerLevels.md)

## Organisation affichage

### Regroupement

3 sections: Talents raciaux, Talent astrologique, Talents carrière

Objectif: clarifier origine

### Information affichée

**Minimal**: Nom, spécialisation, source

**Enrichi**: Description, rangs max, effets

## Statuts

### Acquis automatiquement

Talents simples sans choix. Ex: "Costaud", "Destinée", "Baratiner"

Affichage: Marqués ✓ ou grisés

### Nécessitant action

**Types**:
1. Choix exclusifs: "Perspicace ou Affable"
2. Spécialisations: "Résistance (Au choix)"
3. Aléatoires: "3 Talent aléatoire"

Affichage: Liste "À choisir", indicateurs

**Voir**: [talents-choice.md](./talents-choice.md), [talents-specialization.md](./talents-specialization.md), [talents-random.md](./talents-random.md)

## Parsing

### Processus

1. Récupération chaînes 3 sources
2. Parsing [pattern-parsing.md](../../patterns/pattern-parsing.md): virgules, "ou", parenthèses, quantités
3. Classification: automatiques vs interactions
4. Attribution: direct ou attente

**Voir**: [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md)

## Exemples

### Nain Artisan

**Raciaux**: ✓ Costaud, ? Déterminé OU Obstiné, ? Lire/Écrire OU Impitoyable, ✓ Résistance magie, ✓ Vision nocturne

**Astrologique**: ? Maître artisan (Au choix)

**Carrière**: ? Ambidextre OU Maître artisan, ✓ Méticuleux, ? Résistance (Au choix)

**Total**: 5 acquis, 4 choix requis

### Humain Agitateur

**Raciaux**: ? Perspicace OU Affable, ✓ Destinée, ? 3 aléatoires

**Astrologique**: ✓ Chanceux

**Carrière**: ✓ Baratiner, ✓ Faire la manche, ✓ Lire/Écrire, ✓ Sociable

**Total**: 7 acquis, 4 interactions

## Cas particuliers

### Doublons

Même talent espèce + carrière (ex: "Lire/Écrire" 2×)

**Résolution**:
- Max 1: déduplication, marqué acquis espèce
- Rangs multiples: cumul, 2 rangs

**Voir**: [talents-ranks.md](./talents-ranks.md)

### Effets immédiats

Talents modifiant caractéristiques/compétences appliqués automatiquement

Ex: "Affable" (+5 Soc), "Maître artisan" (ajoute Métier)

**Voir**: [talents-effects.md](./talents-effects.md)

### Pré-requis

Vérification avant affichage, blocage si non respecté

Ex: "Flagellant" ajoute "Frénésie"

**Voir**: [talents-prerequisites.md](./talents-prerequisites.md)

## Workflow

### Affichage initial

1. Parsing 3 sources
2. Classification acquis/à choisir
3. Affichage sections

### Interactions

**Choix**: Affichage options → Sélection → Validation → Attribution

**Aléatoires**: Génération → Proposition → Acceptation/relance → Attribution

### Validation étape

**Critères**: Tous choix résolus, spécialisations sélectionnées, aléatoires validés

**Blocage**: Si actions en attente

## Relations étapes wizard

### Dépendances amont

- Species: Talents raciaux
- Stars: Talent astrologique
- Careers: Talents niveau 1

### Impact aval

- Caractéristiques: Recalcul si modificateurs
- Skills: Talents ajoutant compétences
- Effets: Application finale

## Voir aussi

- [species.md](../../database/species.md), [stars.md](../../database/stars.md), [careerLevels.md](../../database/careerLevels.md)
- [talents.md](../../database/talents.md), [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md)
- [talents-choice.md](./talents-choice.md), [talents-random.md](./talents-random.md), [talents-specialization.md](./talents-specialization.md)
- [talents-ranks.md](./talents-ranks.md), [talents-effects.md](./talents-effects.md), [talents-prerequisites.md](./talents-prerequisites.md)
