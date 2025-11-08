# Character Model - Calculs dérivés

## Objectif

Documenter les méthodes de calcul des attributs dérivés: Mouvement, Blessures, Encombrement.

## Contexte Warhammer

Certains attributs sont calculés depuis d'autres valeurs:
- **Mouvement (M)**: Vitesse de déplacement
- **Points de Blessures (PB)**: Résistance aux dégâts
- **Encombrement**: Capacité de charge

Ces valeurs changent dynamiquement selon les caractéristiques, talents et équipement.

## Attributs dérivés principaux

### Mouvement (M)

**Formule de base**: Définie par l'espèce
- Humain: M = 4
- Nain: M = 3
- Elfe: M = 5
- Halfling: M = 3

**Modificateurs**:
- Talent Véloce: +1 par rang (via characteristic.talent)
- Armure lourde: peut réduire (règles avancées)

**Calcul**: characteristic.getSpecie() + characteristic.talent
- Exemple Humain base: 4
- Exemple Humain avec Véloce: 4 + 1 = 5

### Points de Blessures (PB)

**Formule de base**: Dépend de l'espèce

**Humain/Elfe/Halfling**: (BE × 2) + BFM
- Exemple BE=3, BFM=2: PB = 6 + 2 = 8

**Nain**: BF + (BE × 2) + BFM
- Exemple BF=3, BE=4, BFM=3: PB = 3 + 8 + 3 = 14

**Ogre/Géants**: ((BF + (BE × 2) + BFM) × 2
- Double la valeur de base

**Modificateurs**:
- Talent Robuste: +BE par rang
- Talent Dur à cuire: +BE par rang
- Appliqués via characteristic.talent

**Calcul complet**:
1. Récupère BF, BE, BFM via searchCharacteristic().getBonus()
2. Applique formule selon espèce
3. Ajoute characteristic.talent (Robuste, Dur à cuire)
4. Retourne total

**Exemple Humain avec Robuste rang 1 (BE=3)**:
- Base: (3 × 2) + 2 = 8
- Robuste: +3
- Total: 11

### Encombrement

**Limite de charge**: BF + BE
- Exemple BF=2, BE=3: Limite = 5

**Encombrement actuel**: Somme des (qty × enc) de tous les trappings
- Exemple: Épée (1×1) + Armure cuir (1×3) + Rations (7×0.1) = 4.7

**États**:
- Si actuel <= limite: Non encombré
- Si actuel > limite: Encombré (malus déplacement/actions)

**Calcul**: calculateEncumbrance()
```
total = 0
Pour chaque trapping:
  total += trapping.qty × trapping.enc
limite = searchCharacteristic('f').getBonus() + searchCharacteristic('e').getBonus()
encombré = (total > limite)
```

## Méthodes de calcul

### calculateMovement()

**Rôle**: Calculer le Mouvement total.

**Comportement**:
1. Récupère characteristic('m')
2. getSpecie() retourne base selon espèce
3. talent contient bonus Véloce
4. getTotal() = base + talent

**Retour**: Valeur M actuelle

### calculateWounds()

**Rôle**: Calculer les Points de Blessures.

**Comportement**:
1. Récupère characteristic('pb')
2. getSpecie() calcule selon formule espèce + BF/BE/BFM
3. talent contient bonus Robuste/Dur à cuire
4. getTotal() = formule + talent

**Retour**: Valeur PB actuelle

### calculateEncumbrance()

**Rôle**: Calculer encombrement actuel et limite.

**Comportement**:
1. total = 0
2. Pour chaque trapping: total += qty × enc
3. limite = BF + BE
4. Retourne {current: total, max: limite, encumbered: total > limite}

**Retour**: Objet avec détails encombrement

## Autres attributs dérivés

### Bonus (BF, BE, BFM, etc.)

**Formule**: Math.floor(characteristic.getTotal() / 10)

Calculé par chaque characteristic.getBonus().

**Exemples**:
- F = 32 → BF = 3
- E = 45 → BE = 4
- CC = 47 → Pas de "BC", mais utilisé pour tests

### Corruption

**Formule**: BE + BFM
- Exemple BE=3, BFM=2: Corruption = 5

Calculé par characteristic('corruption').getSpecie().

### Chance

**Formule**: Égale au total de Destin
- Si Destin = 3: Chance = 3

Calculé par characteristic('chance').getSpecie().

### Détermination

**Formule**: Égale au total de Résilience
- Si Résilience = 2: Détermination = 2

Calculé par characteristic('determination').getSpecie().

## Déclenchement des recalculs

Les attributs dérivés sont recalculés automatiquement lors de:
- **getTotal()**: Toujours à jour (calcul dynamique)
- **applyTalent()**: Après modification des talents
- **Changement caractéristique**: Lors de setCharacteristic()
- **Ajout/suppression trappings**: Pour encombrement

**Pas de stockage**: Les valeurs ne sont pas sauvegardées, toujours recalculées à la demande.

## Exemples concrets

**Guerrier Humain Robuste**: BF=3, BE=4, BFM=2, M=4, PB=14 (base10+Robuste4), Enc=6.2/7

**Nain Tueur**: BF=4, BE=5, BFM=4, Robuste×2+Véloce, M=4, PB=28 (base18+Robuste10), Enc=12/9 encombré!

**Halfling agile**: BF=1, BE=3, BFM=2, M=3, PB=8, Enc=0.2/4 très léger

## Validation

Contraintes:
- M >= 0 (jamais négatif)
- PB >= 1 (minimum 1)
- Encombrement >= 0
- BF, BE, BFM cohérents avec caractéristiques

Voir [validation.md](./validation.md)

## Voir aussi

- [characteristics.md](./characteristics.md) - Caractéristiques de base
- [apply-talent.md](./apply-talent.md) - Application talents modificateurs
- [trappings.md](./trappings.md) - Équipement et encombrement
- [database/species.md](../database/species.md) - Formules par espèce
