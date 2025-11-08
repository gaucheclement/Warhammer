# Wizard Talents - Gestion spécialisations talents

## Vue d'ensemble

Talents nécessitant spécialisation. Sélection parmi liste fermée ou saisie libre selon talent.

## Types

### Liste fermée

`specs` contient liste valeurs.

**Ex**: "Artiste" specs="Calligraphie, Peinture, Sculpture, Tatouage"

**Règle**: Choix OBLIGATOIRE parmi liste exacte

### Liste ouverte "(Au choix)"

`specs` contient "(Au choix)".

**Ex**: "Maître artisan (Au choix)"

**Règle**: Saisie texte libre OU suggestions

**Voir**: [pattern-specialisations.md](../../patterns/pattern-specialisations.md)

### Sans spécialisation

`specs` vide.

**Ex**: "Costaud", "Chanceux"

**Règle**: Aucune spé requise

## Catégories courantes

**Art**: Calligraphie, Peinture, Sculpture, Tatouage...

**Terrain**: Littoral, Déserts, Marécages, Rocailleux...

**Divins**: Manann, Morr, Sigmar, Taal, Ulric, Verena...

**Résistances**: Maladie, Poison, Chaleur... ou "(Au choix)"

**Voir**: [talents-specialisations.md](../../business-rules/talents-specialisations.md)

## Interface

### Affichage

**Déclenchement**: Après sélection talent (choix, aléatoire, validation)

**Contexte**: "Talent [Nom] nécessite une spécialisation"

**Label**: `specName` ou "Spécialisation"

### Liste fermée

**UI**: Dropdown, radio ou liste cliquable

**Options**: Valeurs parsing `specs` (split virgule)

**Validation**: 1 obligatoire, pas texte libre

### Liste ouverte

**UI**: Champ texte + suggestions optionnelles

**Validation**: Texte ≥1 car, max 50, pas vide

### Visuel

**Non sélectionné**: Champ vide

**Sélectionné**: Valeur, surbrillance

**Validé**: Grisé, "Talent (Spé)"

## Validation

### Critères

**Fermée**: Valeur EXACTEMENT dans specs

**Ouverte**: Texte non vide, longueur OK

**Format final**: "Nom Talent (Spécialisation)"

### Erreurs

**Aucune**: "Choisissez spécialisation pour [Talent]"

**Vide (ouverte)**: "Spécialisation non vide"

**Invalide (fermée)**: "Choisissez parmi: [liste]"

## Exemples

**Artiste (Peinture)**: Dropdown Art → Sélection "Peinture" → "Artiste (Peinture)", compétence "Art (Peinture)" créée

**Béni (Sigmar)**: Liste dieux → "Sigmar" → "Béni (Sigmar)", bénédictions débloquées

**Résistance (Au choix)**: Texte + suggestions → Saisie "Maladie" → "Résistance (Maladie)"

## Interactions

### Choix exclusifs

"Artiste ou Linguiste" → Sélection "Artiste" → Sous-interface spé

**Voir**: [talents-choice.md](./talents-choice.md)

### Aléatoires

Tirage "Résistance (Au choix)" → Acceptation → Sous-interface spé

**Voir**: [talents-random.md](./talents-random.md)

### Rangs multiples

Même talent, spés différentes = rangs séparés

**Ex**: "Artiste (Peinture)" rang 1, "Artiste (Sculpture)" rang 2

**Voir**: [talents-ranks.md](./talents-ranks.md)

### Effets automatiques

**addSkill héritage**: "Artiste (Peinture)" → "Art (Peinture)" auto

**addMagic domaine**: "Béni (Sigmar)" → Bénédictions Sigmar

**Voir**: [talents-effects.md](./talents-effects.md)

## Cas particuliers

### Spé fixe

"Arme de spécialisation (Arme de Parade)" → Pas interface, spé extraite parsing

### Modification

Spé définitive après validation. Avant validation étape, changement autorisé

### Doublons

"Artiste (Peinture)" 2× → Max=1: dédup, Rangs multiples: rang 2

## Workflow

### Phase 1: Détection

1. Acquisition talent
2. Vérif `specs` rempli
3. Si vide: fin sans spé
4. Si rempli: phase 2

### Phase 2: Affichage

1. Type (fermée vs ouverte)
2. Chargement options si fermée
3. Interface (dropdown vs texte)
4. Attente

### Phase 3: Sélection

1. Choix option ou saisie texte
2. Validation format
3. Stockage temporaire

### Phase 4: Validation

1. Vérif conformité
2. Construction "Talent (Spé)"
3. Attribution
4. Effets (héritage spé)

## Voir aussi

- [pattern-specialisations.md](../../patterns/pattern-specialisations.md)
- [talents-specialisations.md](../../business-rules/talents-specialisations.md)
- [talents.md](../../database/talents.md)
- [talents-choice.md](./talents-choice.md), [talents-random.md](./talents-random.md), [talents-effects.md](./talents-effects.md)
