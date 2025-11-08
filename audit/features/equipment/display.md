# Equipment - Affichage inventaire

## Vue d'ensemble

L'affichage de l'inventaire présente tous les objets possédés par le personnage de manière organisée et informative, permettant une consultation rapide et une gestion efficace de l'équipement.

## Organisation de l'affichage

### Regroupement par catégorie

L'inventaire est généralement divisé en sections:

**Armes:**
- Armes de mêlée (melee)
- Armes à distance (ranged)
- Munitions (ammunition)

**Armures:**
- Toutes pièces d'armure (armor)
- Affichage par zone corporelle ou liste

**Équipement:**
- Objets divers (trapping)
- Conteneurs
- Véhicules (vehicle)

**Monnaie:**
- Section séparée pour la bourse
- Format: X CO, Y PA, Z S

Voir [categorization.md](./categorization.md)

### Tri et ordre

**Par défaut:**
- Regroupé par type (catégories ci-dessus)
- Puis par subType si applicable
- Puis par ordre alphabétique

**Options de tri:**
- Par encombrement (du plus lourd au plus léger)
- Par prix (du plus cher au moins cher)
- Par ordre d'ajout (plus récent d'abord)

## Informations affichées par objet

### Informations par objet

**Base:** Nom, quantité, enc, état (porté/stocké)
**Armes:** Groupe, dégâts, allonge/portée, qualités
**Armures:** Zones (loc), PA, qualités
**Objets:** Capacité (carry) si conteneur
**Prix:** Au survol, format X CO Y PA Z S

## Affichage de l'encombrement

### Récapitulatif

**Format:** `X / Y` où X=actuel, Y=limite
**Couleurs:** Vert (<80%), Orange (80-100%), Rouge (>100%)
**Si surcharge:** Afficher pénalités (Mouvement, Tests)

Voir [encumbrance-calc.md](./encumbrance-calc.md), [encumbrance-limit.md](./encumbrance-limit.md), [encumbrance-penalties.md](./encumbrance-penalties.md)

## Affichage des armures par zone

### Vue par zones

Tableau: Zone | PA | Pièces portées
Permet de voir protection totale et zones vulnérables

## Affichage liste équipement

### Formats

**Liste:** Chaque objet sur une ligne avec icône, nom, stats, enc
**Condensé:** Objets séparés par • avec (enc) entre parenthèses

## Interactions utilisateur

### Actions disponibles

**Sur chaque objet:**
- Voir détails (clic/survol)
- Équiper/Déséquiper (si applicable)
- Porter/Stocker (changer état)
- Vendre (si dans une boutique)
- Jeter/Abandonner

**Sur l'inventaire:**
- Ajouter objet
- Trier/Filtrer
- Chercher objet
- Optimiser encombrement (suggestions)

### Détails d'un objet

Au clic ou survol, afficher:
- Description complète
- Toutes caractéristiques
- Prix et disponibilité
- Livre source / page (si applicable)
- Qualités détaillées

## Exemples Warhammer

**Guerrier:** Armes (3) + Armures (3) + Équip (8) = 14/70 enc ✓
**Scout:** Arc+Flèches (2) + Gilet cuir (1) + Sac (5) = 8/55 enc ✓

## Relations avec d'autres systèmes

### Avec Inventory
Affiche les données de l'inventaire.
Voir [inventory.md](./inventory.md)

### Avec Categorization
Utilise les catégories pour organiser l'affichage.
Voir [categorization.md](./categorization.md)

### Avec Encumbrance
Affiche l'encombrement et les pénalités.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Validation
Affiche les messages de validation et alertes.
Voir [validation.md](./validation.md)

## Validation

### Règles d'affichage

**Clarté:**
- Informations essentielles visibles
- Organisation logique
- Codes couleur cohérents

**Performance:**
- Affichage rapide même avec beaucoup d'objets
- Filtres/tri performants

**Accessibilité:**
- Texte lisible
- Icônes compréhensibles
- Navigation au clavier possible

### Vérifications

- Tous les objets sont affichés
- Encombrement correctement calculé et affiché
- Alertes visibles si surcharge
- Actions possibles claires
