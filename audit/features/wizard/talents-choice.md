# Wizard Talents - Sélection talents "Au choix"

## Vue d'ensemble

Gestion talents avec choix exclusifs (" ou ") dans espèce/carrière. Joueur sélectionne 1 option unique parmi liste.

## Format choix

### Pattern " ou "

Séparateur identifiant choix mutuellement exclusifs.

**Exemples**: "Perspicace ou Affable", "Déterminé ou Obstiné", "Lire/Écrire ou Impitoyable"

**Règle**: Toujours 1 seule sélection finale

**Voir**: [pattern-parsing.md](../../patterns/pattern-parsing.md)

## Sources

### Talents raciaux

**Origine**: `species.talents`

**Exemples**:
- Humains: "Perspicace ou Affable"
- Nains: "Déterminé ou Obstiné", "Lire/Écrire ou Impitoyable"
- Elfes: "Éloquence ou Étiquette"

### Talents carrière

**Origine**: `careerLevel.talents` niveau 1

**Exemples**: "Ambidextre ou Maître artisan", "Sémantique ou Sociable", "Étiquette ou Numismatique"

**Fréquence**: ~30% carrières ont ≥1 choix niveau 1

## Interface sélection

### Affichage options

**Présentation**: Radio buttons ou boutons mutuels

**Informations**: Nom, description courte, effets principaux, restrictions

**Ordre**: Alphabétique ou parsing

### Indication visuelle

**Non sélectionné**: Fond neutre

**Sélectionné**: Fond coloré, ✓, gras

**Validé**: Grisé, non modifiable

**Aide**: Tooltip description au survol

## Validation

### Critères

**Obligatoire**: Exactement 1 option (ni 0, ni 2+)

**Unicité**: Impossible sélectionner mutuellement exclusifs

**Cohérence**: Vérifier pré-requis talent compatible

### Erreurs

**Aucune sélection**: "Vous devez choisir un talent parmi: [liste]"

**Talent invalide**: Blocage option, message pré-requis manquant

### Confirmation

**Mode immédiat**: Sélection appliquée au clic

**Mode validation**: Bouton "Confirmer" après sélection

**Modification**: Changement permis avant validation étape

## Exemples

### Humain - "Perspicace ou Affable"

**Option A: Perspicace** - Détecte mensonges, bonus Intuition

**Option B: Affable** - Charme, +5 Sociabilité

**Sélection**: Affable → Ajout talent, +5 Soc appliqué

### Nain - "Déterminé ou Obstiné"

**Option A: Déterminé** - Résiste intimidation, tests FM avantage

**Option B: Obstiné** - Ignore psychologiques, tests FM bonus

**Sélection**: Obstiné → Ajout, effets psychologiques résistés

## Interactions

### Avec spécialisations

Choix inclut talent nécessitant spécialisation.

**Exemple**: "Artiste ou Linguiste"

**Process**: Sélection "Artiste" → Sous-interface spé → Choix "Peinture" → Validation "Artiste (Peinture)"

**Voir**: [talents-specialization.md](./talents-specialization.md)

### Avec rangs multiples

Talent choisi peut avoir rangs multiples.

**Exemple**: "Ambidextre ou Maître artisan" (max ≥2)

**Conséquence**: Rangs supplémentaires achetables plus tard

**Voir**: [talents-ranks.md](./talents-ranks.md)

### Avec effets automatiques

**Exemple**: "Affable" (+5 Soc) recalcule à validation

**Process**: Sélection → Validation → Application → Recalcul

**Voir**: [talents-effects.md](./talents-effects.md)

## Cas particuliers

### Doublons inter-sources

Choix propose talent déjà acquis.

**Exemple**: "Lire/Écrire ou Impitoyable" mais "Lire/Écrire" déjà acquis

**Résolution**:
- Max=1: "Lire/Écrire" désactivé, seul "Impitoyable" sélectionnable
- Rangs multiples: Les 2 actives, "Lire/Écrire" ajoute rang 2

### Choix conditionnels

Options avec pré-requis.

**Exemple**: "Magie des Arcanes ou Chanceux" (Magie nécessite FM 35+)

**Traitement**: Vérification pré-requis, désactivation options invalides, message survol

**Voir**: [talents-prerequisites.md](./talents-prerequisites.md)

### Annulation

Retour arrière avant validation étape.

**UI**: Bouton "Modifier" ou clic écrase précédente

**Contrainte**: Après validation étape, verrouillage définitif

## Workflow

### Phase 1: Parsing

1. Récupération chaîne talents
2. Détection " ou " via [pattern-parsing.md](../../patterns/pattern-parsing.md)
3. Extraction options
4. Enregistrement choix avec identifiant, liste options, aucune sélection initiale

### Phase 2: Affichage

1. Interface sélection
2. Chargement détails (talents.json)
3. Désactivation invalides (pré-requis, doublons)
4. Attente utilisateur

### Phase 3: Sélection

1. Clic option
2. Mise à jour visuelle
3. Si spé requise: sous-interface
4. Enregistrement temporaire

### Phase 4: Validation

1. Vérification tous choix résolus
2. Application personnage
3. Effets automatiques
4. Verrouillage
5. Passage étape suivante

## Voir aussi

- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Pattern " ou "
- [talents.md](../../database/talents.md) - Détails talents
- [talents-specialization.md](./talents-specialization.md), [talents-prerequisites.md](./talents-prerequisites.md)
- [talents-effects.md](./talents-effects.md), [talents-display.md](./talents-display.md)
