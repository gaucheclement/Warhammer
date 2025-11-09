# Character Model - Random state

## Objectif

Documenter la gestion de l'état aléatoire (randomState) permettant la reproductibilité des tirages dans le wizard.

## Contexte Warhammer

Le wizard en mode guidé effectue des tirages aléatoires:
- **Espèce**: Tirage aléatoire si option activée
- **Carrière**: Tirage selon table + espèce
- **Signe astral**: Tirage 1-100
- **Caractéristiques**: Rolls +0 à +20
- **Talents**: "X Talent aléatoire" pour Humains

Pour permettre de:
- **Rejouer**: Même seed → même résultat
- **Annuler**: Revenir en arrière
- **Débugger**: Reproduire un bug

Le randomState conserve les seeds et impositions.

## Structure randomState

```
{
  specie: 0,                    // Seed tirage espèce
  imposedSpecie: [],            // Espèces imposées/déjà tirées
  career: 0,                    // Seed tirage carrière
  imposedCareers: [],           // Carrières imposées
  star: 0,                      // Seed tirage signe
  imposedStar: [],              // Signes imposés
  characteristic: 0,            // Seed tirage caractéristiques
  imposedCharacteristics: {},   // {id: valeur} imposés
  imposedTalents: []            // Talents imposés/déjà tirés
}
```

**Seeds**: Nombres utilisés pour initialiser générateur aléatoire
**Imposed**: Valeurs forcées ou historique des tirages

## Fonctionnement général

### Principe seed

Un seed (graine) initialise un générateur pseudo-aléatoire déterministe:
- Même seed → même séquence de nombres
- Seed différent → séquence différente

**Usage**: randomState.characteristic = 12345 → roll CC toujours identique

### Principe imposed

Les tableaux imposed conservent:
- **Valeurs forcées**: Utilisateur impose une espèce spécifique
- **Historique**: Talents déjà tirés (éviter doublons)

## Détail par propriété

### specie et imposedSpecie

**specie**: Seed pour tirage espèce aléatoire
**imposedSpecie**: Liste espèces à exclure ou forcer

**Usage**:
- Mode "Espèce aléatoire": Tire selon seed
- imposedSpecie = ['humain'] → force Humain
- imposedSpecie = [] → toutes possibles

**Exemple**:
```
specie: 42
imposedSpecie: []
→ Seed 42 tire "Nain"

imposedSpecie: ['elfe-sylvain']
→ Force Elfe Sylvain, ignore seed
```

### career et imposedCareers

**career**: Seed pour tirage carrière
**imposedCareers**: Carrières imposées/exclues

**Usage**:
- Tire carrière selon table + espèce + seed
- imposedCareers peut forcer une carrière spécifique

**Tables**: Chaque espèce a sa table de carrières (1-100)

### star et imposedStar

**star**: Seed pour tirage signe astral (1-100)
**imposedStar**: Signe forcé

**Usage**:
- Tire 1-100 avec seed
- Trouve signe correspondant
- imposedStar = ['wymund-le-resolu'] → force ce signe

### characteristic et imposedCharacteristics

**characteristic**: Seed pour rolls caractéristiques
**imposedCharacteristics**: {id: valeur} forcés

**Usage**:
- Pour chaque carac: tire +0 à +20 selon seed
- imposedCharacteristics = {cc: 15} → force CC roll = 15

**Exemple**:
```
characteristic: 100
imposedCharacteristics: {}
→ Seed 100: CC=+8, CT=+12, F=+5, E=+10...

imposedCharacteristics: {cc: 18, f: 20}
→ Force CC=+18, F=+20, autres selon seed
```

### imposedTalents

**Tableau**: Talents forcés ou déjà tirés

**Usage**:
- Humains: "3 Talents aléatoires"
- imposedTalents conserve les 3 tirés
- Évite de tirer 2× le même

**Exemple**:
```
1er tirage: Résistant
imposedTalents: ['resistant']

2e tirage: Pas Résistant (déjà tiré)
imposedTalents: ['resistant', 'vivacite']

3e tirage: Pas Résistant ni Vivacité
imposedTalents: ['resistant', 'vivacite', 'tireur-de-precision']
```

## Reproductibilité

### Reproductibilité et modification

Même randomState → même personnage (espèce, carrière, rolls, talents). Permet "figer" tirage chanceux.

Changer seed → résultat différent (specie: 42→43 espèce différente, characteristic: 100→101 rolls différents). Permet re-tirer sans recommencer.

## Sauvegarde et restauration

### save()

randomState est inclus tel quel dans la sauvegarde (pas de data à supprimer).

### load()

```
this.randomState = data.randomState
```

Restaure l'état complet, permettant:
- Reprendre wizard exactement où il était
- Rejouer les mêmes tirages si retour en arrière

## Exemples concrets

**Création Humain**: imposedSpecie=['humain'], star:42→Wymund, career:17→Soldat, characteristic:100→rolls fixes, imposedTalents=[3 tirés]. **Reproduction**: Même randomState → même personnage. **Re-roll carac**: characteristic:100→200 → nouveaux rolls, garde espèce/carrière

## Validation

Contraintes:
- Seeds >= 0 (nombres entiers)
- imposedSpecie: tableau d'IDs valides
- imposedCareers: tableau d'IDs valides
- imposedCharacteristics: {id: 0-20}
- imposedTalents: tableau d'IDs valides

Pas de validation stricte (mode debug/test).

## Voir aussi

- [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md) - Système rand 1-100
- [wizard/species-random.md](../wizard/species-random.md) - Tirage espèce
- [wizard/career-random.md](../wizard/career-random.md) - Tirage carrière
- [wizard/characteristics-roll.md](../wizard/characteristics-roll.md) - Tirage carac
- [wizard/talents-random.md](../wizard/talents-random.md) - Talents aléatoires
