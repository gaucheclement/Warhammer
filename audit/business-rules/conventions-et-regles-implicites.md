# Conventions et Règles Implicites

**Contexte** : Documentation exhaustive des conventions implicites, valeurs par défaut et règles d'application du système Warhammer Character Generator V1.

**Relations** :
- Business Rules : `parsing-wizard-data.md`, `application-effets-talents.md`, `talents-effets-mecanismes.md`, `accumulation-avantages-careerlevels.md`
- Patterns : `pattern-parsing.md`, `pattern-metadonnees-base.md`, `pattern-specialisations.md`
- Features : `character-edit.md`, `species.md`, `career.md`, `skills.md`, `talents.md`

---

## 1. Ordre d'Application des Modificateurs

### 1.1 Calcul des Caractéristiques Finales

**Ordre Séquentiel** (strict, non modifiable) :

1. **Base Espèce** (`specie`) : Valeur de base selon race (ex: Humain CC=30, Nain E=40)
2. **Tirage Aléatoire** (`roll`) : +0 à +20 (2d10), mode aléatoire uniquement
3. **Bonus Talents** (`talent`) : Cumul modificateurs tous talents actifs (rangs > 0)
4. **Bonus Étoile** (`star`) : Modificateur signe astral (+0 à +3 sur 1-2 caractéristiques)
5. **Augmentations Carrière** (`career`) : Bonus niveaux carrière (+5 par niveau, jusqu'à 4 niveaux)
6. **Augmentations XP** (`advance`) : Améliorations payées avec XP post-création

**Formules** :
```
Base = espèce + tirage aléatoire + bonus talents + bonus étoile
Avances = avances XP + avances carrière + avances temporaires
Total = Base + Avances
```

**Exemple** : Nain Guerrier, Force
- specie = 30 (base Nain)
- roll = 12 (tirage 2d10)
- talent = 0 (aucun talent modifiant Force)
- star = +2 (Signe du Guerrier)
- career = 10 (niveau 1: +5, niveau 2: +5)
- advance = 15 (acheté avec XP)
- **Total** : 30 + 12 + 0 + 2 + 10 + 15 = 69

**Bonus Dérivé** : `floor(Total / 10)` = floor(69/10) = **6**

**Références** : `audit/business-rules/application-effets-talents.md`, `audit/features/species.md`

### 1.2 Ordre d'Application des Effets de Talents

**Séquence Stricte** (fonction `applyTalent()`) :

**Phase 0 - Réinitialisation** :
- `characteristic.talent = 0` pour TOUTES les caractéristiques
- Préparation état vierge avant recalcul

**Phase 1 - Parcours Talents** :
- Itération sur tous talents actifs (rang > 0)
- Talents désactivés ignorés

**Phase 2 - Application par Priorité** :
- **P1 - addCharacteristic** : Calcul et ajout bonus caractéristiques (+5, +1, +Bonus)
- **P2 - addMagic** : Collecte domaines magie, ajout sorts spéciaux
- **P3 - addSkill** : Ajout compétences origine "talent"
- **P4 - addTalent** : Ajout talents déblocage chaîne (addTalent)
- **P5 - Nettoyage** : Suppression sorts/compétences non couverts par talents actifs

**Phase 3 - Recalcul Cascade** :
- Caractéristiques dérivées (Points de Blessures, Mouvement)
- Bonus (÷10)
- Encombrement (Bonus Force + Bonus Endurance)

**Exemple** : Perte talent "Affable" (+5 Sociabilité)
1. Réinitialisation : Soc.talent = 0
2. Parcours talents : "Affable" rang = 0 → Ignoré
3. P1 : Aucun bonus Soc appliqué (talent inactif)
4. Recalcul : Soc finale = Base + Avances (sans +5)
5. Impact cascade : Bonus Soc réduit, compétences Charme/Commandement/Ragots réduites

**Références** : `audit/business-rules/application-effets-talents.md`

### 1.3 Séquence Wizard (Création Personnage)

**Ordre Étapes** :

1. **Espèce** → Caractéristiques base + compétences raciales (+5/+3) + talents raciaux
2. **Carrière** → Avances carrière niveau 1 (3 carac +5) + compétences carrière (40 pts) + talents carrière
3. **Étoile** → Bonus caractéristiques (+0 à +3 sur 1-2 carac)
4. **Talents** → Application effets (modificateurs carac, ajout compétences/magie)
5. **XP** → Augmentations post-création (optionnelles)

**Dépendances** :
- Carrière DÉPEND de Espèce (filtrage par `rand.{espèce}`)
- Talents DÉPENDENT de Carrière (prérequis, coûts)
- XP DÉPEND de Tous (budget basé sur espèce + carrière + étoile)

**Références** : `audit/features/wizard/species.md`, `audit/features/wizard/career.md`

---

## 2. Priorités de Calcul

### 2.1 Interdépendances de Calcul

**Ordre de Recalcul en Cascade** :

1. **Caractéristiques Principales** (Force, Endurance, Agilité, etc.)
2. **Bonus** (floor(Caractéristique / 10))
3. **Avances Skills Espèce** (+5 sur 3 skills, +3 sur 3 skills)
4. **Avances Skills Carrière** (40 points répartis, max 10/skill)
5. **Valeurs Finales Skills** (Caractéristique liée + Avances)
6. **Attributs Dérivés** (Points de Blessures, Mouvement, Encombrement)

**Impact Modificateurs** :
- Talent modifie carac → **Recalcul automatique** Bonus → Recalcul skills liées
- Exemple : Talent "Affable" (+5 Soc) → Soc 30→35 → Bonus 3→3 → Charme 33→38

**Références** : `audit/features/character-edit.md`

### 2.2 Talents Modifiant Caractéristiques Utilisées par Autres Talents

**Cas de Max Dynamique** :
- Talents avec `max = "Bonus de {Caractéristique}"` (ex: Chanceux max=Bonus Soc)
- Si caractéristique modifiée → **Recalcul automatique max**

**Conservation Rangs** :
- Si Bonus baisse → Rangs acquis **conservés** (grandfathering)
- Nouveaux achats **bloqués** jusqu'à max ≥ rangs actuels

**Exemple** : Talent "Chanceux" (max = Bonus Sociabilité)
1. **Situation Initiale** :
   - Sociabilité 35 (Bonus 3) → Max = 3
   - Acquiert rangs 1, 2, 3 (Total 3/3) ✓

2. **Malédiction Réduit Sociabilité** :
   - Sociabilité 28 (Bonus 2) → Max = 2
   - Total actuel = 3 (dépasse max!)

3. **Conservation et Blocage** :
   - Rangs 1, 2, 3 **conservés** (grandfathering)
   - Rang 4 **impossible** tant que Sociabilité < 40 (Bonus 4)

4. **Récupération** :
   - Améliorer Sociabilité → Déblocage progressif nouveaux rangs

**Références** : `audit/business-rules/talents-effets-mecanismes.md`

### 2.3 Calcul des Attributs Dérivés

**Dépendances** :

**Points de Blessures** (formules par espèce) :
- Humain/Elfe/Halfling : `(Bonus Endurance × 2) + Bonus Force Mentale`
- Nain : `Bonus Force + (Bonus Endurance × 2) + Bonus Force Mentale`
- Ogre : `((Bonus Force + (Bonus Endurance × 2) + Bonus Force Mentale) × 2)`

**Mouvement** :
- Base espèce (fixe: Humain 4, Nain 3, Halfling 3, Elfe 5)
- + Modificateurs talents (ex: "Rapide" +1)
- Dérivés : Marche = M × 2, Course = M × 4

**Encombrement** :
- Limite = (Bonus Force + Bonus Endurance) × 10
- Seuils : Normal (≤ limite), Surchargé (> limite, ≤ limite×2), Immobilisé (> limite×2)

**Exemple** : Nain Guerrier (Force 35, Endurance 40, Force Mentale 25)
- Bonus : BF=3, BE=4, BFM=2
- PB = BF + (BE × 2) + BFM = 3 + 8 + 2 = **13 Blessures**
- Limite Enc = (BF + BE) × 10 = 7 × 10 = **70 enc**

**Références** : `audit/features/character-edit.md`, `audit/database/species.md`

---

## 3. Valeurs par Défaut

### 3.1 Champs Personnage (Initialisation)

**Composantes Caractéristique** :
- Augmentations validées (permanentes)
- Augmentations temporaires (en cours validation)
- Origine espèce (base fixe)
- Origine carrière (avances gratuites)
- Tirage aléatoire (0 si mode manuel)
- Bonus talents (modificateurs)
- Bonus astral (signe)

**Composantes XP** :
- Budget total (espèce + carrière + étoile)
- Historique transactions (log dépenses)
- XP dépensé validé (permanent)
- XP dépensé temporaire (en cours)

**États Génération Aléatoire** :
- Espèce : non tiré / accepté (+20 XP) / manuel / finalisé
- Carrière : aucun / tirage 1 (+50 XP) / tirage 2 (+25 XP) / tirage 3 (0 XP)
- Signe : non tiré / tiré (+25 XP si accepté) / finalisé
- Caractéristiques : valeurs imposées conservées entre tirages
- Talents : talents imposés conservés entre tirages

**Références** : `audit/features/character-edit.md`, `audit/patterns/pattern-generation-aleatoire.md`

### 3.2 Valeurs Implicites dans Parsing

**Caractéristiques (careerLevels)** :
- Format : `"Nom1, Nom2, Nom3"`
- **Valeur implicite : +5** pour chaque nom (pas de nombre explicite)
- Exemples :
  - `"Force, Endurance, Dextérité"` → Force +5, Endurance +5, Dextérité +5
  - `"Agilité"` → Agilité +5

**Trappings (quantités)** :
- Format sans quantité : `"Épée"` → **Quantité implicite : 1**
- Format avec quantité : `"Rations (7)"` → Quantité explicite : 7
- Format avec dé : `"Chiffon (1d10)"` → Quantité aléatoire (tirage lors création)

**Skills/Talents** :
- Sans opérateur : Item unique
- Avec " ou " : Choix exclusif (1 parmi N)
- "(Au choix)" : Spécialisation requise lors acquisition

**Références** : `audit/business-rules/parsing-wizard-data.md`

### 3.3 États Progression Wizard

**Bonus XP Génération Aléatoire** :

| Étape | Tirage Accepté | Choix Manuel |
|-------|----------------|--------------|
| **Espèce** | +20 XP | 0 XP |
| **Carrière** | Tirage 1: +50 XP, Tirage 2: +25 XP, Tirage 3: 0 XP | 0 XP |
| **Signe** | +25 XP | 0 XP |

**Signification États** :
- **0** : Non initié, attente action
- **1** : Première action aléatoire (+XP maximum)
- **-1** : Mode choix manuel activé (pas de bonus XP)
- **-2** : Choix finalisé, étape validée

**Références** : `audit/patterns/pattern-generation-aleatoire.md`

---

## 4. Conventions d'Affichage

### 4.1 Format Compétences et Talents

**Compétences avec Spécialisation** :
- Format : `"Label (Spécialisation)"`
- Exemples : `"Art (Peinture)"`, `"Langue (Bretonnien)"`, `"Corps à corps (Base)"`

**Compétences Attente Spécialisation** :
- Format : `"Label (Au choix)"` avec indicateur visuel
- Affichage : **Souligné**, couleur distinctive (orange), icône "⚠️"
- Popup : Sélection spécialisation lors clic

**Talents Rangs Multiples** :
- Format Texte : `"Talent (Rang X)"` ou `"X/Max"`
- Badge Visuel : `"×2"` si plusieurs rangs
- Exemples :
  - `"Artiste (Rang 2)"` → Badge "×2"
  - `"Résistant 2/3"` → Rang 2 sur max 3
  - `"Chanceux 3/Bonus Soc"` → Rang 3 sur max dynamique

**Références** : `audit/business-rules/specialisations-skills-talents.md`

### 4.2 Conventions Labels et Noms

**Noms Caractéristiques** (TOUJOURS complets, jamais abrégés dans données) :
- ✅ **Valide** : "Capacité de Combat", "Capacité de Tir", "Force Mentale"
- ❌ **Invalide** : "CC", "CT", "FM" (abrégations réservées affichage UI)

**Raison** : Cohérence parsing, lisibilité données source, éviter ambiguïtés

**Labels Entités** :
- Longueur : 3-100 caractères
- Normalisation : Première lettre majuscule, espaces simples, trim
- Unicité : Insensible à la casse
- Exemple : "agitateur" et "Agitateur" → Considérés identiques (erreur doublon)

**Références Bibliographiques** :
- Format : `BOOK p.PAGE`
- Exemples : `"LDB p.45"`, `"EDO p.128"`, `"AA p.67"`
- BOOK : Abréviation livre (3-5 lettres majuscules)
- PAGE : Numéro page (1-999)

**Références** : `audit/patterns/pattern-metadonnees-base.md`, `audit/business-rules/parsing-wizard-data.md`

### 4.3 Codes Couleurs et Badges

**Caractéristiques (Affichage Espèce)** :
- **Vert** : Valeur ≥ 30 (élevée, avantage racial)
- **Neutre** : Valeur = 20-29 (moyenne)
- **Rouge** : Valeur ≤ 19 (faible, désavantage racial)

**Exemple** : Nain
- Force 30 (vert), Endurance 40 (vert), Agilité 10 (rouge), Initiative 20 (neutre)

**Badges Capacités Spéciales** :
- **"Vision nocturne"** (Nains/Elfes/Gnomes) → Badge gris, icône lune
- **"Résistance magie"** (Nains) → Badge bleu, icône bouclier
- **"Résistance Chaos"** (Halflings) → Badge violet, icône étoile
- **"Costaud"** (Nains) → Badge marron, icône muscles
- **"Petit"** (Halflings/Gnomes) → Badge jaune, taille réduite

**États de Sélection** :
- ✓ **Acquis** : Grisé, coché, non modifiable
- ? **Action Requise** : Surligné jaune, icône "!", clignotant
- **En Cours de Tirage** : Fond jaune, animation 500+300+500ms (orange→noir)

**Références** : `audit/database/species.md`, `audit/features/wizard/resume-display.md`

### 4.4 Organisation Hiérarchique

**Carrières (3 Niveaux)** :
- **Niveau 1** : Classes (`listchild1`) - Headers non sélectionnables (ex: "Citadins", "Guerriers")
- **Niveau 2** : Carrières (`listchild2`) - Sélectionnables avec seuils (ex: "Artisan 2-3", "Soldat 15-25")
- **Niveau 3** : Levels (`listchild3`) - Masqués en création, visibles en avancement (ex: "Artisan 1", "Artisan 2")

**Compétences (Regroupement)** :
- **Section 1** : Compétences de base (`type="base"`) - Accessibles sans formation
- **Section 2** : Compétences avancées (`type="avancée"`) - Nécessitent formation spécifique
- **Tri** : Alphabétique par label au sein de chaque section
- **Alternative** : Regroupement par caractéristique liée (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)

**Références** : `audit/features/wizard/career.md`, `audit/database/skills.md`

### 4.5 Format Valeurs et Calculs

**Caractéristiques (Tableau Résumé)** :
- Colonnes : `Nom Abrégé | Symbole | Init | Aug | Total`
- Exemple : `CC | ⚔️ | 30 (Init) | +10 (Aug) | 40 (Total)`

**Compétences (Tableau Détails)** :
- Colonnes : `Nom | Carac Associée (Abr + Base) | Avances | Total`
- Exemple : `Athlétisme | Ag 25 | +10 | 35`

**Valeur avec Bonus** :
- Format : `"Valeur (Bonus)"`
- Exemple : `"43 (+4)"` → Valeur 43, Bonus 4 (floor(43/10))

**Mouvement Dérivé** :
- Format : `"M = Base, Marche = M×2, Course = M×4"`
- Exemple : `"M=4, Marche=8, Course=16"` (Humain)

**Références** : `audit/features/wizard/resume-display.md`, `audit/database/skills.md`

---

## 5. Conventions de Nommage

### 5.1 Format Spécialisations

**Spécialisation Fixe** :
- Format : `"Nom (Spé)"`
- Exemples : `"Langue (Bataille)"`, `"Corps à corps (Base)"`
- Pas de choix, spécialisation prédéfinie

**Spécialisation au Choix** :
- Format : `"Nom (Au choix)"`
- Exemples : `"Métier (Au choix)"`, `"Art (Au choix)"`
- Popup sélection parmi liste `specs` lors acquisition

**Choix Exclusifs dans Spécialisation** :
- Format : `"Nom (Spé1 ou Spé2)"`
- Exemple : `"Animosité (Nains ou Elfes)"`
- Parsing opérateur " ou " dans paramètre

**Références** : `audit/business-rules/specialisations-skills-talents.md`

### 5.2 Séparateurs et Opérateurs

**Séparateurs Principaux** :

**", " (virgule + espace)** : Sépare items distincts
- `"Calme, Charme, Commandement"` → 3 items indépendants
- Utilisé pour listes skills, talents, trappings

**" ou " (espace + ou + espace)** : Choix exclusif
- `"Perspicace ou Affable"` → Choix entre 2 (1 seul acquis)
- Utilisé pour options alternatives

**ATTENTION CRITIQUE** : Espaces SIGNIFICATIFS
- `" ou "` (avec espaces) = **Opérateur** de choix
- `"ou"` (sans espaces) = **Partie du label**
- Exemple Confusion :
  - `"Langue (Bretonnien ou Tiléen)"` → Choix entre 2 langues ✓
  - `"Langue (Bretonniou)"` → Nom langue avec "ou" dans label ✓ (langue inventée)

**Séparateurs dans Paramètres** :
- `", "` dans `()` : Énumération pour UN item
- `"Dressé (Dompté, Garder)"` → 1 item, 2 valeurs paramètre

**Références** : `audit/patterns/pattern-parsing.md`

### 5.3 Format Quantités

**8 Formats de Parsing** :

1. **Nom seul** : `"Calme"` → `{nom: "Calme"}`
2. **Nom (Paramètre)** : `"Corps à corps (Base)"` → `{nom, param}`
3. **Signe+Valeur Nom** : `"+7 Arme"` → `{nom, modificateur: +7}`
4. **Signe+Valeur Nom (Paramètre)** : `"+8 À distance (50)"` → `{nom, modificateur, param}`
5. **Nom (Paramètre) Signe+Valeur** : `"Arme (Bâton) +7"` → `{nom, param, modificateur}`
6. **Nom Valeur** : `"Esquive 48"` → `{nom, valeur: 48}` (SANS signe)
7. **Nom (Paramètre) Valeur** : `"Corps à corps (Base) 52"` → `{nom, param, valeur}`
8. **N Talent aléatoire** : `"3 Talent aléatoire"` → `{type: "random_talent", quantité: 3}`

**Types de Quantités** :
- **Implicite** : `"Épée"` → quantité = 1
- **Explicite** : `"Rations (7)"` → quantité = 7
- **Dé** : `"Chiffon (1d10)"` → quantité aléatoire (tirage à la création)

**Références** : `audit/patterns/pattern-parsing.md`

### 5.4 Conventions Origins

**Format** : Array de chaînes identifiant source acquisition

**Nomenclature** :
- **Espèce** : `specie.id` (ex: `'humain'`, `'nain'`)
- **Carrière** : `career.id + '|' + level` (ex: `'soldat|1'`, `'artisan|3'`)
- **Talent** : `'talent'` (origine générique)

**Exemples** :
```javascript
origins: ['humain']                      // Compétence raciale uniquement
origins: ['soldat|1']                    // Compétence carrière niveau 1
origins: ['talent']                       // Compétence ajoutée par talent
origins: ['humain', 'soldat|1', 'soldat|2']  // Multiple sources (cumul avances)
```

**Usage** :
- **Traçabilité** : Identifier sources acquisition (espèce, carrière, talent)
- **Calcul Coûts XP** : Déterminer "en carrière" vs "hors carrière"
- **Conservation** : Historique carrières traversées (multi-carrière)

**Références** : `audit/features/character-edit.md`, `audit/database/skills.md`

---

## 6. Règles Implicites Supplémentaires

### 6.1 Gestion des Doublons

**Compétences** :
- **Même nom + même spé** : **Fusion** → 1 entrée, avances cumulées
- **Même nom + spés différentes** : **2 entrées distinctes**

**Exemples** :
- Espèce : `"Art (Peinture)"` +5
- Carrière : `"Art (Peinture)"` +10
- **Résultat** : 1 skill "Art (Peinture)", avances = +15 ✓

- Espèce : `"Art (Peinture)"` +5
- Carrière : `"Art (Sculpture)"` +10
- **Résultat** : 2 skills distinctes ("Peinture" et "Sculpture") ✓

**Talents Rangs Multiples** :
- `max = 1` : **Déduplication** → 1 seul affiché même si 2 sources
- `max > 1` : **Cumul rangs** → Rang augmenté pour chaque source
- `max = "Aucun"` : **Illimité** → Tous rangs cumulés

**Exemple** : Talent "Lire/Écrire"
- Espèce : "Lire/Écrire" (max 1)
- Carrière : "Lire/Écrire" (max 1)
- **Résultat** : 1 talent "Lire/Écrire", rang = 2 (sources cumulées) ✓

**Sorts** :
- **Même sort** : **Fusion** → 1 exemplaire unique (pas de doublons possibles)
- **Domaines conflictuels** : **Impossible** (système empêche multi-domaines)

**Références** : `audit/database/talents.md`, `audit/business-rules/accumulation-avantages-careerlevels.md`

### 6.2 Conservation lors Changement de Carrière

**Conservé** :
- ✅ Toutes caractéristiques améliorées (Base + Avances gardées)
- ✅ Toutes compétences acquises (avec avances)
- ✅ Tous talents acquis (tous rangs)
- ✅ Sorts appris (si talents magiques conservés)

**Non Conservé / Réinitialisé** :
- ❌ Niveau de carrière → **Repart à 1** dans nouvelle carrière
- ❌ Trappings carrière → Nouveaux trappings nouvelle carrière (anciens gardés si acquis)

**Redéfinition Statut "En Carrière"** :
- Anciennes compétences/talents carrière → **"Hors carrière"** (coût XP ×2)
- Nouvelles compétences/talents carrière → **"En carrière"** (coût XP standard)

**Historique Multi-Carrières** :
- `origins[]` conserve TOUTES carrières traversées
- Permet coûts XP réduits si retour carrière antérieure

**Exemple** : Agitateur niveau 3 → Change pour Artisan
- **Conserve** : Charisme +15, Perception +10, Éloquence (talent), Tous sorts
- **Coût** : 100 XP
- **Nouvelle Carrière** : Artisan niveau 1 (pas niveau 3)
- **Impact Coûts** :
  - Charisme (ancienne "en carrière") → **"Hors carrière"** (coût ×2)
  - Métier (Armurier) (nouvelle "en carrière") → **"En carrière"** (coût ×1)

**Références** : `audit/business-rules/progression-careerlevels.md`, `audit/features/character-edit.md`

### 6.3 Règles de Validation Augmentations

**Compétences d'Espèce** :
- **Règle 1** : Exactement 3 compétences à +5
- **Règle 2** : Exactement 3 compétences à +3
- **Total** : 24 augmentations (6 skills)
- **Choix** : Parmi liste fermée (skills de l'espèce uniquement)

**Compétences de Carrière** :
- **Budget** : Exactement 40 points à répartir
- **Maximum** : 10 points par compétence
- **Minimum** : 0 (skill peut rester non amélioré)
- **Validation** : Tous points alloués (pas de points non dépensés)

**Validation Bouton** :
- **Désactivé** : Si conditions non remplies (compteur rouge)
- **Activé** : Si règles respectées (compteur vert)
- **Mode Free** : Toujours activé (pas de validation bloquante)

**Exemples Invalides** :
- Espèce : 4 skills à +5 → ERREUR (max 3)
- Carrière : 38 points dépensés → ERREUR (doit être exactement 40)
- Carrière : 1 skill à +15 → ERREUR (max 10 par skill)

**Références** : `audit/database/skills.md`

### 6.4 Nettoyage Automatique

**Déclencheur** : Fonction `deleteEmpty()` après modifications

**Compétences Origine "Talent"** :
- Si talent source inactif → **Suppression automatique**
- **Exception** : **Conservée si avances investies** (joueur a dépensé XP)

**Exemple** : Talent "Sens Aiguisé (Vue)" perdu
- Compétence "Perception (Vue)" origine "talent", avances = 0 → **Supprimée**
- Compétence "Perception (Vue)" origine "talent", avances = +10 → **Conservée** (XP investi)

**Sorts** :
- Si domaine magie perdu → **Suppression automatique** tous sorts domaine
- Validation : Parcours tous sorts, vérification domaine actif (type ET spec)

**Exemple** : Talent "Magie des Arcanes (Ghur)" retiré
- Tous sorts type "Arcane" spec "Ghur" → **Supprimés automatiquement**
- Sorts autres domaines (ex: "Aqshy") → **Conservés** (domaine toujours actif)

**Cas Spécial Béni** :
- Perte talent "Béni" → **Retrait automatique TOUTES bénédictions** (indépendamment usage)

**Références** : `audit/business-rules/application-effets-talents.md`, `audit/features/character-edit.md`

---

**Références Principales** :
- `audit/business-rules/parsing-wizard-data.md`
- `audit/business-rules/application-effets-talents.md`
- `audit/business-rules/talents-effets-mecanismes.md`
- `audit/business-rules/specialisations-skills-talents.md`
- `audit/patterns/pattern-parsing.md`
- `audit/patterns/pattern-metadonnees-base.md`
- `audit/features/character-edit.md`
- `audit/database/species.md`
- `audit/database/skills.md`

**Mots-clés** : Ordre Application, Priorités, Valeurs Défaut, Conventions Affichage, Conventions Nommage, Règles Implicites, Parsing, Séparateurs, Spécialisations
