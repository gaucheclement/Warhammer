# Pattern: Génération aléatoire (Rand 1-100)

## Contexte
Système de tirage aléatoire d'entité selon probabilités cumulatives.
Permet génération procédurale avec pondération.

---

## Format du champ rand

### Simple
Champ "rand" contenant un nombre entre 1 et 100, ou une chaîne vide "".

### Multi-catégories
Objet "rand" avec une propriété par catégorie, chaque propriété valant un nombre 1-100 ou "".

---

## Exemples

### Simple (Species)
```
Humain → rand: 90
Halfling → rand: 93
Nain → rand: 96
```

### Objet (Careers)
```
Agitateur → rand:
  Humain: 15
  Halfling: ""
  Nain: 8
```

---

## Principe des seuils cumulatifs

### Distribution
```
Entité A : rand=15  → Tirage 1-15  (15%)
Entité B : rand=35  → Tirage 16-35 (20%)
Entité C : rand=60  → Tirage 36-60 (25%)
Entité D : rand=100 → Tirage 61-100 (40%)
```

Le tirage génère un nombre aléatoire entre 1 et 100. On parcourt les entités dans l'ordre des index. La première entité dont le seuil "rand" est supérieur ou égal au tirage est sélectionnée.

Les entités avec rand = "" sont exclues du tirage pour cette catégorie.

---

## Algorithme de tirage

### Version simple

1. Tirer un nombre aléatoire entre 1 et 100
2. Trier les entités par index
3. Parcourir les entités jusqu'à trouver celle dont le seuil rand est >= au tirage
4. Retourner cette entité

**Fallback :** Si aucune entité ne correspond, retourner la dernière.

### Version avec catégorie

Même principe mais utiliser `rand[catégorie]` au lieu de `rand` simple.

Exemple : Tirer une carrière pour un Nain → utiliser `careers[i].rand["Nain"]`

### Optimisations

**Précalcul des plages :**
Calculer à l'avance pour chaque entité :
- min = seuil précédent + 1
- max = seuil actuel

Permet une recherche directe au lieu d'une itération.

**Recherche optimisée :**
Avec les plages précalculées, trouver directement l'entité dont plage contient le tirage.

---

## Validation

### Plage valide
Chaque valeur doit être soit un entier entre 1 et 100, soit une chaîne vide "".

**Erreurs possibles :**
- `RAND_OUT_OF_RANGE` : "Rand 150 invalide (attendu 1-100 ou '')"

### Seuils croissants
Les valeurs rand doivent être strictement croissantes selon l'ordre des index (en excluant les valeurs vides).

**Erreurs possibles :**
- `RAND_DECREASING` : "Seuils décroissants: Humain index 5 (rand=40) > index 6 (rand=30)"

### Couverture complète
La dernière valeur rand non vide devrait être au moins 95 pour couvrir l'ensemble de la plage 1-100.

**Erreurs possibles :**
- `RAND_COVERAGE` : "Dernière valeur 85 < 95, tirages 86-100 impossibles"

---

## Gestion cas limites

### Aucune entité disponible
Si aucune entité n'a de valeur rand pour la catégorie donnée, retourner `null` ou lever une erreur.

### Rand non couvert (< 100)
Si le seuil maximum est < 100, avertir (coverage insuffisant).
Idéalement, le dernier seuil devrait être ≥ 95.

---

## Tirage multiple sans répétition

Pour tirer N entités sans répétition :
1. Tirer une entité
2. La retirer de la liste
3. Répéter N fois

---

## Validation distribution

### Vérifier distribution
Effectuer N tirages (ex: 10000) et compter la fréquence de chaque entité.
Vérifier que la distribution correspond aux probabilités attendues.

### Test de cohérence
Pour chaque plage (min-max), vérifier :
```
Probabilité théorique = (max - min + 1) / 100
Probabilité mesurée ≈ Probabilité théorique (±2%)
```

---

## UI Interactive

### Affichage
- Le résultat du dé (1-100)
- L'entité sélectionnée
- La plage de chaque entité (min-max)
- Highlighting de l'entité sélectionnée

### Visualisation
Barre de progression 0-100 avec zones colorées par entité, taille proportionnelle à la probabilité.

---

## Tables concernées

- Species (rand simple)
- Careers (rand objet)
- Characteristics (rand objet)

---

## Voir aussi

- [pattern-subrand.md](./pattern-subrand.md) - Sous-catégories (non implémenté)
- [pattern-talent-aleatoire.md](./pattern-talent-aleatoire.md) - "X Talent aléatoire"
