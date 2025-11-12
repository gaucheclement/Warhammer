# Validation Globale - Matrice Complète

**Contexte** : Documentation exhaustive de toutes les validations du système Warhammer Character Generator V1, organisée par contexte et type de validation.

**Relations** :
- Business Rules : `careers-validation.md`, `gestion-erreurs-cas-limites.md`, `conventions-et-regles-implicites.md`
- Features : `character-edit.md`, `xp-validation.md`, `wizard/resume-validation.md`, `admin-validation.md`
- Workflows : `workflow-progression-xp.md`, `workflow-changement-carriere.md`

---

## 1. Matrice de Validation Croisée

### 1.1 Vue d'Ensemble (Contexte × Type)

| **Type de Validation** | **Création Wizard** | **Progression XP** | **Changement Carrière** | **Admin Entités** |
|------------------------|---------------------|-------------------|------------------------|------------------|
| **Structurelle** | stepIndex valide, 15 carac, format correct | XP ≥ 0, tmp_used cohérent, pas limite avances | XP ≥ 0 (gratuit V1), historique valide | Index unique, labels uniques, types corrects |
| **Référentielle** | species/career existent, IDs valides | Compétence/talent existe, domaine magie valide | Carrière destination existe, compatible espèce | refChar/refCareer valides, class existe, 4 niveaux |
| **Métier** | Specs choisis, budget XP=0, 40pts skills | Pré-requis OK, rang ≤ max, en/hors carrière | Conservation acquis, niveau=1 obligatoire | Rand croissants, couverture ≥95%, cohérence |
| **Dérivée** | PB ≥ 1, M ≥ 0, encombrement cohérent | Bonus recalculés, effets talents appliqués | Status social mis à jour, "en carrière" redéfini | Distribution équilibrée, hiérarchies cohérentes |

---

## 2. Validations par Contexte

### 2.1 CONTEXTE : Création Wizard

#### Validations Structurelles

**Champs Obligatoires** :

| Champ | Règle | Bloquant | Message Erreur |
|-------|-------|----------|---------------|
| **mode** | ∈ ['guidé', 'libre'] | Oui | "Mode invalide : '{mode}'" |
| **stepIndex** | null, 0-9, -1 | Oui | "Étape invalide : {stepIndex}" |
| **specie.id** | Existe dans table species | Oui (après étape 1) | "Espèce obligatoire manquante" |
| **careerLevel** | Format 'career\|level', level ∈ [1,2,3,4] | Oui (si stepIndex>2) | "Carrière obligatoire manquante" |
| **characteristics** | Exactement 15 éléments | Oui | "Caractéristiques incomplètes ({N}/15)" |

**Caractéristiques (15 Obligatoires)** :
- **IDs Requis** : cc, ct, f, e, i, ag, dex, int, fm, soc, m, pb, chance, determination, corruption
- **Validation** : Chaque ID unique, total ≥ 0 pour toutes
- **Exemple Erreur** : Personnage avec 14 caractéristiques → BLOQUANT

**Budget XP Création (Règle Stricte)** :
- **Formule** : `xp.used + xp.tmp_used ≤ xp.max`
- **Contrainte** : Pas de XP négatif en mode création
- **Validation Log** : sum(positifs) = xp.max, sum(négatifs) = xp.used
- **Exemple Erreur** : used=150, max=100 → Budget XP négatif (-50) → BLOQUANT

**Références** : `audit/features/character-edit.md`, `audit/features/wizard/resume-validation.md`

#### Validations Référentielles

**Species** :
- refChar valide → Pointe characteristics existant
- refCareer valide → Pointe careers avec rand.{espèce} numérique
- refDetail valide → Pointe details existant (toléré vide)

**Career** :
- career.id existe → ID dans table careerLevels
- Carrière accessible espèce → rand.{espèce} numérique (sauf mode Free)
- 4 CareerLevels existent → Niveaux 1, 2, 3, 4 sans trou

**Skills/Talents** :
- IDs existent → Dans tables skills.json/talents.json
- Origins valides → IDs entities référencées existent
- Caractéristique liée existe → Pour skills, characteristic ∈ [CC, CT, F, E, I, Ag, Dex, Int, FM, Soc]

