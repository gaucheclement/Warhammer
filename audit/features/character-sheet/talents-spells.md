# Character Sheet - Talents et Sorts

## Contexte

Affichage des talents dans onglet "Compétences/Talents" (panneau droit suite aux compétences) et sorts dans onglet "Sorts" dédié.

**Objectif** : Consultation rapide des talents actifs et sorts disponibles en jeu.

**Source** : character.talents[] et character.spells[]

## Talents

### Onglet "Compétences/Talents" - Suite Panneau Droit

**Emplacement** : Après la liste des compétences groupées/avancées

**Format tableau** :

| Nom                        | Rang | Description     |
|----------------------------|------|-----------------|
| Affable                    | 1    | +5 Sociabilité  |
| Ambidextre                 | 1    | Pas de malus    |
| Artiste (Calligraphie)     | 2/BA | Bonus tests Art |

**Colonnes** :
1. **Nom** : Label + spécialisation (si présente) + symbole carrière - Exemple : "⚔️ Affinité pour les armes"
2. **Rang** : Rang actuel / Rang maximum - Exemple : "1" ou "2/BA" (Bonus Agilité) ou "3/4" (rang 3 sur max 4)
3. **Description** : Champ test (description courte effet) - Exemple : "+5 Sociabilité", "Relance tests Intuition"

**Filtre** : Talents avec getAdvance() > 0 (au moins 1 rang)

**Tri** : Alphabétique (Helper.sort appliqué sur talents[])

**Clic** : Popup description complète talent (Helper.showPopin)

### Rangs Maximum

**Types de max** :
- **1** : Talent unique (max = 1) - Exemple : "Ambidextre 1"
- **Nombre fixe** : Exemple : "Affable 2/4" (2 rangs sur 4 possibles)
- **Formule dynamique** : Exemple : "Chanceux 3/BA" (max = Bonus Agilité)
- **Illimité** : Exemple : "Artiste (Calligraphie) 5" (aucune limite, affiche rang sans max)

**Formules courantes** :
- BA = Bonus d'Agilité
- BF = Bonus de Force
- BFM = Bonus de Force Mentale
- BE = Bonus d'Endurance

## Sorts

### Onglet "Sorts"

**Organisation** : 5 catégories affichées conditionnellement selon talents magiques possédés

#### En-Tête Onglet

**Dieu Patron** (si talent Béni ou Invocation) :
```
Dieu: Sigmar
```
Clic → Popup description dieu complet

**Domaine Magie Arcane** (si talent Magie des Arcanes) :
```
Domaine de Magie: Ghur
```
Clic → Popup description lore (Ghur)

**Domaine Chaos** (si talent Magie du Chaos) :
```
Domaine du Chaos: Nurgle
```
Clic → Popup description lore Chaos

#### Catégories de Sorts

**1. Béni** (Bénédictions)
- Affichées si talent "Béni (Dieu)" possédé
- Sorts récupérés depuis god.getSpells()
- Exemples : "Bénédiction de Courage", "Bénédiction de Force"

**2. Invocation** (Miracles)
- Affichées si talent "Invocation (Dieu)" possédé
- Sorts récupérés depuis god.getSpells()
- Exemples : "Miracle de Guérison", "Courroux divin"

**3. Magie mineure**
- Affichées si talent "Petite Magie" possédé
- Sorts type "Magie mineure"
- Exemples : "Lumière", "Apaisement", "Sommeil"

**4. Magie des Arcanes**
- Affichées si talent "Magie des Arcanes (Domaine)" possédé
- Sorts filtrés par subType = domaine (spec du talent)
- Exemples : "Peau d'écorce" (Ghur), "Lame de feu" (Aqshy)

**5. Magie du Chaos**
- Affichées si talent "Magie du Chaos (Domaine)" possédé
- Sorts filtrés par subType = domaine Chaos
- Exemples : "Putréfaction" (Nurgle), "Mutation" (Tzeentch)

### Format Tableau Sorts

