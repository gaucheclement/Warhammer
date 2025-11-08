# Equipment - Prix et disponibilité

## Vue d'ensemble

Chaque objet possède un prix et un niveau de disponibilité qui reflètent sa rareté et sa valeur dans le monde de Warhammer. Ces propriétés influencent l'accès à l'équipement et l'économie du jeu.

## Système monétaire

Voir [money.md](./money.md) pour les détails sur le système monétaire (CO/PA/S).

Le prix est exprimé en trois monnaies:
- CO (Couronnes d'Or)
- PA (Pistoles d'Argent)
- S (Sous de cuivre)

## Structure des données

**Propriétés:**
- `gold` - Nombre de Couronnes d'Or
- `silver` - Nombre de Pistoles d'Argent
- `bronze` - Nombre de Sous
- `price` - Prix consolidé (converti en valeur unique)
- `availability` - Niveau de disponibilité

## Prix (price)

Le prix est calculé et consolidé à partir de gold/silver/bronze:

**Conversion:**
- 1 CO = 20 PA
- 1 PA = 12 S

**Exemples:**
- Épée: 10 CO = price consolidé
- Flèche: 1 S = price consolidé
- Armure de maille: 60 CO = price consolidé

## Disponibilité (availability)

Indique la facilité à trouver l'objet sur les marchés.

**Niveaux:**
- **Commune** - Disponible partout, facilement trouvable
- **Limitée** - Disponible dans les villes, plus rare dans les villages
- **Rare** - Difficile à trouver, grandes villes seulement
- **Exotique** - Très rare, importé, prix élevé
- **Unique** - Objet unique, pas en vente normale

### Exemples par niveau

**Commune:**
- Dague (1 CO)
- Gilet de cuir (10 PA)
- Corde (5 PA)
- Rations (3 S par jour)

**Limitée:**
- Épée de qualité (15 CO)
- Armure de maille légère (30 CO)
- Arbalète (25 CO)

**Rare:**
- Armure de plates (400 CO)
- Pistolet (30 CO)
- Arme elfique (prix variable)

**Exotique:**
- Armes naines runiques (prix très élevé)
- Armures elfiques (prix très élevé)
- Objets magiques mineurs

**Unique:**
- Artefacts
- Armes légendaires
- Objets questés

## Variations régionales

La disponibilité et les prix peuvent varier selon la région:

**Villes impériales:**
- Meilleur accès aux objets Communs et Limités
- Prix standards

**Zones rurales:**
- Moins de choix
- Objets Rares quasi introuvables
- Prix parfois plus élevés

**Régions spécialisées:**
- Nuln: Armes à poudre plus accessibles
- Averland: Chevaux plus accessibles
- Ports: Objets exotiques plus accessibles

## Relations avec d'autres systèmes

### Avec Money
Le prix est exprimé dans le système monétaire Warhammer.
Voir [money.md](./money.md)

### Avec Inventory
Tous les objets de l'inventaire ont un prix et une disponibilité.
Voir [inventory.md](./inventory.md)

### Avec Database
Les prix sont stockés dans la table trappings.
Voir [audit/database/trappings.md](../../database/trappings.md)

## Validation

### Règles métier

**Prix:**
- Doit être >= 0
- Cohérence entre gold/silver/bronze et price consolidé

**Disponibilité:**
- Doit être dans la liste autorisée
- Cohérence avec le type d'objet (armure de plates = Rare minimum)

### Vérifications

- Vérifier que price est défini et >= 0
- Vérifier que availability est dans la liste
- Vérifier cohérence price et rareté
- Alerter si objet coûteux avec availability Commune