**Références** : `audit/business-rules/careers-validation.md`, `audit/business-rules/gestion-erreurs-cas-limites.md`

#### Validations Métier

**Étape Skills** :

| Validation | Règle | Bloquant | Message |
|-----------|-------|----------|---------|
| **Spécialisations choisies** | spec ≠ '' si compétence groupée "Au choix" | Oui | "Spécialisation requise : Choisissez pour {label}" |
| **Espèce : 3 skills +5** | Exactement 3 skills avances=5 | Oui | "Espèce : {N}/3 skills à +5" |
| **Espèce : 3 skills +3** | Exactement 3 skills avances=3 | Oui | "Espèce : {N}/3 skills à +3" |
| **Carrière : 40 points** | Total avances = 40 exactement | Oui | "Carrière : {N}/40 points alloués" |
| **Max 10 pts/skill** | Aucune skill > 10 avances | Oui | "Skill '{label}' : {N} points (max 10)" |

**Étape Talents** :

| Validation | Règle | Bloquant | Message |
|-----------|-------|----------|---------|
| **Spécialisations choisies** | spec ≠ '' si talent "Au choix" | Oui | "Spécialisation requise pour {label}" |
| **Pré-requis satisfaits** | Talents chaînés actifs | Oui | "Pré-requis manquant : {talent_parent}" |
| **Rang ≤ max** | advance ≤ maximum | Oui | "Rang max atteint ({actuel}/{max})" |
| **Talents obligatoires carrière** | Tous talents listés niveau carrière acquis | Oui | "{N} talents obligatoires manquants" |

**Références** : `audit/features/wizard/resume-validation.md`, `audit/database/skills.md`, `audit/database/talents.md`

### 2.2 CONTEXTE : Progression XP

#### Validations Temps Réel (Pré-Achat)

**Validations Avant Clic [+]** :

| Validation | Règle | Action si KO | Tooltip |
|-----------|-------|-------------|---------|
| **Budget suffisant (création)** | XP disponible - coût ≥ 0 | Bouton [+] désactivé | "XP insuffisant : {coût} nécessaires, {dispo} disponibles" |
| **Budget suffisant (post-création)** | Dette tolérée (XP < 0 autorisé) | Bouton [+] activé | "Dette XP : {montant} (remboursable XP futures)" |
| **Rang max non atteint** | advance < 70 (skills/carac), rang < max (talents) | Bouton [+] désactivé | "Rang maximum atteint ({actuel}/{max})" |
| **Spécialisation choisie** | spec ≠ '' si spécialisation requise | Popup sélection | "Choisir spécialisation avant achat" |
| **Pré-requis talents** | Talents chaînés actifs, FM≥35 pour Magie, etc. | Bouton [+] désactivé | "Pré-requis manquant : {détails}" |

**Validations Post-Achat (Confirmation)** :

| Validation | Règle | Action si KO |
|-----------|-------|-------------|
| **Budget recalculé** | Double-check XP disponible après achat | Achat annulé |
| **Valeur cohérente** | Respect limites max talents (pas de limite skills/carac) | Achat annulé |
| **Spécialisation confirmée** | Popup validée si affichée | Achat annulé |

**Limites Système** :

| Limite | Valeur | Raison |
|--------|--------|--------|
| **Avances skills/carac** | Illimitées | Progression continue après 70 (coût stabilisé 380/450 XP), voir [calculs-xp-progression.md](./calculs-xp-progression.md) |
| **Rang max talent** | Variable (1, N, Bonus carac, illimité) | Dépend talent.max |
| **XP Totale max** | 99999 | Limite affichage UI |

**Références** : `audit/features/xp-validation.md`, `audit/features/workflows/workflow-progression-xp.md`

#### Validations Métier (Contraintes par Type)

**Caractéristiques** :
- Budget XP suffisant
- Dans/Hors carrière (multiplicateur ×2 si hors)
- Pas de limite max (progression continue après 70)
- Palier correct (coût augmente par tranche de 5, stabilisé 450 XP après 70)

**Compétences** :
- Budget XP suffisant
- Dans/Hors carrière (×2 si hors, SAUF compétences Basic toujours ×1)
- Spécialisation si groupée (popup avant achat)
- Pas de limite max (progression continue après 70)
- Type Basic/Advanced respecté

