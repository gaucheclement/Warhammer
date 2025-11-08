# Character Model - Gestion characteristics

## Objectif

Documenter les méthodes de gestion des caractéristiques dans le modèle Character: création, récupération, calcul des valeurs finales.

## Contexte Warhammer

Les caractéristiques représentent les attributs physiques et mentaux du personnage. Il y a **10 caractéristiques principales**:
- **CC** (Capacité de Combat): Combat au corps-à-corps
- **CT** (Capacité de Tir): Combat à distance
- **F** (Force): Force physique brute
- **E** (Endurance): Résistance physique
- **I** (Initiative): Rapidité de réaction
- **Ag** (Agilité): Souplesse et coordination
- **Dex** (Dextérité): Précision manuelle
- **Int** (Intelligence): Faculté mentale
- **FM** (Force Mentale): Volonté et résistance mentale
- **Soc** (Sociabilité): Charisme et présence

Et **5 attributs dérivés**:
- **M** (Mouvement): Vitesse de déplacement
- **BF** (Bonus Force): Force / 10
- **BE** (Bonus Endurance): Endurance / 10
- **PB** (Points de Blessures): Résistance aux dégâts
- **Corruption**: Résistance à la corruption du Chaos

Voir [database/characteristics.md](../database/characteristics.md)

## Structure d'une caractéristique

Chaque objet characteristic contient:
- **id**: Identifiant (cc, ct, f, e, i, ag, dex, int, fm, soc, m, pb, corruption, etc.)
- **specie**: Valeur de base de l'espèce
- **roll**: Tirage aléatoire (+0 à +20 selon mode)
- **talent**: Bonus de talents (+0, +5, +1 selon talent)
- **star**: Bonus du signe astral (+0 à +3)
- **career**: Bonus de carrière (améliorations de niveau)
- **advance**: Avances payées en XP
- **tmpadvance**: Avances temporaires (non validées)
- **data**: Référence vers les données de caractéristique
- **origins**: Tableau des sources (espèce, carrières)

## Méthodes principales

### createCharacteristic(characteristic)

**Rôle**: Créer un objet characteristic avec toutes ses propriétés et méthodes.

**Entrée**: Objet characteristic depuis la base de données

**Comportement**: Crée un objet avec:
- Propriétés initialisées à 0 (roll, talent, advance, etc.)
- Méthodes de calcul: getBase(), getAdvance(), getTotal(), getBonus()
- Méthodes de présentation: getLabel(), getSymbol(), getDescription()
- Méthodes utilitaires: addOrigins(), hasOrigin()

**Exemple CC**: Propriétés specie/roll/talent/star/career/advance/tmpadvance initialisées à 0, data et origins vides, méthodes getBase/getAdvance/getTotal/getBonus disponibles.

### setCharacteristic(characteristic, index)

**Rôle**: Ajouter ou mettre à jour une caractéristique dans le personnage.

**Comportement**:
1. Si index fourni: remplace à cette position
2. Si pas d'index ET déjà existante (via searchCharacteristic): ajoute origins et retourne existante
3. Sinon: crée nouvelle caractéristique et l'ajoute au tableau

**Usage**: Utilisé pour initialiser les 15 caractéristiques au démarrage.

### getCharacteristics()

**Rôle**: Retourner le tableau complet des caractéristiques.

**Retour**: Tableau de 15 objets characteristic (10 principales + 5 dérivées)

### searchCharacteristic(id, origin)

**Rôle**: Rechercher une caractéristique par son id.

**Paramètres**:
- id: Identifiant de la caractéristique
- origin: (optionnel) Filtrer par origine

**Retour**: Objet characteristic ou null

**Exemple**: searchCharacteristic('cc') → objet CC du personnage

## Calcul des valeurs

### getSpecie()

Retourne la valeur de base selon l'espèce.

**Cas normaux** (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc):
- Retourne data.rand[specie.data.refChar]
- Exemple Humain: CC base = 30
- Exemple Nain: E base = 40

**Cas spéciaux**:
- **Points de Blessures**: BE × 2 + BFM (variant selon espèce)
- **Corruption**: BE + BFM
- **Chance**: Égale au total de Destin
- **Détermination**: Égale au total de Résilience

### Méthodes de calcul

**getStar()**: Bonus signe astral (+0 à +3), seulement pour type 'roll'
**getBase()**: specie + roll + talent + star (ex: 30+8+0+0 = 38)
**getAdvance()**: advance + career + tmpadvance (ex: 5+0+2 = 7)
**getTotal()**: getBase() + getAdvance() (ex: 38+7 = 45)
**getBonus()**: Math.floor(getTotal() / 10) (ex: 45 → 4)

## Avances, talents et origins

**Avances**: career (gratuit), advance (payé XP), tmpadvance (temporaire). Voir [xp.md](./xp.md)
**Talents**: Modifient via addCharacteristic (ex: Résistant +5E, Robuste +BE PB). Voir [apply-talent.md](./apply-talent.md)
**Origins**: addOrigins/hasOrigin pour tracer sources et calculer coût XP réduit.

## Exemples concrets

### CC d'un Humain Soldat niveau 1
- specie: 30 (Humain base)
- roll: 12 (tirage aléatoire)
- star: 0 (pas de bonus astral sur CC)
- talent: 0 (pas de talent affectant CC)
- career: 0 (pas encore d'amélioration)
- advance: 5 (payé 5 avances en XP)
- getBase() = 42, getAdvance() = 5, getTotal() = 47, getBonus() = 4
- origins: ['humain', 'soldat|1'] (améliorable dans cette carrière)

### Endurance d'un Nain Prêtre avec Résistant rang 2
- specie: 40 (Nain base)
- roll: 10
- star: 3 (signe astral booste E)
- talent: 10 (Résistant rang 2 = +5 × 2)
- advance: 15
- getBase() = 63, getAdvance() = 15, getTotal() = 78, getBonus() = 7
- origins: ['nain', 'pretre|1', 'pretre|2']

### Points de Blessures d'un Halfling
- Formule: (BE × 2) + BFM
- Si BE = 3, BFM = 3: PB = (3 × 2) + 3 = 9
- talent: 0 (sauf si Robuste → +BE)
- advance: 0 (les PB ne s'améliorent pas directement)

## Validation

Contraintes:
- Le tableau characteristics doit contenir exactement 15 éléments
- Chaque characteristic doit avoir un id valide
- getTotal() >= 0
- Les origins doivent être des ids valides

Voir [validation.md](./validation.md)

## Voir aussi

- [database/characteristics.md](../database/characteristics.md) - Liste des caractéristiques
- [specie-methods.md](./specie-methods.md) - Application valeurs de base
- [apply-talent.md](./apply-talent.md) - Application des talents
- [xp.md](./xp.md) - Dépense XP pour avances
- [derived.md](./derived.md) - Calcul des attributs dérivés
