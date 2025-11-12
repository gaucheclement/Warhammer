# Pattern : SubRand (Tirage Aléatoire Multiniveau)

**Statut** : NON IMPLÉMENTÉ V1 - Prévu V2

**Contexte** : Système de résolution de collisions pour carrières partageant la même valeur `rand`.

## Problème résolu

Lorsque plusieurs carrières partagent la même valeur `rand` (typiquement après ajout de suppléments au livre de base), un tirage unique ne peut pas départager entre elles.

**Exemple de collision** :
```json
{
  "careers": [
    {"label": "Agitateur", "rand": {"Humain": 15}},
    {"label": "Charlatan", "rand": {"Humain": 15}},
    {"label": "Devin", "rand": {"Humain": 15}}
  ]
}
```

Tirage 1d100 = 12 → 3 carrières matchent (≤ 15) → **Collision !**

## Solution : SubRand

### Principe

Le champ `subRand` contient une valeur secondaire (1-100) utilisée pour départager les carrières qui partagent le même `rand`.

**Algorithme** :
1. **Tirage primaire** : 1d100 → trouve toutes carrières avec `rand` ≥ résultat
2. **Si collision** (plusieurs carrières matchent) :
   - **Tirage secondaire** : 1d100
   - Sélectionner carrière avec `subRand` ≥ résultat secondaire
3. **Si pas de collision** : Retourner carrière unique

### Structure données

```json
{
  "label": "Agitateur",
  "rand": {
    "Humain": 15,
    "Nain": 0,
    "Elfe": 8
  },
  "subRand": {
    "Humain": 33,
    "Nain": 0,
    "Elfe": 50
  }
}
```

**Valeurs subRand** :
- **0 ou ""** : Carrière inaccessible à cette espèce (comme rand)
- **1-100** : Seuil tirage secondaire (répartition entre carrières collision)

### Exemple complet

**Configuration** (Humain, rand 15 partagé) :
```json
[
  {"label": "Agitateur", "rand": {"Humain": 15}, "subRand": {"Humain": 33}},
  {"label": "Charlatan", "rand": {"Humain": 15}, "subRand": {"Humain": 66}},
  {"label": "Devin", "rand": {"Humain": 15}, "subRand": {"Humain": 100}}
]
```

**Tirage personnage Humain** :
1. Tirage primaire : 1d100 = 12
2. Carrières matchant : Agitateur (15), Charlatan (15), Devin (15) → 3 carrières
3. **Collision détectée** → Tirage secondaire : 1d100 = 50
4. SubRand matching :
   - Agitateur (33) : 50 > 33 → Non
   - Charlatan (66) : 50 ≤ 66 → **Match !**
   - Devin (100) : 50 ≤ 100 → Match aussi, mais Charlatan est premier
5. **Résultat** : Charlatan

**Répartition probabilités** :
- Agitateur : 33% (subRand 1-33)
- Charlatan : 33% (subRand 34-66)
- Devin : 34% (subRand 67-100)

## Implémentation V1

**État actuel** : Tous les champs `subRand` sont vides (`""`) dans les tables V1.

**Raison** : Livre de base uniquement → peu de collisions → `rand` suffit.

**Gestion collision V1** : Si collision détectée (plusieurs carrières même rand), afficher popup choix manuel au joueur.

## Migration V2

**Quand activer subRand** :
- Ajout suppléments (ex: Archives de l'Empire, Liber Fanatica)
- Collision `rand` fréquentes
- Souhait éviter popups manuels

**Étapes migration** :
1. Identifier toutes collisions `rand` dans tables complètes (base + suppléments)
2. Pour chaque groupe collision, assigner `subRand` équitablement (ex: 3 carrières → 33/66/100)
3. Tester distribution probabilités (simulation 10000 tirages)
4. Activer code subRand dans générateur aléatoire

**Code activation** :
```javascript
// V1: Collision → Popup manuel
if (matchingCareers.length > 1) {
  return promptUserChoice(matchingCareers);
}

// V2: Collision → SubRand automatique
if (matchingCareers.length > 1) {
  const subRoll = rollD100();
  return matchingCareers.find(c => c.subRand[species] >= subRoll);
}
```

## Références

**Patterns liés** :
- [pattern-generation-aleatoire.md](./pattern-generation-aleatoire.md) - Génération aléatoire globale
- [filtrage-rand-system.md](../business-rules/filtrage-rand-system.md) - Système de filtrage rand

**Tables concernées** :
- [careers.md](../database/careers.md) - Champ `subRand` (vide V1)

**Features impactées** :
- [wizard/career.md](../features/wizard/career.md) - Sélection carrière aléatoire

## Validation

**V1** : Aucune validation (champ vide).

**V2** :
- `subRand` ∈ [1-100] ou "" (inaccessible)
- Toutes carrières groupe collision doivent avoir `subRand` défini
- Max `subRand` d'un groupe collision = 100
- Répartition équitable recommandée (éviter biais)

## Notes

**Pourquoi pas un seul rand unique par carrière ?**
- Suppléments ajoutent carrières entre existantes (insertion)
- `rand` reflète probabilité globale espèce (agrégé livres)
- `subRand` résout collisions locales sans recalculer tous `rand`

**Alternative envisagée** : Table séparée `careerGroups` avec répartition subRand explicite. Rejetée pour complexité ajoutée.

**Mots-clés** : Tirage aléatoire, Collision, Répartition, Rand, SubRand, Génération, Probabilités
