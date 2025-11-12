# Glossaire Métier - Warhammer Character Generator V1

**Version** : 1.0
**Date** : 2025-11-11
**Statut** : COMPLET

---

## Introduction

Ce glossaire définit de manière **canonique** tous les termes métier utilisés dans le système Warhammer Fantasy Roleplay Character Generator V1. Il clarifie les ambiguïtés, distingue les concepts similaires et documente les relations entre termes.

**Organisation** :
1. Concepts Fondamentaux (Caractéristiques, Avances, Rangs, Paliers)
2. Système XP & Progression (Coûts, En/Hors Carrière)
3. Talents & Compétences (Effets, Spécialisations, Magie)
4. Données & Parsing (TmpAdvance, Formats)
5. Abréviations (Caractéristiques, Système)
6. Référence Rapide (Distinctions Clés)

---

## 1. Concepts Fondamentaux

### 1.1 Caractéristique / Caractéristique de Base

**Définition** : Attribut fondamental d'un personnage servant de base pour tests et calculs.

**10 Caractéristiques** :
- **Combat** : CC (Capacité de Combat), CT (Capacité de Tir)
- **Physique** : F (Force), E (Endurance), I (Initiative), Ag (Agilité), Dex (Dextérité)
- **Mental** : Int (Intelligence), FM (Force Mentale), Soc (Sociabilité)

**Distinctions** :
- **Valeur de base** : Générée à la création (espèce + 2d10)
- **Valeur finale** : Base + bonus talents + bonus étoile + avances carrière + avances XP
- **Bonus** : Dizaine de la caractéristique finale (CC 35 → BC 3)

**Exemple** :
```
Nain Guerrier
- CC base : 30 (espèce) + 12 (2d10) + 0 (talent) + 3 (étoile) = 45
- CC avances : +15 (carrière) + +10 (XP) = 25
- CC finale : 45 + 25 = 70
- Bonus CC : floor(70/10) = 7
```

**Relations** : Liée aux compétences (chaque skill a 1 caractéristique associée), talents (modifient via `addCharacteristic`), coûts XP (paliers 1-5 = 25 XP, ..., 66-70 = 450 XP).

---

### 1.2 Bonus / Bonus de Caractéristique

**Définition** : Dizaine d'une caractéristique finale, utilisée dans calculs mécaniques.

**Formule** : `Math.floor(caractéristique / 10)`

**Types de Bonus** :
- **BF** : Bonus Force (dégâts armes mêlée)
- **BE** : Bonus Endurance (calcul Points de Blessures)
- **BFM** : Bonus Force Mentale (tests volonté, PB certaines espèces)
- **BC, BT, BI, BAg, BDex, BInt, BSoc** : Bonus autres caractéristiques

**Exemple - Calcul PB Ogre** :
```
For = 45 → BF = 4
End = 50 → BE = 5
FM = 28 → BFM = 2
PB = (BF + 2×BE + BFM) × 2 = (4 + 10 + 2) × 2 = 32
```

**À NE PAS CONFONDRE** :
- "Bonus talent" = modificateur permanent (+5/rang via `addCharacteristic`)
- "Bonus étoile" = modificateur signe astrologique (+0 à +3)

---

### 1.3 Avance / Avances

**Définition canonique** : Amélioration d'une caractéristique/compétence/talent via dépense XP **après création**.

**Distinctions précises** :
- **Avance** : 1 rang supplémentaire (skill +5 → +10 = 1 avance)
- **Amélioration** : Terme générique (avances + bonus talents/carrière)
- **Augmentation** : Anglicisme à éviter (WFRP utilise "Advance")

**Types d'Avances** :
- **Caractéristiques** : +5 par rang (coûts 25-450 XP selon palier)
- **Compétences** : +5 par rang (coûts 10-380 XP selon palier)
- **Talents** : Rang 1, 2, 3, ... (100 XP × rang)

