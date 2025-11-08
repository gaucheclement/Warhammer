# Pattern: Modificateurs de caractéristiques

## Contexte
Règles métier pour la modification des caractéristiques d'un personnage.
Deux mécanismes : modifications par talents (permanentes) et valeurs dynamiques (calculées).

---

## 1. Modifications par talents

### Format
Champ `addCharacteristic` contenant le nom de la caractéristique à modifier.

### Exemples
```
"Très fort" → addCharacteristic: "Force"
"Très résistant" → addCharacteristic: "Endurance"
"Affinité avec les Arcanes" → addCharacteristic: "Force Mentale"
```

### Types de modifications

**Modification par rang :** +5 par rang pour talents à rangs multiples.

### Validation

**Caractéristique existe :** Vérifier dans table Characteristics.
Normaliser noms ("Force" → "F", "Force Mentale" → "FM").

**Erreurs :** `ADD_CHAR_INVALID` si caractéristique invalide.

### Résolution

Lister talents modifiant caractéristiques, calculer bonus totaux avec rangs.
Limiter valeurs finales à 0-100.

### Affichage UI
Format : `CC: 45 (+5 de "Très agile")`
Tooltip indiquant source (talent).

### Cas particuliers

**Conditionnels :** Certains talents modifient uniquement dans conditions spécifiques.

**Temporaires :** Distinction entre bonus permanents (talents) et temporaires (sorts, états).

**Tables :** Talents (addCharacteristic)

---

## 2. Valeurs dynamiques calculées

### Format
```
"(Caractéristique) unité"
"(Bonus de Caractéristique) unité"
```

### Exemples

```
"(Force Mentale) mètres"
"(Bonus de FM) Rounds"
"(Bonus d'Initiative) heures"
"(Bonus de FM) cibles"
"(Bonus de F) dégâts"
```

### Parsing
Extraire :
- Type (dynamique vs fixe)
- Nom caractéristique
- Bonus (valeur/10) ou valeur complète
- Unité

Exemples :
```
"(Force Mentale) mètres" → FM, valeur complète, "mètres"
"(Bonus de FM) Rounds" → FM, bonus (valeur/10), "Rounds"
"48 mètres" → fixe, "48 mètres"
```

### Résolution
- Si "Bonus de X" : Caractéristique / 10 (arrondi inf)
- Sinon : valeur complète

Exemple : Personnage FM=42 → "(Bonus de FM) Rounds" = 4 Rounds

### Mapping caractéristiques
Normaliser noms :
```
"Force" ou "F" → "F"
"Force Mentale" ou "FM" → "FM"
"Endurance" ou "E" → "E"
etc.
```

### Validation
Vérifier que caractéristique existe dans table Characteristics.

**Erreurs :** `DYNAMIC_CHAR_INVALID`

### Affichage UI

**Mode description :** Afficher template tel quel.

**Mode personnage :** Afficher valeur calculée avec tooltip source.

### Cas particuliers

**Valeur "+ N" :** "(Bonus de FM) Rounds +" indique durée prolongeable.

**Champs concernés :**
- Spells (range, duration, targets, area)
- Talents (effects)
- Traits (effects)

---

## 3. Cumul et application

### Ordre d'application
1. Caractéristiques de base (race)
2. Modificateurs carrière (avances)
3. Modificateurs talents (addCharacteristic)
4. Modificateurs temporaires (sorts, états, étoiles)

### Calcul final
```
Caractéristique finale = Base + Avances + Talents + Temporaires
```

Limité à 0-100.

### Tracking sources
Conserver trace de l'origine pour affichage détaillé :
```
Force : 45
  Base (Humain) : 30
  Avances : +10
  Talent "Très fort" : +5
```

### Recalcul dynamique
Valeurs dynamiques doivent être recalculées quand caractéristiques changent.

---

## Validation complète

### Références caractéristiques
Toutes références (talents, valeurs dynamiques) doivent pointer vers caractéristiques existantes.

### Normalisation
Accepter variations de noms et normaliser vers abréviations standard.

### Plages valides
Après application modificateurs, vérifier valeurs dans 0-100.

---

## Voir aussi

- [pattern-parsing.md](./pattern-parsing.md) - Parsing "+X Nom"
- [pattern-validation-references.md](./pattern-validation-references.md) - Validation références
- [characteristics.md](../database/characteristics.md) - Table caractéristiques