**Talents** :
- Budget XP suffisant
- Dans/Hors carrière (×2 si hors)
- Pré-requis satisfaits (talents chaînés, caractéristiques minimales)
- Rang séquentiel (acquérir rang 1 avant 2, etc.)
- Rang ≤ max (validation dynamique si max = "Bonus de {Carac}")
- Spécialisation si requise

**Sorts** :
- Talent prérequis actif (Magie Arcanes, Béni, etc.)
- Domaine choisi (spec)
- Pas de doublon (même sort une seule fois)
- Budget XP suffisant

**Exemple Conservation Rang** : Talent "Chanceux" (max = Bonus Sociabilité)
1. Sociabilité 35 (Bonus 3) → Achète rangs 1, 2, 3 ✓
2. Sociabilité réduite à 28 (Bonus 2) par malédiction → max = 2
3. **Conservation** : 3 rangs conservés (grandfathering)
4. **Blocage** : Rang 4 impossible jusqu'à Sociabilité 40

**Références** : `audit/features/xp-validation.md`, `audit/business-rules/talents-effets-mecanismes.md`

### 2.3 CONTEXTE : Changement de Carrière

#### Validations Pré-Changement

| Validation | Type | Règle | Bloquant | Message |
|-----------|------|-------|----------|---------|
| **XP ≥ 100** | Métier | XP Actuelle ≥ 100 (coût fixe) | Oui | "XP insuffisantes : {X}/100" |
| **Carrière existe** | Référentielle | ID carrière dans allCareers | Oui | "Carrière '{id}' introuvable" |
| **Espèce compatible** | Métier | rand.{espèce} numérique | Non (warning) | "Carrière inhabituelle pour {espèce}" |
| **Cohérence narrative** | Métier (optionnel) | Justification roleplay, validation MJ | Non | "Justification requise" |

#### Validations Post-Changement

**Application** :

| Opération | Règle | Résultat |
|----------|-------|----------|
| **Déduction XP** | XP Actuelle -= 100, XP Dépensée += 100 | XP restantes mises à jour |
| **Niveau = 1 forcé** | currentLevel = 1 (TOUJOURS) | Démarre obligatoirement niveau 1 |
| **Conservation acquis** | TOUS skills/talents/carac conservés | Aucune perte jamais |
| **Redéfinition "en carrière"** | Union anciennes + nouvelle niveau 1 | Nouveaux coûts XP calculés |
| **Status social maj** | Status = status nouvelle carrière niveau 1 | Status potentiellement réduit |
| **Historique carrières** | Ajout entrée careerHistory[] | Traçabilité multi-carrières |
| **Trappings niveau 1** | Ajout trappings nouvelle carrière | Équipement de départ acquis |

**Validation Finale** :
- Historique cohérent → careerHistory[] contient toutes carrières
- "En carrière" recalculé → Union éléments niveaux atteints toutes carrières
- Progression possible → Éléments requis niveau 2 identifiés

**Références** : `audit/features/workflows/workflow-changement-carriere.md`

### 2.4 CONTEXTE : Admin Entités

#### Validations Schéma (Toutes Tables)

| Validation | Règle | Bloquant | Message |
|-----------|-------|----------|---------|
| **Champs obligatoires** | Tous champs requis présents et non vides | Oui | "Champ '{field}' manquant pour {label}" |
| **Types corrects** | number/string/boolean selon schéma | Oui | "Type invalide '{field}' : {actual} au lieu de {expected}" |
| **Index unique** | Aucun doublon index | Oui | "Index {N} déjà utilisé par {entity}" |
| **Index séquentiel** | 0, 1, 2, 3... sans trou | Non (warning) | "Trou séquence : attendu {expected}, trouvé {found}" |
| **Label unique** | Aucun doublon label (case-insensitive) | Oui | "Label '{label}' dupliqué" |
| **Label longueur** | 3-100 caractères | Oui | "Label trop court/long : {length} car" |
| **Label caractères** | Pas de caractères contrôle | Oui | "Label contient caractères invalides" |

**Références** : `audit/features/admin-validation.md`, `audit/patterns/pattern-validation-metadonnees.md`

#### Validations Careers Spécifique

