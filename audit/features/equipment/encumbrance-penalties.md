# Equipment - Pénalités d'encombrement

## Vue d'ensemble

Quand l'encombrement total dépasse la limite, le personnage subit des pénalités qui reflètent la difficulté à se déplacer et agir sous un tel poids.

## Déclenchement

**Condition:** Encombrement actuel > Limite d'encombrement

**Exemple:**
- Limite: 60
- Actuel: 65
- Dépassement: +5 → Pénalités actives

## Paliers de pénalités

Le système peut avoir des paliers progressifs selon l'ampleur du dépassement:

### Légère surcharge (+1 à +10)

**Modificateurs:**
- Mouvement: -1
- Tests physiques: -5%

**Exemple:** Personnage avec limite 60 portant 65 enc

### Surcharge moyenne (+11 à +20)

**Modificateurs:**
- Mouvement: -2
- Tests physiques: -10%
- Tests Agilité: -10% supplémentaire

**Exemple:** Personnage avec limite 60 portant 75 enc

### Surcharge lourde (+21+)

**Modificateurs:**
- Mouvement: -3
- Tests physiques: -20%
- Tests Agilité: -20% supplémentaire
- Impossible de courir

**Exemple:** Personnage avec limite 60 portant 85 enc

Note: Les paliers exacts dépendent des règles Warhammer utilisées.

## Modificateurs affectés

### Mouvement

La valeur de Mouvement du personnage est réduite.

**Mouvement de base:** Généralement 4 pour un humain
**Avec surcharge:** 4 - pénalité = nouveau mouvement

Le personnage se déplace plus lentement sur le champ de bataille.

### Tests de compétences

**Compétences physiques affectées:**
- Athlétisme
- Escalade
- Natation
- Esquive

**Application:** Malus en % sur les tests

**Exemple:**
- Athlétisme 45%
- Surcharge légère: -5%
- Test effectif: 40%

### Tests d'Agilité

Tous les tests basés sur Agilité subissent un malus supplémentaire car le poids entrave les mouvements rapides et précis.

## Application automatique

Les pénalités s'appliquent automatiquement dès que la limite est dépassée:

**Recalcul quand:**
- L'encombrement change (objet ajouté/retiré)
- La limite change (Force/Endurance modifiée)
- Un objet porté devient stocké (ou inverse)

**Retrait automatique:**
Dès que l'encombrement redescend sous la limite, les pénalités disparaissent.

## Exemples concrets Warhammer

### Guerrier surchargé
```
Force: 35, Endurance: 30
Limite: 65

Équipement:
- Armure de plates (6)
- Bouclier (1)
- Épée à deux mains (2)
- Épée (1)
- Arc (1)
- Carquois 20 flèches (2)
- Sac avec équipement (55)

Total: 68 encombrement
Dépassement: +3 (légère surcharge)

Pénalités:
- Mouvement: 4 → 3
- Tests physiques: -5%
```

### Explorateur prudent
```
Force: 28, Endurance: 32
Limite: 60

Équipement optimal:
- Gilet de cuir (1)
- Arc (1)
- 20 flèches (2)
- Dague (0)
- Sac léger (15)

Total: 19 encombrement
Aucune pénalité - peut courir et esquiver librement
```

## Gestion tactique

### Choix stratégiques

Le joueur doit choisir entre:
- Protection (armure lourde) vs Mobilité (armure légère)
- Polyvalence (plusieurs armes) vs Encombrement réduit
- Équipement de survie vs Capacité de combat

### Solutions

**Réduire l'encombrement:**
- Laisser du matériel au camp/auberge
- Utiliser une monture ou un chariot
- Acheter des conteneurs (augmente capacité)
- Améliorer Force/Endurance avec XP

**Conteneurs:**
Les sacs et conteneurs ont leur propre enc mais permettent de stocker des objets. Voir [inventory.md](./inventory.md)

## Relations avec d'autres systèmes

### Avec Encumbrance Limit
Les pénalités se basent sur le dépassement de la limite.
Voir [encumbrance-limit.md](./encumbrance-limit.md)

### Avec Encumbrance Calc
Le calcul du total détermine si pénalités ou non.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Characteristics
Les pénalités affectent Mouvement et tests de caractéristiques.

### Avec Skills
Les tests de compétences physiques subissent les malus.

## Validation

### Règles métier

**Déclenchement:**
- Pénalités SI ET SEULEMENT SI encombrement > limite
- Recalcul automatique à chaque changement

**Application:**
- Mouvement réduit selon palier
- Tests affectés selon palier
- Retrait immédiat si encombrement redescend

### Vérifications

- Vérifier le dépassement de limite
- Appliquer le bon palier de pénalités
- Retirer pénalités si plus de dépassement
- Alerter clairement le joueur des pénalités actives
