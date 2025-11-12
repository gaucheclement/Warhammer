# Gestion des Erreurs et Cas Limites

**Contexte** : Documentation exhaustive de tous les cas d'erreurs, cas limites et mécanismes de récupération du système Warhammer Character Generator V1.

**Relations** :
- Tables Database : `species.md`, `careers.md`, `careerLevels.md`, `talents.md`, `skills.md`
- Business Rules : `parsing-wizard-data.md`, `careers-validation.md`, `calculs-xp-progression.md`, `talents-effets-mecanismes.md`
- Features : `character-edit.md`, `xp-validation.md`, `wizard/resume-validation.md`, `save-load.md`, `admin-validation.md`

---

## 1. Gestion des Erreurs de Parsing

### 1.1 Parsing Caractéristiques (careerLevels.characteristics)

**Format requis** : Liste noms complets séparés par virgules (ex: "Force, Endurance, Agilité")

#### Erreurs de Format

**Cas** : Niveau 1 avec nombre de caractéristiques ≠ 3
- **Message** : "Niveau 1 requiert exactement 3 caractéristiques"
- **Exemple** : "Force, Endurance" → ERREUR (seulement 2)
- **Blocage** : Validation bloquante (empêche sauvegarde)

**Cas** : Niveaux 2-4 avec nombre de caractéristiques ≠ 1
- **Message** : "Niveaux 2-4 requièrent exactement 1 caractéristique"
- **Exemple** : Niveau 2 avec "Force, Agilité" → ERREUR (2 au lieu de 1)
- **Blocage** : Validation bloquante

#### Erreurs de Références

**Cas** : Nom de caractéristique invalide (non présent dans table characteristics)
- **Message** : "Caractéristique '{nom}' inconnue. Noms valides : Force, Endurance, ..."
- **Exemple** : "Force, Machin, Dextérité" → ERREUR ('Machin' invalide)
- **Validation** : Liste fermée des 10 caractéristiques (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)
- **Blocage** : Erreur bloquante

**Cas** : Utilisation d'abréviations au lieu des noms complets
- **Contrainte** : Toujours nom complet, jamais abréviations
- **Erreur** : "CC, CT, FM" → INVALIDE (utiliser "Corps à corps, Capacité de Tir, Force Mentale")
- **Raison** : Cohérence parsing, lisibilité données

**Exemples Valides** :
- Agitateur niveau 1 : "Capacité de Tir, Agilité, Sociabilité" ✓
- Artisan niveau 2 : "Force" ✓
- Enquêteur niveau 3 : "Intelligence" ✓

**Références** : `audit/business-rules/parsing-wizard-data.md`

### 1.2 Parsing Skills et Talents

**Format requis** : `Label [opérateurs] [quantité] [spécialisation]`

#### Erreurs de Validation

