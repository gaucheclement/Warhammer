# Wizard Career - Génération aléatoire pondérée

## Vue d'ensemble

Le système de génération aléatoire propose des carrières en fonction de leur probabilité d'occurrence dans l'univers Warhammer, avec bonus XP pour encourager le hasard. La pondération reflète la fréquence réaliste des professions selon l'espèce et la région.

**Objectif métier** : Créer une expérience de génération de personnage fidèle à Warhammer, où carrières communes (Artisan, Milicien) apparaissent plus fréquemment que carrières rares (Sorcier, Tueur de Trolls).

## Système de pondération

### Seuils cumulatifs

Les valeurs `rand` ne sont PAS des pourcentages indépendants, mais des **seuils cumulatifs** dans un tirage 1-100.

**Mécanisme** :
1. Tirage aléatoire 1-100
2. Parcours carrières dans ordre fichier
3. Première carrière où `rand[critère] >= tirage` est sélectionnée

**Exemple Humain** :
- Agitateur (1) : Sélectionnée si tirage = 1 → Probabilité 1%
- Artisan (3) : Sélectionnée si tirage 2-3 → Probabilité 2%
- Bourgeois (6) : Sélectionnée si tirage 4-6 → Probabilité 3%
- Sorcier (95) : Sélectionnée si tirage 95-100 → Probabilité 6% (très rare mais possible)

**Formule probabilité réelle** : `(Seuil_actuel - Seuil_précédent) / 100`

### Catégories de rareté

**Communes (seuils 1-20)** : Métiers urbains fréquents (Agitateur 1, Artisan 3, Bourgeois 6, Marchand 8).

**Moyennes (seuils 20-50)** : Professions spécialisées (Soldat 25, Érudit 35).

**Rares (seuils 90-100)** : Carrières exceptionnelles (Sorcier 95, Tueur de Trolls 95).

## Système multi-tirages avec bonus XP

### Tirage 1 : +50 XP

**Processus** :
1. Joueur clique "Lancer" (`randomAction`)
2. Système tire 1 carrière aléatoire
3. Carrière proposée devient cliquable, toutes autres restent grisées
4. Bouton "Lancer" reste actif pour tirage 2

**Choix joueur** :
- **Accepter** : Clic sur carrière proposée → +50 XP, étape suivante
- **Refuser** : Clic "Lancer" à nouveau pour tirage 2

### Tirage 2 : +25 XP

**Processus** :
1. Système tire 2 carrières supplémentaires (différentes de la 1ère)
2. Total 3 carrières proposées deviennent cliquables
3. Bouton "Lancer" devient désactivé (limit atteint)
4. Bouton "Choisir" reste actif

**Choix joueur** :
- **Accepter une des 3** : Clic sur carrière → +25 XP, étape suivante
- **Refuser** : Clic "Choisir" pour sélection manuelle

### Tirage 3 : 0 XP

**Processus** :
1. Joueur clique "Choisir" (refuse les 3 propositions)
2. TOUTES carrières compatibles espèce deviennent cliquables
3. Sélection manuelle libre
4. Aucun bonus XP

**Raison** : Pénalité pour refus total du hasard. Encourage acceptation tirage 1 ou 2.

## Gestion des doublons

### Mécanisme

Le système stocke `imposedCareers[]` contenant IDs des carrières déjà proposées.

**Règles** :
- Tirage 1 : Ajoute 1 ID à `imposedCareers`
- Tirage 2 : Tire 2 carrières, vérifie qu'elles ne sont PAS dans `imposedCareers`
- Si doublon détecté : Re-tirage automatique jusqu'à obtenir carrière unique

**Code** : `if (!character.randomState.imposedCareers.includes(el.id))`

### Cas particulier : Même seuil

**Problème** : Plusieurs carrières peuvent avoir le même seuil (ex: Agitateur 1, Charlatan 1).

**Comportement** :
- Système trouve TOUTES carrières avec ce seuil
- Propose la première non déjà proposée
- Variable `target` force parcours complet jusqu'au même seuil

**Exemple** : Si tirage = 1 et Agitateur déjà proposé, Charlatan (seuil 1 aussi) est proposé.

## Influence de l'espèce et de la région

### Filtrage préalable

