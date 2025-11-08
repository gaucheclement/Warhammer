# Wizard Talents - Sélection talents "X aléatoire"

## Vue d'ensemble

Gestion "X aléatoire" dans espèce/carrière. Génère N talents parmi pool éligible, propose relance ou sélection manuelle.

## Format

**Pattern**: "N Talent aléatoire" où N = 1-5

**Exemples**: "3 Talent aléatoire" (Humains), "2 Talent aléatoire", "1 Talent aléatoire"

**Voir**: [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)

## Sources

**Raciaux**: `species.talents` - Ex: Humains "...3 Talent aléatoire"

**Carrière**: `careerLevel.talents` (rare)

## Algorithme génération

### Pool éligibles

**Inclusion**: Tous talents talents.json

**Exclusions**:
1. Talents possédés (espèce, signe, carrière)
2. Max=1 atteints
3. Pré-requis non satisfaits
4. Spécifiques création (si marqués)

**Voir**: [talents-prerequisites.md](./talents-prerequisites.md)

### Tirage

1. Construction pool (après exclusions)
2. Tirage N sans répétition
3. Vérification unicité
4. Retour liste

**Cas limite**: Si pool < N, tirer max possible, message "Seulement X disponibles"

## Interface

### Affichage initial

**Génération auto**: Tirage immédiat au chargement

**Présentation**: Liste N talents (nom, description, effets)

**Indicateur**: Badge "Aléatoire"

### Options

**A: Accepter** - Bouton "Valider" → Ajout personnage

**B: Relance individuelle** - Bouton "Relancer" par talent → Nouveau tirage 1

**C: Relance globale** - "Relancer tout" → Nouveau tirage N complets

**D: Sélection manuelle** - "Choisir manuellement" → Interface sélection pool

**Limites**: Relances illimitées avant validation étape

## Exemples

### Humain - "3 Talent aléatoire"

**Tirage initial**: Chanceux, Athlétisme naturel, Résistance (Maladie)

**Relance talent 2**: Nouveau "Acuité auditive"

**Final**: Chanceux, Acuité auditive, Résistance (Maladie) → Validation

### Nain - "1 Talent aléatoire"

**Tirage**: "Bagarreur"

**Acceptation**: Ajout direct

## Interactions

### Avec spécialisations

Tirage "Résistance (Au choix)" → Après validation, sous-interface spé

**Voir**: [talents-specialization.md](./talents-specialization.md)

### Avec rangs multiples

Tiré déjà possédé mais max > rang actuel → Inclus pool, acquisition ajoute rang suivant

**Voir**: [talents-ranks.md](./talents-ranks.md)

### Avec effets

Talents effets appliqués à validation. Ex: "Affable" (+5 Soc) recalcule

**Voir**: [talents-effects.md](./talents-effects.md)

## Sélection manuelle alternative

**Déclenchement**: Clic "Choisir manuellement"

**Affichage**: Liste pool éligible (filtré)

**Sélection**: Checkboxes, max N

**Validation**: "Confirmer" actif si exactement N cochés

**Avantages aléatoire**: Rapide, découverte

**Avantages manuel**: Contrôle, optimisation, cohérence

## Workflow

### Phase 1: Parsing

1. Détection "N Talent aléatoire"
2. Extraction N
3. Enregistrement type aléatoire avec quantité N

### Phase 2: Pool

1. Récupération talents.json
2. Exclusions (possédés, max, pré-requis)
3. Constitution pool

### Phase 3: Tirage

1. Tirage N sans répétition
2. Stockage talents tirés avec source aléatoire marquée
3. Affichage interface

### Phase 4: Interaction

1. Attente action (accepter, relancer, manuel)
2. Si relance: retour phase 3
3. Si manuel: interface sélection
4. Si accepter: phase 5

### Phase 5: Validation

1. Vérification N exact
2. Vérification spés si requises
3. Application personnage
4. Effets
5. Verrouillage

## Voir aussi

- [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)
- [talents.md](../../database/talents.md)
- [talents-prerequisites.md](./talents-prerequisites.md), [talents-specialization.md](./talents-specialization.md)
- [talents-effects.md](./talents-effects.md)
