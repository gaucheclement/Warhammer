# Wizard Species - Sélection Espèce et Sous-Espèce

## Vue d'ensemble

**Objectif** : Première étape du wizard permettant au joueur de choisir l'espèce et la variante régionale de son personnage.

**Impact** : Détermine caractéristiques de base, compétences raciales, talents raciaux, et carrières disponibles.

## Modes de sélection

### Sélection manuelle

**Bouton "Choisir"** :
- Active la liste complète des espèces
- Change `randomState.specie` à -1
- Désactive le mode aléatoire

**Navigation** :
- Liste hiérarchique à 2 niveaux
- Niveau 1 : Groupement par `refDetail` (Humain, Nain, etc.) avec range de probabilité
- Niveau 2 : Variantes sélectionnables (Reiklander, Middenheim, etc.)

**Exemple d'affichage** :
```
Humain 1-90
  ├─ Humains (Reiklander)
  ├─ Humains (Middenheim)
  └─ Humains (Middenland)
Nain 91-97
  ├─ Nains
  └─ Nains (Altdorfer)
```

### Sélection aléatoire

**Bouton "Lancer"** :
- Tire nombre 1-100
- Sélectionne espèce automatiquement selon algorithme (voir [species-random.md])
- Accorde +20 XP si accepté
- Change `randomState.specie` à 1
- Animation visuelle (~1.5 secondes)

**Gestion variantes multiples** :
- Si plusieurs variantes partagent le même `rand`, toutes sont proposées
- IDs stockés dans `imposedSpecie`
- Joueur choisit parmi les variantes activées

## États de sélection (randomState.specie)

| État | Signification | Bouton Lancer | Bouton Choisir | Liste |
|------|--------------|---------------|----------------|-------|
| `0` | Initial | Activé | Activé | Désactivée |
| `1` | Aléatoire accepté (+20 XP) | Désactivé | Désactivé | Variantes imposées activées |
| `-1` | Choix manuel | Désactivé | Désactivé | Tous activés |
| `-2` | Finalisé et sauvegardé | - | - | - |

## Informations affichées par espèce

### Description narrative
- Source : `species.desc` (HTML)
- Contenu : Contexte culturel, apparence, points de vue inter-races, règles spéciales

### Compétences raciales
- Source : `species.skills` (parsing requis, voir [parsing-skills-talents.md])
- Format : Liste virgules avec spécialisations "(Au choix)" et choix " ou " mis en évidence
- Exemple Nains : "Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid)"

### Talents raciaux
- Source : `species.talents` (parsing requis, voir [parsing-skills-talents.md])
- Format : Liste virgules avec choix " ou " et "X Talent aléatoire"
- Exemple Nains : "Costaud, Déterminé ou Obstiné, Vision nocturne"

### Carrières disponibles
- Source : Relation via `refCareer` (voir [filtrage-careers-espece.md])
- Affichage : Indicatif (détail à l'étape Carrière)

### Caractéristiques de base
- Source : Relation via `refChar` (voir [characteristics.md])
- Affichage : Valeurs départ, formule blessures, mouvement

## Exemples concrets Warhammer

### Humains (Reiklander)
- **Variantes** : 13 (régions, Norse, Tiléens)
- **Probabilité** : 90% (1-90)
- **Spécificités** : Polyvalent, 3 Extra Points, 2 Destinée, toutes carrières accessibles

### Nains
- **Variantes** : 5 (Standard, Altdorfer, Norse, Clans)
- **Probabilité** : 7% (91-97)
- **Spécificités** : E 30, FM 40, Vision nocturne, Résistance magie, M3, carrières artisanat/combat

### Halflings
- **Variantes** : 12 (villages Moot)
- **Spécificités** : CT 30, Dex 30, M3, petite taille, Résistance Chaos, 0 Destinée

### Hauts Elfes
- **Probabilité** : 2% (98-99)
- **Spécificités** : I 40, Int/FM/Soc 30, M5, Vision nocturne, carrières magie/diplomatie

### Elfes Sylvains
- **Probabilité** : 1% (100)
- **Spécificités** : I 40, M5, Vision nocturne, carrières foresterie/magie

### Gnomes
- **Spécificités** : Dex 30-40, FM 30-40, M3, 2 Destinée, affinité illusionnisme

### Ogres
- **Spécificités** : F 35, E 35, I 0, Blessures ×2, limités mentalement, carrières restreintes

## Règles de présélection

### Tirage aléatoire
- Si une seule variante : sélection automatique
- Si plusieurs variantes : toutes activées, joueur choisit

### Restauration sauvegarde
- Si `character.specie` existe : présélection automatique
- État `randomState.specie` restauré
- Boutons activés/désactivés selon état

### Mode Free
- `character.isFreeMode()` = true
- Boutons "Lancer" et "Choisir" masqués
- Sélection manuelle directe sans bonus XP

## Restrictions

### Avant sélection mode
- Liste complète désactivée (classe `disabled`)
- Force choix entre aléatoire (avec bonus) et manuel

### Après tirage aléatoire
- Seules variantes avec même `rand` activées
- Exemple : Tirage 95 → Nains (91-97) → 5 variantes Nains sélectionnables

### Bouton Validate
- Initial : Désactivé
- Activation : Dès sélection espèce (clic niveau 2)
- Action : Sauvegarde puis étape suivante

## Validation et sauvegarde

### Vérifications
- `character.specie` ≠ null
- `randomState.specie` = -2 après sauvegarde
- Si mode aléatoire accepté : +20 XP ajouté avec label "Race Aléatoire"

### Données persistées
- `character.specie` : Objet complet espèce
- `character.randomState.specie` : État sélection
- `character.randomState.imposedSpecie` : IDs variantes imposées

## Relations avec autres tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | label, refDetail, rand, desc | Affichage et navigation |
| Species | skills, talents | Parsing et affichage (voir [parsing-skills-talents.md]) |
| Species | refCareer | Filtrage carrières (voir [filtrage-careers-espece.md]) |
| Species | refChar | Caractéristiques base (voir [species-base-characteristics.md]) |
| Characteristics | rand | Valeurs départ par espèce |
| Careers | rand | Filtrage disponibilité |
| Skills | - | Résolution après parsing |
| Talents | - | Résolution après parsing |

## Voir aussi

- [species.md](../../database/species.md) - Structure table Species
- [species-random.md](./species-random.md) - Algorithme génération aléatoire
- [species-region.md](./species-region.md) - Sélection région Humains
- [species-base-characteristics.md](./species-base-characteristics.md) - Application caractéristiques
- [species-display.md](./species-display.md) - Affichage détails espèce
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Filtrage carrières
- [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md) - Parsing compétences/talents