**Accumulation** :
```
Agitateur Palier 1 : +3 characteristics (15 pts)
Agitateur Palier 2 : +1 characteristic (5 pts) → TOTAL = 20 pts
Agitateur Palier 3 : +1 characteristic (5 pts) → TOTAL = 25 pts
```

**Relation** : Voir "Progression" (section 2.1), "Coûts XP" (section 2.2).

---

### 1.4 Rang / Rangs Multiples

**Définition** : Niveau de progression d'un talent ou compétence, acquis séquentiellement.

#### Rangs Compétences
- **Limite** : Théoriquement illimitée
- **Progression** : +5 valeur par rang
- **Coûts** : Paliers (1-5 = 10 XP, 6-10 = 15 XP, ..., 66-70 = 380 XP)

**Exemple** :
```
Athlétisme (Ag 35)
- Rang 0 : 35 (test Ag brut)
- Rang 1 : 40 (Ag + 5)
- Rang 2 : 45 (Ag + 10)
Coût total : 10 XP (rang 1) + 10 XP (rang 2) = 20 XP
```

#### Rangs Talents
- **Limite** : Variable par talent (max = 1, 2, "Aucun", ou "Bonus de X")
- **Coûts** : 100 XP × rang (rang 1 = 100 XP, rang 2 = 200 XP)

**Exemples** :
- **Ambidextre** : max 2 (rang 1 = -10 main 2e, rang 2 = 0)
- **Affable** : max 1 (unique)
- **Costaud** : max "Bonus de Force" (5 rangs si BF = 50 → 5)

**Acquisition multiple** : Même talent × rangs = entrées distinctes (total 100 + 200 + 300 XP).

**Relation** : Voir "Effets Talents" (section 3.1), "Coûts XP Talents" (section 2.2).

---

### 1.5 Palier / Niveau de Carrière

**Définition** :
- **Palier** : Étape de progression carrière (1, 2, 3, 4 - fixe)
- **Niveau de Carrière** : Position du personnage dans sa carrière actuelle

**Structure fixe** : Toutes les carrières = 4 paliers (aucune exception).

**Nomenclature sociale** :
- **Bronze 1-3** (Paliers 1-2) : Prestige faible
- **Argent 1-5** (Paliers 2-3) : Prestige moyen
- **Or 1-3** (Palier 4) : Prestige élevé

**IMPORTANT** : Status social (Bronze/Argent/Or) ≠ rangs de talent.

**Progression** :
```
Pamphlétaire (Palier 1) → Agitateur (Palier 2) → Démagogue (Palier 3) → Meneur (Palier 4)
```

**Accumulation** : Avantages paliers 1-N s'additionnent (sauf trappings qui se remplacent).

**Changement carrière** : Réinitialise à palier 1 nouvelle carrière, conserve tous acquis ancienne carrière.

**Relation** : Voir "Accumulation Avantages CareerLevels" (business-rules), "Changement Carrière" (workflows).

---

### 1.6 Distinction Rang vs Palier vs Niveau

| **Terme** | **Définition** | **Exemple** |
|-----------|----------------|-------------|
| **Rang** | Progression talent/compétence | Ambidextre rang 1, rang 2 |
| **Palier** | Étape carrière (toujours 4) | Pamphlétaire = palier 1, Agitateur = palier 2 |
| **Niveau** | Position générale (carrière/magie) | "Personnage niveau 3" = palier 3 |
| **Niveau prestige** | Statut social | Bronze 2, Argent 5, Or 1 |

---

## 2. Système XP & Progression

### 2.1 En Carrière vs Hors Carrière

**Définition** :
- **En carrière** : Élément listé dans le palier carrière **actuel**
- **Hors carrière** : Tout élément non listé au palier actuel

#### En Carrière
- **Coûts XP** : Normaux (table standard)
- **Accès** : Déblocage automatique dès palier atteint
- **Éléments** : Characteristics, skills, talents du palier courant

