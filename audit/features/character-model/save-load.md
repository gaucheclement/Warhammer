# Character Model - Save/Load

## Objectif

Documenter la sauvegarde et le chargement du personnage: sérialisation, désérialisation, gestion erreurs.

## Contexte

Le personnage doit pouvoir être sauvegardé pour reprise ultérieure. La sauvegarde:
- **Persiste**: État complet du personnage
- **Allège**: Supprime les références data (rechargées depuis DB)
- **Conserve**: Toutes les valeurs, origins, specs, avances

## Méthode save(step)

**Rôle**: Préparer le personnage pour sérialisation (localStorage, export).

**Comportement**:

### 1. Nettoyage préalable
Appelle deleteEmpty() pour supprimer skills/talents avec advance=0.

### 2. Clonage
Crée un clone complet du personnage via clone().

### 3. Suppression références data
Parcourt et supprime les propriétés data de:
- specie.data
- star.data
- careerLevel.data
- characteristics[i].data
- skills[i].data
- talents[i].data
- spells[i].data

**Raison**: Les data seront rechargées depuis la DB au load(). Économie d'espace de stockage.

### 4. Gestion stepIndex
Si step fourni ET stepIndex !== -1:
- clone.stepIndex += step
- Usage: Passer à l'étape suivante dans le wizard

### 5. Retour
Retourne le clone allégé, prêt pour JSON.stringify().

**Résultat**: Objet allégé sans data, contenant id/roll/advance/origins uniquement.

## Méthode load(data)

**Rôle**: Restaurer le personnage depuis les données sauvegardées.

**Comportement**:

### 1. Propriétés simples
```
this.stepIndex = data.stepIndex
this.mode = data.mode
this.trappings = data.trappings
this.details = data.details
this.xp = data.xp
this.randomState = data.randomState
```

### 2. Rechargement specie
Si data.specie:
- Récupère CharGen.allSpecies[data.specie.id]
- Appelle setSpecie(specie)

### 3. Rechargement careerLevel
Si data.careerLevel:
- Récupère CharGen.allCareersLevels[data.careerLevel.id]
- Appelle setCareerLevel(careerLevel)

### 4. Rechargement characteristics
Pour chaque characteristic dans data.characteristics:
1. Clone depuis CharGen.allCharacteristics[el.id]
2. Appelle setCharacteristic(elem, index)
3. Merge les valeurs sauvegardées (roll, advance, origins...) via Helper.merge()

### 5. Rechargement skills
Pour chaque skill dans data.skills:
1. Clone depuis CharGen.allSkills[el.id]
2. Restaure specs et spec sauvegardés
3. Appelle setSkill(elem, index)
4. Merge les valeurs

### 6. Rechargement talents
Pour chaque talent dans data.talents:
1. Clone depuis CharGen.allTalents[el.id]
2. Restaure specs et spec
3. Appelle setTalent(elem, index)
4. Merge les valeurs

### 7. Rechargement spells
Pour chaque spell dans data.spells:
1. Récupère depuis CharGen.allSpells[el.id]
2. Appelle setSpell(spell, index)
3. Merge les valeurs

### 8. Retour
Retourne this (personnage restauré).

## Méthodes auxiliaires

### clone()

**Rôle**: Créer une copie complète du personnage.

**Comportement**:
1. Helper.clone(this) - copie profonde
2. refresh(clone) - recrée les méthodes

**Usage**: Utilisé par save() et pour dupliquer un personnage.

### refresh(clone)

**Rôle**: Re-créer toutes les méthodes des objets (perdues lors du clonage).

**Comportement**:
1. Si specie: appelle setSpecie(specie.data)
2. Si star: appelle setStar(star.data)
3. Si careerLevel: appelle setCareerLevel(careerLevel.data)
4. Pour chaque characteristic: appelle setCharacteristic(el, index)
5. Pour chaque skill: appelle setSkill(el, index)
6. Pour chaque talent: appelle setTalent(el, index)

**Raison**: Les méthodes (getLabel, getTotal...) sont des fonctions, pas sérialisables. Il faut les recréer.

## Gestion erreurs

**Cas d'erreur possibles**:
- ID inexistant dans DB: CharGen.allX[id] → undefined
- Data corrompue: JSON invalide
- Version incompatible: Structure changée

**Recommandations**:
- Valider les IDs avant accès
- Gérer les undefined gracieusement
- Versionner le format de sauvegarde

## Exemples concrets

### Sauvegarde Humain Soldat
```
Avant save():
- specie: {id: 'humain', data: {...objets complets...}, getLabel: function...}
- characteristics[0]: {id: 'cc', roll: 8, data: {...}, getTotal: function...}

Après save():
- specie: {id: 'humain'}
- characteristics[0]: {id: 'cc', roll: 8, advance: 5, origins: [...]}
```

### Chargement depuis localStorage
```
1. data = JSON.parse(localStorage.getItem('character_123'))
2. character.load(data)
3. Résultat:
   - specie rechargé avec data depuis CharGen.allSpecies['humain']
   - Méthodes recréées: getLabel(), getSkills()
   - characteristics avec data depuis CharGen.allCharacteristics
   - Valeurs (roll, advance) restaurées
```

### Progression wizard avec save
```
Étape 3 (carrière) terminée:
1. save(1) → stepIndex passe de 3 à 4
2. Sauvegarde dans localStorage
3. Utilisateur revient plus tard
4. load(data) → reprend à stepIndex=4 (étape suivante)
```

## Validation

Contraintes au load():
- Tous les IDs doivent exister dans CharGen.allX
- stepIndex valide (-1 ou 0-N)
- Structure data conforme

Voir [validation.md](./validation.md)

## Voir aussi

- [structure.md](./structure.md) - Structure complète du modèle
- [validation.md](./validation.md) - Validation des données