| Validation | Type | Règle | Bloquant | Message |
|-----------|------|-------|----------|---------|
| **Rand 10 clés** | Structurelle | Exactement 10 clés (7 espèces + 3 régions) | Oui | "Rand : {N} clés au lieu de 10" |
| **Rand valeurs** | Structurelle | Numérique 1-100 OU "" | Oui | "Rand.{espèce} invalide : {valeur}" |
| **Rand croissants** | Métier | Seuils croissants ou égaux par espèce | Oui | "Seuils décroissants : {label1}({s1}) > {label2}({s2})" |
| **Rand couverture** | Métier | Au moins 1 carrière seuil ≥95 par espèce | Oui | "Couverture insuffisante : max {max} < 95" |
| **Class existe** | Référentielle | class dans classes.json | Oui | "Classe '{class}' inconnue" |
| **4 CareerLevels** | Référentielle | Exactement 4 niveaux 1-4 sans trou | Oui | "Carrière '{label}' : {N} niveaux au lieu de 4" |
| **Desc HTML** | Structurelle | Balises autorisées (<i>, <b>, <br>) | Oui | "Balises HTML non autorisées" |
| **Book/page** | Structurelle | book 2-10 car, page >0 <1000 | Oui | "Référence livre invalide" |

**Cohérence Métier** :

| Validation | Règle | Bloquant | Message |
|-----------|-------|----------|---------|
| **Carrières universelles** | Si "Artisan"/"Villageois" → ≥4 espèces numériques | Non (warning) | "Carrière universelle '{label}' : {N} espèces (<4)" |
| **Carrières exclusives** | Si 1 seule espèce numérique → toutes autres "" | Non (warning) | "Carrière mono-espèce incohérente" |
| **Carrières Chaos** | Si class="Chaos" → tous rand "" | Oui | "Carrière Chaos '{label}' accessible aléatoire" |

**Références** : `audit/business-rules/careers-validation.md`

---

## 3. Catalogue Messages Erreur avec Codes

### 3.1 Format Standard

**Structure** : `[Champ] {Libellé erreur} : {Détails}`

**Exemples** :
- `[index] Index 5 déjà utilisé par carrière 'Marchand'`
- `[rand.Humain] Seuil invalide : 150. Attendu 1-100 ou ''`
- `[class] Classe 'Paysans' inconnue. Classes valides : {liste}`
- `[label] Label 'Agitateur' dupliqué`

### 3.2 Codes Erreur Pattern-Validation

#### Index

| Code | Message | Description |
|------|---------|-------------|
| `INDEX_DUPLICATE` | "Index {index} utilisé par: {entities}" | Index non unique |
| `INDEX_GAP` | "Trou dans séquence: attendu {expected}, trouvé {found}" | Index non séquentiel |
| `INDEX_TYPE` | "Index invalide: type {actualType} au lieu de number" | Type incorrect |
| `INDEX_NEGATIVE` | "Index négatif: {index}" | Valeur négative |

#### Label

| Code | Message | Description |
|------|---------|-------------|
| `LABEL_MISSING` | "Label manquant pour index {index}" | Label absent |
| `LABEL_DUPLICATE` | "Label \"{label}\" utilisé aux index {indices}" | Label non unique |
| `LABEL_TOO_SHORT` | "Label \"{label}\" trop court ({length} car, min 3)" | < 3 caractères |
| `LABEL_TOO_LONG` | "Label \"{label}\" trop long ({length} car, max 100)" | > 100 caractères |
| `LABEL_INVALID_CHARS` | "Label \"{label}\" contient caractères invalides" | Caractères contrôle |
| `LABEL_WHITESPACE` | "Label \"{label}\": espaces début/fin ou multiples" | Espaces invalides |

**Références** : `audit/patterns/pattern-validation-metadonnees.md`

### 3.3 Messages XP (Progression)

#### Budget Insuffisant

**Message** : "Budget XP insuffisant ({coût} XP nécessaires, {disponible} XP disponibles)"

**Exemples** :
- "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)"
- "Validation bloquée : XP disponible négatif (-15 XP)"

**Affichage** :
- Bouton [+] désactivé (grisé)
- Tooltip au survol
- Panneau XP en rouge si < 0

