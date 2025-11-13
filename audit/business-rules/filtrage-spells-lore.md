# Filtrage des Sorts par Domaine de Magie

## Vue d'ensemble

Le système de magie de Warhammer organise les sorts en trois grandes catégories selon leur source de pouvoir : Magie Arcane (huit Vents de Magie), Magie Divine (prières aux dieux), et Magie du Chaos (pouvoir corrompu). Chaque catégorie a ses propres règles d'accès et restrictions.

**Source** : `data/spells.json`, `data/magicks.json`
**Référence** : [Table Spells](../database/spells.md)

## Trois systèmes de magie

### Magie Arcane (Vents de Magie)

Basée sur huit domaines appelés "Vents de Magie" ou "Magie des Couleurs". Chaque vent représente une force primordiale du monde.

**Accès** : Nécessite le talent "Magie des Arcanes (Domaine)"
**Organisation** : Par domaine magique (lore)
**Spécialisation** : Obligatoire - un mage choisit UN domaine

**Les huit domaines** :
- Bête (Ghur/Ambre) - bêtes sauvages, instinct, transformation
- Cieux (Azyr/Bleu) - destin, foudre, protection
- Feu (Aqshy/Rouge) - destruction, courage, chaleur
- Lumière (Hysh/Blanc) - pureté, bannissement, intelligence
- Métal (Chamon/Doré) - transmutation, alchimie
- Mort (Shyish/Pourpre) - fin de vie, nécromancie
- Ombres (Ulgu/Gris) - illusion, dissimulation
- Vie (Ghyran/Vert) - guérison, croissance, nature

### Magie Divine (Prières)

Pouvoir accordé par les divinités du Vieux Monde à leurs serviteurs fidèles.

**Accès** : Nécessite les talents "Béni" ou "Invocation (Dieu)"
**Organisation** : Par divinité
**Types** :
- **Bénédictions** (Béni) : Prières universelles accessibles à tous les prêtres
- **Miracles** (Invocation) : Prières spécifiques à chaque dieu

### Magie du Chaos

Pouvoir corrompu issu des Royaumes du Chaos et des dieux sombres.

**Accès** : Nécessite le talent "Magie du Chaos (Dieu)"
**Organisation** : Par dieu du Chaos (Nurgle, Slaanesh, Tzeentch, Khorne) ou Indivisible
**Nature** : Corrompue, dangereuse, interdite dans l'Empire

## Règles d'accès par type

### Sorts Arcanes : Spécialisation par Domaine

**Règle de base** : Un mage des Arcanes ne peut apprendre que les sorts de SON domaine.

**Mécanisme** :
1. Le personnage acquiert "Magie des Arcanes (Domaine X)"
2. Il peut apprendre UNIQUEMENT les sorts où type="Magie des Arcanes" ET qui correspondent à son domaine
3. Le domaine du sort est soit dans le champ subType, soit implicite via son appartenance

**Exemple** :
- Talent : "Magie des Arcanes (Feu)"
- Accessible : Tous les sorts du Domaine du Feu (Aqshy)
- Interdit : Tous les sorts des autres domaines

### Prières Divines : Universelles ou Spécifiques

**Bénédictions (Béni)** :
- Type : "Béni", subType : nom du dieu (ou vide pour universelles)
- **Acquisition** : Le talent "Béni (Dieu)" donne **TOUTES les bénédictions du dieu gratuitement** à l'acquisition du talent
- Pas de limite de nombre (contrairement à Magie mineure qui est limité au Bonus FM)
- Exemples : "Bénédiction de Bataille", "Bénédiction de Courage", "Bénédiction de Protection"

**Miracles (Invocation)** :
- Type : "Invocation", subType : nom du dieu
- **Acquisition** : Le talent "Invocation (Dieu X)" donne **accès** aux miracles de X
- Les miracles doivent être **achetés avec XP** individuellement (comme les sorts arcanes)
- Exemples pour Manann : "Encalminé", "Générosité de Manann", "Marcher sur les eaux"

**Exemple** :
- Talent : "Béni (Sigmar)" → Le personnage connaît immédiatement toutes les bénédictions de Sigmar
- Talent : "Invocation (Manann)" → Le personnage peut acheter les miracles de Manann avec XP
- Interdit : Bénédictions/Miracles des autres dieux

### Magie du Chaos : Par Dieu ou Générique

**Règle** : Les sorts du Chaos peuvent être génériques (Indivisible) ou liés à un dieu spécifique.

**Mécanisme** :
- Talent "Magie du Chaos (Dieu X)" → sorts du dieu X + sorts Indivisibles
- subType vide ou "Indivisible" → accessible à tous les mages du Chaos
- subType = nom du dieu → accessible uniquement aux adorateurs de ce dieu