**Cas** : Label skill/talent inconnu (non présent dans tables skills/talents)
- **Message** : "Compétence '{label}' inconnue"
- **Exemple** : "Attaque Spéciale" → ERREUR (n'existe pas)
- **Blocage** : Erreur bloquante
- **Vérification** : Lookup dans skills.json/talents.json

**Cas** : Spécialisation invalide pour compétence groupée
- **Message** : "Spécialisation '{spec}' invalide pour {label}"
- **Exemple** : "Art (Peinture sur Mur)" → ERREUR (spécialisation non listée)
- **Validation** : Si compétence groupée → vérifier specs dans liste fermée
- **Blocage** : Erreur bloquante

**Cas** : Format incorrect (parenthèses mal fermées, séparateurs manquants)
- **Message** : "Format invalide : '{input}'"
- **Exemples** :
  - "Art Peinture)" → ERREUR (parenthèse ouvrante manquante)
  - "Langue (Reikspiel, Bretonnien)" → ERREUR (virgule dans spécialisation, utiliser "ou")
- **Blocage** : Erreur bloquante

**Cas** : Quantités incohérentes (< 1 ou format invalide)
- **Message** : "Quantité invalide : '{quantité}'"
- **Exemples** :
  - "Épée (0)" → ERREUR (minimum 1)
  - "Arbalète (abc)" → ERREUR (non numérique)
  - "Or (1d10)" → VALIDE (formule dé autorisée pour trappings)
- **Blocage** : Erreur bloquante

**Cas** : Doublons détectés dans même liste
- **Message** : "Doublon détecté : '{label}' apparaît plusieurs fois"
- **Exemple** : "Athlétisme, Perception, Athlétisme" → ERREUR
- **Blocage** : Avertissement (permet sauvegarde, mais signale incohérence)

#### Gestion Espaces Critiques

**Attention** : Espaces significatifs dans opérateur "ou"
- **Valide** : "Métier (Armurier) ou Métier (Forgeron)" → Opérateur "ou" reconnu
- **Invalide** : "Métier (ArmurieroouMétier (Forgeron)" → "ou" considéré comme partie du label
- **Règle** : " ou " (avec espaces) = opérateur, "ou" (sans espaces) = partie du label

**Exemples Complets** :
- "Perception, Athlétisme, Corps à corps (Armes lourdes)" ✓
- "4 aléatoire Talents" ✓
- "Langue (Au choix)" ✓
- "Survie ou Natation" ✓
- "Perception Athlétisme" → ERREUR (virgule manquante)
- "Art ()" → ERREUR (spécialisation vide)

**Références** : `audit/business-rules/parsing-wizard-data.md`

---

## 2. Cas Limites des Données

### 2.1 Valeurs Nulles et Champs Vides

#### Species

**Cas** : Description vide (desc = "") pour variante d'espèce
- **Règle** : Toléré uniquement pour variantes (héritent description race base)
- **Exemples Valides** :
  - "Humains (Tiléens)" avec desc="" → OK (hérite "Humains")
  - "Nains (Altdorfer)" avec desc="" → OK (hérite "Nains")
- **Exemple Invalide** :
  - "Humains" avec desc="" → ERREUR (race principale doit avoir description)
- **Message** : "Description manquante pour la race principale '{label}'"

**Cas** : refChar/refCareer/refDetail manquant ou null
- **Impact** : Impossible générer caractéristiques, carrières ou détails
- **Message** : "Impossible de déterminer les caractéristiques pour '{label}'"
- **Conséquence** : Erreur bloquante création personnage
- **Exemple** : Elfe avec refChar=null → Pas de valeurs base CC/CT/F/etc.

**Références** : `audit/database/species.md`

#### Careers

**Cas** : Champ obligatoire manquant (index, label, class, desc, book, page, rand)
- **Impact** : Affichage incomplet ou crash génération aléatoire
- **Message** : "Champ obligatoire '{field}' manquant pour carrière '{label}'"
- **Exemple** : Carrière sans `rand` → Impossible de calculer probabilités génération aléatoire

**Cas** : Valeurs rand invalides (null, 0, -1, 101, valeurs hors range 1-100)
- **Règle** : rand.{espèce} doit être entre 1-100 OU "" (carrière inaccessible à cette espèce)
- **Message** : "Valeur invalide pour rand.{espèce} : '{valeur}'. Attendu 1-100 ou ''"
- **Exemples** :
  - rand.Humain = 150 → ERREUR (> 100)
  - rand.Nain = -5 → ERREUR (< 1)
  - rand.Elfe = "" → VALIDE (carrière inaccessible aux Elfes)

**Références** : `audit/business-rules/careers-validation.md`

#### Skills

**Cas** : Champs obligatoires absents (index, label, characteristic, type, desc)
- **Message** : "Champ obligatoire '{field}' manquant pour compétence '{label}'"
- **Impact** : Impossible d'afficher ou calculer valeur finale

**Cas** : characteristic invalide (ne correspond à aucune caractéristique existante)
- **Message** : "Caractéristique '{char}' inconnue pour compétence '{label}'"
- **Exemple** : skill.characteristic = "Machin" → ERREUR
- **Validation** : Doit être une des 10 caractéristiques (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)

**Références** : `audit/database/skills.md`

#### Talents

**Cas** : max invalide (valeur non numérique, formule mal formée)
- **Règle** : max doit être nombre >0, "Aucun" (illimité) ou "Bonus de {Carac}"
- **Exemples Valides** :
  - max = 2 → Rang maximum 2
  - max = "Aucun" → Rangs illimités
  - max = "Bonus d'Agilité" → Rang max dynamique (recalculé si Ag change)
- **Exemples Invalides** :
  - max = 0 → ERREUR (minimum 1)
  - max = "Bonus de Machin" → ERREUR (caractéristique inconnue)

**Cas** : addCharacteristic référence caractéristique non valide
- **Message** : "Caractéristique '{carac}' inconnue pour talent '{label}'"
- **Validation** : Doit exister dans characteristics
- **Exemple** : addCharacteristic = "Capacité Magique" → ERREUR (n'existe pas)

**Références** : `audit/database/talents.md`

### 2.2 Listes Vides

#### Character Trappings

**Cas** : Liste trappings vide après suppression
- **Gestion** : Toléré, pas de minimum requis
- **Nettoyage** : `deleteEmpty()` supprime skills/talents sans avances (pas trappings)
- **Exemple** : Personnage sans équipement → VALIDE (pauvre ou dépouillé)

**Références** : `audit/features/character-edit.md`

#### Sorts sans Talent Actif

**Cas** : Personnage possède sorts mais talent magique désactivé/supprimé
- **Détection** : Parcours sorts, vérification domaine actif via talents
- **Action** : Suppression automatique tous sorts du domaine inactif
- **Exemple** :
  - Talent "Magie des Arcanes (Ghur)" retiré → Tous sorts Ghur supprimés automatiquement
  - Talent "Béni" perdu → Toutes bénédictions retirées
- **Raison** : Impossibilité lancer sorts sans formation/bénédiction divine

**Références** : `audit/business-rules/application-effets-talents.md`

### 2.3 Doublons

#### Index/Labels (Tables Database)

**Cas** : Index dupliqué
- **Test** : Tous index uniques, séquentiels (0-N)
- **Message** : "Index {N} déjà utilisé par {type} '{label}'"
- **Impact** : Ambiguïté identification, erreurs lookup
- **Exemple** : Deux carrières avec index = 5 → ERREUR critique

**Cas** : Label dupliqué (case-insensitive)
- **Test** : Tous labels uniques après normalisation
- **Message** : "Label '{label}' dupliqué (déjà utilisé par {type} existant)"
- **Impact** : Confusion joueur, erreurs filtrage/recherche
- **Exemple** : "Marchand" et "marchand" → ERREUR (considérés identiques)
- **Contraintes** : 3-50 caractères, caractères alphanumériques + espaces/tirets

**Références** : `audit/business-rules/careers-validation.md`

#### Validation Admin

**Cas** : Doublon détecté lors édition/création entité
- **Message** : "Erreur {table}.{field}: Doublon détecté '{valeur}'"
- **Exemples** :
  - "Erreur talents.label: Doublon détecté 'Strike Mighty Blow'" → Talent déjà existant
  - "Erreur skills.label: Doublon détecté 'Perception'" → Compétence déjà existante
- **Action** : Rollback automatique modification, restauration état précédent
- **Backup** : Copie état actuel avant modification (permet annulation)

**Références** : `audit/features/admin-validation.md`

### 2.4 Références Cassées

#### Validation Références Carrières

**Test 1** : Champ `class` existe dans `classes.json`
- **Message** : "Classe '{class}' inconnue. Classes valides : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos"
- **Exemple** : career.class = "Paysans" → ERREUR (classe invalide)

**Test 2** : Clés `rand` correspondent à `species.refCareer` existants
- **Règle** : Chaque clé rand.{espèce} doit correspondre à refCareer d'une espèce
- **Message** : "Espèce '{espèce}' inconnue dans rand"
- **Exemple** : rand.Ogre = 50, mais pas d'espèce avec refCareer="Ogre" → ERREUR

**Test 3** : Chaque espèce a ≥5 carrières accessibles (rand numérique)
- **Règle** : Minimum 3 carrières pour génération viable, recommandé 5+
- **Message** : "Espèce '{espèce}' a seulement {N} carrières accessibles (minimum 5 recommandé)"
- **Impact** : Si <3 carrières → Génération personnage quasi-impossible (répétitions)
- **Exemple** : Halfling avec seulement 2 carrières (rand numériques) → AVERTISSEMENT critique

**Test 4** : Exactement 4 CareerLevels par carrière (niveaux 1, 2, 3, 4 sans trou)
- **Message** : "Carrière '{label}' : {N} niveaux trouvés au lieu de 4"
- **Exemples** :
  - Agitateur avec niveaux 1, 2, 4 (manque 3) → ERREUR
  - Artisan avec niveaux 1, 2, 3, 3 (doublon 3) → ERREUR
- **Impact** : Blocage progression carrière, impossible atteindre niveau manquant

**Références** : `audit/business-rules/careers-validation.md`

#### Save/Load - Références Manquantes

**Cas** : JSON corrompu ou invalide
- **Détection** : `JSON.parse()` échoue
- **Comportement V1** : Exception non catchée → Crash application
- **Message** : "Fichier corrompu ou format invalide"
- **Recommandation V2** : Try/catch avec message utilisateur explicite

**Cas** : Références entités supprimées/modifiées (species, career, talents)
- **Détection** : ID invalide lors chargement
- **Comportement V1** : `setSpecie(undefined)` → Crash potentiel (validation manquante)
- **Message** : "Espèce '{id}' introuvable (supprimée ou renommée)"
- **Recommandation V2** : Validation stricte existence avant assignation

**Références** : `audit/features/save-load.md`

---

## 3. Cas Limites des Calculs

### 3.1 Divisions par Zéro

#### Bonus Caractéristiques

**Formule** : Bonus = floor(valeur finale / 10)

**Cas Limite** : Valeur = 0
- **Calcul** : Bonus = floor(0 / 10) = 0
- **Pas d'erreur** : Division par zéro impossible (diviseur toujours 10)
- **Impact** : Bonus = 0 (valide, personnage extrêmement faible)

**Exemple** : Personnage maudit, Force réduite à 0 par malédiction
- Bonus Force = 0
- Limite encombrement = 0 (si Endurance aussi = 0)
- État "Immobilisé" permanent

**Références** : `audit/features/character-edit.md`

#### Limite Encombrement

**Formule** : Limite = Bonus Force × 10

**Cas Limite** : Bonus Force = 0 (Force ≤ 9)
- **Calcul** : Limite = 0 × 10 = 0
- **Conséquence** : Tout encombrement > 0 = surcharge
- **Seuils** :
  - 0 < enc ≤ 0 (impossible) → Normal
  - enc > 0 → Surchargé immédiatement
  - enc > 0 (toujours vrai) → Immobilisé si > BF × 20 = 0
- **Impact Gameplay** : Personnage ne peut rien porter, même vêtements (enc > 0)

**Exemple** : Halfling très faible (Force 8, Endurance 8)
- Bonus Force = 0, Bonus Endurance = 0
- Limite = 0
- Vêtements (enc 1) → Surchargé
- Vêtements + Dague (enc 2) → Immobilisé

**Références** : `audit/features/equipment.md`

### 3.2 Dépassements de Limites

#### Avances Caractéristiques et Skills

**Limite Absolue** : Avances ≤ 70 (paliers 1 à 70)
- **Raison** : Système conçu pour progression jusqu'à +70
- **Coût Dernier Palier** : 66-70 = 380 XP (très élevé)
- **Blocage** : Bouton [+] désactivé si avances = 70
- **Message** : "Avances maximum atteintes (+70)"

**Exemple Extrême** : Vétéran 30 ans carrière
- Corps à corps (Armes lourdes) : Base 35 + Avances 70 = 105
- Coût Total : 10+10+10+10+10 + 15+...+25 (×14) + 30+...+50 (×15) + 60+...+90 (×15) + 100+...+190 (×10) + 200+...+380 (×5) = ~8,000 XP pour une compétence
- Durée : ~80 sessions jeu (100 XP/session)

**Références** : `audit/business-rules/calculs-xp-progression.md`

#### Rangs Talents (Max Dynamique)

**Règle** : Rangs acquis ≤ maximum autorisé

**Cas** : Max dynamique = "Bonus de {Carac}"
- **Recalcul** : Si carac modifiée → max recalculé automatiquement
- **Conservation** : Rangs acquis conservés même si dépasse nouveau max
- **Blocage Nouveaux Achats** : Rang N+1 impossible tant que max < N+1

**Exemple** : Talent "Chanceux" (max = Bonus Sociabilité)
1. Sociabilité 35 (Bonus 3) → Achète rangs 1, 2, 3 (total 3/3) ✓
2. Sociabilité réduite à 28 (Bonus 2) par malédiction → max = 2, total = 3 (dépasse!)
3. **Conservation** : 3 rangs conservés (grandfathering)
4. **Blocage** : Rang 4 impossible tant que Sociabilité < 40

**Stratégie Récupération** : Améliorer Sociabilité pour débloquer rangs supérieurs

**Références** : `audit/business-rules/talents-effets-mecanismes.md`

#### Budget XP

**Mode Création** : XP disponible DOIT être ≥ 0
- **Blocages** :
  - Bouton [+] désactivé si achat futur dépasse budget
  - Bouton [Valider] désactivé si budget actuel < 0
  - Impossible valider étape wizard avec budget négatif
- **Message** : "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)"
- **Raison** : Personnages niveau 1 ne peuvent pas avoir dette XP

**Mode Post-Création** : XP disponible peut être < 0 (dette temporaire tolérée)
- **Raison** : Permet achats anticipés (remboursés par XP sessions futures)
- **Exemple** : XP actuelle = 50, achète amélioration 100 XP → Dette -50 XP
- **Remboursement** : Prochaines sessions XP réduisent dette avant d'augmenter disponible

**Références** : `audit/features/xp-validation.md`

#### Encombrement - Seuils de Pénalités

**Formule** : Bonus Force × 10/20

**Seuils** :
1. **Normal** : enc ≤ BF × 10
   - Aucune pénalité
2. **Surchargé** : BF × 10 < enc ≤ BF × 20
   - Mouvement réduit de moitié
   - Malus -10 tests Agilité
   - Pas de course possible
3. **Immobilisé** : enc > BF × 20
   - Déplacement impossible
   - Malus -20 tous tests physiques
   - Combat fortement désavantagé

**Exemple** : Nain Guerrier (Force 35, Endurance 40)
- Bonus Force = 3
- Normal : ≤ 30 enc
- Surchargé : 31-60 enc (armure complète + armes + sac)
- Immobilisé : > 60 enc (impossible porter équipement complet + butin)

**Références** : `audit/business-rules/calcul-encombrement.md`

### 3.3 Cumuls Invalides

#### Seuils Rand Carrières (Non Croissants)

**Règle** : Pour chaque espèce/région, seuils doivent être croissants ou égaux
- **Raison** : Génération aléatoire utilise seuils cumulatifs (1d100 ≤ seuil)
- **Erreur** : Seuil décroissant → Génération incohérente

**Message** : "Seuils décroissants pour {espèce} : carrière '{label1}' ({seuil1}) > '{label2}' ({seuil2})"

**Exemple Invalide** :
```
Carrières Humains :
- Agitateur : rand.Humain = 30
- Marchand : rand.Humain = 20  ← ERREUR (décroissant)
- Soldat : rand.Humain = 50
```

**Conséquence** : Tirage 25 → Aucune carrière trouvée (entre Marchand et Agitateur)

**Exemple Valide** :
```
Carrières Humains :
- Agitateur : rand.Humain = 30  (tirages 1-30)
- Marchand : rand.Humain = 50  (tirages 31-50)
- Soldat : rand.Humain = 80  (tirages 51-80)
```

**Références** : `audit/business-rules/careers-validation.md`

#### Couverture Probabilités Incomplète

**Règle** : Au moins une carrière avec seuil ≥ 95 pour chaque espèce
- **Raison** : Garantir résultat pour tirages élevés (96-100)
- **Erreur** : Dernière carrière seuil 50 → Tirages 51-100 sans résultat

**Message** : "Couverture insuffisante pour {espèce} : seuil maximum {max} < 95"

**Exemple Problématique** :
```
Carrières Halfling :
- Vagabond : rand.Halfling = 40
- Voleur : rand.Halfling = 80  ← Dernier seuil < 95
```
**Impact** : Tirage 90 → Aucune carrière → Erreur génération → Création personnage impossible

**Correction** : Ajouter carrière "fourre-tout" avec rand.Halfling = 100

**Références** : `audit/business-rules/careers-validation.md`

---

## 4. États Transitoires

### 4.1 Changement de Carrière en Cours

#### Retour Arrière Wizard

**Processus** :
1. Utilisateur sélectionne nouvelle carrière
2. Suppression temporaire ancienne carrière
3. Assignation niveau 1 nouvelle carrière
4. Si retour arrière (bouton Précédent) → État aléatoire conservé

**Conservation** :
- État aléatoire préservé (permet régénérer mêmes tirages)
- Compétences/talents/trappings carrière RETIRÉS (pas conservés en création)
- Caractéristiques de base conservées (espèce)

**Exemple** : Création personnage, étape Carrière
1. Sélectionne "Agitateur" → +Compétences (Charisme, Perception)
2. Retour arrière → Compétences retirées
3. Sélectionne "Artisan" → Nouvelles compétences différentes

**Références** : `audit/features/wizard/career.md`

#### Changement Post-Création

**Coût** : 100 XP (fixe, non négociable)

**Conservation Totale** :
- Skills acquis (toutes avances conservées)
- Talents acquis (tous rangs conservés)
- Caractéristiques améliorées (toutes avances conservées)
- Sorts appris (si talents magiques conservés)

**Réinitialisation** :
- Nouvelle carrière démarre toujours niveau 1
- Statut "en carrière" redéfini (nouvelles skills/talents "en carrière", anciennes "hors carrière")

**Impact "En Carrière"** :
- Anciennes compétences carrière → Coût ×2 pour nouvelles avances
- Nouvelles compétences carrière → Coût ×1 (tarif normal)

**Exemple** : Agitateur niveau 3 → Change pour Artisan
- Conserve : Charisme +15, Perception +10, Éloquence (talent)
- Coût : 100 XP
- Nouvelle carrière : Artisan niveau 1
- Charisme (ancienne "en carrière") → Désormais "hors carrière" (coût ×2 pour avances futures)
- Métier (Armurier) (nouvelle "en carrière") → Coût normal

**Références** : `audit/features/character-edit.md`

### 4.2 Suppression avec Dépendances

#### Talents et Compétences Liées

**Règle** : Compétence ajoutée par talent (addSkill) conservée si avances investies

**Processus Validation** :
1. Parcours toutes compétences
2. Si origine = "talent" → Vérifier talent source actif
3. Si talent inactif ET avances = 0 → Suppression compétence
4. Si talent inactif ET avances > 0 → **Conservation** (exception grandfathering)

**Exemple 1** : Talent "Sens Aiguisé (Vue)" perdu
- Compétence "Perception (Vue)" ajoutée par talent
- Si Perception (Vue) avances = 0 → Suppression automatique
- Si Perception (Vue) avances = +10 → **Conservée** (investissement XP protège)

**Exemple 2** : Talent "Magie des Arcanes (Ghur)" retiré
- Compétence "Focalisation (Ghur)" ajoutée par talent
- Focalisation avances = 0 → Suppression
- Impact : Impossible lancer sorts Ghur (pas de compétence)

**Références** : `audit/business-rules/application-effets-talents.md`

#### Talents et Sorts

**Règle Béni** : Si talent "Béni" perdu → Retrait automatique TOUTES bénédictions (indépendamment usage)

**Raison** : Bénédictions divines nécessitent faveur dieu active (talent Béni)

**Processus** :
1. Détection perte talent Béni
2. Parcours tous sorts type "Béni"
3. Suppression inconditionnelle (aucune exception)
4. Notification joueur : "Toutes bénédictions retirées (talent Béni perdu)"

**Exemple** : Prêtre de Sigmar perd faveur divine
- Talent "Béni (Sigmar)" retiré par MJ (punition)
- Sorts : "Bénédiction de Courage", "Bénédiction de Force", "Bénédiction de Protection"
- Action : Suppression automatique toutes bénédictions
- Récupération : Réacquérir talent Béni (quête expiation, 100 XP)

**Autres Domaines Magiques** : Règle identique (perte "Magie des Arcanes" → perte sorts Arcanes)

**Références** : `audit/business-rules/application-effets-talents.md`

#### Compétences sans Avances

**Déclencheur** : Fonction `deleteEmpty()` appelée après modifications

**Action** : Suppression skills/talents avec advance = 0 ET origine non-permanente

**Cas Conservés** :
- Compétences espèce (origine = species) → Jamais supprimées
- Compétences carrière (origine = career) → Jamais supprimées
- Compétences avec avances > 0 → Jamais supprimées

**Cas Supprimés** :
- Compétences temporaires ajoutées puis non investies
- Talents acquis temporairement puis retirés sans rangs

**Exemple** : Étape Skills wizard
1. Ajoute "Natation" (origine = temporaire)
2. N'investit aucune avance (advance = 0)
3. Passe étape suivante → `deleteEmpty()` → Natation supprimée

**Références** : `audit/features/character-edit.md`

### 4.3 Modifications Temporaires (tmpadvance/tmp_used)

**Workflow Modification Avances** :
1. **Modification Temporaire** : Clic [+] → Incrément `tmpadvance` (pas `advance`)
2. **Calcul Coût** : `tmp_used` calculé en fonction tmpadvance
3. **Affichage** : "Coûtera {tmp_used} XP" (temps réel)
4. **Validation** : Clic [Valider] → `saveAdvance()` transfère tmpadvance vers advance, réinitialise tmp_used
5. **Annulation** : Clic [Annuler] → tmpadvance = 0, tmp_used = 0 (pas de sauvegarde)

**Avantage** : Modifications testées avant commit définitif

**Exemple** : Amélioration Corps à corps
1. Valeur actuelle : Base 30 + Advance 10 = 40
2. Clic [+] 5 fois → tmpadvance = 5
3. Calcul : Paliers 11-15 = 15 XP chacun = 75 XP total
4. Affichage : "Coûtera 75 XP (nouvelle valeur : 45)"
5. Options :
   - [Valider] → advance = 15, XP dépensée += 75
   - [Annuler] → tmpadvance = 0, aucune modification

**Cas Limite** : Clic [+] puis navigation autre page sans valider
- Comportement V1 : tmpadvance conservé en mémoire (pas réinitialisé)
- Recommandation V2 : Modal confirmation "Modifications non sauvegardées, continuer ?"

**Références** : `audit/features/character-edit.md`

#### Recalcul après Modifications

**Fonction** : `refreshXP()` appelée après CHAQUE modification

**Garantit** :
- XP totale dépensée cohérente
- XP disponible à jour (temps réel)
- Détection dépassement budget
- Mise à jour affichage (panneaux XP, boutons activation/désactivation)

**Déclencheurs** :
- Ajout/suppression skill/talent
- Modification avances (après validation saveAdvance)
- Changement carrière
- Retour arrière wizard

**Références** : `audit/features/xp-validation.md`

---

## 5. Messages d'Erreur Utilisateur

### 5.1 Format Standard

**Structure** : `[Champ] {Libellé erreur} : {Détails}`

**Exemples** :
- `[index] Index 5 déjà utilisé par carrière 'Marchand'`
- `[rand.Humain] Seuil invalide : 150. Attendu 1-100 ou ''`
- `[class] Classe 'Paysans' inconnue. Classes valides : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos`
- `[label] Label 'Agitateur' dupliqué (déjà utilisé par carrière existante)`

**Composants** :
1. **[Champ]** : Identifiant technique champ en erreur
2. **{Libellé}** : Description concise problème
3. **{Détails}** : Valeur invalide + valeurs attendues/exemples

**Références** : `audit/business-rules/careers-validation.md`

### 5.2 Sévérité

#### Erreur Bloquante

**Définition** : Empêche sauvegarde/validation entité

**Cas** :
- Champs obligatoires manquants
- Valeurs hors range autorisé
- Références cassées (ID inexistant)
- Doublons index/label

**Affichage** :
- Icône ⛔ (rouge)
- Bordure rouge champ invalide
- Message erreur en gras
- Bouton [Sauvegarder] désactivé

**Exemple Admin** :
```
⛔ Erreur careers.rand.Humain: Seuil invalide (150). Attendu 1-100 ou ''
[Sauvegarder] ← DÉSACTIVÉ
```

**Références** : `audit/business-rules/careers-validation.md`

#### Avertissement

**Définition** : Signale incohérence mais permet sauvegarde

**Cas** :
- Cohérence métier (carrière accessible à 0 espèces)
- Optimisation (seuils non optimaux mais fonctionnels)
- Recommendations (descriptions courtes mais présentes)

**Affichage** :
- Icône ⚠️ (orange)
- Message erreur en italique
- Bouton [Sauvegarder] activé
- Confirmation "Sauvegarder malgré avertissements ?"

**Exemple Admin** :
```
⚠️ Avertissement careers.rand: Carrière 'Érudit' accessible à seulement 1 espèce (recommandé ≥2)
[Sauvegarder] ← ACTIVÉ (avec confirmation)
```

**Références** : `audit/business-rules/careers-validation.md`

### 5.3 Messages XP (Character Edit)

#### Budget Insuffisant

**Message** : "Budget XP insuffisant ({coût} XP nécessaires, {disponible} XP disponibles)"

**Exemples** :
- "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)"
- "Validation bloquée : XP disponible négatif (-15 XP)"

**Affichage** :
- Bouton [+] désactivé
- Tooltip : Message au survol
- Panneau XP : Valeur disponible en rouge si < 0

**Références** : `audit/features/xp-validation.md`

#### Pré-requis Manquants

**Message** : "Pré-requis manquant : {talent_requis} requis pour {talent_cible}"

**Exemples** :
- "Pré-requis manquant : Sens de la magie requis pour Magie des Arcanes"
- "Pré-requis manquant : Acquérir rang 1 avant rang 2"

**Affichage** :
- Icône ⛔ à côté talent
- Message tooltip au survol
- Bouton [Acquérir] désactivé

**Références** : `audit/features/xp-validation.md`

#### Rang Maximum

**Message** : "Rang maximum atteint ({actuel}/{max}) : {raison}"

**Exemples** :
- "Rang maximum atteint (3/3) : Bonus Chance = 3"
- "Rang maximum atteint (2/2) : Maximum fixe pour ce talent"
- "Avances maximum atteintes (+70)"

**Affichage** :
- Bouton [+] désactivé (grisé)
- Badge "MAX" à côté rang
- Tooltip : Explication calcul max (si dynamique)

**Références** : `audit/features/xp-validation.md`

#### Spécialisation Requise

**Message** : "Spécialisation requise : Choisissez {type} pour {label}"

**Exemples** :
- "Spécialisation requise : Choisissez un type d'arme pour Maîtrise"
- "Spécialisation requise : Choisissez une langue pour Langue"
- "Spécialisation requise : Choisissez un domaine de magie pour Magie des Arcanes"

**Affichage** :
- Dropdown sélection spécialisation
- Bouton [Acquérir] désactivé tant que spécialisation non choisie
- Liste spécialisations disponibles affichée

**Références** : `audit/features/xp-validation.md`

### 5.4 Messages Admin

**Format** : `"Erreur [table.field]: [description]"`

**Exemples** :
- "Erreur species.rand: Valeur doit être entre 1 et 100"
- "Erreur careers.parent: Parent 'Soldat' n'existe pas"
- "Erreur careers.hiérarchie: Parent level 2, current level 4 (doit être 3)"
- "Erreur talents.label: Doublon détecté 'Acute Sense (Sight)'"
- "Erreur skills.characteristic: 'Force' invalide, doit être S"
- "Erreur spells.CN: Valeur doit être numérique"
- "Erreur trappings.enc: Valeur doit être numérique entre 0 et 999"

**Références** : `audit/features/admin-validation.md`

### 5.5 Problème V1 : Blocages Silencieux

**Problème Actuel** :
- V1 désactive boutons sans message explication
- Bouton [+] grisé → Pourquoi ? Budget insuffisant / Limite atteinte / Pré-requis manquant ?
- Bouton [Valider] grisé → Pourquoi ? Budget négatif / Élément invalide / Étape incomplète ?

**Impact UX** :
- Joueur ne comprend pas pourquoi action bloquée
- Frustration (tentatives répétées sans succès)
- Abandon (impossibilité progresser sans comprendre)

**Exemples Problématiques** :
1. Bouton [+] désactivé pour talent
   - Raison possible A : XP insuffisant (25 XP nécessaires, 10 disponibles)
   - Raison possible B : Rang max atteint (3/3)
   - Raison possible C : Pré-requis manquant (Sens de la magie requis)
   - **V1** : Aucune indication → Joueur ne sait pas

2. Bouton [Valider] désactivé étape Resume
   - Raison possible A : XP budget négatif (-15 XP)
   - Raison possible B : Compétence obligatoire manquante
   - Raison possible C : Talent invalide (spécialisation non choisie)
   - **V1** : Aucune indication → Joueur bloqué

**Recommandation V2** :
- **Tooltip Contextuel** : Afficher message au survol bouton désactivé
- **Panneau "Problèmes"** : Liste centralisée toutes violations
- **Indicateurs Visuels** : Icônes ⛔/⚠️ à côté éléments invalides
- **Messages Explicites** : "Impossible d'acquérir : XP insuffisant (25 nécessaires, 10 disponibles)"

**Références** : `audit/features/xp-validation.md`

---

## 6. Stratégies de Récupération

### 6.1 Validation par Étapes (Wizard)

**Mécanisme** : Variable `stepIndex` contrôle activation bouton "Valider"

**États** :
- `stepIndex === number` (0-9) : Bouton "Valider" activé (étape en cours validable)
- `stepIndex !== number` : Bouton désactivé (étapes incomplètes)
- `stepIndex === -1` : Bouton caché (création terminée, personnage validé)

**Validations Bloquantes** :
- Absence race (Species non sélectionné) → BLOQUE
- Absence carrière (Career non sélectionné) → BLOQUE
- Talents obligatoires manquants → BLOQUE
- Compétences obligatoires manquantes → BLOQUE
- XP totale incohérente (dépensée ≠ calcul) → BLOQUE

**Validations Tolérantes** :
- Encombrement > limite → AVERTISSEMENT (pas blocage)
- Détails personnels vides (nom, âge, yeux, cheveux) → Valeurs par défaut générées
- Talents magiques sans sorts → TOLÉRÉ (préparation apprentissage futur)

**Exemple Blocage** : Étape Resume
1. Joueur termine étape Experience
2. Clique [Resume]
3. Système valide :
   - ✓ Species sélectionné (Humain)
   - ✓ Career sélectionné (Agitateur)
   - ✗ XP disponible = -15 (budget dépassé)
4. Bouton [Valider] désactivé
5. Message : "Validation bloquée : XP disponible négatif (-15 XP)"

**Références** : `audit/features/wizard/resume-validation.md`

### 6.2 Rollback et Backup (Admin)

#### Rollback Automatique

**Déclencheur** : Erreur détection lors validation modification

**Processus** :
1. Utilisateur modifie entité (ex: carrière)
2. Système détecte erreur (ex: doublon label)
3. **Rollback automatique** : Annulation modification
4. **Restauration** : État précédent rechargé
5. Message : "Erreur détectée, modifications annulées : {erreur}"

**Exemple** : Modification Talent
1. Admin édite talent "Ambidextre"
2. Change label → "Strike Mighty Blow"
3. Validation détecte doublon (talent existant)
4. **Rollback** : Label restauré "Ambidextre"
5. Message : "Erreur talents.label: Doublon détecté 'Strike Mighty Blow', modifications annulées"

**Références** : `audit/features/admin-validation.md`

#### Backup Automatique

**Déclencheur** : Avant TOUTE modification entité

**Processus** :
1. Copie état actuel entité
2. Stockage backup temporaire (mémoire)
3. Autorisation modification
4. Si succès : Suppression backup
5. Si échec : Rollback depuis backup

**Avantage** : Garantit intégrité données, aucune corruption possible

**Exemple** : Modification Career
1. Admin clique [Éditer] carrière "Agitateur"
2. **Backup** : Copie état actuel carrière
3. Modifie fields (class, desc, rand)
4. Clique [Sauvegarder]
5. Validation détecte erreur rand invalide
6. **Rollback** : Restauration depuis backup
7. Suppression backup (plus nécessaire)

**Références** : `audit/features/admin-validation.md`

### 6.3 Recalculs Automatiques

#### applyTalent()

**Déclencheurs** : Après CHAQUE modification talents (ajout, suppression, changement rang)

**Actions** :
1. **Réinitialisation** : Bonus caractéristiques = 0
2. **Parcours** : Tous talents actifs (rang > 0)
3. **Application** : Effets chaque talent (ordre priorité P1-P5)
4. **Nettoyage** : Suppression sorts/compétences non couverts par talents actuels
5. **Mise à Jour** : Affichage caractéristiques, compétences, sorts

**Ordre Application** :
- P1 : Modifications caractéristiques (+5, +1, +Bonus)
- P2 : Ajout domaines magie (addMagic)
- P3 : Ajout compétences (addSkill)
- P4 : Déblocage talents (addTalent)
- P5 : Nettoyage (suppression éléments non couverts)

**Exemple** : Personnage perd talent "Affable"
1. Talent "Affable" (addCharacteristic: Soc +5) retiré
2. **Déclencheur** : `applyTalent()` appelé
3. **P1** : Sociabilité recalculée (Base + Espèce + Carrière + Étoile + XP) → -5 par rapport avant
4. **P2-P4** : Aucun effet (pas de magie/skills/talents liés)
5. **P5** : Aucun nettoyage nécessaire
6. **Résultat** : Sociabilité finale réduite de 5 points

**Références** : `audit/features/character-edit.md`

#### deleteEmpty()

**Déclencheur** : Après modifications skills/talents

**Action** : Suppression éléments sans avances (advance = 0) ET origine non-permanente

**Préservation** :
- Compétences espèce (origine = species)
- Compétences carrière (origine = career)
- Compétences avec avances > 0 (investissement XP)

**Suppression** :
- Compétences temporaires (origine = temp) avec advance = 0
- Talents temporaires non validés

**Exemple** : Nettoyage après changement carrière
1. Personnage change Agitateur → Artisan
2. Compétences Agitateur (Charisme, Perception) : origine = career, conservées
3. Compétence temporaire "Natation" (ajoutée test, non investie) : origine = temp, advance = 0
4. **deleteEmpty()** : Natation supprimée
5. Compétences finales : Charisme, Perception (conservées), Natation (supprimée)

**Références** : `audit/features/character-edit.md`

### 6.4 Validation Pré-Commit

#### Tests Automatisés

**Recommandation** : Tests automatisés AVANT commit modifications

**Niveaux Validation** :
1. **Frontend** : Validation temps réel formulaire (JavaScript)
2. **Serveur** : Validation côté backend (robuste, sécurisé)
3. **Tests Automatisés** : Suite tests exécutée avant commit données

**Exemples Tests** :
- Test intégrité : Tous index uniques, séquentiels
- Test références : Tous IDs pointent entités existantes
- Test cohérence : Seuils rand croissants pour chaque espèce
- Test complétude : Chaque carrière a exactement 4 niveaux

**Standard** : Maintenir données référence "gold standard" (validation 100%)

**Références** : `audit/business-rules/careers-validation.md`

### 6.5 Gestion Erreurs Parsing (Import JSON)

#### Validation Import

**Étapes Validation** :
1. **JSON Valide** : `JSON.parse()` sans exception
2. **Champ stepIndex** : Présent et numérique
3. **Type Object** : Racine JSON est objet (pas array/string)
4. **Version Compatible** : Si champ version présent, vérifier compatibilité

**Messages Erreur** :
- JSON invalide : "Fichier corrompu ou format JSON invalide"
- Structure invalide : "Format non reconnu (champ stepIndex manquant)"
- Version incompatible : "Version {version} non supportée (version actuelle : {current})"

**Références** : `audit/features/save-load.md`

#### Sécurité Import

**Règles** :
1. **Pas d'eval()** : Utiliser uniquement `JSON.parse()` (sécurisé)
2. **Limite Taille** : Fichier maximum 10 MB (empêche DoS)
3. **Validation Stricte** : Vérifier tous champs obligatoires
4. **Sanitization HTML** : Si descriptions HTML, sanitize avant affichage

**Exemple Sécurité** : Import Personnage
1. Lecture fichier `.json`
2. Vérification taille < 10 MB
3. `JSON.parse()` (PAS eval)
4. Validation structure (stepIndex, species, career)
5. Validation références (species.id existe dans DB)
6. Sanitization descriptions HTML
7. Import autorisé SI toutes validations passent

**Références** : `audit/features/save-load.md`

---

## 7. Recommandations V2

### 7.1 Amélioration Messages Erreur

**Problème V1** : Blocages silencieux (boutons désactivés sans explication)

**Solutions V2** :
1. **Tooltip Contextuel** : Message au survol bouton désactivé
2. **Panneau "Problèmes"** : Liste centralisée violations + actions correctives
3. **Indicateurs Visuels** : Icônes ⛔/⚠️ à côté éléments invalides
4. **Messages Explicites** : Format "{Action} impossible : {Raison} ({Détails})"

**Exemple Amélioration** :
- **V1** : Bouton [+] grisé (aucune info)
- **V2** : Bouton [+] grisé + Tooltip "XP insuffisant : 25 nécessaires, 10 disponibles. Gagner 15 XP supplémentaires pour débloquer."

### 7.2 Validation Temps Réel

**Problème V1** : Validation uniquement lors sauvegarde (erreurs découvertes tard)

**Solutions V2** :
1. **Validation Incrémentale** : Après chaque modification champ
2. **Affichage Temps Réel** : Indicateurs validation à côté chaque champ
3. **Compteur Erreurs** : Badge "3 erreurs détectées" en haut formulaire
4. **Auto-Correction** : Suggestions corrections automatiques

**Exemple** : Modification rand.Humain
- **V1** : Saisie 150, clic [Sauvegarder], erreur affichée
- **V2** : Saisie 150, bordure rouge immédiate, message "Valeur 1-100 attendue"

### 7.3 Gestion États Transitoires

**Problème V1** : Modifications temporaires (tmpadvance) non protégées

**Solutions V2** :
1. **Modal Confirmation** : "Modifications non sauvegardées, continuer ?"
2. **Auto-Save** : Sauvegarde automatique brouillon toutes les 30s
3. **Historique Modifications** : Possibilité annuler/refaire (undo/redo)
4. **Indicateur Modifications** : Badge "Non sauvegardé" si tmpadvance ≠ 0

### 7.4 Récupération Références Cassées

**Problème V1** : Crash si entité référencée supprimée (species, career, talent)

**Solutions V2** :
1. **Validation Existence** : Vérifier ID existe AVANT assignation
2. **Fallback Graceful** : Si référence cassée, proposer sélection manuelle
3. **Migration Automatique** : Si entité renommée, mapping ancien ID → nouveau ID
4. **Audit Intégrité** : Commande admin "Vérifier intégrité personnages" (détecte références cassées)

**Exemple** : Chargement personnage avec species supprimé
- **V1** : `setSpecie(undefined)` → Crash
- **V2** : Détection species invalide → Modal "Espèce '{oldLabel}' introuvable, sélectionner nouvelle espèce" → Joueur choisit manuellement

### 7.5 Tests Automatisés Complets

**Recommandation** : Suite tests exhaustive couvrant tous cas limites

**Tests Critiques** :
1. **Test Divisions Zéro** : Caractéristiques = 0, vérifier calculs bonus
2. **Test Dépassements** : Avances > 70, rangs > max dynamique
3. **Test Références Cassées** : ID invalides, vérifier fallback
4. **Test États Transitoires** : Changement carrière, suppression talents avec dépendances
5. **Test Parsing** : Formats invalides, quantités incorrectes, références manquantes

**Couverture Cible** : 90%+ lignes code, 100% cas limites identifiés

---

**Références Principales** :
- `audit/business-rules/parsing-wizard-data.md`
- `audit/business-rules/careers-validation.md`
- `audit/business-rules/calculs-xp-progression.md`
- `audit/business-rules/talents-effets-mecanismes.md`
- `audit/features/character-edit.md`
- `audit/features/xp-validation.md`
- `audit/features/wizard/resume-validation.md`
- `audit/features/save-load.md`
- `audit/features/admin-validation.md`

**Mots-clés** : Validation, Erreurs, Cas Limites, Parsing, Références Cassées, Calculs, États Transitoires, Messages Erreur, Récupération, Tests