Chaque sort affiché sur 2 colonnes (gauche/droite) pour compacité.

**Colonnes** :

| Nom                  | NI | Portée        | Cible        | Durée    | Effet          |
|----------------------|----|---------------|--------------|----------|----------------|
| Bénédiction Courage  | 2  | 12 mètres     | 1 allié      | 1 round  | +10 Calme      |
| Peau d'écorce        | 5  | Personnelle   | Lanceur      | 6 rounds | +2 PA partout  |

1. **Nom** : Label du sort (+ spécialisation domaine Arcane si applicable)
2. **NI** : Niveau d'Incantation (cn)
3. **Portée** : Range (Personnelle, X mètres, Toucher, etc.)
4. **Cible** : Target (Lanceur, 1 allié, Zone, etc.)
5. **Durée** : Duration (Instantané, X rounds, Permanent, etc.)
6. **Effet** : Description courte (field effect, colonne large 80%)

**Clic** : Popup description complète sort

## Gestion Talents Magiques

### Application Automatique

**Mécanisme applyTalent()** : Maintient synchronisation talents ↔ sorts

**Logique** :
1. Parcourt tous talents avec getTotal() > 0
2. Si talent.data.addMagic présent → Ajoute sorts correspondants
3. Si talent supprimé/désactivé → Retire sorts automatiquement

**Types addMagic** :
- **Béni** : Récupère blessings du dieu (talent.spec = nom dieu)
- **Invocation** : Récupère miracles du dieu
- **Petite Magie** : Accès à tous sorts Magie mineure
- **Magie des Arcanes** : Accès sorts du domaine (talent.spec = lore)
- **Magie du Chaos** : Accès sorts du domaine Chaos

**Exemple** : Acquisition talent "Béni (Sigmar)" → Ajoute automatiquement 6 bénédictions de Sigmar

### Suppression Automatique

Lors de applyTalent(), les sorts dont le talent source n'existe plus sont retirés de spells[].

**Exemple** : Perte talent "Magie des Arcanes (Ghur)" → Retire tous sorts Ghur de la liste

## Symbole Niveau Carrière

**Talents** : Même logique que compétences

**Mécanisme** :
1. Cherche talent dans allByCareer[careerID][niveaux 1-4]
2. Si trouvé → Récupère origin[0] (premier niveau acquis)
3. Affiche icône selon careerLevel

**Exemple** : Talent "Bagarreur" acquis niveau 2 Agitateur → Icône Bronze 2

## Exemples Concrets

### Agitateur - Talents

Bagarreur ⚔️ 1 (+1 dégât désarmé), Chanceux 2/3 (Relance 2 tests), Éloquence ⚔️ 1 (+1 DD Charme)

### Prêtre Sigmar - Sorts Béni

Dieu: Sigmar | Bénédiction Courage NI2 12m 1allié 1rd +10Calme, Bénédiction Force NI3 Toucher 1allié 6rd +1BF

### Sorcier Ghur - Sorts Arcanes

Domaine: Ghur | Peau d'écorce NI5 Perso 6rd +2PA, Forme Bête NI7 Perso 1h Transformation, Maître Bêtes NI4 24m Perm Contrôle

## Relations

### Dépendances Tables

- **database/talents.md** : Schéma 150+ talents
- **database/spells.md** : Schéma 200+ sorts
- **database/gods.md** : Lien dieu → blessings/miracles
- **database/lores.md** : Domaines magie (16)

### Dépendances Features

- **character-model/talents.md** : Stockage talents[]
- **character-model/spells.md** : Stockage spells[]
- **wizard/talents-*.md** : Sélection talents
- **business-rules/application-effets-talents.md** : Logique applyTalent()
- **business-rules/talents-ajout-skills-magie.md** : Mécanisme addMagic

## Voir Aussi

- **character-sheet/characteristics-skills.md** : Première partie onglet Compétences/Talents
- **wizard/talents-choice.md** : Sélection talents au wizard
- **business-rules/filtrage-spells-lore.md** : Filtrage sorts par domaine