**Exemple** :
```
Agitateur Palier 2 : Skills = "Charme, Corps à corps (Escrime), ..."
→ Charme = en carrière (coût 10 XP rang 1)
```

#### Hors Carrière
- **Coûts XP** : ×2 (double)
- **Restrictions** : Compétences de base uniquement (type "base"), talents non-carrière
- **Éléments** : Tout ce qui n'est PAS au palier actuel

**Exemple** :
```
Agitateur Palier 2 : Athlétisme non listé
→ Athlétisme = hors carrière (coût 20 XP rang 1 au lieu de 10)
```

**IMPORTANT Multi-Carrière** : Tous éléments anciens carrières restent "en carrière" (coûts ×1).

**Relation** : Voir "Coûts XP" (section 2.2), "Changement Carrière" (workflows).

---

### 2.2 Coûts XP

#### Compétences (Skills)
| **Palier** | **Coût XP** | **Exemple** |
|------------|-------------|-------------|
| 1-5 | 10 XP | Rang 0→5 = 50 XP total |
| 6-10 | 15 XP | Rang 6→10 = 75 XP total |
| 11-15 | 20 XP | Rang 11→15 = 100 XP total |
| ... | ... | ... |
| 66-70 | 380 XP | Rang 66→70 = 1900 XP total |

**Formule** : Progressif par palier (1-5, 6-10, etc.).

#### Caractéristiques (Characteristics)
| **Palier** | **Coût XP** | **Exemple** |
|------------|-------------|-------------|
| 1-5 | 25 XP | Rang 0→5 = 125 XP total |
| 6-10 | 30 XP | Rang 6→10 = 150 XP total |
| ... | ... | ... |
| 66-70 | 450 XP | Rang 66→70 = 2250 XP total |

**Coûts ~ 2× skills** (premier palier).

#### Talents
- **Coût** : 100 XP × rang
  - Rang 1 : 100 XP
  - Rang 2 : 200 XP
  - Rang 3 : 300 XP
  - Rang 4 : 400 XP
- **Exception** : Talent "Magie du Chaos" = 100 XP fixe tous rangs

#### Multiplicateur Hors Carrière
**Coûts × 2** si élément non listé au palier actuel.

**Exemple** :
```
Athlétisme hors carrière : 10 XP → 20 XP (rang 1)
CC hors carrière : 25 XP → 50 XP (avance 1)
```

**Relation** : Voir "En/Hors Carrière" (section 2.1), "Workflow Progression XP" (workflows).

---

### 2.3 Acquisition vs Amélioration

**Définition** :
- **Acquisition** : Obtenir compétence/talent à rang 0 → 1
- **Amélioration** : Progression dans rangs existants

#### Acquisition
- **Skills** : Déblocage rang 0 (gratuit via carrière/talent) → rang 1 (coût XP)
- **Talents** : Rang 1 = 100 XP

#### Amélioration
- **Skills** : Rangs suivants (+5 chaque, coûts paliers)
- **Talents** : Rangs suivants (+100 XP par rang)

**Exemple** :
```
1. Carrière donne "Charme" rang 0 (gratuit) → ACQUISITION
2. Joueur achète Charme +5 (10 XP) → AMÉLIORATION rang 1
3. Joueur achète Charme +10 (10 XP) → AMÉLIORATION rang 2
```

**Relation** : Voir "Déblocage Éléments" (section 2.4).

---

### 2.4 Déblocage Éléments par Palier

**Distribution par Palier** :

| **Palier** | **Characteristics** | **Skills** | **Talents** | **Trappings** |
|------------|---------------------|-----------|-------------|---------------|
| **1** | 3 (+15 pts) | 8-10 | 4 | Classe + N1 |
| **2** | +1 (+5 pts) | +6 | +4 | N2 (remplace) |
| **3** | +1 (+5 pts) | +4 | +4 | N3 (remplace) |
| **4** | +1 (+5 pts) | +2 | +4 | N4 (remplace) |
| **TOTAL** | 6 (+30 pts) | 20-22 | 16 | N4 uniquement |

