# Equipment - Équipement porté vs stocké

## Vue d'ensemble

L'équipement peut être soit porté/équipé (directement sur le personnage et immédiatement utilisable) soit stocké (dans un sac, sur une monture, au camp). Cette distinction affecte l'encombrement, l'efficacité en combat, et l'accessibilité.

## États de l'équipement

### Porté (Worn/Equipped)

**Définition:** Équipement directement sur le personnage, prêt à l'emploi.

**Exemples:**
- Armure portée sur le corps
- Armes à la ceinture ou en main
- Sac à dos sur le dos
- Bouclier au bras

**Caractéristiques:**
- Compte dans l'encombrement total
- Immédiatement utilisable
- Fournit protection (armures)
- Accessible en un tour (armes)

### Stocké (Stored)

**Définition:** Équipement rangé, non immédiatement accessible.

**Exemples:**
- Objets dans un sac fermé
- Équipement sur une monture/chariot
- Matériel laissé au camp/auberge
- Réserves de munitions

**Caractéristiques:**
- Peut ou non compter dans l'encombrement (selon localisation)
- Nécessite une action pour accéder
- Ne fournit pas de protection (armures)
- Pas utilisable immédiatement (armes)

## Impact sur l'encombrement

### Équipement porté

**Compte toujours** dans le calcul d'encombrement total:
- Armures portées
- Armes équipées
- Sac à dos (et son contenu)
- Objets à la ceinture

Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Équipement stocké

**Dépend de la localisation:**

**Dans sac porté:** Compte (le sac est porté)
**Sur monture:** Ne compte pas (la monture porte)
**Sur chariot:** Ne compte pas (le chariot porte)
**Au camp:** Ne compte pas (laissé sur place)

## Impact en combat

### Armes portées

**Immédiatement utilisables:**
- Arme en main: utilisable ce tour
- Arme à la ceinture: dégainable (action gratuite ou rapide)
- Arme sur le dos: dégainable (action rapide)

### Armes stockées

**Nécessite du temps:**
- Dans sac fermé: 1 tour pour sortir
- Sur monture: 1+ tours selon distance
- Au camp: inaccessible pendant le combat

### Armures portées

**Protection active:**
- PA appliqués normalement
- Défense immédiate

### Armures stockées

**Pas de protection:**
- Aucun PA
- Nécessite temps pour équiper (plusieurs minutes)

## Changement d'état

### Porter un objet stocké

**Action nécessaire:**
- Ouvrir sac/conteneur
- Sortir l'objet
- Le porter/équiper si nécessaire

**Temps:**
- Objet simple (arme): 1 action rapide à 1 tour
- Armure complète: 10+ minutes

### Stocker un objet porté

**Action nécessaire:**
- Retirer l'objet
- Ranger dans conteneur
- Fermer conteneur

**Temps:**
- Objet simple: 1 action rapide
- Armure: 5+ minutes

## Exemples concrets Warhammer

### Guerrier en marche
```
Porté:
- Armure de maille (enc 3)
- Épée à la ceinture (enc 1)
- Bouclier au bras (enc 1)
- Sac à dos (enc 1)

Total porté: 6 enc

Stocké dans le sac:
- Rations (enc 2)
- Corde (enc 1)
- Couverture (enc 1)
- Total sac: 4 enc

Encombrement total: 10 enc (6 porté + 4 dans sac porté)
```

### Scout préparé
```
Porté:
- Gilet de cuir (enc 1)
- Arc en main (enc 1)
- Carquois à la ceinture (enc 1)
- Dague à la ceinture (enc 0)

Total: 3 enc - Très mobile

Stocké au camp:
- Armure de maille
- Épée de secours
- Équipement de bivouac

Encombrement: 3 enc - Peut courir et grimper
```

## Relations avec d'autres systèmes

### Avec Encumbrance
Seul l'équipement porté compte dans l'encombrement (sauf si stocké sur soi).
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Inventory
Tous les objets de l'inventaire ont potentiellement un état porté/stocké.
Voir [inventory.md](./inventory.md)

### Avec Display
L'interface peut distinguer visuellement équipement porté vs stocké.
Voir [display.md](./display.md)

## Validation

### Règles métier

**Cohérence:**
- Une armure stockée ne fournit pas de PA
- Une arme stockée n'est pas utilisable immédiatement
- L'encombrement inclut tout ce qui est porté (sur soi)

### Vérifications

- Vérifier que armures stockées n'ajoutent pas de PA
- Vérifier que l'encombrement compte le porté
- Alerter si personnage surcharge avec objets stockables
