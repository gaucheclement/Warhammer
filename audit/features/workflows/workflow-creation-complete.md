# Workflow Complet: Création de Personnage

## Vue d'ensemble

Parcours complet de création d'un personnage Warhammer via le wizard multi-étapes, de la sélection d'espèce jusqu'à la validation finale.

**Objectif métier**: Créer un personnage viable niveau 1 Bronze avec toutes ses caractéristiques, compétences, talents et équipement de départ.

**Durée estimée**: 15-30 minutes selon familiarité joueur.

## Architecture du wizard

### Étapes séquentielles

Le wizard suit un ordre linéaire strict avec possibilité de retour arrière:

1. **Species** (Espèce): Choix espèce et variante régionale → Voir [wizard/species.md](../wizard/species.md)
2. **Career** (Carrière): Choix carrière niveau 1 Bronze → Voir [wizard/career.md](../wizard/career.md)
3. **Characteristics** (Caractéristiques): Génération/saisie caractéristiques + répartition 5 points carrière → Voir [wizard/characteristics.md](../wizard/characteristics.md)
4. **Skills** (Compétences): Répartition 3×+5, 3×+3 espèce + 40 points carrière → Voir [wizard/skills.md](../wizard/skills.md)
5. **Talents** (Talents): Sélection talents espèce (tous + choix + aléatoires) + signe + carrière → Voir [wizard/talents.md](../wizard/talents.md)
6. **Star** (Signe Astrologique): Choix signe (optionnel) → Voir [wizard/star-selection.md](../wizard/star-selection.md)
7. **Details** (Détails): Nom, âge, taille, yeux, cheveux → Voir [wizard/details.md](../wizard/details.md)
8. **Trappings** (Équipement): Équipement de départ → Voir [wizard/trappings.md](../wizard/trappings.md)
9. **Resume** (Résumé): Validation finale → Voir [wizard/resume-validation.md](../wizard/resume-validation.md)

### Navigation

**Progression**: Bouton "Valider" → étape suivante.

**Retour arrière**: Possible à tout moment sans perte données.

**Saut impossible**: Progression séquentielle obligatoire.

**Sauvegarde**: Uniquement après validation finale (pas de sauvegarde intermédiaire).

### Gestion des bonus XP

**Sources de bonus**:
- Species: +20 XP si tirage aléatoire accepté
- Career: +50 XP tirage 1, +25 XP tirage 2, +0 XP choix manuel
- Characteristics: +50 XP première génération, +25 XP réassignation, +0 XP relance/manuel
- Star: +20 XP tirage 1, +10 XP tirage 2, +0 XP choix manuel

**Total possible**: 0-120 XP bonus création.

## Résumé des règles de création

### Caractéristiques

**Base espèce**: Valeurs fixes par espèce (ex: Humain 20 partout, Nain E30/FM40).

**Variable**: Tirage 2d10 (aléatoire avec bonus XP) OU saisie manuelle 100 points (sans bonus).

**Carrière**: 5 points à distribuer entre les 3 caractéristiques listées niveau 1.

**Total**: Base + Variable + Avances carrière.

**Voir**: [wizard/characteristics.md](../wizard/characteristics.md)

### Compétences

**Espèce**:
- Choisir 3 compétences différentes à +5 augmentations
- Choisir 3 compétences différentes à +3 augmentations
- Parmi la liste des compétences raciales

**Carrière**:
- 40 points à distribuer parmi les 8-10 compétences niveau 1
- Maximum 10 points par compétence

**Cumul**: Avances espèce + avances carrière s'additionnent.

**Valeur finale**: Caractéristique liée + Avances totales.

**Voir**: [wizard/skills.md](../wizard/skills.md)

### Talents

**Espèce**:
- Tous les talents de la race
- Format parsing voir [pattern-parsing.md](../../patterns/pattern-parsing.md)
- Talents aléatoires voir [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)

**Carrière**: 4 talents niveau 1.

**Signe**: 0-1 talent astrologique (optionnel).

