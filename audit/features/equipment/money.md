# Equipment - Monnaie

## Vue d'ensemble

Le système monétaire de Warhammer utilise trois types de pièces avec des taux de conversion fixes. La monnaie est gérée comme partie de l'équipement du personnage et contribue à l'encombrement en grandes quantités.

## Types de monnaie

### Couronne d'Or (CO)

**Abréviation:** CO (Gold Crown en anglais)

**Valeur:** Monnaie de plus haute valeur
**Usage:** Achats importants (armures, armes de qualité, chevaux)
**Couleur:** Or

### Pistole d'Argent (PA)

**Abréviation:** PA (Silver Shilling en anglais)

**Valeur:** Monnaie courante
**Usage:** Achats quotidiens (nourriture, logement, équipement basique)
**Couleur:** Argent

### Sou (S)

**Abréviation:** S (Brass Penny en anglais, "Sous" en français)

**Valeur:** Petite monnaie
**Usage:** Petits achats (pain, bière, petits objets)
**Couleur:** Cuivre/Laiton

## Conversions

### Taux de conversion fixes

```
1 CO = 20 PA
1 PA = 12 S
1 CO = 240 S
```

### Exemples de conversion

**Convertir en PA:**
- 5 CO = 5 × 20 = 100 PA
- 3 CO + 10 PA = 60 + 10 = 70 PA

**Convertir en S:**
- 1 PA = 12 S
- 2 PA + 6 S = 24 + 6 = 30 S

**Convertir en CO:**
- 40 PA = 40 ÷ 20 = 2 CO
- 240 S = 240 ÷ 240 = 1 CO

## Gestion dans l'inventaire

### Stockage

La monnaie du personnage est stockée dans:
- Propriété dédiée du personnage (gold/silver/bronze)
- Ou objets "monnaie" dans trappings

### Affichage

**Format typique:**
```
Bourse: 15 CO, 8 PA, 23 S
```

Ou consolidé:
```
Richesse: 15 CO 8 PA 23 S (= 308 PA au total)
```

## Poids de la monnaie

### Encombrement

**Pièces individuelles:** enc = 0 (négligeable)

**Grandes quantités:** Peuvent avoir un poids significatif

**Seuils suggérés:**
- < 100 pièces: enc 0
- 100-500 pièces: enc 1
- 500-1000 pièces: enc 2
- etc.

Note: L'implémentation exacte varie selon les règles.

## Exemples de prix Warhammer

### Nourriture et boisson
- Repas simple: 6 S
- Bon repas: 1 PA
- Bière (chope): 3 S
- Vin (bouteille): 5 PA

### Logement
- Lit commun (nuit): 5 S
- Chambre privée (nuit): 1 PA
- Belle auberge (nuit): 5 PA

### Équipement courant
- Corde 10m: 5 PA
- Lanterne: 9 PA
- Couverture: 5 PA
- Sac à dos: 1 CO

### Armes basiques
- Dague: 1 CO
- Épée: 10 CO
- Arc: 10 PA
- Flèche: 1 S (pièce)

### Armures
- Gilet de cuir: 10 PA
- Armure de cuir complète: 50 PA
- Armure de maille: 60 CO
- Armure de plates: 400 CO

### Animaux
- Cheval de trait: 50 CO
- Cheval de guerre: 300 CO
- Mule: 20 CO

## Relations avec d'autres systèmes

### Avec Pricing
Le prix des objets est exprimé en CO/PA/S.
Voir [pricing.md](./pricing.md)

### Avec Inventory
La monnaie fait partie des possessions du personnage.
Voir [inventory.md](./inventory.md)

### Avec Encumbrance
De grandes quantités de pièces peuvent contribuer à l'encombrement.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

## Validation

### Règles métier

**Valeurs:**
- Toutes les valeurs doivent être >= 0
- Pas de valeurs négatives

**Conversions:**
- 1 CO = 20 PA exactement
- 1 PA = 12 S exactement
- Les conversions doivent être précises

### Vérifications

- Vérifier que gold/silver/bronze >= 0
- Vérifier l'exactitude des conversions
- Calculer l'encombrement si grandes quantités
- Alerter si valeurs négatives détectées
