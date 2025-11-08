# Equipment - Limite d'encombrement

## Vue d'ensemble

La limite d'encombrement définit le poids maximum que le personnage peut porter sans subir de pénalités. Elle est calculée à partir des caractéristiques Force et Endurance.

## Formule

```
Limite d'encombrement = Force + Endurance
```

**Force** - Valeur totale de la caractéristique Force
**Endurance** - Valeur totale de la caractéristique Endurance

## Calcul détaillé

### Valeurs des caractéristiques

Les valeurs utilisées sont les valeurs **totales** (base + avancées):

**Force totale:**
- Base espèce + jet + talent + étoile + avancées

**Endurance totale:**
- Base espèce + jet + talent + étoile + avancées

### Exemple

```
Personnage:
- Force: 30 (base 20 + jet 5 + avancées 5)
- Endurance: 35 (base 25 + jet 5 + avancées 5)

Limite = 30 + 35 = 65 encombrement
```

## Comparaison avec l'encombrement actuel

### Affichage limite vs actuel

Format typique: `X / Y`
- X = Encombrement actuel
- Y = Limite d'encombrement

**Exemples:**
- `7 / 65` - Bien en-dessous de la limite
- `65 / 65` - À la limite exacte
- `70 / 65` - Dépassement de 5

### États

**Normal:** Encombrement ≤ Limite
- Aucune pénalité
- Le personnage se déplace normalement

**Surchargé:** Encombrement > Limite
- Pénalités appliquées
- Voir [encumbrance-penalties.md](./encumbrance-penalties.md)

## Indicateur visuel

L'interface doit clairement indiquer si la limite est dépassée:

**Codes couleur suggérés:**
- Vert: < 80% de la limite
- Orange: 80-100% de la limite
- Rouge: > 100% (dépassement)

**Icônes:**
- ✓ Dans la limite
- ⚠ Proche de la limite
- ✗ Surcharge

## Modification dynamique

La limite d'encombrement change quand:

**Force ou Endurance augmente:**
- Avancée achetée avec XP
- Talent modifiant la caractéristique
- Effet temporaire (sort, objet)

**Force ou Endurance diminue:**
- Blessure grave
- Maladie
- Effet négatif

Le dépassement peut survenir si:
- Les caractéristiques baissent
- L'équipement augmente
- Un effet temporaire se termine

## Exemples concrets Warhammer

### Personnage faible
```
Force: 25
Endurance: 30
Limite: 55 encombrement

Peut porter une armure légère et armes de base sans problème.
```

### Personnage moyen
```
Force: 35
Endurance: 35
Limite: 70 encombrement

Peut porter armure de maille, armes, et équipement standard.
```

### Personnage fort
```
Force: 45
Endurance: 40
Limite: 85 encombrement

Peut porter armure de plates, plusieurs armes, et équipement lourd.
```

### Cas de dépassement
```
Force: 30, Endurance: 30
Limite: 60

Équipement:
- Armure de plates (enc 6)
- Épée (enc 1)
- Bouclier (enc 1)
- Sac rempli (enc 55)

Total: 63 encombrement
Dépassement: +3 → Pénalités appliquées
```

## Relations avec d'autres systèmes

### Avec Characteristics
La limite dépend de Force et Endurance du personnage.
Voir [audit/database/characteristics.md](../../database/characteristics.md)

### Avec Encumbrance Calc
Le total calculé est comparé à la limite.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Encumbrance Penalties
Si la limite est dépassée, des pénalités s'appliquent.
Voir [encumbrance-penalties.md](./encumbrance-penalties.md)

### Avec Display
La limite est affichée avec l'encombrement actuel.
Voir [display.md](./display.md)

## Validation

### Règles métier

**Calcul:**
- Limite = Force + Endurance
- Les valeurs doivent être les totaux actuels
- La limite doit être recalculée si Force ou Endurance change

**Cohérence:**
- Force et Endurance doivent être > 0
- La limite résultante doit être > 0

### Vérifications

- Vérifier que Force et Endurance existent
- Vérifier le calcul: limite = Force + Endurance
- Recalculer quand caractéristiques changent
- Alerter si encombrement > limite