## Sorts communs vs spécifiques

### Magie Mineure : Universelle

**Type** : "Magie mineure"
**Accès** : TOUS les lanceurs de sorts (Arcanes, Divins, Chaos)
**Fonction** : Sortilèges de base, toujours faciles (CN=0)
**Exemples** : "Alerte", "Amitié animale", "Bruits", "Choc"

**Règle** : Ces sorts constituent le socle commun à toute magie. Un personnage avec n'importe quel talent de magie peut les apprendre.

### Sorts Spécifiques : Par Tradition

Chaque tradition magique a ses propres sorts exclusifs :
- Mage des Arcanes → NE PEUT PAS apprendre de prières divines
- Prêtre → NE PEUT PAS apprendre de sorts arcanes
- Mage du Chaos → NE PEUT PAS apprendre de sorts arcanes ou divins "purs"

## Exemples par domaine

### Domaine du Feu (Aqshy)
**Talent** : "Magie des Arcanes (Feu)"
**Nature** : Feu, chaleur, courage, destruction
**Sorts** : Boules de feu, enchantements enflammés, inspiration au courage
**Composants** : Charbon, huile, bois rouge, objets ignifugés
**Style** : Sorts hurlés avec ferveur, flammes vives. Pyromanciens braves et colériques.

### Invocations de Manann
**Talent** : "Invocation (Manann)"
**Nature** : Pouvoir sur les eaux et la navigation
**Miracles** : "Encalminé" (vole le vent), "Générosité de Manann" (fait apparaître du poisson), "Marcher sur les eaux"
**Thématique** : Eau, mer, navigation, marins

## Logique de filtrage

### Processus d'apprentissage d'un sort

**1. Vérifier le talent**
- Le personnage possède-t-il un talent de magie approprié ?

**2. Identifier le type de sort et vérifier l'accès**
- **Magie mineure** → OK si au moins un talent de magie
- **Magie des Arcanes** → Le domaine du sort correspond-il au domaine du talent ?
- **Béni** → OK si talent "Béni"
- **Invocation** → Le dieu du sort (subType) correspond-il au dieu du talent ?
- **Chaos** → Le dieu correspond OU le sort est Indivisible ?

**3. Appliquer le coût en XP**
- Sorts dans la carrière actuelle : coût normal
- Sorts hors carrière : coût × 2

### Critères de filtrage pour affichage

| Type de sort | Condition d'affichage |
|--------------|----------------------|
| Magie mineure | Au moins un talent de magie |
| Magie des Arcanes | subType ou domaine implicite = domaine du talent |
| Béni | Talent "Béni" possédé |
| Invocation | subType = dieu du talent "Invocation (Dieu)" |
| Magie du Chaos | subType = dieu du talent OU subType vide/Indivisible |

**Exclusions** :
- Mage du Feu ne voit PAS les sorts du Domaine de la Lumière
- Prêtre de Sigmar ne voit PAS les miracles de Manann
- Mage du Chaos de Nurgle ne voit PAS les sorts exclusifs à Tzeentch

### Cas particuliers

**Magie mineure** : Toujours accessible indépendamment de la tradition

**Changement de domaine arcane** : Un mage ne peut normalement avoir qu'UN domaine. Changer nécessite abandonner l'ancien.

**Multi-prêtrise** : Un personnage peut servir plusieurs dieux (rare) et donc avoir plusieurs talents "Invocation (Dieu)". Il accède alors aux miracles de tous ses dieux.

**Magie mixte** : Un personnage peut avoir à la fois des talents arcanes ET divins (très rare, mais possible).

## Relations avec les tables

**Spells → Magicks** : Sort.subType → Magick.label (sorts arcanes avec domaine explicite)
- Magicks contient les huit domaines avec label, abr (Ghur, Aqshy...), folder, desc

**Spells → Gods** : Sort (type="Béni" ou type="Invocation").subType → God.label
- Gods contient les divinités avec label, desc, blessings (liste des bénédictions), miracles
- **Voir** : [gods.md](../database/gods.md) pour structure complète et règles d'acquisition

**Spells → Talents** : Le talent définit l'accès aux sorts par type et spécialisation
- "Magie Mineure" → tous sorts "Magie mineure"
- "Magie des Arcanes (Domaine)" → sorts du domaine
- "Béni (Dieu)" → TOUTES les bénédictions du dieu (gratuites)
- "Invocation (Dieu)" → accès aux miracles du dieu (à acheter en XP)
- "Magie du Chaos (Dieu)" → sorts Chaos du dieu ou Indivisibles

---

**Navigation** : [Table Spells](../database/spells.md) | [Table Gods](../database/gods.md) | [Talents](../database/talents.md) | [Index Business Rules](README.md)
