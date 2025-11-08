# Wizard Skills - Calcul des Avances

## Contexte

Calcul des augmentations (avances) de compétences selon leur source (espèce, carrière, expérience). Les avances déterminent le bonus ajouté à la caractéristique de base.

**Objectif métier** : Calculer correctement le total des avances pour chaque compétence en cumulant toutes les sources.

## Périmètre fonctionnel

### Sources d'avances

**Espèce** (voir [skills-species.md](./skills-species.md))
- 3 compétences à +5 avances chacune
- 3 compétences à +3 avances chacune
- Défini lors de l'étape Species Skills du wizard

**Carrière niveau 1** (voir [skills-career.md](./skills-career.md))
- 40 points à répartir librement
- Maximum 10 points par compétence
- Défini lors de l'étape Career Skills du wizard

**Expérience ultérieure** (hors wizard)
- Dépenses XP pour augmenter les compétences après création
- Coûts par paliers (voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md))

### Cumul des avances

**Règle de cumul**
- Les avances de toutes les sources s'additionnent
- Formule : Avances totales = Avances espèce + Avances carrière + Avances XP

**Type de compétences et avances initiales**

**Compétences de base** (type "base")
- Toujours disponibles, même sans formation
- Avances initiales : espèce + carrière (selon sélections)
- Exemples : Athlétisme, Calme, Esquive, Perception

**Compétences avancées** (type "avancée")
- Nécessitent formation (listées dans carrière)
- Avances initiales : uniquement si dans espèce OU carrière
- Exemples : Guérison, Crochetage, Navigation, Focalisation

### Affichage par source

**Colonne "Augm" dans Species Skills**
- Affiche uniquement les avances d'espèce (0, 3 ou 5)
- Exemples : Art (Peinture) → 5, Calme → 3

**Colonne "Augmentation" dans Career Skills**
- Affiche le cumul espèce + carrière
- Exemples : Charme (espèce +3, carrière +10) → 13

**Stockage par source**
- Champ `specie` : avances d'espèce (0/3/5)
- Champ `career` : avances de carrière (0-10)
- Champ `advance` ou `xp` : avances par dépense XP (après création)

## Exemples de calculs Warhammer

### Humain Agitateur - Athlétisme

**Étape Species Skills** : Athlétisme sélectionné à +5
**Étape Career Skills** : Athlétisme fait partie des skills de carrière, +5 alloués
**Résultat** : Athlétisme = 5 (espèce) + 5 (carrière) = 10 avances totales

### Humain Agitateur - Charme

**Étape Species Skills** : Charme sélectionné à +3
**Étape Career Skills** : Charme fait partie des skills de carrière, +10 alloués
**Résultat** : Charme = 3 (espèce) + 10 (carrière) = 13 avances totales

### Humain Agitateur - Commandement

**Étape Species Skills** : Commandement non sélectionné (0)
**Étape Career Skills** : Commandement fait partie des skills de carrière, +10 alloués
**Résultat** : Commandement = 0 (espèce) + 10 (carrière) = 10 avances totales

### Nain Artisan - Métier (Forgeron)

**Étape Species Skills** : Métier (Forgeron) sélectionné à +5
**Étape Career Skills** : Métier (Forgeron) fait partie des skills de carrière, +10 alloués
**Résultat** : Métier (Forgeron) = 5 (espèce) + 10 (carrière) = 15 avances totales

### Halfling Bourgeois - Perception

**Étape Species Skills** : Perception sélectionné à +3
**Étape Career Skills** : Perception NON dans les skills de carrière Bourgeois, 0 alloué
**Résultat** : Perception = 3 (espèce) + 0 (carrière) = 3 avances totales

## Relations avec autres composants

**Tables** : Skills (type base/avancée), Species (skills), CareerLevels (skills)

**Business rules** : calculs-xp-progression.md (coûts paliers), skills-avances-progression.md (système avances)

**Étapes wizard** : Species Skills (espèce), Career Skills (carrière), avances XP après création

## Règles métier

### Avances initiales (création de personnage)

**Espèce uniquement**
- 6 compétences de l'espèce reçoivent des avances (3×+5, 3×+3)
- Total : 24 avances d'espèce distribuées

**Carrière niveau 1**
- 40 points à répartir parmi les 8-10 compétences de carrière
- Max 10 par compétence
- Cumul possible avec avances d'espèce

**Total maximum à la création**
- Une compétence peut avoir maximum : 5 (espèce) + 10 (carrière) = 15 avances
- Si non dans espèce : maximum 10 avances (carrière seulement)
- Si non dans carrière : maximum 5 avances (espèce seulement)

### Avances par XP (après création)

**Mécanisme** (voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md))
- Coûts par paliers : 1-5 (10 XP), 6-10 (15 XP), 11-15 (20 XP), etc.
- Multiplicateur ×2 si compétence hors carrière actuelle/passée
- Les avances XP s'ajoutent aux avances initiales

**Exemple progression**
- Personnage créé avec Athlétisme 10 avances (5 espèce + 5 carrière)
- Dépense 15 XP pour passer à 11 avances
- Dépense 15 XP pour passer à 12 avances
- Etc.

### Distinction compétences base vs avancées

**Compétences de base**
- Peuvent être augmentées par XP même si non dans carrière
- Coût normal (non multiplié par 2)
- Exemples : Athlétisme, Calme, Esquive

**Compétences avancées**
- Doivent être dans carrière actuelle ou passée pour être augmentées
- Sinon : coût ×2 (hors carrière)
- Exemples : Guérison, Crochetage, Focalisation

## Validation et contraintes

### Validation à la création

**Espèce**
- Exactement 3 compétences à +5
- Exactement 3 compétences à +3
- Total : 24 avances distribuées

**Carrière**
- Exactement 40 points alloués
- Max 10 points par compétence
- Uniquement sur skills de carrière (sauf mode Free)

**Cumul**
- Pas de limite totale pour le cumul espèce + carrière
- Maximum possible : 15 avances (5+10)

### Affichage

**Colonne "Augm" (Species Skills)**
- Valeur affichée : champ `specie` uniquement
- Exemples : 0, 3, ou 5

**Colonne "Augmentation" (Career Skills)**
- Valeur affichée : `specie` + `career`
- Exemples : 0+10=10, 3+7=10, 5+10=15

**Colonne "Total"**
- Valeur affichée : Base + Augmentation
- Formule : Caractéristique + (specie + career + xp)

## Voir aussi

- [skills-species.md](./skills-species.md) - Avances d'espèce
- [skills-career.md](./skills-career.md) - Avances de carrière
- [skills-values.md](./skills-values.md) - Calcul valeurs finales
- [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md) - Coûts XP
- [skills-avances-progression.md](../../business-rules/skills-avances-progression.md) - Système complet