**Accumulation** :
- **Characteristics** : 3 + 1 + 1 + 1 = 6 (15 + 5 + 5 + 5 = 30 points)
- **Skills** : 8 + 6 + 4 + 2 = 20 (cumul)
- **Talents** : 4 + 4 + 4 + 4 = 16 (cumul)
- **Trappings** : REMPLACEMENT (palier 2 efface palier 1, etc.)

**IMPORTANT** : Trappings NE s'accumulent PAS (seul palier actuel compte).

**Relation** : Voir "Accumulation Avantages CareerLevels" (business-rules).

---

## 3. Talents & Compétences

### 3.1 Effets Talents (4 Mécanismes)

#### 1. addCharacteristic
**Définition** : Bonus permanent à une caractéristique.

**Formules** :
- **Standard** : +5/rang
- **Points de Blessures** : +BE/rang (variable selon espèce)
- **Mouvement** : +1/rang
- **Corruption** : +1/rang

**Exemple** :
```
Costaud rang 2 → +10 End (2 × +5)
Dur à cuire rang 1 → +BE PB (Nain BE=4 → +4 PB)
```

**Max rangs** : Fixe (1, 2), dynamique ("Bonus de X"), ou illimité ("Aucun").

#### 2. addSkill
**Définition** : Compétence gratuite à rang 0, origine "talent".

**Format** :
- "Nom" (simple)
- "Nom (Spé fixe)" (spécialisation imposée)
- "Nom (Au choix)" (joueur sélectionne)

**Retrait** : Si talent perdu, skill retirée (sauf si avances XP investies).

**Exemple** :
```
Linguiste → addSkill "Langue (Au choix)" rang 0
Joueur choisit "Langue (Bretonnien)"
```

#### 3. addTalent
**Définition** : Débloque autre talent pour achat XP.

**Condition** : Talent source acquis ≥ 1 rang.

**Persistance** : Talent débloqué reste accessible même si source perdue.

**Exemple** :
```
Étiquette (rang 1) → addTalent "Intrigant"
→ Intrigant disponible achat 100 XP
```

**Pas de cycles** : A→B→C→A interdit (validation cyclique).

#### 4. addMagic
**Définition** : Accès domaine magique.

**Domaines** :
- **Béni** : Magie divine (dieux)
- **Magie mineure** : Sorts simples
- **Magie des Arcanes** : 9 Vents de Magie
- **Magie du Chaos** : Dhar
- **Invocation** : Créatures

**Déblocage sorts** : Via achat XP après talent acquis.

**Exemple** :
```
Sorcier → addMagic "Arcanes"
→ Accès sorts Aqshy, Azyr, Chamon, etc.
```

**Relation** : Voir "Domaines Magie" (section 3.3).

---

### 3.2 Spécialisation (Skills & Talents)

**Définition** : Sous-catégorie d'une compétence/talent, acquisition distincte par spécialisation.

#### Skills Groupées
- **Format stockage** : "Nom (Spécialisation)"
- **Exemples** : Art (Peinture), Corps à corps (Escrime), Langue (Bretonnien)

**Choix** :
- **Fixe** : "Métier (Charpentier)" (imposé)
- **Au choix** : "Métier (Au choix)" (joueur sélectionne)

**Acquisition multiple** : Même compétence × 2 specs = 2 entrées distinctes.

**Exemple** :
```
Art (Peinture) rang 1 : 10 XP
Art (Sculpture) rang 1 : 10 XP (distinct)
```

#### Skills Non Groupées
- **Format** : Nom simple, spec vide
- **Exemples** : Athlétisme, Calme, Esquive

#### Talents Spécialisés
- **Champs** : `specName` (label) + `specs` (liste options)
- **Exemples** : Art, Terrain, Savoir divin