#### Pré-requis Manquants

**Message** : "Pré-requis manquant : {talent_requis} requis pour {talent_cible}"

**Exemples** :
- "Pré-requis manquant : Sens de la magie requis pour Magie des Arcanes"
- "Pré-requis manquant : Acquérir rang 1 avant rang 2"
- "Pré-requis manquant : Intelligence ≥ 35 requise"

**Affichage** :
- Icône ⛔ à côté talent
- Tooltip au survol
- Bouton [Acquérir] désactivé

#### Rang Maximum

**Message** : "Rang maximum atteint ({actuel}/{max}) : {raison}"

**Exemples** :
- "Rang maximum atteint (3/3) : Bonus Sociabilité = 3"
- "Rang maximum atteint (2/2) : Maximum fixe pour ce talent"
- "Avances maximum atteintes (+70)"

**Affichage** :
- Bouton [+] désactivé
- Badge "MAX" affiché
- Tooltip explication calcul max (si dynamique)

#### Spécialisation Requise

**Message** : "Spécialisation requise : Choisissez {type} pour {label}"

**Exemples** :
- "Spécialisation requise : Choisissez un type d'arme pour Maîtrise"
- "Spécialisation requise : Choisissez une langue pour Langue"
- "Spécialisation requise : Choisissez un domaine de magie pour Magie des Arcanes"

**Affichage** :
- Dropdown sélection spécialisations
- Bouton [Acquérir] désactivé jusqu'à choix
- Liste spécialisations disponibles

**Références** : `audit/features/xp-validation.md`, `audit/business-rules/gestion-erreurs-cas-limites.md`

### 3.4 Messages Admin

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

### 3.5 Sévérité Messages

#### Erreur Bloquante (⛔)

**Définition** : Empêche sauvegarde/validation entité

**Cas** :
- Champs obligatoires manquants
- Valeurs hors range autorisé
- Références cassées (ID inexistant)
- Doublons index/label

**Affichage** :
- Icône ⛔ rouge
- Bordure rouge champ invalide
- Message erreur en gras
- Bouton [Sauvegarder] désactivé

**Exemple** :
```
⛔ Erreur careers.rand.Humain: Seuil invalide (150). Attendu 1-100 ou ''
[Sauvegarder] ← DÉSACTIVÉ
```

#### Avertissement (⚠️)

**Définition** : Signale incohérence mais permet sauvegarde

**Cas** :
- Cohérence métier (carrière accessible à 0 espèces)
- Optimisation (seuils non optimaux mais fonctionnels)
- Recommendations (descriptions courtes mais présentes)

**Affichage** :
- Icône ⚠️ orange
- Message italique
- Bouton [Sauvegarder] activé
- Confirmation "Sauvegarder malgré avertissements ?"

**Exemple** :
```
⚠️ Avertissement careers.rand: Carrière 'Érudit' accessible à 1 espèce (recommandé ≥2)
[Sauvegarder] ← ACTIVÉ (avec confirmation)
```

**Références** : `audit/business-rules/gestion-erreurs-cas-limites.md`

---

## 4. Actions Correctives par Type d'Erreur

### 4.1 Erreurs Structurelles

| Erreur | Action Corrective | Contexte | Automatisable |
|--------|------------------|----------|---------------|
| **Champ obligatoire manquant** | Remplir champ avec valeur valide | Admin toutes tables | Non |
| **Valeur hors range** | Corriger valeur dans limites (ex: rand 1-100) | Admin careers, species | Oui (clamp) |
| **Type incorrect** | Convertir type (string→number) | Admin toutes tables | Oui (cast) |
| **Index négatif** | Remplacer par index ≥ 0 séquentiel | Admin toutes tables | Oui (auto-increment) |
| **15 carac manquantes** | ERREUR CRITIQUE système | Wizard (bug) | Non |

### 4.2 Erreurs Référentielles

| Erreur | Action Corrective | Contexte | Automatisable |
|--------|------------------|----------|---------------|
| **Référence cassée (species/career supprimé)** | Modal sélection manuelle nouvelle entité | Save/Load | Non |
| **Class invalide** | Sélectionner classe parmi liste fermée | Admin careers | Oui (dropdown) |
| **Characteristic invalide** | Corriger abréviation (ex: "Force"→"S") | Admin skills | Oui (mapping) |
| **CareerLevels incomplets** | Créer niveaux manquants 1-4 sans trou | Admin careerLevels | Oui (génération) |
| **Lore inexistant** | Créer lore ou choisir lore existant | Admin spells | Non |