**Effets**: Voir [talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

**Voir**: [wizard/talents.md](../wizard/talents.md)

### Trappings

**Sources**: Classe sociale + niveau 1 carrière.

**Format parsing**: Voir [pattern-parsing.md](../../patterns/pattern-parsing.md).

**Voir**: [wizard/trappings.md](../wizard/trappings.md)

## Modes de sélection

### Mode Aléatoire (avec bonus XP)

**Species**: Tirage 1-100 → accepter = +20 XP.

**Career**: Tirage 1 (+50 XP), tirage 2 (+25 XP), tirage 3 (0 XP).

**Characteristics**: Génération 2d10 → accepter = +50 XP, réassigner = +25 XP, relancer = 0 XP.

**Star**: Tirage 1 (+20 XP), tirage 2 (+10 XP), choix manuel (0 XP).

**Total possible**: 120 XP maximum.

### Mode Manuel (sans bonus)

**Species**: Bouton "Choisir" → liste complète → aucun bonus.

**Career**: Bouton "Choisir" → toutes carrières accessibles → aucun bonus.

**Characteristics**: Bouton "Choisir" → 100 points distribués → aucun bonus.

**Star**: Bouton "Choisir" → liste complète → aucun bonus.

**Total**: 0 XP bonus.

### Mode Free (MJ)

Toutes restrictions levées, toutes carrières accessibles (même incompatibles espèce), pas de validation bloquante.

Utilisé pour tests et personnages hors règles standards.

## Validation finale

### Étape Resume

**Affichage**: Récapitulatif complet personnage (caractéristiques, skills, talents, équipement).

**Vérifications**: Toutes étapes complètes, aucun choix en suspens, spécialisations définies, valeurs cohérentes.

**Calculs finaux**: Points de Blessure, Mouvement, encombrement, XP total.

**Actions**: Valider (sauvegarde définitive), Retour (modifications), Exporter (JSON/PDF).

**Voir**: [wizard/resume-validation.md](../wizard/resume-validation.md), [wizard/resume-save.md](../wizard/resume-save.md), [wizard/resume-export.md](../wizard/resume-export.md)

## Attributs dérivés

**Calculés automatiquement**:

- **Bonus**: Caractéristique ÷ 10 (division entière)
- **Points de Blessure**: Voir formules par espèce dans [resume-derived.md](../wizard/resume-derived.md)
- **Mouvement**: Valeur fixe selon espèce, voir [resume-derived.md](../wizard/resume-derived.md)
- **Destin/Résolution**: Base espèce + modificateurs, voir [resume-derived.md](../wizard/resume-derived.md)
- **Fortune**: Via talent Chanceux uniquement

**Voir**: [wizard/resume-derived.md](../wizard/resume-derived.md)

## Exemples complets

Voir [exemples-personnages-types.md](../exemples-personnages-types.md) pour archétypes complets avec toutes étapes détaillées.

## Règles métier transversales

**Parsing données**: [parsing-wizard-data.md](../../business-rules/parsing-wizard-data.md)

**Spécialisations**: [specialisations-skills-talents.md](../../business-rules/specialisations-skills-talents.md)

**Choix exclusifs "ou"**: [conventions-et-regles-implicites.md](../../business-rules/conventions-et-regles-implicites.md)

**Génération aléatoire**: [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md), [filtrage-rand-system.md](../../business-rules/filtrage-rand-system.md)

**Application effets talents**: [talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)

**Accumulation avantages**: [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md)

**Calculs XP progression**: [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md)

## Références database

**Tables principales**: [species.md](../../database/species.md), [careers.md](../../database/careers.md), [careerLevels.md](../../database/careerLevels.md), [characteristics.md](../../database/characteristics.md), [skills.md](../../database/skills.md), [talents.md](../../database/talents.md), [stars.md](../../database/stars.md), [trappings.md](../../database/trappings.md)

**Tables support**: [classes.md](../../database/classes.md), [details.md](../../database/details.md), [qualities.md](../../database/qualities.md)