**Relation** : Voir "Parsing Skills" (business-rules).

---

### 3.3 Domaines Magie

**Définition** : Catégorie de magie accessible via talents (`addMagic`).

| **Domaine** | **Description** | **Exemples Sorts** |
|-------------|-----------------|-------------------|
| **Béni** | Magie divine (dieux) | Manann, Morr, Sigmar, Taal, Ulric, Verena |
| **Magie mineure** | Sorts simples | Refroidir, Enflammer, Aiguiser |
| **Magie des Arcanes** | 9 Vents de Magie | Aqshy, Azyr, Chamon, Ghur, Ghyran, Hysh, Shyish, Ulgu |
| **Magie du Chaos** | Dhar corrompu | Sorts Chaos |
| **Invocation** | Créatures démons | Créatures invoquées |

**Compétence requise** : Focalisation (+ Langue Magick souvent).

**Spécialisations Focalisation** :
- **Groupée** : 9 Vents (Aqshy, Azyr, etc.)
- **Non groupée** : Focalisation simple (magie mineure/béni)

**Exemple** :
```
Prêtre Sigmar
- Talent "Béni (Sigmar)" → addMagic "Béni"
- Compétence "Focalisation" rang 0 (non groupée)
- Accès sorts Sigmar (Bénédiction, Guérison divine, etc.)
```

**Relation** : Voir "Talents Magie" (database).

---

## 4. Données & Parsing

### 4.1 TmpAdvance vs Advance vs Career

**Définition** :

#### tmpAdvance
- **Nature** : Données temporaires en cours sélection/modification (état wizard)
- **Persistance** : Non sauvegardées
- **Reset** : Si changement input ou annulation
- **Usage** : Validation before commit

#### Advance
- **Nature** : Avance finalisée (après validation)
- **Persistance** : Sauvegardée dans personnage
- **Count** : Contre limite (rangs max talents)

#### Career
- **Nature** : Contexte actuel du personnage
- **Détermine** : Coûts XP (en carrière vs hors), accès éléments

**Exemple Workflow** :
```
1. Joueur sélectionne CC +5 → tmpAdvance = { CC: +5 }
2. Validation → tmpAdvance vérifié (XP suffisant, limites)
3. Confirmation → tmpAdvance → advance (sauvegardé)
```

**Relation** : Voir "Workflow Progression XP" (workflows).

---

### 4.2 RandomState / Rand / Roll

**Définition** :

#### Rand
- **Nature** : Champ valeur probabilité (1-100)
- **Usage** : Générer résultat aléatoire pondéré

**Exemples** :
```
Species rand:
- Humain: 90 (90% cumulatif)
- Nain: 97 (7% supplémentaire)
- Elfe: 100 (3% supplémentaire)

Careers rand par espèce:
{ "Humain": 85, "Nain": 0, "Elfe": 45 }
```

#### RandomState
- **Nature** : Objet état progression tirage
- **Valeurs** :
  - `0` : Non lancé
  - `1` : Accepté (bonus +20 XP)
  - `-1` : Manuel (forcé par joueur)
  - `-2` : Finalisé (verrouillé)

**Bonus aléatoire** : +20 XP si premier résultat aléatoire accepté (faithful to roleplay spirit).

#### Roll
- **Nature** : Valeur générée (ex: 2d10 pour caractéristiques)
- **Usage** : Tirage dés physique ou numérique

**Relation** : Voir "Génération Aléatoire" (patterns).

---

### 4.3 Format Parsing (Conventions)

**Règles strictes** :

#### Séparation
- **Virgule-espace** : `", "` (espace SIGNIFICATIF)
- **Exemple** : "CC, Int, Soc" → 3 éléments

#### Choix Exclusifs
- **Espace-ou-espace** : `" ou "` (espace requis)
- **Exemple** : "Perspicace ou Affable" → array [Perspicace, Affable]