### 4.3 Erreurs Métier

| Erreur | Action Corrective | Contexte | Automatisable |
|--------|------------------|----------|---------------|
| **Spécialisation manquante** | Popup sélection parmi liste specs | Wizard skills/talents, XP | Non |
| **Pré-requis talent non rempli** | Acquérir talent parent ou améliorer carac | XP achat talents | Non |
| **Rang max atteint** | Bloquer achat, améliorer carac si max dynamique | XP achat talents | Oui (bouton désactivé) |
| **Budget XP négatif (création)** | Retirer achats ou attendre gain XP | Wizard Experience | Non |
| **Budget XP négatif (post-création)** | Dette tolérée, rembourser XP futures | XP progression | Automatique |
| **Seuils rand décroissants** | Corriger seuils en ordre croissant | Admin careers.rand | Oui (tri) |
| **Couverture probabilités <95%** | Ajouter carrière fourre-tout rand=100 | Admin careers.rand | Oui (suggestion) |
| **Hiérarchie careers invalide** | Corriger parent level (N-1) ou insérer niveau | Admin careers | Non |

### 4.4 Erreurs Wizard Spécifiques

| Erreur | Action Corrective | Message Suggéré | Automatisable |
|--------|------------------|----------------|---------------|
| **XP budget négatif** | Retirer achats ou ajuster XP max | "Retirer {X} XP d'achats ou ajuster budget" | Non |
| **Talents obligatoires manquants** | Acquérir talents listés niveau carrière | "{N} talents obligatoires manquants : {liste}" | Oui (highlight) |
| **Skills obligatoires manquants** | Acquérir skills listées niveau carrière | "{N} skills obligatoires manquants : {liste}" | Oui (highlight) |
| **Nom personnage vide** | Remplir champ nom ou générer aléatoire | "Nom requis pour finaliser personnage" | Oui (générateur) |
| **Caractéristiques hors limites raciales** | Recalculer ou ajuster modificateurs | "Force {X} hors limites espèce ({min}-{max})" | Oui (recalcul) |

**Références** : `audit/business-rules/gestion-erreurs-cas-limites.md`

---

## 5. Validation par Recalculs Automatiques

### 5.1 Cascade Recalculs (Progression XP)

**Déclencheurs** : Après modification skills/talents/caractéristiques

| Recalcul | Déclencheur | Cascade | Automatique |
|---------|------------|---------|-------------|
| **Bonus caractéristiques** | Si carac modifiée | Bonus = floor(total/10) | Oui |
| **Skills liées** | Si carac liée modifiée et Bonus change | Skill = carac + avances | Oui |
| **Max rangs talents dynamiques** | Si carac utilisée dans max modifiée | Max recalculé, rangs conservés | Oui |
| **Points de Blessures** | Si BE/BF/BFM modifiés | Formule espèce recalculée | Oui |
| **Encombrement** | Si BF/BE modifiés | Limite = (BF+BE) × 10 | Oui |
| **Effets talents** | Si talent acquis/perdu | applyTalent() complet | Oui |
| **Sorts disponibles** | Si talent magie acquis | Liste sorts domaine débloquée | Oui |
| **Skills ajoutées** | Si talent addSkill acquis | Skill ajoutée avec spec héritage | Oui |

**Fonction** : `refreshXP()` appelée après CHAQUE modification

**Garantit** :
- XP totale dépensée cohérente
- XP disponible à jour (temps réel)
- Détection dépassement budget
- Mise à jour affichage (panneaux XP, boutons)

**Références** : `audit/features/xp-validation.md`, `audit/features/character-edit.md`

### 5.2 Validation applyTalent()

**Séquence Stricte** :

**Phase 0 - Réinitialisation** :
- `characteristic.talent = 0` pour TOUTES caractéristiques

**Phase 1 - Parcours** :
- Itération sur tous talents actifs (`total > 0`)

