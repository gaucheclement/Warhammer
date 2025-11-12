# Système de prix et disponibilité

## Vue d'ensemble

Chaque trapping possède un prix (système monétaire trois niveaux) et un niveau de disponibilité (rareté).

## Structure du prix

### Champs de stockage

| Champ | Type | Description |
|-------|------|-------------|
| gold | Nombre | Couronnes d'or (CO) |
| silver | Nombre | Pistoles d'argent (PA) |
| bronze | Nombre | Sous de bronze (SB) |

Tous optionnels (peuvent être 0 ou vides).

### Système monétaire

- 1 Couronne d'or (CO) = 20 Pistoles d'argent (PA)
- 1 Pistole d'argent (PA) = 12 Sous de bronze (SB)
- 1 CO = 240 SB

### Format d'affichage

Conversion en valeur unifiée :

```
2 CO, 0 PA, 0 SB → "2CO"
1 CO, 5 PA, 0 SB → "1CO 5/-"
1 CO, 5 PA, 6 SB → "1CO 5/6"
0 CO, 15 PA, 0 SB → "15/-"
0 CO, 8 PA, 6 SB → "8/6"
0 CO, 0 PA, 5 SB → "5sc"
```

**Valeurs spéciales :** `"Variable"`, `"ND"` (non défini)

## Système de disponibilité

### Champ availability

**Type :** Texte énuméré (obligatoire)
**Valeurs :** Commune, Limitée, Rare, Exotique, Unique

### Niveaux de rareté

| Niveau | Où trouver | Délai | Exemples |
|--------|------------|-------|----------|
| Commune | Partout (villages+) | Immédiat | Bâton, sac, corde, provisions |
| Limitée | Villes | Même jour | Armures complètes, armes spécialisées |
| Rare | Grandes villes | 1d10 jours | Pique, véhicules spéciaux |
| Exotique | Commande spéciale | 2d10 semaines | Équipement étranger |
| Unique | Pas en vente | N/A | Artefacts, objets légendaires |

### Impact gameplay

- **Localisation :** Taille ville requise
- **Négociation :** Tests Marchandage modifiés
- **Prix réel :** Majorations possibles selon contexte

## Règles d'achat

### Processus

1. **Vérifier disponibilité locale**
   - Village : Commune
   - Ville : Commune + Limitée
   - Grande ville : + Rare
   - Capitale : + Exotique

2. **Test Marchandage** (optionnel)
   - Réussite : Réduction
   - Échec : Majoration

3. **Paiement** (conversion monnaie)

4. **Délai** (voir tableau ci-dessus)

### Modificateurs contextuels

**Région :**
- Armes naines : Communes chez nains, Rares ailleurs
- Équipement elfique : Exotique hors terres elfes

**Situation :**
- Guerre : Armes → Rares/Limitées
- Famine : Provisions → Rares
- Foire : Objets temporairement Communs

**Réputation :**
- Contacts marchands : Améliore disponibilité
- Bonne réputation : Facilite accès

## Exemples

### Armes
```
Bâton de combat : 3/- (3 PA) - Commune
Hallebarde : 2CO - Commune
Lance : 15/- (15 PA) - Commune
Pique : 18/- (18 PA) - Rare
Arbalète : 5CO - Commune
Carreaux (20) : 5/- (5 PA) - Commune
```

### Armures
```
Calotte de cuir : 8/- (8 PA) - Commune
```

### Divers
```
Sac à dos : 1CO - Commune
Baril : 8/- (8 PA) - Commune
```

### Véhicules
```
Charrette à bras : 20CO - Commune
```

## Calculs de conversion

### CO vers PA
```
3 CO = 3 × 20 = 60 PA
```

### PA vers SB
```
5 PA = 5 × 12 = 60 SB
```

### CO vers SB
```
2 CO = 2 × 240 = 480 SB
```

### Mixte
```
1 CO 10/6 = 240 + 120 + 6 = 366 SB
```

## Relations

**Avec Trappings :** Champs `gold`, `silver`, `bronze`, `availability` dans `audit/database/trappings.md`

**Avec Skills :** Marchandage influence négociation

**Avec Books :** Prix sources varient selon édition