**ATTENTION CRITIQUE** :
- `" ou "` (avec espaces) = **Opérateur** de choix
- `"ou"` (sans espaces) = **Partie du label** (ex: "Loueur de bateau")

#### Quantités
- **Nombre préfixe** : "3 Talent aléatoire" = 3 talents
- **Format** : "{nombre} {label}"

#### Spécialisations
- **Parenthèses** : "Compétence (Spécialisation)" obligatoires
- **Exemples** : "Art (Peinture)", "Langue (Bretonnien)"

#### Validation
- **Tous noms** : Doivent exister dans tables respectives
- **Format** : Strict (espaces, virgules, parenthèses)

**Relation** : Voir "Parsing Skills/Talents" (business-rules).

---

## 5. Abréviations

### 5.1 Caractéristiques (10 principales)

| **Abréviation** | **Terme Complet** | **Usage** |
|-----------------|-------------------|-----------|
| **CC** | Capacité de Combat | Corps-à-corps |
| **CT** | Capacité de Tir | Projectiles |
| **F** | Force | Puissance physique |
| **E** | Endurance | Résistance physique |
| **I** | Initiative | Rapidité réaction |
| **Ag** | Agilité | Coordination générale |
| **Dex** | Dextérité | Habileté manuelle |
| **Int** | Intelligence | Intellect |
| **FM** | Force Mentale | Volonté/résistance mentale |
| **Soc** | Sociabilité | Charisme |

### 5.2 Bonus Caractéristiques (dérivées)

| **Abréviation** | **Formule** |
|-----------------|-------------|
| **BC** | floor(CC/10) |
| **BT** | floor(CT/10) |
| **BF** | floor(F/10) |
| **BE** | floor(E/10) |
| **BI** | floor(I/10) |
| **BAg** | floor(Ag/10) |
| **BDex** | floor(Dex/10) |
| **BInt** | floor(Int/10) |
| **BFM** | floor(FM/10) |
| **BSoc** | floor(Soc/10) |

### 5.3 Système (Points & Ressources)

| **Abréviation** | **Terme** |
|-----------------|-----------|
| **XP / PX** | Points d'Expérience |
| **PB** | Points de Blessure |
| **M** | Mouvement (cases/tours) |
| **DR** | Degrés de Réussite (tests) |
| **BA** | Bonus d'Attaque |
| **PA** | Points d'Armure |

### 5.4 Autres Abréviations

| **Abréviation** | **Signification** |
|-----------------|-------------------|
| **Destin** | Pool de Points de Destin |
| **Résilience** | Pool Points Résilience |
| **Chance** | Caractéristique spéciale |
| **Corruption** | Points Corruption (Chaos) |

---

## 6. Référence Rapide - Distinctions Clés

### 6.1 Paires Facilement Confondues

| **Terme A** | **Terme B** | **Distinction** |
|-------------|-------------|-----------------|
| **Rang** | **Palier** | Rang = progression talent (1-N), Palier = position carrière (1-4) |
| **Avance** | **Bonus** | Avance = acquisition XP, Bonus = dizaine caractéristique |
| **Max** | **Limite** | Max = plafond rangs talent, Limite = restriction système |
| **En carrière** | **Hors carrière** | En = dans palier courant (coût ×1), Hors = autre (coût ×2) |
| **Rand** | **RandomState** | Rand = valeur prob., RandomState = état tirage |
| **Total** | **Cumul** | Total = somme (N1-4 skills=20), Cumul = résultat accumulation |
| **Trappings** | **Équipement** | Trappings = terme technique, Équipement = sens générique |
| **Status carrière** | **Status en jeu** | Status carrière = prestige (Bronze/Or), Status jeu = conditions (Peur) |
| **Spécialisation** | **Au choix** | Spec = type fixe (Peinture), Au choix = sélection libre joueur |
| **Basic** | **Advanced** | Basic = accessible tous, Advanced = require formation |
| **Acquisition** | **Amélioration** | Acquisition = 0→1, Amélioration = progression rangs |
| **Base** | **Valeur finale** | Base = générée (espèce+roll), Finale = base+avances |