**Ordre d'exécution** :
1. Filtrage espèce : Éliminer carrières où `rand[espèce]` = "" ou absent
2. Filtrage région (si applicable) : Éliminer carrières où `rand[région]` = "" ou absent
3. Pondération : Utiliser seuil le plus spécifique (région > espèce)
4. Tirage aléatoire sur liste filtrée

### Seuils multiples

Certaines carrières ont seuils différents selon critère.

**Exemple Soldat** : `{Humain: 25, Middenheim: 30, Middenland: 25, Nordland: 28}`

**Application** :
- Humain sans région → seuil 25
- Humain de Middenheim → seuil 30 (culture martiale ulricaine)
- Humain de Nordland → seuil 28

**Règle** : Système utilise seuil régional si présent, sinon seuil espèce.

### Distributions variables

**Nain** : Artisan (8), Guerrier (30), Ingénieur (45) → Forte probabilité métiers artisanaux/techniques.

**Elfe** : Peu de carrières accessibles → Probabilités individuelles plus élevées (ranges plus larges entre seuils).

**Humain** : Maximum de carrières → Distribution étale, plus de variété.

## Animation et feedback

Animation dés (`Helper.dice`) : Seuils jaunes, dés roulent, carrière clignote orange, scroll automatique vers proposition.

## État du système (randomState.career)

### Valeurs possibles

**0** : Aucun tirage effectué. Bouton "Lancer" actif et clignotant (`clickMe`).

**1** : Tirage 1 effectué, 1 carrière proposée. Bouton "Lancer" actif pour tirage 2.

**2** : Tirage 2 effectué, 3 carrières proposées. Bouton "Lancer" désactivé, "Choisir" actif.

**-1** : Joueur a cliqué "Choisir", toutes carrières déverrouillées. Pas de bonus XP.

**-2** : Sélection validée, étape terminée.

### Persistance

`randomState.career` est sauvegardé : `CharGen.saveRandomState(character)`.

**Raison** : Si joueur revient en arrière puis retourne à l'étape Careers, état restauré (pas de reset des tirages).

## Mode libre (isFreeMode)

### Désactivation complète

**Comportement** :
- Boutons "Lancer" et "Choisir" masqués (`visibility: hidden`)
- Toutes carrières déverrouillées immédiatement
- Aucune pondération appliquée
- Pas de bonus XP

**Raison** : MJ peut créer concepts narratifs uniques (Nain Sorcier, Elfe Mendiant) sans contraintes système.

## Cas d'usage

### Joueur accepte tirage 1
1. Clic "Lancer" → Tirage 42 → "Enquêteur" (seuil 42)
2. Carrière acceptable pour concept → Clic "Enquêteur"
3. +50 XP bonus → Étape suivante

### Joueur refuse tirage 1, accepte tirage 2
1. Clic "Lancer" → "Mendiant" (seuil 10)
2. Pas intéressé → Clic "Lancer" à nouveau
3. 2 carrières supplémentaires → "Artisan" (3), "Milicien" (11)
4. Total 3 propositions : Mendiant, Artisan, Milicien
5. Clic "Milicien" → +25 XP bonus

### Joueur refuse tous tirages
1. Clic "Lancer" → "Ratier" (13)
2. Clic "Lancer" → 2 nouvelles : "Criminel" (17), "Voleur" (19)
3. Aucune ne convient → Clic "Choisir"
4. Liste complète déverrouillée → Choix manuel "Chevalier"
5. 0 XP bonus

### Nain de Middenheim
1. Filtrage espèce : Éliminer carrières où `rand.Nain` = ""
2. Filtrage région : Éliminer carrières où `rand.Middenheim` = ""
3. Seuils utilisés : Privilégier `rand.Middenheim` si existe, sinon `rand.Nain`
4. Tirage : Soldat favorisé (seuil 30 Middenheim vs 25 standard)

## Références croisées

- [careers.md](../../database/careers.md) - Table carrières
- [ponderation-aleatoire-careers.md](../../business-rules/ponderation-aleatoire-careers.md) - Règles pondération
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Filtrage espèce
- [filtrage-careers-region.md](../../business-rules/filtrage-careers-region.md) - Filtrage région
- [career-selection.md](./career-selection.md) - Sélection carrière globale