**Phase 2 - Application par Priorité** :
- **P1 - addCharacteristic** : Calcul et ajout bonus caractéristiques
- **P2 - addMagic** : Collecte domaines magie, ajout sorts spéciaux
- **P3 - addSkill** : Ajout compétences origine "talent"
- **P4 - addTalent** : Ajout talents déblocage chaîne
- **P5 - Nettoyage** : Suppression sorts/compétences non couverts

**Phase 3 - Recalcul Cascade** :
- Caractéristiques dérivées (PB, Mouvement)
- Bonus (÷10)
- Encombrement (BF + BE)

**Exemple** : Perte talent "Affable" (+5 Sociabilité)
1. Réinitialisation : Soc.talent = 0
2. Parcours : "Affable" rang = 0 → Ignoré
3. P1 : Aucun bonus Soc appliqué
4. Recalcul : Soc finale = Base + Avances (sans +5)
5. Cascade : Bonus Soc réduit, Charme/Commandement/Ragots réduits

**Références** : `audit/business-rules/application-effets-talents.md`

---

## 6. Problèmes V1 et Recommandations V2

### 6.1 Problèmes Identifiés V1

**Blocages Silencieux** :
- V1 désactive boutons sans message explication
- Bouton [+] grisé → Pourquoi ? Budget/Limite/Pré-requis ?
- Bouton [Valider] grisé → Pourquoi ? Budget négatif/Élément invalide ?

**Impact UX** :
- Joueur ne comprend pas pourquoi action bloquée
- Frustration (tentatives répétées sans succès)
- Abandon (impossibilité progresser sans comprendre)

**Validation Partielle** :
- Validation uniquement HTML5 required côté client
- Pas de panneau récapitulatif problèmes centralisé
- Messages erreur techniques sans contexte utilisateur

**Références** : `audit/features/xp-validation.md`, `audit/business-rules/gestion-erreurs-cas-limites.md`

### 6.2 Recommandations V2

**Amélioration Messages** :
- **Tooltip Contextuel** : Message au survol bouton désactivé
- **Panneau "Problèmes"** : Liste centralisée violations + actions correctives
- **Indicateurs Visuels** : Icônes ⛔/⚠️ à côté éléments invalides
- **Messages Explicites** : "{Action} impossible : {Raison} ({Détails})"

**Exemple Amélioration** :
- **V1** : Bouton [+] grisé (aucune info)
- **V2** : Bouton [+] grisé + Tooltip "XP insuffisant : 25 nécessaires, 10 disponibles. Gagner 15 XP pour débloquer."

**Validation Temps Réel** :
- Validation incrémentale après chaque modification champ
- Affichage temps réel indicateurs validation
- Compteur erreurs : Badge "3 erreurs détectées"
- Auto-correction : Suggestions corrections automatiques

**Gestion États Transitoires** :
- Modal confirmation : "Modifications non sauvegardées, continuer ?"
- Auto-save : Sauvegarde automatique brouillon toutes les 30s
- Historique modifications : Undo/redo
- Indicateur modifications : Badge "Non sauvegardé" si tmpadvance ≠ 0

**Récupération Références Cassées** :
- Validation existence AVANT assignation
- Fallback graceful : Proposer sélection manuelle
- Migration automatique : Mapping ancien ID → nouveau ID
- Audit intégrité : Commande admin "Vérifier intégrité personnages"

**Tests Automatisés** :
- Suite tests exhaustive couvrant tous cas limites
- Couverture cible : 90%+ lignes code, 100% cas limites
- Tests critiques : Divisions zéro, dépassements, références cassées, états transitoires, parsing

**Références** : `audit/business-rules/gestion-erreurs-cas-limites.md`

---

**Références Principales** :
- `audit/features/character-edit.md`
- `audit/features/xp-validation.md`
- `audit/features/wizard/resume-validation.md`
- `audit/features/admin-validation.md`
- `audit/business-rules/careers-validation.md`
- `audit/business-rules/gestion-erreurs-cas-limites.md`
- `audit/patterns/pattern-validation-metadonnees.md`

**Mots-clés** : Validation, Matrice, Contexte, Structurelle, Référentielle, Métier, Messages Erreur, Actions Correctives, Recalculs, Blocages Silencieux