### 6.2 Différences Clés Concepts

#### Niveau vs Palier vs Rang
- **Rang** : Progression talent/compétence (Ambidextre rang 1, 2)
- **Palier** : Étape carrière (toujours 4) (Pamphlétaire = palier 1)
- **Niveau** : Position générale ("Personnage niveau 3" = palier 3)

#### Avances temporaires vs finales
- **Temporaire** : En cours validation
- **Final** : Sauvegardé définitif
- **Contexte carrière** : Détermine coûts (en/hors carrière)

#### Caractéristique Value vs Base vs Bonus
- **Base** : Générée initiale (espèce + roll)
- **Finale** : Base + avances + talents + étoile
- **Bonus** : floor(finale / 10)

---

## 7. Relations Inter-Concepts

### 7.1 Hiérarchie Espèce → Carrière → Palier

```
Espèce (Nain)
  ├─ Caractéristiques base (CC 30, E 40, etc.)
  ├─ Skills raciaux (Calme, Résistance (Magie))
  ├─ Talents raciaux (Vision nocturne, Haine (Orcs))
  └─ Filtre Carrières (Artisan, Guerrier, Tueur, etc.)

Carrière (Artisan)
  ├─ Palier 1 : 3 chars (+15), 8 skills, 4 talents, trappings N1
  ├─ Palier 2 : +1 char (+5), +6 skills, +4 talents, trappings N2 (remplace)
  ├─ Palier 3 : +1 char (+5), +4 skills, +4 talents, trappings N3 (remplace)
  └─ Palier 4 : +1 char (+5), +2 skills, +4 talents, trappings N4 (remplace)

Palier (Artisan Palier 2)
  ├─ Détermine coûts XP (en carrière vs hors)
  ├─ Accumulation skills/talents (total = N1 + N2)
  └─ Remplacement trappings (N2 uniquement)
```

### 7.2 Relations Talents → Effets

```
Talent (Costaud)
  ├─ addCharacteristic (+5 End/rang)
  ├─ max = "Aucun" (rangs illimités)
  └─ Coût 100 XP × rang

Talent (Linguiste)
  ├─ addSkill ("Langue (Au choix)" rang 0)
  └─ max = 1 (unique)

Talent (Étiquette)
  ├─ addTalent ("Intrigant")
  └─ Débloque achat Intrigant 100 XP

Talent (Sorcier)
  ├─ addMagic ("Arcanes")
  └─ Accès sorts 9 Vents
```

### 7.3 Relations Skills → Caractéristiques

```
Skill (Athlétisme)
  ├─ characteristic = "Agilité"
  ├─ type = "base" (accessible tous)
  └─ Test = Ag + rangs×5 (ex: Ag 35 + 10 = 45)

Skill (Focalisation)
  ├─ characteristic = "Force Mentale"
  ├─ type = "advanced" (require formation)
  ├─ Groupée = 9 Vents (Aqshy, Azyr, etc.)
  └─ Test = FM + rangs×5
```

---

## Conclusion

Ce glossaire définit **tous les termes métier fondamentaux** du système Warhammer Character Generator V1 avec rigueur et cohérence. Il sert de référence canonique pour :

- **Migration technologique** : Terminologie unifiée et non ambiguë
- **Onboarding développeurs** : Compréhension rapide concepts métier
- **Documentation validation** : Définitions précises pour tests
- **Communication équipe** : Vocabulaire commun évitant malentendus

**Navigation** :
- Pour workflows complets → `audit/features/workflows/*.md`
- Pour règles métier → `audit/business-rules/*.md`
- Pour schémas données → `audit/database/*.md`
- Pour validation → `audit/business-rules/validation-globale.md`
