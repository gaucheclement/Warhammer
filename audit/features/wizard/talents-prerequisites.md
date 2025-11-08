# Wizard Talents - Validation pré-requis talents

## Vue d'ensemble

Validation pré-requis avant acquisition/affichage talents. Blocage talents incompatibles, messages erreur explicites.

## Types pré-requis

**Autres talents**: Talent nécessite autre possédé. Ex: aptitude magique. Vérif: lookup talents actuels

**Caractéristiques**: Seuil requis. Ex: FM ≥ 35. Vérif: carac (base espèce + signe) vs seuil

**Compétences**: Compétence requise (rare création). Ex: talent avancé. Vérif: lookup skills

**Exclusions**: Incompatibilités. Ex: "Béni" + "Magie Arcanes" (hypothétique). Vérif: conflits définis (peu fréquent)

## Application wizard création

### Étape talents

**Contexte**: Affichage/sélection talents espèce + signe + carrière

**Pré-requis vérifiés**:
1. Caractéristiques (espèce base + signe modifs)
2. Talents déjà attribués étape actuelle
3. Compétences raciales (rare)

**Pré-requis NON vérifiés**: Compétences carrière avancées (étape ultérieure)

### Talents aléatoires - Pool filtrage

**Exclusion pool**: Talents pré-requis non satisfaits exclus génération

**Process**:
1. Liste tous talents
2. Filtre pré-requis OK
3. Filtre déjà possédés (si max=1)
4. Pool final tirage

**Voir**: [talents-random.md](./talents-random.md)

### Talents choix - Options désactivées

**UI**: Options invalides grisées, tooltip explicatif

**Exemple**: "Magie des Arcanes ou Chanceux" avec FM < 35 → "Magie" grisé

**Voir**: [talents-choice.md](./talents-choice.md)

## Validation messages

### Structure message

**Format**: "[Talent] nécessite [Pré-requis]"

**Exemples**:
- "Magie des Arcanes nécessite Force Mentale ≥ 35"
- "Flagellant nécessite talent Frénésie"
- "Érudit nécessite compétence Lire/Écrire"

### Affichage

**Tooltip survol**: Option grisée affiche pré-requis manquant

**Modal détails** (optionnel): Clic talent affiche tous pré-requis

**Liste pré-requis**: Section talent détails listant conditions

## Exemples

**Magie Arcanes (FM ≥35)**: Elfe FM 30 + signe +2 = 32 → BLOQUÉ. Message: "Nécessite FM ≥35 (vous: 32)". UI grisée

**Chanceux**: Aucun pré-requis → Toujours accessible

**Béni vs Magie** (hypothétique): Si "Béni" acquis → "Magie Arcanes" bloqué. Message: "Incompatible avec Béni"

## Vérifications

**Caractéristiques**: Source: base espèce + signe modifs + talents. Calcul somme. Comparaison ≥ seuil

**Talents**: Liste possédés (espèce + signe + carrière). Vérif label IN liste. Spé: vérifier talent+spé exact

**Compétences**: Liste raciales. Vérif label IN skills. Rare création (plupart Step Skills)

**Exclusions**: Table/règles hardcodées. Vérif NOT(conflictuel IN possédés)

## Recalcul dynamique

### Déclencheurs

**Sélection choix**: Sélection "ou" peut débloquer/bloquer autres

**Talents effets**: Talent modifiant carac peut débloquer suivants

**Spécialisations**: Choix spé peut affecter pré-requis

### Process

1. Application effets talent sélectionné (addCharacteristic, addTalent)
2. Recalcul caractéristiques
3. Re-vérification pré-requis talents restants
4. Mise à jour UI (activation/désactivation options)

## Cas particuliers

**Circulaires**: A nécessite B, B nécessite A → ERREUR données. Détection validation amont. Blocage les 2

**Talent futur**: Niveau 1 nécessite niveau 2 → Erreur logique. Blocage, correction données

**Multiples**: A ET Carac X ET Compétence Z → Tous doivent passer (AND). Message liste manquants

## Workflow

### Phase 1: Chargement pré-requis

1. Récupération pré-requis talents (table talents, champs dédiés si existent)
2. Parsing conditions
3. Enregistrement talent avec label et liste pré-requis associés

### Phase 2: Évaluation personnage

1. Calcul caractéristiques actuelles (base + modifs)
2. Liste talents possédés
3. Liste compétences possédées
4. État personnage complet

### Phase 3: Vérification

Pour chaque talent:
1. Récupération pré-requis définis
2. Évaluation conditions comparées état personnage
3. Détermination accessible ou non accessible
4. Si non accessible: création message explicatif

### Phase 4: Application

**Affichage**: Filtrage options UI selon résultat

**Pool aléatoire**: Exclusion talents inaccessibles

**Validation sélection**: Blocage acquisition invalide

## Impact autres tickets

**Ticket 108** (Random): Pool filtré pré-requis

**Ticket 107** (Choice): Options grisées pré-requis

**Ticket 112** (Effects): Effets peuvent débloquer talents

## Voir aussi

- [talents.md](../../database/talents.md) - Champs pré-requis (si existent)
- [talents-random.md](./talents-random.md) - Filtrage pool
- [talents-choice.md](./talents-choice.md) - Options désactivées
- [talents-effects.md](./talents-effects.md) - Recalcul dynamique
